import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';

const BASE=process.env.DBACK_LIVE_URL||'https://dback-fitness.dback.workers.dev';
const OUT='artifacts/mobile-qa';
await mkdir(OUT,{recursive:true});

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

async function clickNav(page,text){
  const buttons=page.getByRole('button',{name:text,exact:true});
  const count=await buttons.count();
  for(let i=0;i<count;i++){
    const b=buttons.nth(i);
    if(await b.isVisible()){
      await b.click();
      await page.waitForTimeout(700);
      return;
    }
  }
  const visible=await page.locator('button:visible').allTextContents();
  throw new Error(`Visible navigation control not found: ${text}. Visible buttons: ${visible.join(' | ')}`);
}

for(const profile of profiles){
  const context=await browser.newContext({
    viewport:profile.viewport,
    deviceScaleFactor:profile.deviceScaleFactor,
    isMobile:profile.isMobile,
    hasTouch:profile.hasTouch
  });
  const page=await context.newPage();
  page.on('pageerror',e=>failures.push(`${profile.name}: pageerror ${e.message}`));
  const consoleErrors=[];
  page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
  let historyGets=0;
  page.on('request',r=>{if(r.method()==='GET'&&r.url().includes('/api/manage/history')&&!r.url().includes('/export'))historyGets++});

  try{
    const res=await page.goto(BASE,{waitUntil:'networkidle',timeout:60000});
    assert.ok(res&&res.ok(),`${profile.name}: live site failed to load`);
    await page.screenshot({path:`${OUT}/${profile.name}-home.png`,fullPage:true});
    await noHorizontalOverflow(page,`${profile.name} home`);

    await clickNav(page,'Workout');
    await page.locator('#view-workout .db31').waitFor({state:'visible',timeout:20000});
    assert.equal(await page.locator('#view-workout [data-db31-day]').count(),7,`${profile.name}: Workout must show 7 day tabs`);
    assert.ok((await page.locator('#view-workout .db31WarmItem').count())>=15,`${profile.name}: incomplete warm-up`);
    assert.ok((await page.locator('#view-workout .db31Exercise').count())>=6,`${profile.name}: incomplete workout exercises`);
    assert.equal(await page.locator('#view-workout .db31Error').count(),0,`${profile.name}: Workout error state present`);
    await noHorizontalOverflow(page,`${profile.name} workout`);
    await page.screenshot({path:`${OUT}/${profile.name}-workout.png`,fullPage:true});

    await clickNav(page,'Full Plan');
    await page.locator('#view-plan .db31').waitFor({state:'visible',timeout:20000});
    assert.equal(await page.locator('#view-plan .db31PlanDay').count(),7,`${profile.name}: Full Plan must show 7 days`);
    assert.equal(await page.locator('#view-plan .db31Error').count(),0,`${profile.name}: Full Plan error state present`);
    await noHorizontalOverflow(page,`${profile.name} full-plan`);
    await page.screenshot({path:`${OUT}/${profile.name}-full-plan.png`,fullPage:true});

    await clickNav(page,'Anatomy Lab');
    await page.locator('#view-anatomy .db30').waitFor({state:'visible',timeout:20000});
    assert.equal(await page.locator('#view-anatomy .db30').count(),1,`${profile.name}: Anatomy must have exactly one unified map`);
    assert.equal(await page.locator('#view-anatomy .db30Tabs button').count(),3,`${profile.name}: Anatomy view controls missing`);
    for(const label of ['Front View','Back View','Both Views']){
      const b=page.getByRole('button',{name:label,exact:true});
      assert.ok(await b.count(),`${profile.name}: missing ${label}`);
      await b.first().click();
      await page.waitForTimeout(150);
    }
    await noHorizontalOverflow(page,`${profile.name} anatomy`);
    await page.screenshot({path:`${OUT}/${profile.name}-anatomy.png`,fullPage:true});

    await clickNav(page,'Progress');
    await page.waitForTimeout(350);
    await noHorizontalOverflow(page,`${profile.name} Progress`);

    const historyBefore=historyGets;
    await clickNav(page,'History');
    await page.locator('#view-history .dbManager .card').waitFor({state:'visible',timeout:20000});
    await page.evaluate(()=>{const card=document.querySelector('#view-history .dbManager .card');if(card)card.dataset.stabilityProbe='stable'});
    await page.waitForTimeout(1800);
    assert.equal(await page.locator('#view-history .dbManager .card[data-stability-probe="stable"]').count(),1,`${profile.name}: History DOM was replaced repeatedly (flicker regression)`);
    assert.ok(historyGets-historyBefore<=1,`${profile.name}: History refetched repeatedly (${historyGets-historyBefore} GETs)`);
    await noHorizontalOverflow(page,`${profile.name} History`);
    await page.screenshot({path:`${OUT}/${profile.name}-history.png`,fullPage:true});

    for(const section of ['AI Coach','Profile']){
      await clickNav(page,section);
      await page.waitForTimeout(350);
      await noHorizontalOverflow(page,`${profile.name} ${section}`);
    }

    if(consoleErrors.length)failures.push(`${profile.name}: console errors: ${consoleErrors.join(' | ')}`);
  }catch(e){
    failures.push(`${profile.name}: ${e.message}`);
    await page.screenshot({path:`${OUT}/${profile.name}-failure.png`,fullPage:true}).catch(()=>{});
  }finally{
    await context.close();
  }
}

await browser.close();
if(failures.length){
  console.error(failures.join('\n'));
  process.exitCode=1;
}else{
  console.log('Live mobile QA passed for 390px, 430px and 768px viewports, including History anti-flicker stability.');
}
