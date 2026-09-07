import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PROGRAM31,WARMUP31,DAY_ORDER,validateProgram31} from '../src/v31-program-core.js';
import {coachingFor} from '../src/v36-coaching.js';
import {SYSTEM_VERSION} from '../src/system-version.js';

test('canonical program is complete and valid',()=>{
 const result=validateProgram31();
 assert.equal(result.ok,true,result.errors.join('\n'));
 assert.equal(result.days,7);
 assert.ok(result.totalExercises>=60);
 assert.ok(result.warmupMovements>=15);
 assert.equal(result.version,'36.1.0');
});

test('every day remains a 60 minute standalone session without runaway exercise count',()=>{
 assert.deepEqual(Object.keys(PROGRAM31).sort(),DAY_ORDER.slice().sort());
 for(const day of DAY_ORDER){
  const d=PROGRAM31[day];
  assert.equal(d.targetMinutes,60,day);
  assert.ok(d.focus.length>3,day);
  assert.ok(d.exercises.length>=6,day);
  assert.ok(d.exercises.length<=10,`${day}: too many exercises for a focused 60-minute session`);
 }
});

test('exercise identifiers are unique and every exercise has an instructional video',()=>{
 const ids=new Set();
 for(const day of DAY_ORDER){
  for(const e of PROGRAM31[day].exercises){
   assert.ok(!ids.has(e.id),`duplicate exercise id: ${e.id}`);
   ids.add(e.id);
   assert.match(e.video,/^https:\/\/www\.youtube\.com\/watch\?/);
   assert.ok(Number.isFinite(e.restSeconds));
  }
 }
});

test('warm-up covers the full movement chain',()=>{
 const cats=new Set(WARMUP31.map(x=>x.category));
 for(const expected of ['feet','ankles','knees','hips','spine','neck','shoulders','scapula','forearms','wrists','glutes','core','grip','posture'])assert.ok(cats.has(expected),expected);
});

test('targeted gaps are explicitly trained',()=>{
 const names=Object.values(PROGRAM31).flatMap(d=>d.exercises.map(e=>e.name));
 for(const required of ['Single-Leg Calf Raise','Wall Tibialis Raise','Reverse Crunch','Dumbbell Lateral Lunge','Side-Lying Dumbbell External Rotation','Bodyweight Squat Jump'])assert.ok(names.includes(required),required);
 assert.ok(names.filter(x=>x==='Single-Leg Calf Raise').length>=2,'calves need two direct weekly exposures');
 assert.ok(names.filter(x=>x==='Wall Tibialis Raise').length>=2,'tibialis needs two direct weekly exposures');
 assert.ok(names.filter(x=>x==='Reverse Crunch').length>=2,'direct trunk flexion needs two weekly exposures');
});

test('every exercise resolves to usable coaching metadata',()=>{
 for(const day of DAY_ORDER){
  for(const e of PROGRAM31[day].exercises){
   const c=coachingFor(e);
   for(const field of ['purpose','muscles','cues','watchFor','focus'])assert.ok(String(c[field]||'').length>12,`${day}/${e.name}: missing coaching ${field}`);
  }
 }
});

test('production worker wires current anatomy, completion suite, universal tracker, adaptive platform and app shell',async()=>{
 const source=await readFile(new URL('../src/worker-v10.js',import.meta.url),'utf8');
 assert.match(source,/v35-anatomy-hard-reset\.js/);
 assert.doesNotMatch(source,/v27-anatomy-vector\.js|v28-anatomy-mobile-shell\.js|v29-anatomy-unified\.js|v30-anatomy-realistic\.js/);
 assert.match(source,/v31-completion-ui\.js/);
 assert.match(source,/v37-timer-tracker\.js/);
 assert.match(source,/v37-reconcile-api\.js/);
 assert.match(source,/v40-adaptive-platform\.js/);
 assert.match(source,/v41-fitness-app-shell\.js/);
 assert.match(source,/TIMER37_CSS/);
 assert.match(source,/TIMER37_JS/);
 assert.match(source,/PLATFORM40_CSS/);
 assert.match(source,/PLATFORM40_JS/);
 assert.match(source,/APP41_CSS/);
 assert.match(source,/APP41_JS/);
 assert.match(source,/handleV31Api/);
 assert.match(source,/handleV37ReconcileApi/);
 assert.match(source,/handleV40Api/);
});

test('universal timer tracker covers every workout exercise and warm-up movement',async()=>{
 const source=await readFile(new URL('../src/v37-timer-tracker.js',import.meta.url),'utf8');
 assert.match(source,/\.db31Exercise/);
 assert.match(source,/\.db31WarmItem/);
 assert.match(source,/Work \/ Exercise/);
 assert.match(source,/>Rest</);
 assert.match(source,/Complete Set/);
 assert.match(source,/Undo Set/);
 assert.match(source,/warm-check/);
 assert.match(source,/localStorage/);
 assert.match(source,/navigator\.vibrate/);
 assert.match(source,/data-log/);
 assert.match(source,/Workout Tracker/);
});

