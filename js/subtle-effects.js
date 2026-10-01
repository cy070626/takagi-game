/* Finite decorative bursts. No animation loop or external assets. */
(() => {
  const active = new Map(), last = new Map();
  const reduced = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const mode = scope => { if(scope==='chat')return globalThis.matchMedia?.('(max-width: 480px)').matches?'reduced':'on';try { return localStorage.getItem('takagi-effects-'+scope) || (globalThis.matchMedia?.('(max-width: 480px)').matches ? 'reduced' : 'on'); } catch { return 'reduced'; } };
  const enabled = scope => mode(scope) !== 'off';
  function detect(text) {
    text=String(text||'');
    if (/不要.*(?:烟花|特效)|别放|难过|去世|危险|事故|火灾|禁放/.test(text)) return null;
    if (/生日|生快|誕生日/.test(text)) return 'cake';
    if (/烟花|煙花|花火/.test(text)) return 'firework';
    if (/雪花|下雪|雪が/.test(text)) return 'snow';
    if (/樱花|桜/.test(text)) return 'petal';
    if (/新年快乐|春节快乐|新年快樂|あけまして/.test(text)) return 'confetti';
    return null;
  }
  function clear(container) { const old=active.get(container); if(old){clearTimeout(old.timer);old.node.remove();active.delete(container);} }
  function styles() {
    if(document.getElementById('takagi-effect-style')) return;
    const style=document.createElement('style');style.id='takagi-effect-style';
    style.textContent=`.takagi-effect{position:absolute;width:104px;height:104px;pointer-events:none;z-index:5;contain:strict;overflow:hidden}.takagi-effect span{position:absolute;left:50%;top:50%;font-size:18px;animation:takagi-spark 2.6s ease-out both;animation-delay:var(--delay,0ms);color:var(--color,#e4ba79)}.takagi-effect .cake{font-size:38px;animation:takagi-cake 2.6s ease-out both}.takagi-effect .dot{width:4px;height:4px;border-radius:50%;background:var(--color)}.takagi-effect.falling{width:160px;height:160px}.chat-scroll>.message,.stage>.message{position:relative;z-index:1}.scene>button{z-index:6}.takagi-effect.falling span{top:0;animation-duration:3.6s}.takagi-effect .petal{width:8px;height:13px;border-radius:75% 0 75% 30%;background:#edb0c1;animation-name:takagi-petal}.takagi-effect .snow{width:5px;height:5px;border-radius:50%;background:#e9f1f6;box-shadow:0 0 0 1px #8199ab66;animation-name:takagi-snow}.takagi-effect .star{font-size:25px;color:#fff4bb;text-shadow:0 0 7px #ffd26e,0 0 2px #9e642a;animation-name:takagi-star;animation-duration:3.8s}.takagi-effect.burst{width:148px;height:148px}.takagi-effect .ray{width:5px;height:13px;border-radius:5px;background:var(--color);box-shadow:0 0 3px var(--color);animation:takagi-firework 3.8s ease-out both}.takagi-effect .confetti{width:7px;height:12px;border-radius:2px;background:var(--color);animation:takagi-confetti 3.8s ease-out both}.takagi-effect .celebration{font-size:32px;animation:takagi-cake 3.8s ease-out both}.takagi-effect.is-reduced span{animation-duration:2.6s}.takagi-effect.is-reduced{opacity:.9}@keyframes takagi-spark{0%{opacity:0;transform:translate(-50%,-50%) scale(.2)}15%{opacity:1}75%,100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) scale(.7)}}@keyframes takagi-firework{0%{opacity:.9;transform:translate(-50%,-50%) rotate(var(--angle)) scale(.35)}28%,55%{opacity:1;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(var(--angle)) scale(1)}100%{opacity:0;transform:translate(calc(-50% + var(--x)),calc(-50% + var(--y))) rotate(var(--angle)) scale(.5)}}@keyframes takagi-confetti{0%{opacity:.9;transform:translate(-50%,-50%) rotate(0deg)}30%{opacity:1;transform:translate(calc(-50% + var(--x)),calc(-70% + var(--y))) rotate(var(--angle))}65%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--x)),50px) rotate(240deg)}}@keyframes takagi-cake{0%{opacity:0;transform:translate(-50%,-30%) scale(.7)}20%,65%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-60%) scale(.9)}}@keyframes takagi-petal{0%{opacity:0;transform:translate(var(--x),-12px) rotate(0deg)}20%{opacity:.8}100%{opacity:0;transform:translate(calc(var(--x) + var(--drift,18px)),140px) rotate(var(--turn,140deg))}}@keyframes takagi-snow{0%{opacity:0;transform:translate(var(--x),-8px)}20%{opacity:.85}100%{opacity:0;transform:translate(calc(var(--x) + var(--drift,-12px)),140px)}}@keyframes takagi-star{0%{opacity:.25;transform:translate(var(--x),var(--y)) scale(.5)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.5)}25%,55%{opacity:1;transform:translate(var(--x),var(--y)) scale(1.2)}}@media(prefers-reduced-motion:reduce){.takagi-effect{display:none!important}}`;
    document.head.append(style);
  }
  function emptySpot(container,size) {
    if(!container.querySelectorAll)return null;
    const rect=container.getBoundingClientRect(),width=container.clientWidth||rect.width,height=container.clientHeight||rect.height;
    const blocks=[...container.querySelectorAll('.message p,.message img,.message span,.intro,.date,.reply-reactions,details,button')].map(el=>el.getBoundingClientRect());
    for(let y=height-size-10;y>=10;y-=12){for(const x of [width-size-10,10,Math.round((width-size)/2)]){
      if(x<10)continue;const box={left:rect.left+x,top:rect.top+y,right:rect.left+x+size,bottom:rect.top+y+size};
      if(!blocks.some(b=>box.left<b.right+6&&box.right>b.left-6&&box.top<b.bottom+6&&box.bottom>b.top-6))return {x,y};
    }}return null;
  }
  function trigger(container, kind, scope='chat', replay=false) {
    if(!container || !kind || !enabled(scope) || reduced() || document.hidden) return false;
    const rect=container.getBoundingClientRect();if(rect.width<1||rect.height<1||rect.bottom<=0||rect.top>=innerHeight) return false;
    if(scope==='chat' && !replay && Date.now()-(last.get(container)||0)<12000) return false;
    const size=kind==='petal'||kind==='snow'?164:kind==='firework'||kind==='confetti'?152:108;
    let spot=null,scale=1;
    if(scope==='chat'&&!replay&&container.querySelectorAll){for(const factor of [1,.7,.5]){spot=emptySpot(container,Math.ceil(size*factor));if(spot){scale=factor;break;}}}
    if(scope==='chat'&&!replay&&container.querySelectorAll&&!spot)return false;
    clear(container);last.set(container,Date.now());styles();
    const node=document.createElement('div');const light=mode(scope)==='reduced',falling=kind==='petal'||kind==='snow',burst=kind==='firework'||kind==='confetti';node.className='takagi-effect'+(light?' is-reduced':'')+(falling?' falling':'')+(burst?' burst':'');node.setAttribute('aria-hidden','true');
    if(getComputedStyle(container).position==='static')container.style.position='relative';
    node.style.left=Math.max(0,Math.min(rect.width-(falling?164:burst?152:108),rect.width*.72))+'px';
    node.style.top=((scope==='chat'?container.scrollTop:0)+Math.min(scope==='music'?(rect.height<=300?8:Math.max(110,rect.height*.25)):90,Math.max(0,rect.height-(falling?164:burst?152:108))))+'px';
    if(spot){node.style.left=spot.x+'px';node.style.top=(container.scrollTop+spot.y)+'px';node.style.transform='scale('+scale+')';node.style.transformOrigin='top left';}
    node.style.zIndex=scope==='music'?'2':'0';
    if(falling && scope==='music'){node.style.left='8%';node.style.width='84%';node.style.top=(rect.height<=300?8:90)+'px';}
    if(kind==='cake'){const cake=document.createElement('span');cake.className='cake';cake.textContent='🎂';node.append(cake);}
    if(kind==='confetti'){const mark=document.createElement('span');mark.className='celebration';mark.textContent='🎉';node.append(mark);}
    const count=light?(kind==='firework'?6:kind==='confetti'?4:3):kind==='firework'?12:kind==='cake'?4:falling||kind==='confetti'?9:5;
    for(let i=0;i<count;i++){
      const item=document.createElement('span'),angle=i/count*Math.PI*2,radius=(burst?42:25)+(i%3)*9;
      item.style.setProperty('--x',Math.round(Math.cos(angle)*radius)+'px');item.style.setProperty('--y',Math.round(Math.sin(angle)*radius)+'px');item.style.setProperty('--delay',(i%3)*110+'ms');item.style.setProperty('--color',['#dc9235','#d65d88','#459c84'][i%3]);
      item.style.setProperty('--angle',Math.round(angle*180/Math.PI+(kind==='firework'?90:0))+'deg');
      item.className=kind==='firework'?'ray':kind==='confetti'?'confetti':kind==='petal'?'petal':kind==='snow'?'snow':kind==='star'?'star':'dot';item.textContent=kind==='star'?'✧':'';if(falling){const group=i%3,layer=Math.floor(i/3);item.style.setProperty('--delay',(group*300+layer*380)+'ms');item.style.setProperty('--drift',(group===1?-10:12)+'px');item.style.setProperty('--turn',(group===1?-100:120)+'deg');if(scope==='music'){item.style.left=[18,50,82][group]+'%';item.style.setProperty('--x',(layer-1)*9+'px');}item.style.width=(kind==='snow'?3+i%3:6+i%3)+'px';item.style.height=(kind==='snow'?3+i%3:10+i%4)+'px';}node.append(item);
    }
    container.append(node);active.set(container,{node,timer:setTimeout(()=>clear(container),falling?(light?3500:5600):light?3200:burst||kind==='star'?4400:3200)});return true;
  }
  function bindToggle(button,scope,onEnable) {
    if(!button)return;
    const render=()=>{const value=mode(scope);button.textContent=reduced()?'小特效：系统已减少':'小特效：'+({on:'完整',reduced:'减少',off:'关闭'}[value]||'完整');button.setAttribute('aria-pressed',String(value!=='off'&&!reduced()));button.title='点击切换完整、减少、关闭；选择会保留。系统减少动态效果优先。';};
    button.onclick=()=>{const next={on:'reduced',reduced:'off',off:'on'}[mode(scope)]||'reduced';try{localStorage.setItem('takagi-effects-'+scope,next);}catch{}for(const container of active.keys())clear(container);render();if(next!=='off')onEnable?.();};render();
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change',render);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const container of active.keys())clear(container);});
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').addEventListener?.('change',event=>{if(event.matches)for(const container of active.keys())clear(container);});
  globalThis.TakagiSubtleEffects=Object.freeze({detect,trigger,clear,bindToggle});
})();
