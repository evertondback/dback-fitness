import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {SYSTEM_VERSION} from '../src/system-version.js';

const BASE=process.env.DBACK_LIVE_URL||'https://dback-fitness.dback.workers.dev';
const OUT='artifacts/mobile-qa';
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
  {name:'iphone-390',viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true},
  {name:'iphone-430',viewport:{width:430,height:932},deviceScaleFactor:3,isMobile:true,hasTouch:true},
  {name:'tablet-768',viewport:{width:768,height:1024},deviceScaleFactor:2,isMobile:true,hasTouch:true}
];

const browser=await chromium.launch({headless:true});
const failures=[];

async function noHorizontalOverflow(page,label){
  const m=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,bw:document.body?.scrollWidth||0}));
  if(m.sw>m.cw+2||m.bw>m.cw+2)failures.push(`${label}: horizontal overflow sw=${m.sw} bw=${m.bw} cw=${m.cw}`);
}

async function openDrawer(page){
  const menu=page.locator('#db41-mobile-menu');
  if(await menu.isVisible()){
    await menu.click();
    await page.locator('.db41-panel.mobile-menu-open').waitFor({state:'attached',timeout:5000});
  }
}

async function shellNav(page,text){
  const panel=page.locator('.db41-panel');
  const menu=page.locator('#db41-mobile-menu');
  if(await menu.isVisible()){
    const open=await panel.evaluate(el=>el.classList.contains('mobile-menu-open'));
    if(!open)await openDrawer(page);
  }
  const button=page.locator('#db41-nav button').filter({hasText:new RegExp(`^${text}$`)});
  await button.scrollIntoViewIfNeeded();
  await button.click();
  await page.waitForTimeout(350);
}

for(const profile of profiles){
  const context=await browser.newContext({viewport:profile.viewport,deviceScaleFactor:profile.deviceScaleFactor,isMobile:profile.isMobile,hasTouch:profile.hasTouch});
  const page=await context.newPage();
  page.on('pageerror',e=>failures.push(`${profile.name}: pageerror ${e.message}`));
  const consoleErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});

  try{
    const res=await page.goto(BASE,{waitUntil:'networkidle',timeout:60000});
    assert.ok(res&&res.ok(),`${profile.name}: live site failed to load`);
    assert.equal(res.headers()['x-dback-build'],SYSTEM_VERSION,`${profile.name}: live root build header is not the repository system version`);

    await page.locator('#db41-shell.open').waitFor({state:'visible',timeout:10000});
    assert.equal(await page.locator('#db41-launch').count(),0,`${profile.name}: legacy app launcher must not exist in unified mode`);
    assert.equal(await page.locator('#db41-close:visible').count(),0,`${profile.name}: unified app must not expose a Close Workspace control`);
    assert.equal(await page.locator('#db41-video-sheet').count(),1,`${profile.name}: unified video sheet missing`);
    assert.equal(await page.locator('#db41-video-head').count(),1,`${profile.name}: unified video drag handle missing`);
    assert.equal(await page.locator('#db41-video-min').count(),1,`${profile.name}: video minimize control missing`);
    assert.equal(await page.locator('#db41-video-max').count(),1,`${profile.name}: video maximize control missing`);
    assert.equal(await page.locator('body.db41-unified-app').count(),1,`${profile.name}: unified app body state missing`);
    assert.equal(await page.locator('#db41-mobilebar:visible').count(),1,`${profile.name}: mobile app bar missing`);
    assert.equal(await page.locator('#db41-mobile-menu:visible').count(),1,`${profile.name}: mobile menu button missing`);
    await noHorizontalOverflow(page,`${profile.name} unified root`);
    const visibleText=await page.locator('body').innerText();
    assert.ok(!/[ÃÂ�]/.test(visibleText),`${profile.name}: mojibake detected in visible mobile text`);
    if(profile.name!=='tablet-768'){assert.ok(await page.locator('.db41-exmeta').count()>=1,`${profile.name}: mobile metadata grid missing`);}
    await page.screenshot({path:`${OUT}/${profile.name}-unified-root.png`,fullPage:true});

    await openDrawer(page);
    assert.ok(await page.locator('.db41-panel.mobile-menu-open').count(),`${profile.name}: mobile drawer did not open`);
    await page.locator('#db41-nav button').filter({hasText:/^Welcome$/}).click();
    await page.waitForTimeout(200);
    assert.equal(await page.locator('.db41-panel.mobile-menu-open').count(),0,`${profile.name}: drawer did not close after navigation`);
    assert.ok(await page.getByText('Train with a plan that adapts to you.').count(),`${profile.name}: welcome screen missing`);

    for(const section of ['Today','Plan','Progress']){
      await shellNav(page,section);
      await noHorizontalOverflow(page,`${profile.name} ${section}`);
      await page.screenshot({path:`${OUT}/${profile.name}-${section.toLowerCase()}.png`,fullPage:true});
    }

    await shellNav(page,'Library');
    await noHorizontalOverflow(page,`${profile.name} library`);
    const libraryText=(await page.locator('#db41-view').innerText()).toLowerCase();
    assert.ok(libraryText.includes('home equipment'),`${profile.name}: Home Equipment library missing`);
    assert.ok(libraryText.includes('full gym equipment library'),`${profile.name}: Full Gym Equipment Library missing`);
    assert.ok(libraryText.includes('adjustable dumbbell'),`${profile.name}: adjustable dumbbells missing from home equipment`);
    assert.ok(libraryText.includes('5')&&libraryText.includes('55'),`${profile.name}: 5-55 lb home dumbbell range missing`);
    assert.ok(libraryText.includes('floor mat'),`${profile.name}: floor mat missing from home equipment`);
    assert.ok(libraryText.includes('pull-up')||libraryText.includes('hanging bar'),`${profile.name}: pull-up/hanging bar missing from home equipment`);
    const search=page.locator('#db41-library-search');
    await search.fill('hack squat');
    await page.waitForTimeout(250);
    const filteredText=(await page.locator('#db41-view').innerText()).toLowerCase();
    assert.ok(filteredText.includes('hack squat'),`${profile.name}: gym equipment search did not return Hack Squat`);
    assert.ok(filteredText.includes('equipment types shown'),`${profile.name}: filtered equipment count missing`);
    await page.locator('#db41-library-clear').click();
    await page.waitForTimeout(200);
    await page.screenshot({path:`${OUT}/${profile.name}-equipment-library.png`,fullPage:true});

    await shellNav(page,'Profile');
    await noHorizontalOverflow(page,`${profile.name} profile`);
    await shellNav(page,'Settings');
    await noHorizontalOverflow(page,`${profile.name} settings`);

    if(consoleErrors.length)failures.push(`${profile.name}: console errors: ${consoleErrors.join(' | ')}`);
  }catch(e){
    failures.push(`${profile.name}: ${e.message}`);
    await page.screenshot({path:`${OUT}/${profile.name}-failure.png`,fullPage:true}).catch(()=>{});
  }finally{await context.close()}
}

await browser.close();
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else{console.log(`Live mobile QA passed for unified production build ${SYSTEM_VERSION} at 390px, 430px and 768px, including full-screen shell and reconciled Home/Gym equipment libraries.`)}
