import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import handler from '../netlify/functions/chat.js';
const source=readFileSync(new URL('../js/topic-tree.js',import.meta.url),'utf8');
const terms=[{title:'透明雨伞',scene:'rain',tag:'原创情景',summary:'雨天走廊'},{title:'奶茶',scene:'cafeteria',tag:'中国日常',summary:'放学后的饮料'},{title:'食堂排队',scene:'cafeteria',summary:'午餐队伍'},{title:'放学路',scene:'classroom',summary:'放学一起走'}];
function boot(storage=new Map()){const c=vm.createContext({sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});vm.runInContext(source,c);return {tree:c.TakagiTopicTree,storage}}

test('雨伞转奶茶承接前文，明确转场不重新解释，计划失败不消耗记忆',()=>{
 const {tree,storage}=boot();tree.start(terms[0]);tree.commit(tree.plan(terms[0],'鞋湿了'),'鞋湿了','先在走廊擦一下鞋。');const before=storage.get('takagi-topic-tree-v1');
 const p=tree.resolve(terms[0],'先不聊这个，想喝杯奶茶',terms);assert.equal(p.title,'奶茶');assert.equal(p.previous,'透明雨伞');assert.equal(p.phase,'转场');assert.match(p.recent,/鞋湿了/);assert.equal(p.term.title,'奶茶');assert.equal(p.detached,undefined);assert.equal(storage.get('takagi-topic-tree-v1'),before);
 tree.commit(p,'想喝杯奶茶','走到食堂再看看口味。');const restored=boot(storage).tree;assert.equal(restored.restore(terms).title,'奶茶');assert.match(JSON.stringify(restored.handoff()),/透明雨伞 → 奶茶/);assert.match(JSON.stringify(restored.handoff()),/鞋湿了/);
});

test('不强迫转场，不把拒绝提到的奶茶选作新话题',()=>{
 const {tree}=boot();tree.start(terms[0]);assert.equal(tree.resolve(terms[0],'雨声很轻，我再坐一下',terms).title,'透明雨伞');assert.equal(tree.resolve(terms[0],'不聊奶茶了，先说雨伞吧',terms).title,'透明雨伞');assert.equal(tree.resolve(terms[0],'换个话题',terms).detached,true);
 assert.ok(tree.related(terms[1],terms).includes('食堂排队'));
});

test('三条推荐过滤机械标签及重复，下一轮有变化，包含相关转向',()=>{
 const {tree}=boot();const p=tree.resolve(terms[1],'我想喝奶茶',terms);
 const first=tree.recommendations(['补充背景','我想喝点不甜的','我想喝点不甜的'],p,{},terms);assert.equal(first.length,3);assert.equal(new Set(first).size,3);assert.ok(!first.some(x=>x.includes('背景')));
 const next=tree.recommendations([],p,{chatStyle:'playful'},terms);assert.equal(next.length,3);assert.ok(next.some(x=>/食堂|吃的/.test(x)));assert.ok(!next.some(x=>first.includes(x)));
});

test('重连和跨四个引擎保留完全相同的历史、词条与承接摘要',async()=>{
 const context=vm.createContext({AbortController,setTimeout,clearTimeout,Date,fetch});vm.runInContext(readFileSync(new URL('../js/chat-chain.js',import.meta.url),'utf8'),context);
 const body={message:'继续',password:'test-pass',modelPreference:'qwen-flash',history:[{role:'user',text:'鞋湿了'}],topicContext:{title:'奶茶',previous:'透明雨伞'},conversationContext:{details:['玩家：鞋湿了；高木：我先等你'],links:['透明雨伞 → 奶茶']},visitContext:'同一次到访'};let calls=0;
 const result=await context.TakagiChatChain.run(body,{sleep:async()=>{},fetchImpl:async(url,options)=>{const payload=JSON.parse(options.body);for(const key of ['history','topicContext','conversationContext','visitContext'])assert.deepEqual(payload[key],body[key]);return ++calls===10?Response.json({text:'我记着。',engine:payload.modelPreference}):Response.json({error:'暂时不可用',engine:payload.modelPreference,code:'ENGINE_UNAVAILABLE'},{status:503})}});
 assert.equal(calls,10);assert.equal(result.engine,'deepseek-pro');
});

test('统一提示词传入摘要与表情规则，查资料请求启用千问搜索',async()=>{
 process.env.ADMIN_PASSWORD='test-pass';process.env.QWEN_API_KEY='test-key';process.env.DEEPSEEK_API_KEY='test-key';let outbound;
 globalThis.fetch=async(url,options)=>{outbound=JSON.parse(options.body);return Response.json({choices:[{message:{content:JSON.stringify({text:'雨停了，我们再看看饮料。',suggestions:['今天想喝点清淡的']})}}]})};
 for(const modelPreference of ['qwen-flash','deepseek-pro']){
 const r=await handler(new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'test-pass',message:'帮我查一下这个',modelPreference,allowFallback:false,conversationContext:{topic:'奶茶',details:['玩家：鞋湿了；高木：先擦一下'],links:['透明雨伞 → 奶茶'],choices:['我先等雨停']},topicContext:{title:'奶茶',previous:'透明雨伞',bridge:'先接受新话题'}})}));assert.equal(r.status,200);
 const prompt=outbound.messages[0].content;assert.match(prompt,/鞋湿了/);assert.match(prompt,/恰好三条/);assert.match(prompt,/emoji 或颜文字/);assert.match(prompt,/不要把角色说过的细节记成玩家经历/);
 if(modelPreference==='qwen-flash'){assert.equal(outbound.enable_search,true);assert.match(prompt,/参数已启用/)}else{assert.equal(outbound.enable_search,undefined);assert.match(prompt,/本轮未启用联网/)}
 }
});

test('正常追问和答案不被替换成固定陪伴句，只移除机械句',async()=>{
 process.env.ADMIN_PASSWORD='test-pass';process.env.QWEN_API_KEY='test-key';const answer=['我想到一个具体问题。你想先吃饭还是喝奶茶？ ☺','需要更多信息。先用这个公式计算，结果是六。'];
 for(const text of answer){globalThis.fetch=async()=>Response.json({choices:[{message:{content:JSON.stringify({text,suggestions:[]})}}]});const r=await handler(new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'test-pass',message:'那你怎么看',modelPreference:'qwen-flash',allowFallback:false})}));const reply=await r.json();assert.equal(reply.text,text.includes('需要更多信息')?'先用这个公式计算，结果是六。':text)}
});
