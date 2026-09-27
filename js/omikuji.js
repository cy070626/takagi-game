(() => {
  const fortunes = [
    {name:'大吉',weight:8,tone:'sun',lead:'今天适合把期待说得具体一点。',lines:['先完成最想留下痕迹的一步，运气会跟上行动。','别急着证明自己，先让真正重要的事发生。','有人记得你随口说过的小事，今天也可以回应一次。']},
    {name:'吉',weight:24,tone:'leaf',lead:'节奏很稳，适合慢慢把事情推进。',lines:['先做十分钟，再决定要不要继续。','绕一点路也没关系，沿途会多听见一种声音。','把一个模糊的约定说清楚，今天会轻松很多。']},
    {name:'中吉',weight:26,tone:'sky',lead:'平常的一天里，会藏着一个值得记住的细节。',lines:['留意窗边、路口或车站的一次停顿。','先问清楚，再替别人猜答案。','今天适合整理旧想法，也适合开始一页新笔记。']},
    {name:'小吉',weight:22,tone:'plum',lead:'小小的顺利，需要你主动伸手接住。',lines:['把任务缩小到现在就能完成的一步。','一句短回复，也能让等待的人安心。','如果犹豫，就选更容易回头调整的方向。']},
    {name:'末吉',weight:15,tone:'rain',lead:'结果来得慢一些，先照顾好过程。',lines:['今天少做一件消耗你的事，也算进展。','别在疲惫时替明天做永久决定。','把没有说完的话记下来，晚一点再判断。']},
    {name:'凶',weight:5,tone:'night',lead:'今天适合谨慎一点，也适合把负担减轻一点。',lines:['先检查时间、预算和承诺，再继续向前。','暂时没有答案时，停下来不会让事情更糟。','把最担心的结果写清楚，你会看见可以控制的部分。']}
  ];
  const total = fortunes.reduce((sum,item)=>sum+item.weight,0);
  const sceneNotes = {
    classroom:'放学铃之后，给自己留十分钟再出发。',
    cafeteria:'先好好吃一顿，再处理复杂的决定。',
    study:'只看下一步，今晚不用一次解决全部。',
    rain:'雨声会遮住一点杂音，等你听清真正的想法。',
    valentine:'期待可以坦白，回应也需要留出余地。',
    whiteDay:'记得一件事，本身已经是一种回答。',
    festival:'烟花很短，同行的路可以慢一点。'
  };
  const ritualScenes=[
    {id:'spring',name:'春日神社',kana:'神社の春',src:'./assets/omikuji-scenes/spring.webp',position:'center center'},
    {id:'beach',name:'夕暮海边',kana:'夏の海辺',src:'./assets/omikuji-scenes/beach.webp',position:'center center'},
    {id:'festival',name:'祭典之夜',kana:'夏祭り',src:'./assets/omikuji-scenes/festival.webp',position:'center center'},
    {id:'winter',name:'冬日雪景',kana:'冬の静けさ',src:'./assets/omikuji-scenes/winter.webp',position:'center center'}
  ];
  function randomUnit(){
    if(window.crypto?.getRandomValues){const value=new Uint32Array(1);window.crypto.getRandomValues(value);return value[0]/4294967296}
    return Math.random();
  }
  function drawFortune(){
    let point=randomUnit()*total;
    for(const item of fortunes){point-=item.weight;if(point<0)return item}
    return fortunes[fortunes.length-1];
  }
  const shell=textEl('section','','omikuji-shell');shell.id='omikuji';
  const summary=textEl('button','','omikuji-summary');summary.type='button';summary.setAttribute('aria-haspopup','dialog');
  const summaryMark=textEl('span','御','omikuji-summary-mark');summaryMark.setAttribute('aria-hidden','true');
  const summaryCopy=textEl('span','','omikuji-summary-copy');summaryCopy.append(textEl('strong','高木的御神签'),textEl('small','おみくじ · 点开抽一支今日签'));
  const summaryStatus=textEl('span','今日未抽','omikuji-summary-status');
  const summaryArrow=textEl('span','↗','omikuji-summary-arrow');summaryArrow.setAttribute('aria-hidden','true');
  summary.append(summaryMark,summaryCopy,summaryStatus,summaryArrow);
  shell.append(summary);
  const modal=document.createElement('dialog');modal.className='omikuji-modal';modal.setAttribute('aria-labelledby','omikuji-title');
  const modalFrame=textEl('div','','omikuji-modal-frame');
  const backdrop=textEl('div','','omikuji-scene-backdrop');backdrop.setAttribute('aria-hidden','true');
  const veil=textEl('div','','omikuji-scene-veil');veil.setAttribute('aria-hidden','true');
  const modalHeader=textEl('header','','omikuji-modal-header');
  const brand=textEl('div','','omikuji-modal-brand');brand.append(textEl('strong','高木同学'),textEl('small','Takagi-san · 御神签'));
  const modalWish=textEl('p','今日という日が、少しでもやさしい日になりますように。','omikuji-modal-wish');
  const closeButton=textEl('button','×','omikuji-close');closeButton.type='button';closeButton.setAttribute('aria-label','关闭御神签');
  modalHeader.append(brand,modalWish,closeButton);
  const area=textEl('section','','omikuji-area');area.setAttribute('aria-labelledby','omikuji-title');
  const intro=textEl('div','','omikuji-intro');
  intro.append(textEl('span','神社の午後 · 今日の一枚','omikuji-eyebrow'),textEl('h2','高木的御神签'));
  intro.querySelector('h2').id='omikuji-title';
  intro.append(textEl('p','先看看今天的景色。想抽签时，点一下签筒就好。'));
  const nameRow=textEl('div','','omikuji-names');
  const nameOne=document.createElement('input');nameOne.maxLength=12;nameOne.placeholder='例如：小林';nameOne.setAttribute('aria-label','你的昵称');
  const nameTwo=document.createElement('input');nameTwo.maxLength=12;nameTwo.placeholder='例如：同行者';nameTwo.setAttribute('aria-label','同行者昵称');
  const nameOneField=textEl('label','','omikuji-name-field');nameOneField.append(textEl('span','你的昵称 · 选填'),nameOne);
  const nameTwoField=textEl('label','','omikuji-name-field');nameTwoField.append(textEl('span','同行者昵称 · 选填'),nameTwo);
  nameRow.append(nameOneField,nameTwoField);
  const controls=textEl('div','','omikuji-controls');
  const drawButton=textEl('button','打开签盒','omikuji-draw');drawButton.type='button';
  const rulesButton=textEl('button','查看签运概率','omikuji-rules');rulesButton.type='button';
  controls.append(drawButton,rulesButton);
  intro.append(textEl('p','填写后会印在纪念签上，留空也可以直接抽签。','omikuji-name-hint'),nameRow,controls,textEl('small','昵称只用于生成当前页面的纪念签，不会上传。签运概率不随场景变化。'));
  const boxLaunch=textEl('button','','omikuji-box-launch');boxLaunch.type='button';boxLaunch.setAttribute('aria-label','打开御神签签盒');
  const boxLaunchArt=textEl('span','','omikuji-box-launch-art');boxLaunchArt.setAttribute('aria-hidden','true');
  const launchSticks=textEl('span','','omikuji-box-launch-sticks');for(let i=0;i<7;i++)launchSticks.append(textEl('i'));
  boxLaunchArt.append(launchSticks,textEl('b','おみくじ'));
  const boxLaunchCopy=textEl('span','','omikuji-box-launch-copy');boxLaunchCopy.append(textEl('strong','我要抽签'),textEl('small','点击签筒，打开抽签说明'));
  boxLaunch.append(boxLaunchArt,boxLaunchCopy);
  const stage=textEl('div','','omikuji-stage');stage.dataset.phase='idle';stage.hidden=true;
  const torii=textEl('div','','omikuji-torii');torii.setAttribute('aria-hidden','true');
  const cylinder=textEl('div','','omikuji-cylinder');cylinder.setAttribute('aria-hidden','true');cylinder.append(textEl('span','御神签'));
  const stick=textEl('div','今日','omikuji-stick');stick.setAttribute('aria-hidden','true');
  const paper=textEl('article','','omikuji-paper');paper.setAttribute('aria-live','polite');
  const stageClose=textEl('button','×','omikuji-stage-close');stageClose.type='button';stageClose.setAttribute('aria-label','收起签盒');stageClose.title='收起签盒';
  const idle=textEl('div','','omikuji-idle');idle.append(textEl('strong','おみくじ'),textEl('p','签盒已经打开。可以填写昵称，再点击左侧的“摇动签筒”。'));
  paper.append(idle);stage.append(torii,cylinder,stick,paper,stageClose);
  const scenePicker=textEl('div','','omikuji-scene-picker');scenePicker.setAttribute('aria-label','御神签场景');
  let ritualSceneIndex=0;
  function selectRitualScene(index){
    ritualSceneIndex=index;const selected=ritualScenes[index];backdrop.style.backgroundImage=`url(${JSON.stringify(selected.src)})`;backdrop.style.backgroundPosition=selected.position;
    scenePicker.querySelectorAll('button').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===index));button.classList.toggle('is-active',i===index)});
  }
  ritualScenes.forEach((item,index)=>{const button=textEl('button','','omikuji-scene-option');button.type='button';button.setAttribute('aria-label',`切换到${item.name}`);const image=document.createElement('img');image.src=item.src;image.alt='';image.loading='lazy';image.decoding='async';button.append(image,textEl('span',item.name),textEl('small',item.kana));button.onclick=()=>selectRitualScene(index);scenePicker.append(button)});
  intro.insertBefore(boxLaunch,nameRow);area.append(intro,stage);modalFrame.append(backdrop,veil,modalHeader,area,scenePicker);modal.append(modalFrame);document.body.append(modal);selectRitualScene(0);
  const anchor=document.querySelector('.leisure')||document.querySelector('.terms-preview');
  anchor.after(shell);
  let boxOpen=false;
  function revealBox(){if(boxOpen)return;boxOpen=true;stage.hidden=false;boxLaunch.hidden=true;area.classList.add('box-open');drawButton.textContent='摇动签筒';stage.dataset.phase=lastResult?'result':'idle';setTimeout(()=>stage.classList.add('is-visible'),20)}
  function hideBox(){if(drawing)return;boxOpen=false;stage.classList.remove('is-visible');area.classList.remove('box-open');drawButton.textContent='打开签盒';setTimeout(()=>{stage.hidden=true;boxLaunch.hidden=false;boxLaunch.focus()},180)}
  function openOmikuji(){if(!modal.open)modal.showModal();document.body.classList.add('omikuji-modal-open');setTimeout(()=>(boxOpen?drawButton:boxLaunch).focus(),80)}
  function closeOmikuji(){if(modal.open)modal.close()}
  summary.onclick=openOmikuji;closeButton.onclick=closeOmikuji;modal.addEventListener('click',event=>{if(event.target===modal)closeOmikuji()});modal.addEventListener('close',()=>{document.body.classList.remove('omikuji-modal-open');if(boxOpen&&!drawing){boxOpen=false;stage.classList.remove('is-visible');stage.hidden=true;boxLaunch.hidden=false;area.classList.remove('box-open');drawButton.textContent='打开签盒'}});
  boxLaunch.onclick=revealBox;stageClose.onclick=hideBox;
  const navButton=document.querySelector('#omikuji-open');if(navButton)navButton.onclick=openOmikuji;
  let drawing=false,lastResult=null,lastMessage='';
  function preferredName(){return nameOne.value.trim()||profile?.address?.trim()||profile?.name?.trim()||'同桌'}
  function companionLine(fortune){
    const name=preferredName(),other=nameTwo.value.trim();
    if(other)return `${name}和${other}的纪念签已经展开。签运只管今天的提示，真正的答案还是留给你们一起写。`;
    const playful=fortune.name==='大吉'||fortune.name==='吉';
    return playful?`${name}，抽到“${fortune.name}”以后表情这么认真，是准备把每一句都做到吗？`:`${name}，先别皱眉。签上写的是提醒，又不是替你决定今天。`;
  }
  function renderResult(fortune){
    lastResult=fortune;const message=fortune.lines[Math.floor(randomUnit()*fortune.lines.length)],sceneLine=sceneNotes[activeScene]||sceneNotes.classroom;
    summaryStatus.textContent=`今日签 · ${fortune.name}`;summaryStatus.dataset.tone=fortune.tone;
    lastMessage=message;paper.replaceChildren();paper.dataset.tone=fortune.tone;
    const head=textEl('div','','omikuji-paper-head');head.append(textEl('small','今日の運勢'),textEl('strong',fortune.name));
    const portrait=document.createElement('img');portrait.src=ritualScenes[ritualSceneIndex].src;portrait.alt=`${ritualScenes[ritualSceneIndex].name}的御神签场景`;
    const copy=textEl('div','','omikuji-copy');copy.append(textEl('h3',nameTwo.value.trim()?`${preferredName()} × ${nameTwo.value.trim()}`:`${preferredName()}的今日签`),textEl('p',fortune.lead),textEl('p',message,'omikuji-main-line'),textEl('small',sceneLine));
    const actions=textEl('div','','omikuji-result-actions');const saveButton=textEl('button','保存纪念签');saveButton.type='button';const again=textEl('button','再抽一次');again.type='button';actions.append(saveButton,again);
    paper.append(head,portrait,copy,actions);
    saveButton.onclick=()=>saveCard(fortune,message,sceneLine);
    again.onclick=()=>startDraw();
    const line=companionLine(fortune);addContext(`御神签展开了：${fortune.name}`);add('assistant',line,fortune.name==='凶'?'quiet':'warm');speak(line,fortune.name==='大吉'?'playful':'warm');
  }
  function startDraw(){
    if(!boxOpen){revealBox();return}
    if(drawing)return;drawing=true;drawButton.disabled=true;rulesButton.disabled=true;stage.dataset.phase='shaking';
    stageClose.disabled=true;
    summaryStatus.textContent='正在抽签…';delete summaryStatus.dataset.tone;
    paper.replaceChildren(textEl('p','签筒轻轻响了起来…','omikuji-progress'));
    const result=drawFortune(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const steps=reduced?[0,0,0]:[720,520,620];
    setTimeout(()=>{stage.dataset.phase='stick';paper.firstChild.textContent='一支木签落了下来。';
      setTimeout(()=>{stage.dataset.phase='paper';paper.firstChild.textContent='和纸正在展开…';
        setTimeout(()=>{stage.dataset.phase='result';renderResult(result);drawing=false;drawButton.disabled=false;rulesButton.disabled=false;stageClose.disabled=false},steps[2]);
      },steps[1]);
    },steps[0]);
  }
  function saveCard(fortune,message,sceneLine){
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;const ctx=canvas.getContext('2d');
    const gradient=ctx.createLinearGradient(0,0,0,1440);gradient.addColorStop(0,'#f4eee2');gradient.addColorStop(1,'#e8efe3');ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,1440);
    ctx.strokeStyle='#9b4038';ctx.lineWidth=8;ctx.strokeRect(70,70,940,1300);ctx.fillStyle='#9b4038';ctx.fillRect(70,70,940,24);
    ctx.textAlign='center';ctx.fillStyle='#6b2f2a';ctx.font='36px serif';ctx.fillText('放学后 · 高木的御神签',540,170);
    ctx.font='bold 150px serif';ctx.fillText(fortune.name,540,390);
    ctx.fillStyle='#344c3a';ctx.font='40px sans-serif';ctx.fillText(nameTwo.value.trim()?`${preferredName()} × ${nameTwo.value.trim()}`:`${preferredName()}的今日签`,540,500);
    const lines=[fortune.lead,message,sceneLine,'きょうも、ゆっくりいこう。'];ctx.font='34px sans-serif';
    lines.forEach((line,index)=>wrapCanvas(ctx,line,540,650+index*150,820,50));
    ctx.font='24px sans-serif';ctx.fillStyle='#73806c';ctx.fillText('非官方同人互动 · 签运仅作轻松体验',540,1320);
    const link=document.createElement('a');link.download='高木的今日御神签.png';link.href=canvas.toDataURL('image/png');link.click();
  }
  function wrapCanvas(ctx,text,x,y,maxWidth,lineHeight){
    let line='';const rows=[];for(const char of Array.from(text)){const test=line+char;if(ctx.measureText(test).width>maxWidth&&line){rows.push(line);line=char}else line=test}if(line)rows.push(line);
    rows.slice(0,3).forEach((row,index)=>ctx.fillText(row,x,y+index*lineHeight));
  }
  function showRules(){
    const body=textEl('div','','omikuji-rules-dialog');body.append(textEl('p','每次抽取都使用同一组公开权重，合计 100%。昵称、章节和此前结果都不会改变概率。'));
    const list=textEl('div','','omikuji-probabilities');fortunes.forEach(item=>{const row=textEl('div');row.append(textEl('strong',item.name),textEl('span',item.weight+'%'));list.append(row)});body.append(list);
    body.append(textEl('h3','抽签流程'),textEl('p','点击“摇动签筒”后，会依次显示签筒摇动、木签掉出、和纸展开和今日寄语。开启减少动态效果时，流程会立即完成。'));
    body.append(textEl('h3','结果说明'),textEl('p','抽签用于轻松体验。大吉等结果不与付费、分享次数或重复点击绑定，也不会作为现实决定的依据。'));
    openDialog('御神签玩法与概率',body);
  }
  drawButton.onclick=startDraw;rulesButton.onclick=showRules;
  window.TakagiOmikuji={fortunes:fortunes.map(({name,weight})=>({name,weight})),draw:drawFortune};
})();