test('v31 API never performs runtime schema DDL and exposes complete contract',async()=>{
 const source=await readFile(new URL('../src/v31-api.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/CREATE\s+TABLE/i);
 assert.match(source,/v36-coaching\.js/);
 for(const table of ['workout_sessions','set_logs','exercise_state'])assert.match(source,new RegExp(table));
 for(const route of ['/api/v31/health','/api/v31/program','/api/v31/session/start','/api/v31/session/log','/api/v31/session/complete','/api/v31/history','/api/v31/progress'])assert.ok(source.includes(route),route);
});

test('runtime reconciliation uses authoritative live D1 column names',async()=>{
 const source=await readFile(new URL('../src/v37-reconcile-api.js',import.meta.url),'utf8');
 assert.match(source,/completed_at/);
 assert.match(source,/duration_seconds/);
 assert.doesNotMatch(source,/ended_at/);
 assert.doesNotMatch(source,/duration_min/);
 assert.match(source,/add-session/);
 assert.match(source,/duplicate-session/);
 assert.match(source,/stop-current/);
});

test('single system version is used by production runtime',async()=>{
 assert.equal(SYSTEM_VERSION,'44.0.0');
 const production=await readFile(new URL('../src/worker-production.js',import.meta.url),'utf8');
 const runtime=await readFile(new URL('../src/worker-v10.js',import.meta.url),'utf8');
 assert.match(production,/SYSTEM_VERSION as PRODUCTION_VERSION/);
 assert.match(runtime,/SYSTEM_VERSION/);
 assert.match(production,/no-store, no-cache, must-revalidate/);
 assert.match(production,/x-dback-build/);
});

test('v41 app shell exposes core universal user flows',async()=>{
 const source=await readFile(new URL('../src/v41-fitness-app-shell.js',import.meta.url),'utf8');
 for(const label of ['Today','Plan','Progress','Library','Profile','Admin','Settings'])assert.ok(source.includes(label),label);
 for(const route of ['/api/v40/me','/api/v40/plan','/api/v40/metrics','/api/v40/profile','/api/v40/admin/summary','/api/v40/admin/users'])assert.ok(source.includes(route),route);
 assert.match(source,/data-mode="gym"/);
 assert.match(source,/data-mode="home"/);
 assert.match(source,/Coach Copilot/);
 assert.match(source,/Purpose:/);
});

test('workout and full-plan UI has desktop, tablet and phone responsive contracts',async()=>{
 const source=await readFile(new URL('../src/v31-completion-ui.js',import.meta.url),'utf8');
 assert.match(source,/@media\(max-width:900px\)/);
 assert.match(source,/@media\(max-width:600px\)/);
 assert.match(source,/grid-template-columns:1fr/);
 assert.match(source,/db31Days/);
 assert.match(source,/data-db31-day/);
 assert.match(source,/Purpose:/);
 assert.match(source,/Focus muscles:/);
 assert.match(source,/Coach cues:/);
 assert.match(source,/Avoid:/);
});

test('current anatomy UI has single-owner cleanup and mobile full-screen contract',async()=>{
 const source=await readFile(new URL('../src/v35-anatomy-hard-reset.js',import.meta.url),'utf8');
 assert.match(source,/@media\(max-width:720px\)/);
 assert.match(source,/#view-anatomy>\.db35\{display:block!important\}/);
 assert.match(source,/#view-anatomy>\.db35~\*\{display:none!important\}/);
 assert.match(source,/db35Active/);
 assert.match(source,/db35Seg/);
});

test('v42 persists adaptive week and phase transitions with audit records',async()=>{
 const source=await readFile(new URL('../src/v40-adaptive-platform.js',import.meta.url),'utf8');
 assert.match(source,/syncPlanState/);
 assert.match(source,/cycle-state-change/);
 assert.match(source,/UPDATE coach_plan_state SET week_number=\?,phase=\?/);
 assert.match(source,/INSERT INTO coach_adaptations/);
});


test('v43 environment-aware planning and role-aware navigation are wired',async()=>{
 const platform=await readFile(new URL('../src/v40-adaptive-platform.js',import.meta.url),'utf8');
 const shell=await readFile(new URL('../src/v41-fitness-app-shell.js',import.meta.url),'utf8');
 assert.match(platform,/environmentExercise/);
 assert.match(platform,/homeAdaptExercise/);
 assert.match(platform,/url\.searchParams\.get\('environment'\)/);
 assert.match(platform,/actor:\{id:a\.id,role:a\.role,status:a\.status\}/);
 assert.match(shell,/plan\?environment=/);
 assert.match(shell,/S\.me\?\.actor\?\.role==='admin'/);
 assert.match(shell,/isAdmin\?\[\['admin','Admin'\]\]:\[\]/);
 assert.match(shell,/Training environment updated to/);
});


test('v44 admin lifecycle controls are wired end to end',async()=>{
 const api=await readFile(new URL('../src/v40-adaptive-platform.js',import.meta.url),'utf8');
 const ui=await readFile(new URL('../src/v41-fitness-app-shell.js',import.meta.url),'utf8');
 assert.match(api,/updateAdminUser/);
 assert.match(api,/rotateAdminUserToken/);
 assert.match(api,/admin-token-rotation/);
 assert.ok(api.includes("/api/v40/admin/users/"));
 assert.ok(api.includes("/token"));
 assert.match(ui,/data-user-action=\"status\"/);
 assert.match(ui,/data-user-action=\"role\"/);
 assert.match(ui,/data-user-action=\"token\"/);
 assert.match(ui,/adminUserAction/);
});
