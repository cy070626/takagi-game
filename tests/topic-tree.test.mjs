import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import handler from '../netlify/functions/chat.js';
const source=readFileSync(new URL('../js/topic-tree.js',import.meta.url),'utf8');
const term={title:'透明雨伞',scene:'rain',tag:'原创互动',summary:'雨天一起走',detail:'本站原创情境'};
function boot(storage=new Map()){
 const context=vm.createContext({sessionStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)}});vm.runInContext(source,context);return{tree:context.TakagiTopicTree,storage};
}
test('15 个新增词条各有四个不同方向，反复进入常用词条不复用同一开场',()=>{
 const {tree}=boot();assert.equal(tree.extraTerms.length,15);
 for(const term of tree.extraTerms)assert.equal(new Set(tree.suggestions(term)).size,4);
 const openings=Array.from({length:4},()=>tree.start(term));assert.equal(new Set(openings).size,4);
 assert.notEqual(tree.start(term),openings[0]);
});
test('玩家细节选择分支，已有方向可以深入，换角度才轮换',()=>{
 const {tree}=boot();tree.start(term);
 const plan=tree.plan(term,'我的鞋湿了');assert.equal(plan.branch,'被淋湿的小细节');
 tree.commit(plan,'我的鞋湿了','先往里面站一点。');const follow=tree.plan(term,'那我坐这儿吧');assert.equal(follow.branch,plan.branch);assert.match(follow.recent,/我的鞋湿了/);assert.equal(follow.phase,'延续');
 assert.notEqual(tree.plan(term,'换个角度聊').branch,plan.branch);
});
test('只是计划或失败重试不消耗分支，刷新恢复进展，转场可解除词条',()=>{
 const {tree,storage}=boot();tree.start(term);const before=storage.get('takagi-topic-tree-v1');
 tree.plan(term,'我的鞋湿了');tree.plan(term,'我的鞋湿了');assert.equal(storage.get('takagi-topic-tree-v1'),before);
 tree.commit(tree.plan(term,'我的鞋湿了'),'我的鞋湿了','我记着了');const restored=boot(storage).tree;
 assert.equal(restored.restore([term]).title,term.title);assert.match(restored.plan(term,'接着说').recent,/我记着了/);
 assert.equal(restored.plan(term,'先不聊这个，聊篮球').detached,true);restored.deactivate();assert.equal(boot(storage).tree.restore([term]),null);assert.equal(restored.sceneTerm([term],'rain'),null);assert.equal(boot(storage).tree.sceneTerm([term],'rain'),null);assert.equal(restored.sceneTerm([term],'classroom'),null);assert.equal(restored.sceneTerm([term],'rain').title,term.title);
});
test('词条记忆容量有上限，损坏缓存可继续使用',()=>{
 const {tree,storage}=boot();for(let n=0;n<50;n++)tree.start({title:'小事'+n,summary:'校园原创',scene:'classroom'});
 assert.ok(Object.keys(JSON.parse(storage.get('takagi-topic-tree-v1')).entries).length<=30);
 const bad=new Map([['takagi-topic-tree-v1','{"entries":{"透明雨伞":{"details":null,"openings":7}},"active":"透明雨伞"}']]);assert.doesNotThrow(()=>boot(bad).tree.start(term));
});
test('千问和 DeepSeek 均接收词条进展与统一分支规则',async()=>{
 process.env.ADMIN_PASSWORD='test-pass';process.env.QWEN_API_KEY='test-key';process.env.DEEPSEEK_API_KEY='test-key';let outbound;
 globalThis.fetch=async(url,options)=>{outbound=JSON.parse(options.body);return Response.json({choices:[{message:{content:'{"text":"先看看你的鞋边。"}'}}]})};
 for(const modelPreference of ['qwen-flash','deepseek-pro']){
  const response=await handler(new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'接着说',password:'test-pass',modelPreference,allowFallback:false,topicContext:{title:'透明雨伞',branch:'被淋湿的小细节',phase:'延续',recent:'玩家说鞋湿了',used:['借伞的小捉弄'],background:'走廊门口',detail:'本站原创情境'}})}));
  assert.equal(response.status,200);const prompt=outbound.messages[0].content;
  assert.match(prompt,/当前分支：被淋湿的小细节/);assert.match(prompt,/进展：延续/);assert.match(prompt,/玩家说鞋湿了/);assert.match(prompt,/禁止重新介绍背景/);assert.match(prompt,/以玩家的话为准/);
 }
});
