import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../js/subtle-effects.js',import.meta.url),'utf8');
function setup(){
  let reduced=false;const timers=new Map(), listeners={}, storage=new Map();
  const element=()=>({children:[],style:{setProperty(){}},setAttribute(){},append(n){this.children.push(n);n.parent=this},remove(){this.parent.children=this.parent.children.filter(n=>n!==this)}});
  const container=element();container.scrollTop=0;container.getBoundingClientRect=()=>({width:320,height:280,top:0,bottom:280});
  const document={hidden:false,head:element(),createElement:element,getElementById:()=>null,addEventListener:(k,f)=>listeners[k]=f};
  const context={document,innerHeight:800,getComputedStyle:()=>({position:'relative'}),localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},matchMedia:()=>({matches:reduced,addEventListener(){}}),setTimeout:f=>{const id=timers.size+1;timers.set(id,f);return id},clearTimeout:id=>timers.delete(id)};
  vm.createContext(context);vm.runInContext(source,context);
  return {api:context.TakagiSubtleEffects,container,timers,document,listeners,storage,reduce:()=>reduced=true};
}
test('聊天庆祝词及消极语境处理',()=>{const {api}=setup();assert.equal(api.detect('今天我生日'),'cake');assert.equal(api.detect('一起看花火'),'firework');assert.equal(api.detect('新年快乐'),'confetti');assert.equal(api.detect('不要放烟花'),null);assert.equal(api.detect('烟花引发事故'),null);assert.equal(api.detect('今天上课'),null)});
test('动画有数量上限、到时清理、关闭和减少动态效果生效',()=>{const s=setup();assert.equal(s.api.trigger(s.container,'firework'),true);assert.equal(s.container.children[0].children.length,12);assert.equal(s.api.trigger(s.container,'cake'),false);[...s.timers.values()][0]();assert.equal(s.container.children.length,0);s.storage.set('takagi-effects-music','off');assert.equal(s.api.trigger(s.container,'star','music'),false);s.storage.set('takagi-effects-music','on');s.reduce();assert.equal(s.api.trigger(s.container,'star','music'),false)});
test('隐藏页面停止并清理特效',()=>{const s=setup();s.api.trigger(s.container,'petal','music');s.document.hidden=true;s.listeners.visibilitychange();assert.equal(s.container.children.length,0);assert.equal(s.timers.size,0)});

test('减少档限制飘落颗粒，开关切换可终止动画并禁止再触发',()=>{const s=setup();const button={setAttribute(){}};s.api.bindToggle(button,'music');button.onclick();assert.equal(s.storage.get('takagi-effects-music'),'reduced');s.api.trigger(s.container,'snow','music');assert.equal(s.container.children[0].children.length,3);button.onclick();assert.equal(s.container.children.length,0);assert.equal(s.api.trigger(s.container,'petal','music'),false)});

test('场景飘落使用三个分散落点，且颗粒总量不增加',()=>{const s=setup();s.api.trigger(s.container,'petal','music');const effect=s.container.children[0];assert.equal(effect.children.length,9);assert.deepEqual([...new Set(effect.children.map(n=>n.style.left))],['18%','50%','82%']);assert.equal(effect.style.zIndex,'2');});

test('聊天选择空白位置，小空白缩小，满屏消息时跳过',()=>{const s=setup();s.container.clientWidth=320;s.container.clientHeight=180;s.container.getBoundingClientRect=()=>({left:0,top:0,right:320,bottom:180,width:320,height:180});s.container.querySelectorAll=()=>[{getBoundingClientRect:()=>({left:0,right:320,top:0,bottom:100})}];assert.equal(s.api.trigger(s.container,'star'),true);assert.equal(s.container.children[0].style.transform,'scale(0.5)');const full=setup();full.container.clientWidth=320;full.container.clientHeight=180;full.container.getBoundingClientRect=s.container.getBoundingClientRect;full.container.querySelectorAll=()=>[{getBoundingClientRect:()=>({left:0,right:320,top:0,bottom:180})}];assert.equal(full.api.trigger(full.container,'star'),false);assert.equal(full.container.children.length,0);});
