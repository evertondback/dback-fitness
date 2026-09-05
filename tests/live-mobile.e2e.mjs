import {chromium, devices} from 'playwright';
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
  const candidates=[
    page.getByRole('button',{name:text,exact:true}),
    page.getByText(text,{exact:true})
  ];
  for(const c of candidates){
    if(await c.count()){await c.first().click();await page.waitForTimeout(500);return;}
  }
  throw new Error(`Navigation control not found: ${text}`);
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

  const res=await page.goto(BASE,{waitUntil:'networkidle',timeout:60000});
  assert.ok(res&&res.ok(),`${profile.name}: live site failed to load`);
  await noHorizontalOverflow(page,`${profile.name} home`);

  await clickNav(page,'Workout');
  await page.locator('#view-workout .db31').waitFor({state:'visible',timeout:15000});
  assert.equal(await page.locator('#view-workout [data-db31-day]').count(),7,`${profile.name}: Workout must show 7 day tabs`);
  assert.ok((await page.locator('#view-workout .db31WarmItem').count())>=15,`${profile.name}: incomplete warm-up`);
  assert.ok((await page.locator('#view-workout .db31Exercise').count())>=6,`${profile.name}: incomplete workout exercises`);
  assert.equal(await page.locator('#view-workout .db31Error').count(),0,`${profile.name}: Workout error state present`);
  await noHorizontalOverflow(page,`${profile.name} workout`);
  await page.screenshot({path:`${OUT}/${profile.name}-workout.png`,fullPage:true});

  await clickNav(page,'Full Plan');
  await page.locator('#view-plan .db31').waitFor({state:'visible',timeout:15000});
  assert.equal(await page.locator('#view-plan .db31PlanDay').count(),7,`${profile.name}: Full Plan must show 7 days`);
  assert.equal(await page.locator('#view-plan .db31Error').count(),0,`${profile.name}: Full Plan error state present`);
  await noHorizontalOverflow(page,`${profile.name} full-plan`);
  await page.screenshot({path:`${OUT}/${profile.name}-full-plan.png`,fullPage:true});

  await clickNav(page,'Anatomy Lab');
  await page.locator('#view-anatomy .db30').waitFor({state:'visible',timeout:15000});
  assert.equal(await page.locator('#view-anatomy .db30').count(),1,`${profile.name}: Anatomy must have exactly one unified map`);
  assert.equal(await page.locator('#view-anatomy .db30Tabs button').count(),3,`${profile.name}: Anatomy view controls missing`);
  for(const label of ['Front View','Back View','Both Views']){
    const b=page.getByRole('button',{name:label,exact:true});
    assert.ok(await b.count(),`${profile.name}: missing ${label}`);
    await b.click();
    await page.waitForTimeout(150);
  }
  await noHorizontalOverflow(page,`${profile.name} anatomy`);
  await page.screenshot({path:`${OUT}/${profile.name}-anatomy.png`,fullPage:true});

  for(const section of ['Progress','History','AI Coach','Profile']){
    await clickNav(page,section);
    await page.waitForTimeout(350);
    await noHorizontalOverflow(page,`${profile.name} ${section}`);
  }

  if(consoleErrors.length)failures.push(`${profile.name}: console errors: ${consoleErrors.join(' | ')}`);
  await context.close();
}

await browser.close();
if(failures.length){
  console.error(failures.join('\n'));
  process.exitCode=1;
}else{
  console.log('Live mobile QA passed for 390px, 430px and 768px viewports.');
}
