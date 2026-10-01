import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('构建可重复执行，合并文件与资源版本引用保持稳定',()=>{
  const config=JSON.parse(readFileSync(resolve(root,'build.config.json'),'utf8'));
  const files=[...Object.keys(config.javascript),...Object.keys(config.css),'index.html','pages/music-theater.html'];
  const fingerprints=()=>files.map(file=>createHash('sha256').update(readFileSync(resolve(root,file))).digest('hex'));
  const before=fingerprints();
  execFileSync(process.execPath,['scripts/build-bundles.mjs'],{cwd:root,stdio:'pipe'});
  assert.deepEqual(fingerprints(),before);
  for(const file of files){
    const versions=[...readFileSync(resolve(root,file),'utf8').matchAll(/\?v=(\d+)/g)].map(match=>Number(match[1]));
    assert.ok(versions.every(version=>version===config.release),`${file} contains an old resource version`);
  }
});
