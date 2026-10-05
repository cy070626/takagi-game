import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import handler from '../netlify/functions/chat.js';
import {interactiveRequested} from '../netlify/functions/reply-format.js';
import {decodeModelReply} from '../netlify/functions/reply-parser.js';
const card={title:'分数练习',html:"<button type='button' onclick='this.textContent=2+2'>看答案</button>"};
function request(message,modelPreference='qwen-flash'){return new Request('https://example.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,modelPreference,password:'test-pass',allowFallback:false,clientManagedRetries:true})})}
test('生成页面需要明确意图，普通聊天和否定意图不触发',()=>{
 for(const text of ['生成一个HTML分数小游戏','帮我做一个可拖动的互动页面','制作一个互动卡片'])assert.equal(interactiveRequested(text),true,text);
 for(const text of ['打开音乐小剧场','我想玩一个小游戏','今天晚饭吃什么','不要生成网页','不要做一个HTML页面'])assert.equal(interactiveRequested(text),false,text);
});
test('四个引擎均接收自然语言公式规则，HTML 按要求返回独立字段',async()=>{
 process.env.ADMIN_PASSWORD='test-pass';process.env.QWEN_API_KEY='test-key';process.env.DEEPSEEK_API_KEY='test-key';const original=globalThis.fetch;
 try {for(const engine of ['qwen-flash','qwen-max','deepseek-flash','deepseek-pro']){
 let outbound;globalThis.fetch=async(_,options)=>{outbound=JSON.parse(options.body);return Response.json({choices:[{message:{content:JSON.stringify({text:'给你做了道分数练习。',interactive:card})}}]})};
 const response=await handler(request('生成一个HTML分数互动页面',engine));const reply=await response.json();
 assert.equal(response.status,200);assert.deepEqual(reply.interactive,card);assert.match(outbound.messages[0].content,/自然语言/);assert.match(outbound.messages[0].content,/不能只甩代码/);assert.match(outbound.messages[0].content,/本轮玩家明确请求/);assert.equal(outbound.max_tokens,1800);
 }}finally{globalThis.fetch=original}
});
test('模型擅自返回页面时丢弃，仅显示文字，普通预算不增加',async()=>{
 process.env.ADMIN_PASSWORD='test-pass';process.env.QWEN_API_KEY='test-key';const original=globalThis.fetch;let outbound;
 globalThis.fetch=async(_,options)=>{outbound=JSON.parse(options.body);return Response.json({choices:[{message:{content:JSON.stringify({text:'结果是四。',interactive:card})}}]})};
 try{const response=await handler(request('二加二等于几'));const reply=await response.json();assert.equal(reply.interactive,undefined);assert.equal(reply.text,'结果是四。');assert.equal(outbound.max_tokens,360)}finally{globalThis.fetch=original}
});
test('过长的 HTML 不截断执行，反馈请求缩小范围',async()=>{
 process.env.ADMIN_PASSWORD='test-pass';process.env.QWEN_API_KEY='test-key';const original=globalThis.fetch;
 globalThis.fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify({text:'做了一道题。',interactive:{html:'x'.repeat(6001)}})}}]});
 try{const response=await handler(request('生成一个HTML页面'));const reply=await response.json();assert.equal(reply.interactive,undefined);assert.match(reply.text,/没有生成完整/)}finally{globalThis.fetch=original}
});
test('页面 JSON 被截断时仍恢复自然语言，避免显示整个代码包装',()=>{
 const reply=decodeModelReply('{"text":"这道题算出来是四。","interactive":{"html":"<button');assert.equal(reply.text,'这道题算出来是四。');assert.equal(reply.interactive,undefined);
});
test('页面请求不会被现有小游戏入口截走，打开原小游戏仍按原路由',()=>{
 const context=vm.createContext({TakagiInteractiveCard:{requested:interactiveRequested}});vm.runInContext(readFileSync(new URL('../js/chat-hub.js',import.meta.url),'utf8'),context);
 assert.equal(context.TakagiChatHub.intent('帮我做一个HTML小游戏页面'),null);
 assert.equal(context.TakagiChatHub.intent('打开小游戏').type,'games');
});
test('卡片默认不执行，展开才创建 sandbox iframe，关闭后移除',()=>{
 function el(tag){return{tag,dataset:{},attrs:{},children:[],hidden:false,append(...items){this.children.push(...items)},replaceChildren(){this.children=[]},setAttribute(k,v){this.attrs[k]=v}}}
 const context=vm.createContext({document:{createElement:el},DOMParser:class{parseFromString(){return{querySelectorAll:()=>[],head:{innerHTML:''},body:{innerHTML:card.html}}}}});vm.runInContext(readFileSync(new URL('../js/features/interactive-card.js',import.meta.url),'utf8'),context);
 const row=el('div');context.TakagiInteractiveCard.attach(row,card);const panel=row.children[0],actions=panel.children[2],box=panel.children[3];assert.equal(box.hidden,true);assert.equal(box.children.length,0);
 actions.children[0].onclick();const frame=box.children[0];assert.equal(frame.attrs.sandbox,'allow-scripts');assert.match(frame.srcdoc,/connect-src 'none'/);assert.match(frame.srcdoc,/form-action 'none'/);assert.match(frame.attrs.allow,/microphone 'none'/);assert.equal(frame.referrerPolicy,'no-referrer');
 actions.children[0].onclick();assert.equal(box.children.length,0);assert.equal(box.hidden,true);
});

test('人物小气泡使用可读摘要，不显示公式代码，也不切断表情字符',()=>{
 const context=vm.createContext({});vm.runInContext(readFileSync(new URL('../js/features/reply-display.js',import.meta.url),'utf8'),context);
 const line=context.TakagiReplyDisplay.summary(String.raw`结果是五份。\(\frac{5}{6}\)`);assert.equal(line,'结果是五份。');
 assert.doesNotMatch(context.TakagiReplyDisplay.summary(String.raw`\(\frac{5}{6}\)`),/frac/);
 assert.equal(context.TakagiReplyDisplay.summary('😊'.repeat(60)),'😊'.repeat(58)+'…');
});
