(() => {
  const riddles = [
    {type:'脑筋急转弯',q:'什么东西明明是你的，别人却比你用得更多？',choices:['名字','钥匙','书包'],answer:0,hint:'别人叫你时就会用到。',why:'别人常常叫你的名字，你自己却很少叫自己的名字。'},
    {type:'脑筋急转弯',q:'什么东西越洗越脏？',choices:['毛巾','洗东西的水','衣服'],answer:1,hint:'看看脏东西最后去了哪里。',why:'东西被洗干净，污垢却留在水里了。'},
    {type:'脑筋急转弯',q:'什么门永远不能用手关上？',choices:['校门','房门','球门'],answer:2,hint:'操场上能看到它。',why:'球门用来进球，并没有可以关上的门板。'},
    {type:'脑筋急转弯',q:'什么东西有很多牙齿，却从来不吃饭？',choices:['梳子','老虎','小狗'],answer:0,hint:'整理头发时用得到。',why:'梳子的“齿”用来梳头，不用来咬东西。'},
    {type:'脑筋急转弯',q:'什么东西打破以后，大家反而能听见声音？',choices:['杯子','沉默','气球'],answer:1,hint:'这里的“打破”不需要动手。',why:'有人开口说话，便打破了沉默。'},
    {type:'脑筋急转弯',q:'你参加跑步比赛，超过了第二名，现在是第几名？',choices:['第一名','第三名','第二名'],answer:2,hint:'你占据的是被你超过的人的位置。',why:'超过第二名后，你就在第二名的位置；第一名还在前面。'},
    {type:'脑筋急转弯',q:'两位妈妈和两位女儿一起散步，为什么可以只有三个人？',choices:['祖孙三代','有一个人没来','其中一人是照片'],answer:0,hint:'一个人可以同时拥有两种身份。',why:'外婆、妈妈、女儿三个人：妈妈既是女儿的妈妈，也是外婆的女儿。'},
    {type:'脑筋急转弯',q:'什么东西越挖越大？',choices:['石头','坑','铲子'],answer:1,hint:'注意挖完之后留下的东西。',why:'挖走的土越多，留下来的坑就越大。'},
    {type:'猜谜底',q:'有面没有口，有脚没有手，书本放上头，陪你把字写。打一件家具。',choices:['书柜','床','书桌'],answer:2,hint:'我们在教室里每天都会用它。',why:'桌面放书本，桌脚支撑桌面，是书桌。'},
    {type:'猜谜底',q:'小小身子穿木衣，黑色心肠写字迹，越是认真做功课，个子越会变得低。打一件文具。',choices:['铅笔','尺子','圆规'],answer:0,hint:'用钝了，需要削一削。',why:'铅笔有木质外壳和笔芯，削得越多就越短。'},
    {type:'猜谜底',q:'平时收起像根棒，下雨撑开像朵花，雨珠落在花瓣上，花下的人不湿发。打一件日用品。',choices:['风扇','雨伞','台灯'],answer:1,hint:'雨天走廊里，她手里就有一把。',why:'伞收起像棒，打开伞面可以挡雨。'},
    {type:'猜谜底',q:'白天跟着你赶路，夜晚灯下又相逢；你动它也跟着动，就是从来不出声。打一种现象。',choices:['风','回声','影子'],answer:2,hint:'光照在你身上时，它会出现。',why:'身体挡住光，就形成影子，位置会随着人和光源变化。'},
    {type:'猜谜底',q:'一座彩桥挂天边，七种颜色接相连；雨后太阳来露面，桥上却不能行船。打一种自然现象。',choices:['彩虹','晚霞','极光'],answer:0,hint:'阳光和空气中的小水滴一起形成它。',why:'阳光经过水滴的折射和反射，形成彩虹。'},
    {type:'猜谜底',q:'四四方方一扇窗，窗外世界随手翻；没有玻璃没有框，故事装在纸里边。打一件物品。',choices:['电视','书','相框'],answer:1,hint:'可以借回家，也可以放进书包。',why:'翻开书页，便能读到故事和知识。'},
    {type:'猜谜底',q:'圆圆脸上三兄弟，长短不同跑不停；一圈一圈忙着走，告诉大家几时几分。打一件物品。',choices:['指南针','风车','钟表'],answer:2,hint:'三个兄弟分别负责时、分、秒。',why:'指针式钟表的时针、分针和秒针转动报时。'},
    {type:'猜谜底',q:'身子小小软又方，铅笔走错它来帮；把那黑印轻轻擦，自己也会瘦一点。打一件文具。',choices:['橡皮','订书机','卷笔刀'],answer:0,hint:'常和铅笔一起放在文具盒。',why:'橡皮擦去铅笔痕迹时，自身也会磨损。'}
  ];
  const levels={easy:'入门',medium:'进阶',hard:'成人挑战',expert:'高阶'};
  const bank=[...riddles.filter(r=>!r.q.includes('打破以后')).map((r,i)=>({...r,id:'old-'+i,level:'easy',category:r.type})),...window.TakagiPuzzles];
  const area=textEl('section','','leisure');area.setAttribute('aria-label','小游戏与轻音乐');
  const games=textEl('div','','leisure-games');games.append(textEl('h2','猜一个，再走吧'),textEl('p',bank.length+' 道题 · 四档难度 · 每组最多 6 题'));
  const buttons=textEl('div','','leisure-buttons');games.append(buttons);
  const category=document.createElement('select');category.setAttribute('aria-label','谜题主题');
  ['综合题组','中文灯谜','日本语趣','逻辑推理','脑筋急转弯','猜谜底'].forEach(v=>{const o=textEl('option',v);o.value=v;category.append(o)});category.value='综合题组';
  const caption=textEl('small','');const difficulty=()=>levels[profile.difficulty]?profile.difficulty:'medium';
  const updateCaption=()=>caption.textContent='当前难度：'+levels[difficulty()]+'，可在个性设置中调整。各难度均包含脑筋急转弯与猜谜底。';
  updateCaption();window.addEventListener('takagi-profile-change',updateCaption);
  const records=new Map();
  function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function rules(){const body=textEl('div');[
    ['如何开始','在“个性设置”选择难度，再选主题，点击“开始 / 继续”。综合题组混合当前难度的所有主题，每组最多 6 题，同组不重复。'],
    ['四档区别','入门：单步字谜与常识。进阶：两步条件和语言转换。成人挑战：多步逻辑、组合计数与基础概率。高阶：贝叶斯推断、信息利用和反直觉概率。中文主题包含字谜及原创灯会情境题；日本主题包含日语语趣及原创日本生活情境题。'],
    ['怎样回答','每题选择一个答案，提交后立即锁定并显示完整解析。没有倒计时，可以用纸笔计算。日语题在题干中提供所需词义。'],
    ['计分与线索','独立答对按难度获得 1、2、3、4 分；使用提示后答对减半取整，答错、揭晓和跳过为 0 分。分数只用于回顾本组思路，没有连胜压力。'],
    ['提示与统计','每题可先要一个线索，再决定作答、揭晓或跳过。独立答对、提示后答对、答错、直接揭晓、跳过会分别记录。揭晓会结束本题。'],
    ['暂停与继续','关闭窗口会保留当前题、已用提示和答案；本次页面打开期间随时继续。刷新页面会清空题组进度，设置的难度仍保留在本设备。换主题或难度会使用对应的独立题组。'],
    ['题目来源','本题库以本站原创和常见谜题改编为主，不是原作剧情台词。日语“不能吃的面包”采用常见 pan 词尾双关；迷你数独遵循每行、列、宫不重复的规则。']
  ].forEach(([h,p])=>body.append(textEl('h3',h),textEl('p',p)));
  body.append(textEl('h3','题型参考'));
  [
    ['Nikoli 日本益智题型与规则','https://www.nikoli.co.jp/en/puzzles/'],
    ['NRICH 概率与证据专题','https://nrich.maths.org/probability-and-evidence'],
    ['Project Gutenberg 公版谜语集','https://www.gutenberg.org/ebooks/36571'],
    ['CC-Riddle 中文字谜研究','https://arxiv.org/abs/2206.13778']
  ].forEach(([label,url])=>{const link=textEl('a',label,'rules-source');link.href=url;link.target='_blank';link.rel='noopener noreferrer';body.append(link)});
  openDialog('谜题玩法与计分',body)}
  function openGame(){updateCaption();const level=difficulty(),topic=category.value,key=level+':'+topic;
    if(!records.has(key))records.set(key,{deck:shuffle(bank.filter(r=>r.level===level&&(topic==='综合题组'||r.category===topic))).slice(0,6),index:0,results:[],attempts:{},score:0});
    const state=records.get(key),body=textEl('div','','riddle-game');
    if(!state.deck.length){body.append(textEl('p','这个主题在当前难度没有题目。可切换为综合题组，或在个性设置中选择轻松档。'));const settings=textEl('button','调整难度');settings.onclick=openProfileSettings;body.append(settings);openDialog('选择题组',body);return}
    if(state.index>=state.deck.length){const count=v=>state.results.filter(r=>r===v).length;body.append(textEl('h3','这一组完成了'),textEl('p','得分 '+state.score+' · 独立答对 '+count('correct')+' · 提示后答对 '+count('hinted')+' · 答错 '+count('wrong')+' · 揭晓 '+count('revealed')+' · 跳过 '+count('skipped')));
      const review=textEl('div','','riddle-review');state.deck.forEach((r,i)=>{const detail=textEl('details');detail.append(textEl('summary',(i+1)+'. '+r.q),textEl('p','答案：'+r.choices[r.answer]+'。'+r.why));review.append(detail)});body.append(review);
      const restart=textEl('button','换一组题','setting');restart.onclick=()=>{records.delete(key);openGame()};body.append(restart);speak('这一组看完了。哪道最让你犹豫？可以展开解析再看一眼。','warm');openDialog('题组回顾',body);return}
    const r=state.deck[state.index],attempt=state.attempts[state.index]||(state.attempts[state.index]={hinted:false,resolved:false,selected:-1});
    body.append(textEl('small',(state.index+1)+' / '+state.deck.length+' · '+levels[level]+' · '+r.category),textEl('p',r.q,'riddle-question'));
    const options=textEl('div','','riddle-options'),feedback=textEl('p','','riddle-feedback');feedback.setAttribute('role','status');
    const controls=textEl('div','','riddle-controls'),hint=textEl('button','给个提示'),reveal=textEl('button','揭晓谜底'),next=textEl('button','跳过此题');
    function paint(){options.querySelectorAll('button').forEach((b,i)=>{b.disabled=attempt.resolved;if(attempt.resolved){if(i===r.answer)b.dataset.result='correct';else if(i===attempt.selected)b.dataset.result='wrong'}});hint.disabled=attempt.hinted||attempt.resolved;reveal.disabled=attempt.resolved;next.textContent=attempt.resolved?(state.index===state.deck.length-1?'查看这一组结果':'下一题'):'跳过此题';feedback.textContent=attempt.resolved?attempt.feedback:attempt.hinted?'提示：'+r.hint:''}
    function finish(index,revealed=false){if(attempt.resolved)return;attempt.resolved=true;attempt.selected=index;const right=index===r.answer;state.results[state.index]=revealed?'revealed':right?(attempt.hinted?'hinted':'correct'):'wrong';if(right){const points={easy:1,medium:2,hard:3,expert:4}[level]||1;state.score+=attempt.hinted?Math.max(1,Math.floor(points/2)):points}attempt.feedback=(revealed?'谜底揭晓':right?'答对了':'再看看推理')+'：'+r.choices[r.answer]+'。'+r.why;paint();const line=revealed?'把关键一步摊开来看。你可以按自己的节奏想。':right?(attempt.hinted?'提示接上了。下次试着自己找这一步？':'这题被你看穿了。下一题我再认真一点。'):'先别急着换题。看看提示里的条件，哪里和刚才想的不一样？';speak(line,right?'playful':'warm');add('assistant',r.q+'\n'+attempt.feedback)}
    r.choices.forEach((c,i)=>{const b=textEl('button',c);b.onclick=()=>finish(i);options.append(b)});
    hint.onclick=()=>{attempt.hinted=true;paint();speak('悄悄提醒你：'+r.hint,'playful')};reveal.onclick=()=>finish(-1,true);next.onclick=()=>{if(!attempt.resolved)state.results[state.index]='skipped';state.index++;openGame()};controls.append(hint,reveal,next);body.append(options,feedback,controls,textEl('small','每题一次作答；关闭窗口后可继续本题。'));if(r.source){const source=textEl('a','题型参考：'+(r.sourceLabel||'查看资料'),'riddle-source');source.href=r.source;source.target='_blank';source.rel='noopener noreferrer';body.append(source)}paint();openDialog('一起猜 · '+topic,body);
  }
  const begin=textEl('button','开始 / 继续');begin.onclick=openGame;const help=textEl('button','玩法与计分');help.onclick=rules;const settings=textEl('button','设置难度');settings.onclick=openProfileSettings;buttons.append(category,begin,help,settings);games.append(caption);
  const arcade=textEl('details','','arcade-shelf'),arcadeSummary=document.createElement('summary');arcadeSummary.append(textEl('strong','和高木玩一局'),textEl('span','数字密码 · 禁止词 · 五子棋'),textEl('em','展开'));
  const arcadeBody=textEl('div','','arcade-body'),arcadeTabs=textEl('div','','arcade-tabs'),arcadeStage=textEl('div','','arcade-stage'),arcadeScoreLine=textEl('small','','arcade-score');arcadeScoreLine.setAttribute('role','status');
  const gameNames={code:'数字密码',words:'禁止词挑战',gomoku:'小型五子棋'};let activeArcade='code',codeState=null,wordState=null,gomokuState=null;
  let arcadeScore;try{arcadeScore=JSON.parse(load('takagi-arcade-score')||'{}')}catch{arcadeScore={}}if(!arcadeScore||typeof arcadeScore!=='object')arcadeScore={};['code','words','gomoku'].forEach(key=>{if(!arcadeScore[key]||typeof arcadeScore[key]!=='object')arcadeScore[key]={played:0,wins:0,losses:0,draws:0}});
  function saveArcadeScore(){save('takagi-arcade-score',JSON.stringify(arcadeScore));paintArcadeScore()}
  function paintArcadeScore(){const total=Object.values(arcadeScore).reduce((sum,item)=>sum+(Number(item.played)||0),0),wins=Object.values(arcadeScore).reduce((sum,item)=>sum+(Number(item.wins)||0),0);arcadeScoreLine.textContent=total?`本设备记录：${total} 局 · 你赢 ${wins} 局。各游戏可以随时重开。`:'本设备还没有对局记录。选择一项开始即可。'}
  function recordArcade(key,result){const item=arcadeScore[key];item.played++;if(result==='win')item.wins++;else if(result==='loss')item.losses++;else item.draws++;saveArcadeScore()}
  function arcadeHeading(title,rule){const head=textEl('div','','arcade-game-head');head.append(textEl('h3',title),textEl('p',rule));return head}
  function actionButton(label,handler,kind=''){const button=textEl('button',label,kind);button.type='button';button.onclick=handler;return button}
  function newCodeGame(){const digits=shuffle(['0','1','2','3','4','5','6','7','8','9']).slice(0,4).join('');codeState={secret:digits,attempts:[],over:false,recorded:false};renderCode()}
  function renderCode(){
    if(!codeState)newCodeGame();arcadeStage.replaceChildren();const s=codeState,head=arcadeHeading('四位数字密码','四个数字互不重复，可以包含 0。你有 8 次机会。“位置正确”表示数字和位置都对，“数字正确”表示数字存在但位置不对。');
    const status=textEl('p',s.over?`本局答案：${s.secret}`:`剩余 ${8-s.attempts.length} 次机会。输入四个互不重复的数字。`,'arcade-status');status.setAttribute('role','status');
    const form=document.createElement('form');form.className='code-form';const input=document.createElement('input');input.inputMode='numeric';input.maxLength=4;input.pattern='[0-9]{4}';input.autocomplete='off';input.setAttribute('aria-label','输入四位数字密码');input.placeholder='例如 5072';input.disabled=s.over;const submit=textEl('button','确认猜测');submit.type='submit';submit.disabled=s.over;form.append(input,submit);
    const feedback=textEl('small','','arcade-feedback');const history=textEl('div','','code-history');
    s.attempts.forEach((item,index)=>{const row=textEl('div','','code-row');row.append(textEl('b',String(index+1).padStart(2,'0')),textEl('strong',item.guess),textEl('span',`位置正确 ${item.exact} · 数字正确 ${item.misplaced}`));history.append(row)});
    form.onsubmit=event=>{event.preventDefault();const guess=input.value.trim();if(!/^\d{4}$/.test(guess)||new Set(guess).size!==4){feedback.textContent='请输入四个互不重复的数字。';return}let exact=0,present=0;[...guess].forEach((digit,index)=>{if(digit===s.secret[index])exact++;else if(s.secret.includes(digit))present++});s.attempts.push({guess,exact,misplaced:present});if(exact===4){s.over=true;if(!s.recorded){s.recorded=true;recordArcade('code','win')}speak('被你猜中了。最后那一步，是排除出来的，还是直觉？','playful')}else if(s.attempts.length>=8){s.over=true;if(!s.recorded){s.recorded=true;recordArcade('code','loss')}speak('这次差一点。答案已经摊开了，要不要换一组再来？','warm')}renderCode()};
    const controls=textEl('div','','arcade-actions');controls.append(actionButton(s.over?'再来一局':'换一组密码',newCodeGame));arcadeStage.append(head,status,form,feedback,history,controls);
  }
  const wordPacks=[
    {ban:['是','不是'],questions:['你今天已经打开这个页面了吗？','夏日祭里最先想到的是烟花吗？','你觉得我刚才在故意引你回答吗？','现在这轮比想象中难吗？','最后一题，你确定不会说出禁词吗？']},
    {ban:['有','没有'],questions:['今天发生过让你记住的小事吗？','你的桌边现在放着饮料吗？','你觉得这轮还剩陷阱吗？','刚才的回答里藏着犹豫吗？','要不要承认你已经快赢了？']},
    {ban:['喜欢','不喜欢'],questions:['夏天和冬天，你更偏向哪一个？','遇到下雨天时，你通常是什么心情？','如果只能选一首歌循环，你会怎么评价它？','你会怎样形容烟花升起的那一刻？','最后说一句对这个游戏的评价吧。']}
  ];
  function newWordGame(){const pack=wordPacks[Math.floor(Math.random()*wordPacks.length)];wordState={pack,index:0,user:0,takagi:0,answers:[],over:false,recorded:false};renderWords()}
  function renderWords(){
    if(!wordState)newWordGame();arcadeStage.replaceChildren();const s=wordState,head=arcadeHeading('禁止词挑战','连续回答 5 个问题，同时避开本轮禁词。输入完成后立即判定；包含禁词时高木得 1 分，成功避开时你得 1 分。');
    const score=textEl('p',`你 ${s.user} ： ${s.takagi} 高木`,'duel-score'),ban=textEl('div','','ban-list');ban.append(textEl('span','本轮禁词'),...s.pack.ban.map(word=>textEl('b',word)));
    if(s.over){const result=s.user>s.takagi?'你赢了':s.user<s.takagi?'高木赢了':'平局';const summary=textEl('div','','duel-result');summary.append(textEl('h4',result),textEl('p',s.user>s.takagi?'你避开了大部分陷阱。下一轮会换一组禁词。':s.user<s.takagi?'问题里的诱导生效了。换一组禁词还能再试。':'最后一句刚好把比分拉平。'));const list=textEl('div','','duel-history');s.answers.forEach((item,index)=>{const row=textEl('p',`${index+1}. ${item.answer}`);row.dataset.safe=String(item.safe);list.append(row)});arcadeStage.append(head,score,ban,summary,list,actionButton('再来一轮',newWordGame,'setting'));return}
    const question=textEl('p',s.pack.questions[s.index],'duel-question'),form=document.createElement('form');form.className='duel-form';const input=document.createElement('input');input.maxLength=60;input.autocomplete='off';input.placeholder='换一种说法，避开禁词…';input.setAttribute('aria-label','回答禁止词挑战');const submit=textEl('button','回答');submit.type='submit';form.append(input,submit);const feedback=textEl('small','可以用同义表达、描述动作，或直接换个角度。','arcade-feedback');
    form.onsubmit=event=>{event.preventDefault();const answer=input.value.trim();if(answer.length<2){feedback.textContent='至少写两个字，再看看能不能避开禁词。';return}const hit=s.pack.ban.find(word=>answer.includes(word)),safe=!hit;s.answers.push({answer,safe,hit});if(safe){s.user++;speak('这句绕得很自然。你是不是早就想好了？','playful')}else{s.takagi++;speak(`抓到了，你用了“${hit}”。这一分归我。`,'playful')}s.index++;if(s.index>=s.pack.questions.length){s.over=true;if(!s.recorded){s.recorded=true;recordArcade('words',s.user>s.takagi?'win':s.user<s.takagi?'loss':'draw')}}renderWords()};arcadeStage.append(head,score,ban,question,form,feedback,actionButton('换一组禁词',newWordGame));
  }
  function newGomoku(){gomokuState={board:Array(81).fill(''),over:false,thinking:false,recorded:false,status:'你执黑先行。连成五子即可获胜。'};renderGomoku()}
  function five(board,index,stone){const row=Math.floor(index/9),col=index%9;return[[1,0],[0,1],[1,1],[1,-1]].some(([dr,dc])=>{let count=1;for(const sign of [-1,1]){let r=row+dr*sign,c=col+dc*sign;while(r>=0&&r<9&&c>=0&&c<9&&board[r*9+c]===stone){count++;r+=dr*sign;c+=dc*sign}}return count>=5})}
  function lineScore(board,index,stone){const row=Math.floor(index/9),col=index%9;let score=0;[[1,0],[0,1],[1,1],[1,-1]].forEach(([dr,dc])=>{let count=1,open=0;for(const sign of [-1,1]){let r=row+dr*sign,c=col+dc*sign;while(r>=0&&r<9&&c>=0&&c<9&&board[r*9+c]===stone){count++;r+=dr*sign;c+=dc*sign}if(r>=0&&r<9&&c>=0&&c<9&&!board[r*9+c])open++}score+=count*count*(open+1)});return score}
  function aiMove(){const s=gomokuState,empty=s.board.map((value,index)=>value?'':index).filter(value=>value!=='');if(!empty.length)return-1;for(const stone of ['w','b'])for(const index of empty){s.board[index]=stone;const wins=five(s.board,index,stone);s.board[index]='';if(wins)return index}if(profile.difficulty==='easy')return empty[Math.floor(Math.random()*empty.length)];let best=empty[0],bestScore=-1;empty.forEach(index=>{const row=Math.floor(index/9),col=index%9,near=s.board.some((stone,other)=>stone&&Math.abs(Math.floor(other/9)-row)<=1&&Math.abs(other%9-col)<=1);const score=lineScore(s.board,index,'w')*4+lineScore(s.board,index,'b')*3+(near?12:0)-Math.abs(4-row)-Math.abs(4-col)+Math.random();if(score>bestScore){bestScore=score;best=index}});return best}
  function finishGomoku(result,message){const s=gomokuState;s.over=true;s.status=message;if(!s.recorded){s.recorded=true;recordArcade('gomoku',result)}speak(result==='win'?'这一步我没挡住。你从什么时候开始布这条线的？':result==='loss'?'五个连起来了。这局归我，要复盘刚才那个缺口吗？':'棋盘刚好下满。算平局，再来一盘？',result==='win'?'playful':'warm')}
  function renderGomoku(){
    if(!gomokuState)newGomoku();arcadeStage.replaceChildren();const s=gomokuState,head=arcadeHeading('9×9 小型五子棋','你执黑子，高木执白子。双方轮流落子，横、竖或斜线率先连成五子获胜。难度跟随个性设置；入门档会更随意。');const status=textEl('p',s.status,'arcade-status');status.setAttribute('role','status');const board=textEl('div','','gomoku-board');board.setAttribute('role','grid');board.setAttribute('aria-label','九乘九五子棋棋盘');s.board.forEach((stone,index)=>{const cell=textEl('button','',stone?'stone '+stone:'');cell.type='button';cell.setAttribute('role','gridcell');cell.setAttribute('aria-label',`第 ${Math.floor(index/9)+1} 行第 ${index%9+1} 列${stone==='b'?'，黑子':stone==='w'?'，白子':''}`);cell.disabled=Boolean(stone)||s.over||s.thinking;cell.onclick=()=>{if(s.board[index]||s.over||s.thinking)return;s.board[index]='b';if(five(s.board,index,'b')){finishGomoku('win','你连成了五子，本局获胜。');renderGomoku();return}if(s.board.every(Boolean)){finishGomoku('draw','棋盘已满，本局平局。');renderGomoku();return}s.thinking=true;s.status='高木正在看棋盘…';renderGomoku();setTimeout(()=>{const move=aiMove();if(move<0)return;s.board[move]='w';s.thinking=false;if(five(s.board,move,'w'))finishGomoku('loss','高木连成了五子，本局结束。');else if(s.board.every(Boolean))finishGomoku('draw','棋盘已满，本局平局。');else s.status='轮到你落黑子。';renderGomoku()},260)};board.append(cell)});const actions=textEl('div','','arcade-actions');actions.append(actionButton('重新开局',newGomoku),actionButton('查看难度设置',openProfileSettings));arcadeStage.append(head,status,board,actions);
  }
  function renderArcade(key=activeArcade){activeArcade=key;arcadeTabs.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.game===key)));if(key==='code')renderCode();else if(key==='words')renderWords();else renderGomoku()}
  Object.entries(gameNames).forEach(([key,label])=>{const button=actionButton(label,()=>renderArcade(key));button.dataset.game=key;button.setAttribute('aria-pressed',String(key===activeArcade));arcadeTabs.append(button)});arcadeBody.append(textEl('p','三款游戏都在当前页面直接运行，不消耗聊天 API。关闭窗口会保留本次页面中的对局进度。','arcade-intro'),arcadeTabs,arcadeScoreLine,arcadeStage);arcade.append(arcadeSummary,arcadeBody);arcade.addEventListener('toggle',()=>{arcadeSummary.querySelector('em').textContent=arcade.open?'收起':'展开';if(arcade.open&&!arcadeStage.childElementCount)renderArcade()});paintArcadeScore();
  const music=textEl('div','','leisure-music music-theater-entry');
  const entryCopy=textEl('div','','music-entry-copy');
  entryCopy.append(textEl('span','MUSIC THEATER','music-entry-kicker'),textEl('h2','留一点音乐'),textEl('p','九个场景 · 青春歌单 · 本地音乐'));
  const scenePreview=textEl('div','','music-entry-scene');
  const sceneImage=document.createElement('img');sceneImage.loading='lazy';sceneImage.decoding='async';sceneImage.src=load('takagi-music-thumb')||'./assets/music-scenes/sunset-classroom-thumb.webp';sceneImage.alt='当前音乐场景';
  const sceneMeta=textEl('div');const sceneName=textEl('strong',load('takagi-music-title')||'夕阳教室');const sceneTrack=textEl('small',load('takagi-music-track-title')||'言わないけどね。 · 大原ゆい子');sceneMeta.append(textEl('span','上次停留'),sceneName,sceneTrack);scenePreview.append(sceneImage,sceneMeta);
  const entryActions=textEl('div','','music-entry-actions');const openTheater=textEl('button','♫ 进入音乐小剧场','music-entry-open');const entryHint=textEl('small','全屏场景、Spotify 歌单与本地音乐。收起后可回到当前页面。','music-entry-hint');entryActions.append(openTheater,entryHint);
  music.append(entryCopy,scenePreview,entryActions);

  let theaterModal=null,theaterFrame=null;
  function closeTheater(stop=false){
    if(!theaterModal)return;
    theaterFrame?.contentWindow?.postMessage({type:'takagi-music-visibility',visible:false},location.origin);
    if(theaterModal.open)theaterModal.close();
    document.body.classList.remove('music-theater-open');
    if(stop){theaterFrame.src='about:blank';theaterModal.remove();theaterModal=null;theaterFrame=null;openTheater.textContent='♫ 进入音乐小剧场'}
    else openTheater.textContent='♫ 继续音乐小剧场';
  }
  function showTheater(){
    if(!theaterModal){
      theaterModal=document.createElement('dialog');theaterModal.className='music-theater-modal';theaterModal.setAttribute('aria-label','音乐小剧场');
      theaterFrame=document.createElement('iframe');theaterFrame.src='./pages/music-theater.html?v=98';theaterFrame.title='高木同学音乐小剧场';theaterFrame.loading='eager';theaterFrame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';theaterFrame.setAttribute('allowfullscreen','');
      theaterModal.append(theaterFrame);document.body.append(theaterModal);
      theaterModal.addEventListener('cancel',event=>{event.preventDefault();closeTheater(false)});
    }
    document.body.classList.add('music-theater-open');theaterModal.showModal();
  }
  openTheater.onclick=showTheater;
  globalThis.TakagiMusicTheater=Object.freeze({open:showTheater});
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==theaterFrame?.contentWindow||event.data?.type!=='takagi-music-theater')return;
    const data=event.data;
    if(data.sceneTitle){sceneName.textContent=data.sceneTitle;sceneTrack.textContent=`${data.trackTitle} · ${data.artist}`;sceneImage.src=data.thumb;save('takagi-music-title',data.sceneTitle);save('takagi-music-track-title',sceneTrack.textContent);save('takagi-music-thumb',data.thumb);globalThis.TakagiVisitMemory?.record('音乐',data.sceneTitle,sceneTrack.textContent)}
    if(data.action==='minimize')closeTheater(false);else if(data.action==='stop-close')closeTheater(true);
  });
  area.append(arcade,games,music);$('.interactions').after(area);
  window.addEventListener('pagehide',()=>{if(theaterFrame)theaterFrame.src='about:blank'});
})();

