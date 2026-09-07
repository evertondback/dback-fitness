import test from 'node:test';
import assert from 'node:assert/strict';
import {APP41_JS} from '../src/v41-fitness-app-shell.js';
import {PLATFORM40_JS} from '../src/v40-adaptive-platform.js';
import {COMMAND36_JS} from '../src/v36-universal-command-center.js';
import {TIMER37_JS} from '../src/v37-timer-tracker.js';

test('injected browser runtime strings are valid JavaScript',()=>{
 const runtimes={APP41_JS,PLATFORM40_JS,COMMAND36_JS,TIMER37_JS};
 for(const [name,source] of Object.entries(runtimes)){
  assert.doesNotThrow(()=>new Function(source),`${name} must parse when injected into the production HTML`);
 }
});
