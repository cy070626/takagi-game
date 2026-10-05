/* Generated pages execute only after opening, in an opaque sandbox origin. */
(() => {
 const requested = text => !/(?:不要|不用|别)(?:再)?(?:生成|制作|做|写)/.test(text) && /生成|制作|做个|做一个|写个|写一个|帮我写|来个/.test(text) && /HTML|网页|页面|互动页|交互页|互动卡片|互动图|可点击|可拖动/i.test(text);
 const policy="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; font-src 'none'; media-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
 function documentFor(html) {
  const parsed=new DOMParser().parseFromString(html,'text/html');
  parsed.querySelectorAll('meta,base,link,iframe,object,embed,script[src]').forEach(el=>el.remove());
  parsed.querySelectorAll('a[href]').forEach(el=>{if(!el.getAttribute('href').startsWith('#'))el.removeAttribute('href');el.removeAttribute('target')});
  parsed.querySelectorAll('form').forEach(el=>{el.removeAttribute('action');el.setAttribute('onsubmit','return false')});
  return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="'+policy+'"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html{color-scheme:light}body{margin:0;padding:16px;font:16px/1.6 system-ui,sans-serif;color:#314735;background:#fcfdf8;overflow-wrap:anywhere}*{box-sizing:border-box}img,svg,canvas{max-width:100%}button,input,select{font:inherit}button,input[type=range]{min-height:44px}button{cursor:pointer}pre{overflow:auto}button:focus-visible,input:focus-visible{outline:2px solid #47634b}</style>'+parsed.head.innerHTML+'</head><body>'+parsed.body.innerHTML+'</body></html>';
 }
 function attach(row,data) {
  if(!data||typeof data.html!=='string'||!data.html.trim()||data.html.length>6000)return;
  const card=document.createElement('section');card.className='interactive-card';
  const title=document.createElement('strong');title.textContent=String(data.title||'互动页面').slice(0,60);
  const actions=document.createElement('div');actions.className='interactive-card-actions';
  const toggle=document.createElement('button');toggle.type='button';toggle.textContent='展开页面';toggle.setAttribute('aria-expanded','false');
  const restart=document.createElement('button');restart.type='button';restart.textContent='重新开始';restart.hidden=true;
  const box=document.createElement('div');box.className='interactive-card-body';box.hidden=true;
  const note=document.createElement('small');note.textContent='AI 生成的临时互动，可随时收起。';
  let frame;
  function mount(){box.replaceChildren();frame=document.createElement('iframe');frame.title=title.textContent;frame.setAttribute('sandbox','allow-scripts');frame.setAttribute('allow',"camera 'none'; microphone 'none'; geolocation 'none'; clipboard-read 'none'; clipboard-write 'none'");frame.referrerPolicy='no-referrer';frame.srcdoc=documentFor(data.html);box.append(frame)}
  toggle.onclick=()=>{const open=box.hidden;box.hidden=!open;toggle.textContent=open?'收起页面':'展开页面';toggle.setAttribute('aria-expanded',String(open));restart.hidden=!open;if(open)mount();else{box.replaceChildren();frame=null}};
  restart.onclick=mount;actions.append(toggle,restart);card.append(title,note,actions,box);row.append(card);
 }
 globalThis.TakagiInteractiveCard=Object.freeze({attach,requested,documentFor});
})();
