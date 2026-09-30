import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import handler from '../netlify/functions/chat.js';
const context=vm.createContext({AbortController,setTimeout,clearTimeout,Date,fetch});
vm.runInContext(readFileSync(new URL('../js/chat-chain.js',import.meta.url),'utf8'),context);
const run=context.TakagiChatChain.run;
const body={message:'这道题怎么做',password:'test-password',modelPreference:'qwen-flash'};
const sleep=async()=>{};
const success=engine=>Response.json({text:'我看看这道题。',engine,engineName:engine});
const unavailable=()=>Response.json({error:'上游暂时不可用',code:'ENGINE_UNAVAILABLE',engine:'test'},{status:503});

test('每个引擎首次连接加两次重连，Flash、Max、DeepSeek Flash、Pro 顺序正确',async()=>{
 const calls=[],progress=[];
 const result=await run(body,{sleep,onProgress:step=>progress.push(step),fetchImpl:async(url,options)=>{
  const payload=JSON.parse(options.body);calls.push(payload.modelPreference);
  assert.equal(payload.password,body.password);assert.equal(payload.allowFallback,false);assert.equal(payload.clientManagedRetries,true);
  return calls.length===12?success(payload.modelPreference):unavailable();
 }});
 assert.deepEqual(calls,['qwen-flash','qwen-flash','qwen-flash','qwen-max','qwen-max','qwen-max','deepseek-flash','deepseek-flash','deepseek-flash','deepseek-pro','deepseek-pro','deepseek-pro']);
 assert.equal(result.connectionAttempts,12);assert.equal(progress[2].attempt,3);
});
test('AbortError 带数字 code 时仍重连，当前引擎恢复后停止切换',async()=>{
 let calls=0;const result=await run(body,{sleep,fetchImpl:async()=>{if(++calls<3)throw Object.assign(new Error('aborted'),{name:'AbortError',code:20});return success('qwen-flash')}});
 assert.equal(calls,3);assert.equal(result.engine,'qwen-flash');assert.equal(result.retryCount,2);
});
test('图片在重连时完整保留，并跳过纯文本 Pro',async()=>{
 const image='data:image/png;base64,aGVsbG8=';const calls=[];
 const result=await run({...body,image},{sleep,fetchImpl:async(url,options)=>{const payload=JSON.parse(options.body);assert.equal(payload.image,image);calls.push(payload.modelPreference);return calls.length===7?success(payload.modelPreference):unavailable()}});
 assert.deepEqual(calls,['qwen-flash','qwen-flash','qwen-flash','qwen-max','qwen-max','qwen-max','deepseek-flash']);assert.equal(result.engine,'deepseek-flash');
});
test('密码失败立即终止，取消等待也不会启动后续模型',async()=>{
 let calls=0;await assert.rejects(run(body,{sleep,fetchImpl:async()=>{calls++;return Response.json({error:'密码错误',code:'INVALID_ADMIN_PASSWORD'},{status:401})}}),error=>error.code==='INVALID_ADMIN_PASSWORD');assert.equal(calls,1);
 const controller=new AbortController();controller.abort();await assert.rejects(run(body,{signal:controller.signal,fetchImpl:async()=>{calls++}}),error=>error.code==='CLIENT_CANCELLED');assert.equal(calls,1);
});
test('全部失败保留每次具体诊断，不自动返回本地生成的回复',async()=>{
 await assert.rejects(run(body,{sleep,fetchImpl:async()=>unavailable()}),error=>error.code==='ALL_ENGINES_FAILED'&&error.attempts.length===12);
});

test('服务端视觉请求保留图片，关闭思考，不叠加内部重试',async()=>{
 process.env.ADMIN_PASSWORD='test-password';process.env.QWEN_API_KEY='test-key';process.env.DEEPSEEK_API_KEY='test-key';
 const image='data:image/png;base64,aGVsbG8=';let outbound,calls=0;
 globalThis.fetch=async(url,options)=>{calls++;outbound=JSON.parse(options.body);return Response.json({choices:[{message:{content:'{"text":"我看到题目了。"}'}}]})};
 const request=payload=>new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,allowFallback:false,clientManagedRetries:true,...payload})});
 let response=await handler(request({image}));let reply=await response.json();assert.equal(response.status,200);assert.equal(reply.visionEnabled,true);assert.equal(outbound.enable_thinking,false);assert.equal(outbound.messages.at(-1).content[1].image_url.url,image);
 assert.match(outbound.messages[0].content,/实际视觉输入/);
 response=await handler(request({image,modelPreference:'deepseek-flash'}));assert.equal(response.status,200);assert.equal(outbound.model,'deepseek-flash');
 calls=0;response=await handler(request({image,modelPreference:'deepseek-pro'}));assert.equal(response.status,400);assert.equal((await response.json()).code,'VISION_UNSUPPORTED');assert.equal(calls,0);
 globalThis.fetch=async()=>{calls++;return unavailable()};response=await handler(request({}));reply=await response.json();assert.equal(response.status,502);assert.equal(reply.details.status,503);assert.equal(calls,1);assert.equal(reply.attempts.length,1);assert.equal(reply.retryCount,0);
});

