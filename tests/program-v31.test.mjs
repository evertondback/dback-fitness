import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PROGRAM31,WARMUP31,DAY_ORDER,validateProgram31} from '../src/v31-program-core.js';

test('canonical program is complete and valid',()=>{
 const result=validateProgram31();
 assert.equal(result.ok,true,result.errors.join('\n'));
 assert.equal(result.days,7);
 assert.ok(result.totalExercises>=50);
 assert.ok(result.warmupMovements>=15);
});

test('every day is a 60 minute standalone session',()=>{
 assert.deepEqual(Object.keys(PROGRAM31).sort(),DAY_ORDER.slice().sort());
 for(const day of DAY_ORDER){
  const d=PROGRAM31[day];
  assert.equal(d.targetMinutes,60,day);
  assert.ok(d.focus.length>3,day);
  assert.ok(d.exercises.length>=6,day);
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

test('production worker wires only the current realistic anatomy module and completion suite',async()=>{
 const source=await readFile(new URL('../src/worker-v10.js',import.meta.url),'utf8');
 assert.match(source,/v30-anatomy-realistic\.js/);
 assert.doesNotMatch(source,/v27-anatomy-vector\.js|v28-anatomy-mobile-shell\.js|v29-anatomy-unified\.js/);
 assert.match(source,/v31-completion-ui\.js/);
 assert.match(source,/handleV31Api/);
});
