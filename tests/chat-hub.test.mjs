import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,existsSync} from 'node:fs';
import handler from '../netlify/functions/chat.js';
const context=vm.createContext({});vm.runInContext(readFileSync(new URL('../js/chat-hub.js',import.meta.url),'utf8'),context);const hub=context.TakagiChatHub;
test('明确的站内请求对应固定入口，否定与普通谈论不会自动导航',()=>{
 for(const [message,type] of [['我想去音乐小剧场','music'],['我们去音乐小剧场吧','music'],['我想做一个小游戏','games'],['来一局猜心对决','mind'],['打开橡皮对决','eraser'],['我想写一首诗','poetry'],['给我看雨天的图片','image']])assert.equal(hub.intent(message)?.type,type);
 for(const text of ['音乐小剧场是什么','我不想去音乐小剧场','别打开小游戏','下次再玩猜心','我喜欢音乐','能不能不打开诗集'])assert.equal(hub.intent(text),null);
 assert.equal(hub.image('https://example.com/evil.png'),null);assert.equal(hub.image('__proto__'),null);
});
test('配图全是存在的本地压缩图，未知情境提供选择',()=>{
 for(const value of Object.values(hub.images))assert.ok(existsSync(new URL('../'+value.src.replace('./',''),import.meta.url)));
 assert.equal(hub.intent('给我看一张图片').type,'image-choice');assert.equal(hub.intent('看看海边的照片').key,'seaside');
});
test('模型不能决定导航 URL，配图仅接收白名单标识，人设声明真实能力',async()=>{
 process.env.ADMIN_PASSWORD='test-pass';process.env.QWEN_API_KEY='test-key';let outbound;
 for(const [visualCue,expected] of [['rain','rain'],['https://example.com/a.png','']]){
 globalThis.fetch=async(url,opts)=>{outbound=JSON.parse(opts.body);return Response.json({choices:[{message:{content:JSON.stringify({text:'雨声可以陪我们慢慢聊。',visualCue,action:{url:'https://example.com'}})}}]})};
 const response=await handler(new Request('https://example.com/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:'test-pass',message:'想象雨天的情境',modelPreference:'qwen-flash',allowFallback:false})}));const reply=await response.json();assert.equal(reply.visualCue,expected);assert.equal(reply.action,undefined);assert.match(outbound.messages[0].content,/没有图片搜索工具/);assert.match(outbound.messages[0].content,/不替玩家编造动作或感受/);
 }
});
