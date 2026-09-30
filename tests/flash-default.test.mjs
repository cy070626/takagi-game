import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

test('旧引擎偏好自动迁移为 Flash，保留其他个人设置且只迁移一次',()=>{
 const source=readFileSync(new URL('../js/experience.js',import.meta.url),'utf8');
 const init=source.slice(source.indexOf('function save('),source.indexOf('const savedMode='));
 const storage=new Map([['takagi-profile',JSON.stringify({modelPreference:'qwen-max',name:'小明',currentMood:'happy',difficulty:'easy'})]]);
 let resets=0;
 const boot=()=>{const ctx=vm.createContext({localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},TakagiEngineSession:{reset:()=>resets++}});vm.runInContext(init,ctx);return JSON.parse(vm.runInContext('JSON.stringify(profile)',ctx))};
 const profile=boot();assert.equal(profile.modelPreference,'qwen-flash');assert.equal(profile.name,'小明');assert.equal(profile.currentMood,'happy');assert.equal(profile.difficulty,'easy');assert.equal(resets,1);
 storage.set('takagi-profile',JSON.stringify({...profile,modelPreference:'deepseek-pro'}));assert.equal(boot().modelPreference,'deepseek-pro');assert.equal(resets,1);
});
