import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import handler from '../netlify/functions/chat.js';

function browserContext() {
  const storage = new Map();
  let now = 1000000;
  const context = vm.createContext({ sessionStorage: { getItem: key => storage.get(key), setItem: (key,value) => storage.set(key,value) }, Date: class extends Date { static now(){return now} }, crypto: { randomUUID: () => 'visit-test' }, document: { addEventListener(){} } });
  return {context,advance:ms=>{now+=ms}};
}

test('备用模型保持五分钟，随后恢复首选，手动重置立即恢复',()=>{
  const {context,advance}=browserContext();
  vm.runInContext(readFileSync(new URL('../js/engine-session.js',import.meta.url),'utf8'),context);
  const engine=context.TakagiEngineSession;
  engine.accept('qwen-max',{engine:'deepseek-pro'});
  assert.equal(engine.preference('qwen-max'),'deepseek-pro');
  assert.equal(engine.preference('qwen-flash'),'qwen-flash');
  advance(240000);engine.accept('qwen-max',{engine:'deepseek-pro'});
  advance(61000);assert.equal(engine.preference('qwen-max'),'qwen-max');
  engine.accept('qwen-max',{engine:'qwen-flash'});engine.reset();
  assert.equal(engine.preference('qwen-max'),'qwen-max');
});

test('长对话后仍保留游戏经历，摘要有长度上限并可刷新恢复',()=>{
  const {context}=browserContext();
  const source=readFileSync(new URL('../js/visit-memory.js',import.meta.url),'utf8');
  vm.runInContext(source,context);
  context.TakagiVisitMemory.record('游戏','猜心对决完成一局','赢了');
  for(let n=0;n<45;n++)context.TakagiVisitMemory.record('对话',`第${n}句话`,'回复');
  assert.match(context.TakagiVisitMemory.context(),/猜心对决完成一局/);
  assert.ok(context.TakagiVisitMemory.context().length<=1220);
  vm.runInContext(source,context);
  assert.match(context.TakagiVisitMemory.context(),/猜心对决完成一局/);
});

test('密码失败反馈带请求编号，同时不回传密码',async()=>{
  const previous=process.env.ADMIN_PASSWORD;process.env.ADMIN_PASSWORD='server-only-value';
  try{
    const response=await handler(new Request('https://example.test/api/chat',{method:'POST',headers:{'x-nf-request-id':'diagnostic-test-123','Content-Type':'application/json'},body:JSON.stringify({message:'你好',password:'wrong-input'})}));
    const data=await response.json();assert.equal(response.status,401);assert.equal(data.requestId,'diagnostic-test-123');
    assert.ok(!JSON.stringify(data).includes('server-only-value'));assert.ok(!JSON.stringify(data).includes('wrong-input'));
  }finally{if(previous===undefined)delete process.env.ADMIN_PASSWORD;else process.env.ADMIN_PASSWORD=previous}
});
