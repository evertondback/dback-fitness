import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PROGRAM31,WARMUP31,DAY_ORDER,validateProgram31} from '../src/v31-program-core.js';
import {coachingFor} from '../src/v36-coaching.js';

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

test('production worker wires only the current realistic anatomy module and completion suite',async()=>{
 const source=await readFile(new URL('../src/worker-v10.js',import.meta.url),'utf8');
 assert.match(source,/v30-anatomy-realistic\.js/);
 assert.doesNotMatch(source,/v27-anatomy-vector\.js|v28-anatomy-mobile-shell\.js|v29-anatomy-unified\.js/);
 assert.match(source,/v31-completion-ui\.js/);
 assert.match(source,/handleV31Api/);
});

test('v31 API never performs runtime schema DDL and exposes complete contract',async()=>{
 const source=await readFile(new URL('../src/v31-api.js',import.meta.url),'utf8');
 assert.doesNotMatch(source,/CREATE\s+TABLE/i);
 assert.match(source,/v36-coaching\.js/);
 for(const table of ['workout_sessions','set_logs','exercise_state'])assert.match(source,new RegExp(table));
 for(const route of ['/api/v31/health','/api/v31/program','/api/v31/session/start','/api/v31/session/log','/api/v31/session/complete','/api/v31/history','/api/v31/progress'])assert.ok(source.includes(route),route);
});

test('production shell is stamped as v36.1 and disables caching',async()=>{
 const source=await readFile(new URL('../src/worker-production.js',import.meta.url),'utf8');
 assert.match(source,/PRODUCTION_VERSION='36\.1\.0'/);
 assert.match(source,/no-store, no-cache, must-revalidate/);
 assert.match(source,/x-dback-build/);
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

test('anatomy UI has unified cleanup and mobile full-screen contract',async()=>{
 const source=await readFile(new URL('../src/v30-anatomy-realistic.js',import.meta.url),'utf8');
 assert.match(source,/@media\(max-width:720px\)/);
 assert.match(source,/#view-anatomy>\*:not\(\.db30\)\{display:none!important\}/);
 assert.match(source,/function clean\(v\)/);
 assert.match(source,/data-mode="front"/);
 assert.match(source,/data-mode="back"/);
 assert.match(source,/data-mode="both"/);
});
