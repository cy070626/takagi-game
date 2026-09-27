// Chapter pictures stay in this browser. No upload or model service is used.
(() => {
  const character=$('#character');
  const cinemaBackdrop=textEl('div','','cinema-backdrop');
  const cinemaLight=textEl('div','','cinema-light');
  const cinemaGrain=textEl('div','','cinema-grain');
  cinemaBackdrop.setAttribute('aria-hidden','true');cinemaLight.setAttribute('aria-hidden','true');cinemaGrain.setAttribute('aria-hidden','true');
  character.before(cinemaBackdrop);character.after(cinemaLight,cinemaGrain);
  const gallery=document.createElement('div');gallery.className='chapter-gallery';
  $('.scene-controls').after(gallery);
  const pictures={};let database,uploading=false;
  const festivalFrames=[
    {src:'./assets/festival-scenes/festival-stairs-01.jpg',label:'夏祭 · 石阶相遇',alt:'夏日祭夜晚，高木与西片走在灯火映亮的石阶上',supplied:true},
    {src:'./assets/festival-scenes/festival-close-01.jpg',label:'夏祭 · 浴衣近景',alt:'夏日祭夜晚，身着浴衣的高木回头看向身旁',supplied:true},
    {src:'./assets/festival-scenes/festival-stairs-02.jpg',label:'夏祭 · 灯火同行',alt:'夏日祭灯火下，高木与西片并肩走过石阶',supplied:true},
    {src:'./assets/festival-scenes/festival-hands.jpg',label:'夏祭 · 握住的手',alt:'夏日祭夜晚，两个人在人群中握住彼此的手',supplied:true},
    {src:'./assets/festival-scenes/festival-blush.jpg',label:'夏祭 · 一瞬脸红',alt:'夏日祭夜晚，高木微微脸红的近景',supplied:true},
    {src:'./assets/festival-scenes/festival-together.jpg',label:'夏祭 · 没有走散',alt:'夏日祭夜晚，高木与西片牵手站在人群前',supplied:true},
    {src:'./assets/festival-scenes/festival-sky.jpg',label:'夏祭 · 烟花以前',alt:'夏日祭的深蓝夜空下，两个人安静站在一起',supplied:true}
  ];
  const festivalGalleryAssets=[
    {src:'./assets/festival-scenes/festival-manga-walk.jpg',label:'原作选图 · 浴衣同行',alt:'原作漫画中，高木与西片身着浴衣同行的画面',supplied:true,fit:'contain'},
    {src:'./assets/festival-scenes/festival-manga-portrait.jpg',label:'原作选图 · 祭典回眸',alt:'原作漫画中，高木身着浴衣回眸的近景',supplied:true,fit:'contain'},
    {src:'./assets/festival-scenes/festival-manga-dialogue.jpg',label:'原作选图 · 夏夜对话',alt:'原作漫画中，高木在夏日祭说话的画面',supplied:true,fit:'contain'}
  ];
  let festivalFrameIndex=0,festivalTimer=null,festivalPaused=false;
  const festivalPlayer=textEl('div','','festival-slides');festivalPlayer.hidden=true;festivalPlayer.setAttribute('aria-label','夏日祭画面轮播');
  const festivalDots=textEl('div','','festival-slide-dots');
  const festivalToggle=textEl('button','Ⅱ','festival-slide-toggle');festivalToggle.type='button';festivalToggle.setAttribute('aria-label','暂停夏日祭画面轮播');
  festivalFrames.forEach((frame,index)=>{const dot=textEl('button','','festival-slide-dot');dot.type='button';dot.setAttribute('aria-label',`显示${frame.label}`);dot.onclick=()=>{festivalFrameIndex=index;applyFestivalFrame(true);syncFestivalPlayer(true)};festivalDots.append(dot)});
  festivalPlayer.append(textEl('span','夏祭の記憶'),festivalDots,festivalToggle);sceneEl.append(festivalPlayer);
  const galleryAssets=[
    {src:'./assets/takagi.png',label:'旧版 · 窗边日常',alt:'晴天下午，窗边的高木同学托着脸颊微笑'},
    {src:'./assets/cafeteria.png',label:'旧版 · 食堂对坐',alt:'高木同学坐在食堂桌子对面的情境插画'},
    {src:'./assets/study.png',label:'旧版 · 窗边学习',alt:'夜晚教室里的窗边学习情境插画'},
    {src:'./assets/rain-corridor.png',label:'旧版 · 雨天走廊',alt:'雨天教学楼走廊的情境插画'},
    {src:'./assets/summer-window.png',label:'旧版 · 夏日窗风',alt:'夏日放学后的窗边教室，高木同学回头微笑'},
    {src:'./assets/evening-study.png',label:'旧版 AI · 夜灯自习',alt:'夜色中的教室，棕发少女在台灯旁写练习册'},
    {src:'./assets/rain-gallery.png',label:'旧版 AI · 雨廊回眸',alt:'雨天教学楼走廊，棕发少女撑透明伞回头'},
    {src:'./assets/gm/takagi-sunset-close.jpg',label:'资料包 · 夕照近景',alt:'山坡夕照下，高木同学回头微笑的近景',supplied:true},
    {src:'./assets/gm/takagi-manga-glance.gif',label:'资料包 · 漫画回眸',alt:'黑白漫画风格的高木同学动态回眸',supplied:true,fit:'contain'},
    {src:'./assets/gm/takagi-winter-scarf.jpg',label:'资料包 · 冬日围巾',alt:'冬日里戴围巾的高木同学侧身看向前方',supplied:true,fit:'contain'},
    {src:'./assets/gm/takagi-seaside-sunset.jpg',label:'资料包 · 海边等候',alt:'夕阳海边，高木同学回头说等你好久了',supplied:true},
    {src:'./assets/gm/takagi-sketch-duo.jpg',label:'资料包 · 线稿二人',alt:'高木同学与西片的淡色线稿',supplied:true,fit:'contain'},
    {src:'./assets/gm/takagi-shadow-play.jpg',label:'资料包 · 灯下影子',alt:'墙面上高木同学与西片影子相遇的竖幅画面',supplied:true,fit:'contain'},
    {src:'./assets/gm/takagi-outfits-strip.jpg',label:'资料包 · 日常剪影',alt:'高木同学不同日常服装与表情的横幅画面',supplied:true,fit:'contain'},
    {src:'./assets/gm/takagi-memory.gif',label:'资料包 · 黑白片段',alt:'黑白漫画风格的高木同学与西片动态片段',supplied:true,fit:'contain'},
    {src:'./assets/gm/takagi-spring-classroom.jpg',label:'资料包 · 春日伸手',alt:'春日教室里，高木同学在窗边向前伸手',supplied:true},
    {src:'./assets/gm/takagi-collage-memories.jpg',label:'资料包 · 青春拼贴',alt:'高木同学主题的青春画面拼贴',supplied:true,fit:'contain'},
    {src:'./assets/gm/takagi-collage-scenes.jpg',label:'资料包 · 四季拼贴',alt:'高木同学主题的多场景横幅拼贴',supplied:true,fit:'contain'},
    {src:'./assets/official-chapters/classroom.jpg',label:'官方分集 · 教室',alt:'官方动画画面，教室柜台前的高木同学与西片',source:'第三季第2话官方分集页',href:'https://takagi3.me/3rd/episodes/ep2.html',fit:'contain'},
    {src:'./assets/official-chapters/cafeteria.jpg',label:'官方分集 · 便当',alt:'官方动画便当场景，高木同学拿着午餐袋坐在台阶旁',source:'第三季第4话官方分集页',href:'https://takagi3.me/3rd/episodes/ep4.html',fit:'contain'},
    {src:'./assets/official-chapters/study.jpg',label:'官方分集 · 学习',alt:'官方动画学习场景，高木同学与西片在书本旁交流',source:'第一季第5话官方故事页',href:'https://takagi3.me/1st/story/story05.php',fit:'contain'},
    {src:'./assets/official-chapters/rain.jpg',label:'官方分集 · 雨',alt:'官方动画雨天场景，窗外阴雨，高木同学在教室里看向西片',source:'第三季第3话官方分集页',href:'https://takagi3.me/3rd/episodes/ep3.html',fit:'contain'},
    {src:'./assets/official-chapters/valentine.jpg',label:'官方分集 · 2月14日',alt:'第三季第十一话官方画面，黑板写着二月十四日',source:'第三季第11话官方分集页',href:'https://takagi3.me/3rd/episodes/ep11.html',fit:'contain'},
    {src:'./assets/official-chapters/white-day.jpg',label:'官方分集 · 3月14日',alt:'第三季第十二话官方画面，夕阳归途与准备好的回礼',source:'第三季第12话官方分集页',href:'https://takagi3.me/3rd/episodes/ep12.html',fit:'contain'},
    {src:'./assets/official-chapters/festival.jpg',label:'官方分集 · 夏祭',alt:'第二季夏祭官方画面，身着浴衣的高木同学与西片逛摊位',source:'第二季第12话官方故事页',href:'https://takagi3.me/2nd/story/story12.php',fit:'contain'},
    {src:'./assets/takagi-reference.jpg',label:'官方 · 角色设定',alt:'动画第一季高木角色设定，正面、侧面和背面造型',source:'动画第一季官网',href:'https://takagi3.me/1st/character/'},
    {src:'./assets/takagi-movie.jpg',label:'官方 · 海边夏日',alt:'剧场版官方主视觉，高木与西片在海边抱着小猫',source:'剧场版官网',href:'https://takagi3.me/'},
    {src:'./assets/takagi-comic01.jpg',label:'原作 · 雨中封面',alt:'山本崇一朗原作漫画第一卷封面，高木与西片共伞',source:'动画第三季官网漫画介绍',href:'https://takagi3.me/3rd/'}
  ];
  const suppliedGroup=(ids,label)=>ids.map((id,index)=>({src:`./assets/user-gallery-202609/${id}.webp`,thumb:`./assets/user-gallery-202609/${id}-thumb.webp`,label:`新增选图 · ${label} ${String(index+1).padStart(2,'0')}`,alt:`你提供的${label}相关画面`,supplied:true,fit:'contain',supplement:true}));
  const suppliedGallery={
    classroom:suppliedGroup(['b1-16','b1-18','b1-19','b1-20','b2-01','b2-02','b2-03','b2-04','b2-05','b2-09','b2-10','b2-11','b3-09','b3-15','b3-17'],'校园日常'),
    cafeteria:suppliedGroup(['b1-15','b3-08','b3-10','b3-16'],'午后闲谈'),
    study:suppliedGroup(['b1-17','b3-13','b3-14'],'图书馆与学习'),
    rain:suppliedGroup(['b2-06','b2-07','b2-08','b3-18'],'雨天与避雨'),
    valentine:suppliedGroup(['b2-12','b2-13','b2-14','b2-15','b2-16','b3-01','b3-03'],'情人节'),
    whiteDay:suppliedGroup(['b3-02','b3-11','b3-12'],'暮色归途'),
    festival:suppliedGroup(['b1-01','b1-02','b1-03','b1-04','b1-05','b1-06','b1-07','b1-08','b1-09','b1-10','b1-11','b1-12','b1-13','b1-14','b3-04','b3-05','b3-06','b3-07','b3-19','b3-20'],'夏祭与星空')
  };
  const builtIns=key=>{
    const first={src:scenes[key].image,label:`章节默认 · ${scenes[key].name}`,alt:scenes[key].alt};
    return [first,...(key==='festival'?festivalGalleryAssets:[]),...galleryAssets,...(suppliedGallery[key]||[])].filter((item,index,items)=>items.findIndex(candidate=>candidate.src===item.src)===index);
  };
  const credit=textEl('p','','gallery-credit');
  const status=textEl('p','每个 Chapter 最多添加 3 张自选图。自选缩略图右上角的 × 可以单张删除。','gallery-note');
  status.setAttribute('role','status');
  const picker=document.createElement('input');picker.type='file';picker.accept='image/png,image/jpeg,image/webp';picker.multiple=true;picker.hidden=true;
  const thumbs=document.createElement('div');thumbs.className='gallery-thumbs';
  const supplement=document.createElement('details');supplement.className='gallery-supplement';supplement.open=true;
  const supplementSummary=document.createElement('summary');
  const supplementIntro=textEl('p','依据画面线索归入当前 Chapter。点击缩略图后才会替换主画面，章节默认图保持不变。','gallery-supplement-note');
  const supplementThumbs=document.createElement('div');supplementThumbs.className='gallery-thumbs gallery-supplement-thumbs';
  supplement.append(supplementSummary,supplementIntro,supplementThumbs);
  const choose=textEl('button','＋ 添加本章图片');choose.type='button';choose.onclick=()=>picker.click();
  const restore=textEl('button','恢复章节匹配');restore.type='button';
  const clear=textEl('button','删除全部自选图');clear.type='button';
  const manageHint=textEl('p','内置画面会保留；你添加的图片可以逐张删除，也可以一次清空。','gallery-manage-note');
  gallery.append(textEl('strong','本章画面'),manageHint,thumbs,supplement,choose,restore,clear,picker,status,credit);
  const entry=key=>pictures[key]||(pictures[key]={files:[],selected:0,galleryVersion:8});
  function applyFestivalFrame(animate=false){
    const frame=festivalFrames[festivalFrameIndex%festivalFrames.length];
    const swap=()=>{character.src=frame.src;character.alt=frame.alt;$('.avatar img').src=frame.src;sceneEl.dataset.artSource='supplied';sceneEl.dataset.artFit='cover';cinemaBackdrop.style.backgroundImage=`url(${JSON.stringify(frame.src)})`;[...festivalDots.children].forEach((dot,index)=>dot.setAttribute('aria-current',String(index===festivalFrameIndex)))};
    if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const out=character.animate([{opacity:1},{opacity:.12}],{duration:180,easing:'ease-in',fill:'forwards'});out.finished.then(()=>{swap();character.animate([{opacity:.12},{opacity:1}],{duration:300,easing:'ease-out'});out.cancel()}).catch(swap)}else swap();
  }
  function syncFestivalPlayer(enabled){
    clearInterval(festivalTimer);festivalTimer=null;festivalPlayer.hidden=!enabled;
    if(!enabled)return;
    festivalToggle.textContent=festivalPaused?'▷':'Ⅱ';festivalToggle.setAttribute('aria-label',festivalPaused?'继续夏日祭画面轮播':'暂停夏日祭画面轮播');
    [...festivalDots.children].forEach((dot,index)=>dot.setAttribute('aria-current',String(index===festivalFrameIndex)));
    if(!festivalPaused)festivalTimer=setInterval(()=>{festivalFrameIndex=(festivalFrameIndex+1)%festivalFrames.length;applyFestivalFrame(true)},6500);
  }
  festivalToggle.onclick=()=>{festivalPaused=!festivalPaused;syncFestivalPlayer(true)};
  async function persist(key){if(!database)return;await new Promise((resolve,reject)=>{const tx=database.transaction('chapters','readwrite');tx.objectStore('chapters').put(entry(key),key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
  let urls=[];
  async function removePicture(key,userIndex){const data=entry(key),builtInCount=builtIns(key).length,removedIndex=builtInCount+userIndex;data.files.splice(userIndex,1);if(data.selected===removedIndex)data.selected=0;else if(data.selected>removedIndex)data.selected--;refresh();try{await persist(key);status.textContent=`已删除${scenes[key].name}中的这张图片。`}catch{status.textContent='图片已删除，但浏览器未能保存此次操作。'}}
  function refresh(){
    urls.forEach(url=>URL.revokeObjectURL(url));urls=[];thumbs.replaceChildren();supplementThumbs.replaceChildren();
    const key=activeScene,data=entry(key);const builtIn=builtIns(key);
    supplementSummary.textContent=`补充图库 · ${(suppliedGallery[key]||[]).length} 张`;
    const items=[...builtIn,...data.files.map((file,userIndex)=>{const src=URL.createObjectURL(file);urls.push(src);return{src,label:`我的图片 ${userIndex+1}`,alt:`${scenes[key].name}的本地自选图片`,userIndex}})];
    const selectedIndex=Math.max(0,Math.min(data.selected,items.length-1));data.selected=selectedIndex;
    items.forEach((item,i)=>{const wrap=textEl('div','','gallery-thumb');const b=textEl('button','','gallery-choice');b.type='button';b.setAttribute('aria-label',item.label);b.setAttribute('aria-pressed',String(selectedIndex===i));const image=document.createElement('img');image.src=item.thumb||item.src;image.alt='';image.loading='lazy';image.decoding='async';image.fetchPriority=selectedIndex===i?'auto':'low';b.append(image,textEl('span',item.label));b.onclick=async()=>{data.selected=i;refresh();try{await persist(key)}catch{status.textContent='已切换；浏览器未能保存此次选择。'}};wrap.append(b);if(Number.isInteger(item.userIndex)){const remove=textEl('button','×','gallery-remove');remove.type='button';remove.setAttribute('aria-label',`删除${item.label}`);remove.title='删除这张图片';remove.onclick=()=>removePicture(key,item.userIndex);wrap.append(remove)}(item.supplement?supplementThumbs:thumbs).append(wrap)});
    const selected=items[selectedIndex]||items[0],festivalDefault=key==='festival'&&selectedIndex===0;if(festivalDefault){applyFestivalFrame()}else{character.src=selected.src;character.alt=selected.alt;$('.avatar img').src=selected.src;sceneEl.dataset.artSource=selected.source?'official':selected.supplied?'supplied':'scene';sceneEl.dataset.artFit=selected.fit||'cover';cinemaBackdrop.style.backgroundImage=`url(${JSON.stringify(selected.src)})`;}syncFestivalPlayer(festivalDefault);credit.replaceChildren();
    if(festivalDefault)credit.textContent='夏日祭默认轮播 · 使用你提供的原作画面，可暂停或点选画面。';else if(selected.source){credit.append(document.createTextNode('原作参考 · '+selected.source+' · © 山本崇一朗／小学館及相关动画制作委员会 · '));const link=textEl('a','查看原出处');link.href=selected.href;link.target='_blank';link.rel='noopener noreferrer';const full=textEl('a','查看完整图片');full.href=selected.src;full.target='_blank';full.rel='noopener noreferrer';credit.append(link,document.createTextNode(' · '),full)}else if(selected.supplied)credit.textContent='你提供的画面，仅在主动选择后显示。已生成 WebP 展示版和独立缩略图。';else credit.textContent=selected.label.startsWith('AI')?'保留的 AI 情境插画，仅在主动选择后显示。':selected.label.startsWith('章节默认')?'当前 Chapter 自动匹配的默认情境画面。':'你选择的本地图片，仅保存在此浏览器。';choose.disabled=uploading;restore.disabled=uploading||selectedIndex===0;clear.disabled=uploading||!data.files.length;
  }
  window.refreshSceneGallery=refresh;
  picker.onchange=async()=>{const key=activeScene;const picked=Array.from(picker.files||[]);picker.value='';if(!picked.length)return;uploading=true;refresh();const accepted=[];let rejected=0;for(const file of picked.slice(0,3)){if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){rejected++;continue}const url=URL.createObjectURL(file);try{await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=url});accepted.push(file)}catch{rejected++}finally{URL.revokeObjectURL(url)}}if(accepted.length){pictures[key]={files:accepted,selected:builtIns(key).length,galleryVersion:8};try{await persist(key);status.textContent=`已为${scenes[key].name}选好 ${accepted.length} 张。${database?'保存在此浏览器。':'仅在本次打开期间保留。'}${rejected?'部分图片无法读取或超过 5 MB。':''}${picked.length>3?'最多保留前三张中的有效图片。':''}`}catch{status.textContent='画面已更新，但浏览器空间不足，刷新后可能丢失。'}}else status.textContent='没有可用图片。请选择单张不超过 5 MB 的 JPG、PNG 或 WebP。';uploading=false;refresh()};
  restore.onclick=async()=>{const key=activeScene;entry(key).selected=0;refresh();try{await persist(key);status.textContent=`已恢复${scenes[key].name}的 Chapter 自动匹配画面。`}catch{status.textContent='已恢复章节画面，但浏览器未能保存此次选择。'}};
  clear.onclick=async()=>{pictures[activeScene]={files:[],selected:0,galleryVersion:8};refresh();try{await persist(activeScene);status.textContent='已删除本章全部自选图片，并恢复 Chapter 自动匹配画面。'}catch{status.textContent='已恢复章节画面，删除操作未能保存。'}};
  refresh();choose.disabled=true;clear.disabled=true;
  const migrated=[];try{const request=indexedDB.open('takagi-chapter-pictures',1);request.onupgradeneeded=()=>request.result.createObjectStore('chapters');request.onerror=()=>{status.textContent='此浏览器无法保存图片，自选图仅在本次打开期间保留。';refresh()};request.onsuccess=()=>{database=request.result;const tx=database.transaction('chapters','readonly');Object.keys(scenes).forEach(key=>{const read=tx.objectStore('chapters').get(key);read.onsuccess=()=>{const data=read.result;if(data&&Array.isArray(data.files)&&data.files.every(file=>file instanceof Blob)){if(data.galleryVersion!==8){data.selected=0;data.galleryVersion=8;migrated.push(key)}pictures[key]=data}}});tx.oncomplete=()=>{refresh();migrated.forEach(key=>persist(key).catch(()=>{}))};tx.onerror=refresh}}catch{status.textContent='自选图片仅在本次打开期间保留。';refresh()}
  [['portrait','侧重面部'],['wide','完整画面']].forEach(([value,label])=>{const option=textEl('option',label);option.value=value;$('#pose').append(option)});
  const stored=load('takagi-pose');if(['daily','close','portrait','wide'].includes(stored))pose(stored);
  const angle=document.createElement('select');angle.setAttribute('aria-label','镜头角度');[['center','居中视角'],['left','偏左视角'],['right','偏右视角'],['tilt','轻斜镜头']].forEach(([value,label])=>{const option=textEl('option',label);option.value=value;angle.append(option)});angle.value=load('takagi-angle')||'center';angle.onchange=()=>{sceneEl.dataset.angle=angle.value;save('takagi-angle',angle.value);speak(angle.value==='tilt'?'镜头稍微偏了一点。这样看，会不会更像抓拍？':'好，换个角度看看。','playful')};sceneEl.dataset.angle=angle.value;
  const motionStyle=document.createElement('select');motionStyle.setAttribute('aria-label','人物动态');[['soft','轻柔呼吸'],['breeze','夏风轻摆'],['glance','偶尔回眸'],['still','静态画面']].forEach(([value,label])=>{const option=textEl('option',label);option.value=value;motionStyle.append(option)});motionStyle.value=load('takagi-motion-style')||'soft';motionStyle.onchange=()=>{sceneEl.dataset.motionStyle=motionStyle.value;save('takagi-motion-style',motionStyle.value);speak(motionStyle.value==='still'?'好，先让画面安静下来。':'嗯，换一种动起来的方式。','warm')};sceneEl.dataset.motionStyle=motionStyle.value;
  const angleLabel=textEl('label','镜头角度');angleLabel.append(angle);const motionLabel=textEl('label','人物动态');motionLabel.append(motionStyle);$('.scene-controls').append(angleLabel,motionLabel);
  const hint=textEl('small','“完整画面”保留整张图片并留出边距；“靠近一点”会明显放大人物。取景、镜头偏向与动态节奏可分别调整。','pose-note');$('.scene-controls').after(hint);
  const rules={wave:'点击后她会回应招手。可以重复体验，没有胜负。',note:'点击传递一张纸条，内容会随章节变化。可在聊天框接着回答。',bet:'点击开始数字猜谜。她选 1 至 3 中的一个数字，你有一次机会；公布答案后可以再玩。',stay:'进入安静陪伴，暂停主动找话题。点击“继续聊天”或发送消息即可退出。',share:'提出交换菜品的小邀请。点击后查看情境回应，再在聊天框说出你的选择。',guess:'她会用一句预设台词猜你的午餐。你可以在聊天框揭晓答案，不计分。',tea:'递出一杯茶，收到一句情境回应。可以接着聊口味或今天的小事。',question:'先在聊天框写出题目与卡住的步骤，也可以切换“学习陪伴”获取提示。',timer:'点击开始十分钟计时；再次点击可提前结束。切换章节会结束计时，关闭页面也会停止。',umbrella:'接过伞，开启共伞的情境回应。之后可选择“一起走”或继续聊天。',rain:'点击听雨声会出现文字情境，没有实际音频。',walk:'用一句情境回应开启同行话题，可以继续在聊天框接话。',chocolate:'先猜纸袋里的内容，再在聊天框说明为什么这样猜。章节会把话题引向期待和回应。',gift:'递出回礼后，她会追问选择理由。可以继续聊预算、分寸或想传达的心意。',reason:'让她先猜你的挑选过程。你可以纠正她，再补充真正的理由。',stall:'从三个典型摊位中选一个，接着说你会先玩什么、为什么。',fireworks:'进入烟花开始前的等待情境。适合接着说一件想在烟花前后讲的话。',find:'把“走散”变成线索挑战。请在聊天框给出一个具体地点或双方刚才注意到的标记。'};
  const guide=textEl('button','玩法与指引','interaction-guide');guide.type='button';$('.interactions>div').append(guide);guide.onclick=()=>{const body=document.createElement('div');body.append(textEl('p',`${scenes[activeScene].name} · 从任意一个小动作开始。`));scenes[activeScene].actions.forEach(([id,,label])=>body.append(textEl('h3',label),textEl('p',rules[id])));openDialog('做点小事 · 玩法',body)};
  const originalInteract=interact;
  interact=function(action){if(action!=='bet')return originalInteract(action);const answer=1+Math.floor(Math.random()*3);const body=document.createElement('div');body.append(textEl('p','我选好了 1、2、3 中的一个数字。你只有一次机会，要猜哪个？'));const options=document.createElement('div');options.className='guess-options';body.append(options);[1,2,3].forEach(value=>{const button=textEl('button',String(value));options.append(button);button.onclick=()=>{options.querySelectorAll('button').forEach(b=>b.disabled=true);const line=value===answer?`猜对了，是 ${answer}。这局算你赢。`:`我选的是 ${answer}。这局被我赢了一次，要再试试吗？`;body.append(textEl('p',line));speak(line,'playful');add('assistant',line);const again=textEl('button','再玩一局','setting');again.onclick=()=>interact('bet');body.append(again)}});openDialog('数字小挑战',body);return{action:'bet',reply:'数字挑战已开始'}};
})();

const puzzlesScript=document.createElement('script');puzzlesScript.src='./js/puzzles.js?v=31';puzzlesScript.onload=()=>{const extraScript=document.createElement('script');extraScript.src='./js/puzzles-extra.js?v=31';extraScript.onload=()=>{const leisureScript=document.createElement('script');leisureScript.src='./js/leisure.js?v=57';leisureScript.onload=()=>{const arcadeScript=document.createElement('script');arcadeScript.src='./js/arcade-v2.js?v=55';arcadeScript.onload=()=>{const omikujiScript=document.createElement('script');omikujiScript.src='./js/omikuji.js?v=53';omikujiScript.onload=()=>{const memoriesScript=document.createElement('script');memoriesScript.src='./js/memories.js?v=47';document.body.append(memoriesScript)};document.body.append(omikujiScript)};document.body.append(arcadeScript)};document.body.append(leisureScript)};document.body.append(extraScript)};document.body.append(puzzlesScript);

