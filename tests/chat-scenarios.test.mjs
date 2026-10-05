import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
function boot() {
 const captured=[];const node=()=>({setAttribute(){},after(){},before(){},remove(){},replaceChildren(){},append(){},hidden:false});
 const context=vm.createContext({Date,AbortController,console,sessionStorage:{setItem(){}},window:{addEventListener(){},removeEventListener(){}},document:{querySelector(){return null}},textEl:node,$:node,activeTerm:null,terms:[],activeScene:'festival',aiMode:'chat',profile:{modelPreference:'qwen-flash'},aiHistory:[{role:'user',text:'我刚才在看烟花'}],CHAT_CONTEXT_LIMIT:12,passwordInput:{value:'test'},forgetPassword:{},passwordStatus:{},TakagiTopicTree:{resolve:()=>null,sceneTerm:()=>null,handoff:()=>({topic:'烟花'})},TakagiChatChain:{run:async body=>{captured.push(body);return{text:'继续聊吧。',engine:'qwen-flash'}}}});
 vm.runInContext(read('js/main/chat-request.js'),context);
 return {context,captured};
}
test('上传图片后追问第二步时携带同一张图和历史',async()=>{
 const {context,captured}=boot();
 await vm.runInContext(`requestAI('帮我看这题',{dataUrl:'data:image/jpeg;base64,abc'})`,context);
 await vm.runInContext(`requestAI('第二步为什么这样算？',null)`,context);
 assert.equal(captured[1].image,captured[0].image);assert.equal(captured[1].history[0].text,'我刚才在看烟花');
});
test('突然换话题保留对话记忆，但不附带无关的旧图',async()=>{
 const {context,captured}=boot();
 await vm.runInContext(`requestAI('看这张图',{dataUrl:'data:image/jpeg;base64,abc'})`,context);
 await vm.runInContext(`requestAI('换个话题，晚饭吃什么？',null)`,context);
 assert.equal(captured[1].image,undefined);assert.equal(captured[1].history.length,1);
});
test('旧图超过五分钟后不自动重新上传',async()=>{
 const {context,captured}=boot();
 vm.runInContext(`recentChatImage={dataUrl:'data:image/jpeg;base64,abc',at:Date.now()-6*60000}`,context);
 await vm.runInContext(`requestAI('这题第二步呢',null)`,context);
 assert.equal(captured[0].image,undefined);
});
test('首次默认夏日祭，已保存场景和个人首选均优先保留',()=>{
 const source=read('js/main/scene-actions.js');const start=source.indexOf('const savedScene');const stop=source.indexOf('function pulseReaction');
 for(const [saved,preferred,want] of [[null,'last','festival'],['rain','last','rain'],['rain','study','study']]){
 let selected;const context=vm.createContext({load:()=>saved,profile:{startScene:preferred},scenes:{festival:{},rain:{},study:{}},log:{replaceChildren(){}},setScene:v=>selected=v});
 vm.runInContext(source.slice(start,stop),context);assert.equal(selected,want);
 }
});
test('图片准备期间禁用发送，拖入不支持的文档会提示',()=>{
 assert.match(read('js/main/image-input.js'),/send.disabled = busy \|\| imagePreparing/);
 assert.match(read('js/main/chat-submit.js'),/if \(imagePreparing\)/);
 assert.match(read('js/main/image-input.js'),/PDF、Word/);
});
