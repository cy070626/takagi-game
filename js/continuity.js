/* Offline scene branches. No network, no generated facts. */
(() => {
 const topics = {
  work: {title:'今天的工作',match:/工作|加班|老板|领导|任务/,opening:'把包放下来吧。今天最占脑子的，是事情太多，还是有个人让你一直想着？',choices:['事情太多','主要是沟通','我只想吐槽'],branches:[['先挑一件最急的。它的截止时间是确定的，还是大家默认你会赶出来？',['期限已定','可以协商','我还没问清']],['挑一句对方实际说过的话给我听。我们先看要求有没有说清，再看你要怎么回应。',['对方说的是…','我不知道怎么拒绝','先听我说完']],['好，这一轮不列计划。你可以从今天最想翻白眼的那一刻说起。',['最烦的是…','还有一件事','说完舒服一点了']]]},
  music: {title:'一首歌的画面',match:/音乐|歌曲|听歌|旋律|耳机/,opening:'把耳机分我一边？先说你在听哪首。我想知道，你先被声音吸引，还是想起了某个时候。',choices:['先是声音','想起一段回忆','想找相似的感觉'],branches:[['你最先注意到哪一层：人声、钢琴、弦乐，还是节奏？说出这一层，比只说“好听”更接近你的口味。',['人声很近','钢琴很轻','节奏让我放松']],['那就从一个画面讲起。第一次听它的时候，你在哪里，在做什么？',['那时我在…','和一个人有关','暂时不想说细节']],['先选想留下的感觉：夏日的明亮、雨天的安静，还是夜里带一点心事？',['夏日明亮','雨天安静','夜里的心事']]]},
  tired: {title:'歇一会儿',match:/累|疲惫|困|没精神/,opening:'今天想少说一点吗？可以聊让你累的事，也可以先把它放一边。',choices:['身体很累','脑子停不下来','先不分析'],branches:[['那先把接下来的安排缩小。你现在还有必须做完的事吗，还是已经可以休息了？',['还有一件必须做','可以休息了','想安静坐着']],['脑子里重复的是一件没做完的事，还是一句别人说过的话？只挑最明显的一件。',['没做完的事','别人说的话','两种都有']],['好。你不用回应每一句。想继续时告诉我，我们就从这里接上。',['继续刚才的话题','换个轻松话题','安静一下']]]},
  food: {title:'今天吃什么',match:/食堂|吃|午餐|晚餐|奶茶|口味/,opening:'先不用纠结整张菜单。你现在是想吃喜欢的、赶时间，还是想换点新口味？',choices:['喜欢的就好','赶时间','换个新口味'],branches:[['你已经有答案了吧。说一道常点的，我猜猜你留恋的是味道还是熟悉感。',['我常点…','主要是熟悉','想聊中日饮食']],['那先看能等几分钟、预算多少。告诉我这两个条件，再从你面前真实的选项里挑。',['十分钟以内','预算二十左右','我面前有…']],['只换一个地方就好：主食、配菜或饮料。你最愿意试哪个？',['换主食','换配菜','换饮料']]]},
  valentine: {title:'二月与三月',match:/情人节|白色情人节|巧克力|回礼|礼物/,opening:'先不替礼物解释心意。你更在意送什么、对方会怎么回应，还是这段关系现在走到哪里？',choices:['不知道送什么','在意对方回应','想把分寸说清'],branches:[['先给我三个条件：预算、对方明确喜欢的东西，以及你希望礼物显得轻松还是郑重。',['预算大概是…','对方喜欢…','想轻松一点']],['你期待的是一句明确回应、一个自然的反应，还是只希望对方认真收下？这三种期待差得很远。',['想要明确回应','自然一点就好','收下就够了']],['那就把能表达的和暂时不想承诺的各写一句。礼物可以传达好感，也需要保留真实边界。',['我能表达的是…','我暂时不能…','帮我整理一句话']]]},
  festival: {title:'夏日祭与烟花',match:/夏日祭|夏祭|烟花|花火|祭典|摊位|苹果糖|捞金鱼/,opening:'烟花还没开始，先别急着跳到最浪漫的那一刻。你更想聊摊位、人群里的相处，还是有一句话想留到烟花升起时？',choices:['先逛摊位','怕在人群走散','有句话想说'],branches:[['只能先选一个：吃点东西、玩一次游戏，还是找一个能看清烟花的位置？',['先吃点东西','玩一次游戏','先找位置']],['那约一个具体到能辨认的集合点，再说联络不上时等多久。浪漫也要有能找到彼此的办法。',['约在入口','约在灯笼下面','我想一个更具体的']],['先把那句话说成最短的一句。删掉解释以后，剩下的通常更接近你真正想表达的。',['最短的一句是…','我还在犹豫','先听我慢慢说']]]},
  rain: {title:'雨天的走廊',match:/雨|天气|降温|伞/,opening:'走廊里的雨声听着更近。你是在等雨停，还是今天本来就想慢一点？',choices:['等雨停','想慢一点','我其实喜欢雨天'],branches:[['你接下来有必须准时到的地方吗？有的话我们先看实际安排，没有就留一点空白。',['有安排','暂时没安排','聊点别的']],['那把今天最不急的一件事先放下。你想听我说点轻松的，还是你来讲？',['你问我一个轻松的问题','我来讲','一起安静一下']],['你喜欢的是雨声、空气的味道，还是待在屋里不用出门的感觉？',['雨声','空气的味道','窝在屋里的感觉']]]}
 };
 let current=null,stage=0,branch=null,lastDetail='',recent=[];
 function result(text, suggestions, mood='listening') {
  if(recent.includes(text)) text='这部分我们刚刚聊过了。还停在“'+(lastDetail||current.title)+'”这里：你想补一个新细节，还是换话题？',suggestions=['补一个细节','换个话题','安静一下'];
  recent=[...recent.slice(-5),text];
  return {text,suggestions,mood,topic:'offline-scene',knowledgeTags:[]};
 }
 window.companionLocalReply=(message,engine,scene,mode,knowledge)=>{
  const s=message.trim();
  if(/我叫什么|记得我的名字/.test(s)){engine.begin(s);return engine.finish(engine.name?'记得，你叫'+engine.name+'。':'你还没告诉我名字，希望我怎么称呼你？','warm','name',['叫我小林','换个话题'])}
  if(/你理解错了|没理解|答非所问|说的不是/.test(s)){current=null;stage=0;engine.awaiting='';return result('刚才接偏了。你可以重新说出要聊的对象，我从这句话重新接，不沿用刚才的判断。',['重新说一下','换个话题'],'quiet')}
  if(mode==='study'||/^(我叫|叫我|你可以叫我)|我叫什么|记得我的名字|我.*喜欢|我(?:今天|明天|周末)?(?:要|准备)|别.*(逗|捉弄)|认真听|不想聊|安静一下|晚安|再见/.test(s))return engine.reply(s,scene,mode);
  if(activeTerm&&globalThis.TakagiTopicTree.has(activeTerm)){const reply=knowledge(s);if(reply)return reply}
  if(engine.awaiting&&!current){const follow=engine.followUp(s);if(follow){engine.begin(s);return follow}}
  if(/换.*话题|重新开始/.test(s)){current=null;stage=0;return result('好，换一页。你想聊一首歌、一顿饭，还是今天的一件小事？',['聊音乐','聊午餐','聊工作'],'warm')}
  if(/刚才.*(说|聊)|记得.*聊/.test(s)&&current)return result('刚才在聊“'+current.title+'”。'+(lastDetail?'你提到：“'+lastDetail+'”。':'')+'要从那里接着说吗？',['继续刚才的话题','补一个细节','换个话题']);
  if(/知识|区别|为什么|中国|日本|文化|原作|西片|气候|地理|预报/.test(s)){const answer=knowledge(s);if(answer)return answer}
  const found=Object.values(topics).find(t=>t.match.test(s));
  if(found&&found!==current){current=found;stage=0;lastDetail=s.slice(0,60);return result(current.opening,current.choices,'warm')}
  if(current){
   if(stage===0){const i=current.choices.indexOf(s);if(i>=0){branch=current.branches[i];stage=1;lastDetail=s;return result(branch[0],branch[1],/累|歇/.test(current.title)?'quiet':'listening')}
    stage=1;branch=current.branches[0];lastDetail=s.slice(0,60);return result('你说“'+lastDetail+'”。先沿着这个细节讲：它是今天发生的，还是最近一直这样？',['今天发生的','最近一直这样','我再补充一点'])}
   if(/^(嗯|好|对|是的|可以|继续刚才的话题)[。！]*$/.test(s))return result('那我们接着“'+current.title+'”。'+(branch?branch[0]:'你想补充哪个细节？'),branch?branch[1]:current.choices);
   const previous=lastDetail;lastDetail=s.slice(0,60);stage++;
   if(stage===2)return result('从“'+previous+'”到“'+lastDetail+'”，我先把这两点记在一起。你最希望我理解的是哪一点？',['最在意的是…','先听我说完','换个角度看']);
   if(/先听|还有|补充/.test(s))return result('嗯，接着说。我先听完整，这一段暂时不追问。',['事情接下来是…','我说完了','换个话题'],'quiet');
   return result('我们已经聊到“'+lastDetail+'”。本地对话对更复杂的因果判断有限，我先不替你下结论。你想把经过补完整，还是回到刚才那个具体选择？',['我再补充一点',...current.choices.slice(0,2)]);
  }
  return engine.reply(s,scene,mode);
 };
 if(typeof document==='undefined')return;
 const controls=document.querySelector('.scene-controls');
 const depth=document.createElement('button');depth.className='depth-toggle';depth.type='button';
 let enabled=load('takagi-depth')!=='off',frame=0;
 function renderDepth(){sceneEl.dataset.depth=enabled?'on':'off';depth.textContent=enabled?'景深：开':'景深：关';depth.setAttribute('aria-pressed',String(enabled));if(!enabled)reset()}
 function reset(){sceneEl.style.setProperty('--depth-x','0deg');sceneEl.style.setProperty('--depth-y','0deg');}
 depth.onclick=()=>{enabled=!enabled;save('takagi-depth',enabled?'on':'off');renderDepth()};controls.append(depth);renderDepth();
 const note=textEl('small','移动指针感受轻微景深；手机轻触画面也会回应。原有取景和动态仍可独立切换。','depth-note');controls.after(note);
 sceneEl.addEventListener('pointermove',event=>{
  if(frame||!enabled||!sceneEl.classList.contains('alive')||sceneEl.dataset.motionStyle==='still'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const x=event.clientX,y=event.clientY;frame=requestAnimationFrame(()=>{frame=0;const r=sceneEl.getBoundingClientRect();sceneEl.style.setProperty('--depth-x',((.5-(y-r.top)/r.height)*4).toFixed(2)+'deg');sceneEl.style.setProperty('--depth-y',(((x-r.left)/r.width-.5)*5).toFixed(2)+'deg')});
 });
 sceneEl.addEventListener('pointerleave',reset);
 new MutationObserver(()=>{if(!sceneEl.classList.contains('alive')||sceneEl.dataset.motionStyle==='still')reset()}).observe(sceneEl,{attributes:true,attributeFilter:['class','data-motion-style']});
 const toolbar=textEl('div','','conversation-tools');
 const speed=textEl('button','');speed.type='button';const paintSpeed=()=>speed.textContent=load('takagi-text-speed')==='instant'?'文字：即时':'文字：轻快';paintSpeed();speed.onclick=()=>{save('takagi-text-speed',load('takagi-text-speed')==='instant'?'quick':'instant');paintSpeed()};
 const recap=textEl('button','回看对话');recap.type='button';recap.onclick=()=>{const body=textEl('div','','conversation-history');log.querySelectorAll('.message').forEach(row=>{body.append(textEl('strong',row.classList.contains('assistant')?'高木':'你'),textEl('p',row.querySelector('p')?.textContent||''))});openDialog('这次见面的对话',body)};
 const latest=textEl('button','回到最新');latest.type='button';latest.onclick=()=>{log.scrollTo({top:log.scrollHeight,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
 toolbar.append(speed,recap,latest);document.querySelector('.composer').prepend(toolbar);
 const trail=textEl('p','从今天的小事聊起，也可以接着刚才说。','conversation-trail');toolbar.after(trail);
 const shortcuts=textEl('div','','scene-shortcuts');
 [['一起玩一局','arcade-open'],['留一句诗','poetry-open']].forEach(([label,id])=>{const button=textEl('button',label);button.type='button';button.onclick=()=>document.getElementById(id)?.click();shortcuts.append(button)});
 document.querySelector('.scene-story')?.append(shortcuts);
 const original=window.companionLocalReply;
 window.companionLocalReply=(...args)=>{const reply=original(...args);trail.textContent=current?'正在聊：'+current.title+' · 可以接着刚才说':'从今天的小事聊起，也可以接着刚才说。';if(['tired','low','anxious'].includes(profile.currentMood)||profile.chatStyle==='quiet')reply.mood='quiet';if(profile.chatStyle==='quiet'){reply.text=reply.text.split(/(?<=[。！？])/).slice(0,2).join('')}return reply};
 document.querySelector('#actions').addEventListener('click',event=>{
  const action=event.target.closest('[data-action]')?.dataset.action;
  const key=({tea:'food',share:'food',guess:'food',umbrella:'rain',rain:'rain',walk:activeScene==='festival'?'festival':'rain',stay:'tired',chocolate:'valentine',gift:'valentine',reason:'valentine',stall:'festival',fireworks:'festival',find:'festival'})[action];
  if(!key||busy)return;current=topics[key];stage=0;branch=null;lastDetail='';
  renderSuggestions(current.choices);trail.textContent='正在聊：'+current.title+' · 从刚才的动作继续';
 });
})();
