import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {SYSTEM_VERSION} from '../src/system-version.js';

test('release metadata is internally consistent', async()=>{
 const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
 const shell=await readFile(new URL('../src/v41-fitness-app-shell.js',import.meta.url),'utf8');
 assert.equal(pkg.version,SYSTEM_VERSION);
 assert.ok(shell.includes(`APP41_VERSION='${SYSTEM_VERSION}'`));
});
