import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {SYSTEM_VERSION} from '../src/system-version.js';

const BASE=process.env.DBACK_LIVE_URL||'https://dback-fitness.dback.workers.dev';
const OUT='artifacts/desktop-qa';
await mkdir(OUT,{recursive:true});

async function waitForProductionVersion(){
  const deadline=Date.now()+120000;
  let last='';
  while(Date.now()<deadline){
    try{
      const root=await fetch(BASE,{headers:{'cache-control':'no-cache'}});
      const build=root.headers.get('x-dback-build')||'';
      const health=await fetch(`${BASE}/api/v40/health`,{headers:{'cache-control':'no-cache'}});
      const payload=health.ok?await health.json():{};
      last=`root=${root.status} build=${build||'<missing>'} health=${health.status} api=${payload.version||'<missing>'}`;
      if(root.ok&&health.ok&&build===SYSTEM_VERSION&&payload.version===SYSTEM_VERSION)return;
    }catch(e){last=e.message}
    await new Promise(r=>setTimeout(r,3000));
  }
  throw new Error(`Production version attestation failed. Expected ${SYSTEM_VERSION}; last observed ${last}`);
}

await waitForProductionVersion();

const profiles=[
  {name:'desktop-1440',viewport:{width:1440,height:1000},minBody:1100},
  {name:'desktop-1600',viewport:{width:1600,height:1000},minBody:1250}
];

const browser=await chromium.launch({headless:true});
const failures=[];

async function noHorizontalOverflow(page,label){
  const m=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
  if(m.sw>m.cw+2||m.bw>m.cw+2)failures.push(`${label}: horizontal overflow sw=${m.sw} bw=${m.bw} cw=${m.cw}`);
}

async function nav(page,text){
  const button=page.locator('#db41-nav button').filter({hasText:new RegExp(`^${text}$`)});
  await button.click();
  await page.waitForTimeout(250);
}

for(const profile of profiles){
  const context=await browser.newContext({viewport:profile.viewport});
  const page=await context.newPage();
  page.on('pageerror',e=>failures.push(`${profile.name}: pageerror ${e.message}`));
  const consoleErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});

  try{
    const res=await page.goto(BASE,{waitUntil:'networkidle',timeout:60000});
    assert.ok(res&&res.ok(),`${profile.name}: live site failed to load`);
    assert.equal(res.headers()['x-dback-build'],SYSTEM_VERSION,`${profile.name}: live root build header mismatch`);
    await page.locator('#db41-shell.open').waitFor({state:'visible',timeout:10000});

    assert.equal(await page.locator('.db41-side:visible').count(),1,`${profile.name}: desktop sidebar missing`);
    assert.equal(await page.locator('#db41-mobilebar:visible').count(),0,`${profile.name}: mobile bar must be hidden on desktop`);
    assert.equal(await page.locator('#db41-mobile-menu:visible').count(),0,`${profile.name}: mobile menu must be hidden on desktop`);
    assert.equal(await page.locator('#db41-launch').count(),0,`${profile.name}: legacy launcher must not exist`);

    const layout=await page.evaluate(()=>{
      const body=document.querySelector('.db41-body');
      const main=document.querySelector('.db41-main');
      const side=document.querySelector('.db41-side');
      const r=body?.getBoundingClientRect();
      return {bodyWidth:r?.width||0,maxWidth:body?getComputedStyle(body).maxWidth:'',mainWidth:main?.getBoundingClientRect().width||0,sideWidth:side?.getBoundingClientRect().width||0};
    });
    assert.equal(layout.maxWidth,'1440px',`${profile.name}: desktop command center max width must be 1440px`);
    assert.ok(layout.bodyWidth>=profile.minBody,`${profile.name}: workout workspace remains too narrow (${layout.bodyWidth}px)`);
    assert.ok(layout.mainWidth>layout.sideWidth*3.5,`${profile.name}: sidebar dominates the workout workspace`);
    await noHorizontalOverflow(page,`${profile.name} root`);
    await page.screenshot({path:`${OUT}/${profile.name}-root.png`,fullPage:true});

    for(const section of ['Today','Plan','Progress','Library']){
      await nav(page,section);
      await noHorizontalOverflow(page,`${profile.name} ${section}`);
    }

    const search=page.locator('#db41-library-search');
    await search.fill('hack squat');
    await page.getByText(/Hack Squat/i).first().waitFor({state:'visible',timeout:5000});
    const count=await page.locator('#db41-library-count').innerText();
    assert.match(count,/1 of \d+ equipment types shown\./i,`${profile.name}: filtered equipment count is not visible`);
    await page.screenshot({path:`${OUT}/${profile.name}-library-search.png`,fullPage:true});

    if(consoleErrors.length)failures.push(`${profile.name}: console errors: ${consoleErrors.join(' | ')}`);
  }catch(e){
    failures.push(`${profile.name}: ${e.message}`);
    await page.screenshot({path:`${OUT}/${profile.name}-failure.png`,fullPage:true}).catch(()=>{});
  }finally{await context.close()}
}

await browser.close();
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else{console.log(`Live desktop QA passed for production build ${SYSTEM_VERSION} at 1440px and 1600px, including expanded command-center width, desktop navigation, overflow protection and equipment search.`)}
