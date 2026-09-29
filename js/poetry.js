(()=>{
const openButton=document.querySelector('#poetry-open');
if(!openButton||document.querySelector('.poetry-modal'))return;

const storageKey='takagi-youth-poems-v1';
const library=[
 {lang:'zh',mood:'回望',text:'此情可待成追忆，只是当时已惘然。',source:'李商隐《锦瑟》',translation:'',meaning:'有些感情后来会成为回忆，身在其中时却未必已经看懂。适合写青春里的迟疑与未说出口。'},
 {lang:'zh',mood:'日常',text:'被酒莫惊春睡重，赌书消得泼茶香。当时只道是寻常。',source:'纳兰性德《浣溪沙》',translation:'',meaning:'回头才发现，真正留得久的往往是当时觉得普通的相处。适合教室、同桌与放学后的日常。'},
 {lang:'zh',mood:'回望',text:'欲买桂花同载酒，终不似，少年游。',source:'刘过《唐多令》',translation:'',meaning:'仍想重游旧地，却知道心境已经改变。它有怀念，也保留了少年时的明亮。'},
 {lang:'zh',mood:'前行',text:'行到水穷处，坐看云起时。',source:'王维《终南别业》',translation:'',meaning:'走到暂时无路的地方，也可以停下来看看变化发生。适合迷茫时的从容。'},
 {lang:'zh',mood:'前行',text:'少年心事当拏云。',source:'李贺《致酒行》',translation:'',meaning:'少年的心愿可以高远。这里强调眼前真实的一步，不把理想写成空泛口号。'},
 {lang:'zh',mood:'生长',text:'白日不到处，青春恰自来。',source:'袁枚《苔》',translation:'',meaning:'即使身处少有人注意的角落，生命仍会按自己的方式生长。'},
 {lang:'zh',mood:'从容',text:'莫听穿林打叶声，何妨吟啸且徐行。',source:'苏轼《定风波》',translation:'',meaning:'风雨声很近，脚步仍可以由自己掌握。适合考试、失误和重新开始的时刻。'},
 {lang:'zh',mood:'当下',text:'且将新火试新茶，诗酒趁年华。',source:'苏轼《望江南·超然台作》',translation:'',meaning:'用新火煮新茶，认真过好眼前的年华。它更接近日常生活里的珍惜。'},
 {lang:'zh',mood:'陪伴',text:'海上生明月，天涯共此时。',source:'张九龄《望月怀远》',translation:'',meaning:'身处不同地方的人，也能在同一轮月亮下共享一刻。适合友情与毕业后的联系。'},
 {lang:'zh',mood:'心动',text:'青青子衿，悠悠我心。',source:'《诗经·郑风·子衿》',translation:'',meaning:'一身熟悉的衣色，牵起长久而含蓄的惦念。适合写没有明说的心动。'},
 {lang:'ja',mood:'初见',text:'まだあげ初めし前髪の\n林檎のもとに見えしとき',source:'島崎藤村《初恋》',translation:'初次梳起刘海的你，在苹果树下映入眼帘。',meaning:'第一次真正注意到一个人的瞬间，细节比告白更先留下来。'},
 {lang:'ja',mood:'前行',text:'僕の前に道はない\n僕の後ろに道は出来る',source:'高村光太郎《道程》',translation:'我的面前没有现成的路，走过之后，身后便有了路。',meaning:'成长没有标准答案，方向会在真实行动里逐渐清楚。'},
 {lang:'ja',mood:'群像',text:'みんなちがって、みんないい。',source:'金子みすゞ《私と小鳥と鈴と》',translation:'每个人都不同，每个人都有自己的好。',meaning:'适合班级、朋友和校园群像，承认差异，也保留彼此的位置。'},
 {lang:'ja',mood:'愿望',text:'夢みたものは\nひとつの幸福',source:'立原道造《夢みたものは》',translation:'梦见的，是一种幸福。',meaning:'愿望无需宏大，能被认真想象过的幸福已经有了轮廓。'},
 {lang:'ja',mood:'坚持',text:'雨ニモマケズ\n風ニモマケズ',source:'宮沢賢治《雨ニモマケズ》',translation:'不因雨而退缩，也不因风而退缩。',meaning:'句子克制而坚定，适合雨天、训练、考试后继续往前。'},
 {lang:'ja',mood:'夏日',text:'夏が終わる前に、伝えたいことがある。',source:'青春主题句 · 素材库整理',translation:'在夏天结束之前，有些话想告诉你。',meaning:'时间有限，所以一句普通的话也有了分量。适合夏日祭与烟火之后。'},
 {lang:'ja',mood:'回忆',text:'あの日見た空を、今でも覚えている。',source:'青春主题句 · 素材库整理',translation:'那一天看见的天空，至今仍记得。',meaning:'用一片天空保存具体的日子，委婉，却不沉溺在失去里。'},
 {lang:'ja',mood:'成长',text:'遠回りした道も、いつか宝物になる。',source:'青春主题句 · 素材库整理',translation:'曾经绕远的路，终有一天也会成为珍藏。',meaning:'绕路仍是经历的一部分。它承认迟疑，也留下继续前进的空间。'},
 {lang:'ja',mood:'陪伴',text:'雨の日も、晴れの日も、君と歩いた。',source:'青春主题句 · 素材库整理',translation:'雨天也好，晴天也好，都曾与你同行。',meaning:'天气只是背景，真正留下来的是一起走过的普通路程。'},
 {lang:'zh',mood:'求索',text:'路漫漫其修远兮，吾将上下而求索。',source:'屈原《离骚》',translation:'',meaning:'前路很长，方向也需要不断寻找。适合把成长写成持续的探索，而非一次决定。'},
 {lang:'zh',mood:'友情',text:'海内存知己，天涯若比邻。',source:'王勃《送杜少府之任蜀州》',translation:'',meaning:'距离会改变日常，却未必削弱真正的理解。适合毕业与朋友分别。'},
 {lang:'zh',mood:'新旧',text:'无可奈何花落去，似曾相识燕归来。',source:'晏殊《浣溪沙》',translation:'',meaning:'有些离去无法挽回，也总有熟悉的新事物回来。它同时容纳告别与新的开始。'},
 {lang:'zh',mood:'心动',text:'山有木兮木有枝，心悦君兮君不知。',source:'《越人歌》',translation:'',meaning:'喜欢已经发生，对方是否察觉仍未可知。适合轻微捉弄背后没有说破的心意。'},
 {lang:'zh',mood:'朦胧',text:'蒹葭苍苍，白露为霜。所谓伊人，在水一方。',source:'《诗经·秦风·蒹葭》',translation:'',meaning:'想靠近的人似乎就在眼前，又隔着一点距离。画面清冷，情绪仍保持节制。'},
 {lang:'zh',mood:'时间',text:'年年岁岁花相似，岁岁年年人不同。',source:'刘希夷《代悲白头翁》',translation:'',meaning:'季节循环，人在其中悄悄改变。适合新学期、毕业照和重回旧校园。'},
 {lang:'ja',mood:'未来',text:'未来はまだ白いページ。',source:'青春主题句 · 素材库整理',translation:'未来仍是一页空白。',meaning:'空白意味着尚未决定，也意味着仍能写下自己的选择。'},
 {lang:'ja',mood:'少年',text:'あの頃の僕たちは、何にでもなれると思っていた。',source:'青春主题句 · 素材库整理',translation:'那时候的我们，曾相信自己可以成为任何人。',meaning:'保留少年时期的辽阔感，也承认成长会让选择逐渐具体。'},
 {lang:'ja',mood:'日常',text:'小さな幸せを見つけられる人は、強い人だ。',source:'青春主题句 · 素材库整理',translation:'能发现微小幸福的人，也有自己的坚强。',meaning:'关注便当、风声和一句问候，让力量落在可以感受到的日常里。'},
 {lang:'ja',mood:'今日',text:'明日の自分は、今日の自分が作る。',source:'青春主题句 · 素材库整理',translation:'明天的自己，由今天的自己慢慢写成。',meaning:'它把激励落在今天的一道题、一次练习和一个小决定上。'},
 {lang:'ja',mood:'当下',text:'いつか思い出す今日が、きっと輝いている。',source:'青春主题句 · 素材库整理',translation:'将来某天回想起的今天，也许正在发光。',meaning:'今天未必特别，未来的回望会让普通时刻显出光亮。'},
];

const make=(tag,text,cls)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node};
const readPoems=()=>{try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(data)?data.filter(item=>item&&typeof item.content==='string').slice(0,40):[]}catch{return[]}};
const persist=()=>{try{localStorage.setItem(storageKey,JSON.stringify(poems))}catch{setStatus('浏览器没有允许保存本地诗稿。','error')}};
let poems=readPoems(),activeId='',libraryFilter='all',selectedLibrary=3,busy=false;

const modal=make('dialog','', 'poetry-modal');
modal.setAttribute('aria-labelledby','poetry-title');
const shell=make('div','', 'poetry-shell');
const header=make('header','', 'poetry-header');
const heading=make('div','', 'poetry-heading');
const title=make('h2','青春诗笺 · 詩の窓');title.id='poetry-title';
heading.append(title,make('p','读一页古诗与日文短句，也把自己的放学后留下来。'));
const close=make('button','×','poetry-close');close.type='button';close.setAttribute('aria-label','关闭诗集分享');
header.append(heading,close);

const body=make('div','', 'poetry-body');
const gallery=make('section','', 'poetry-gallery');
const libraryHeading=make('div','', 'poetry-library-heading');
const libraryTitle=make('div');libraryTitle.append(make('span','导入素材库 · 選詩集','poetry-kicker'),make('h3','少年、雾意与仍在生长的心事'));
libraryHeading.append(libraryTitle,make('small',`${library.length} 则`));
const fixedQuote=make('blockquote','', 'poetry-featured');
fixedQuote.append(make('p','“此情可待成追忆，只是当时已惘然。”'),make('cite','李商隐《锦瑟》'));
const filters=make('div','', 'poetry-library-filters');
[['all','全部'],['zh','中华诗词'],['ja','日文诗句']].forEach(([value,label])=>{const button=make('button',label);button.type='button';button.dataset.filter=value;button.onclick=()=>{libraryFilter=value;renderLibrary()};filters.append(button)});
const randomButton=make('button','✦ 抽一笺','poetry-library-random');randomButton.type='button';randomButton.onclick=()=>{const choices=library.map((item,index)=>({item,index})).filter(({item})=>libraryFilter==='all'||item.lang===libraryFilter);if(!choices.length)return;let next=choices[Math.floor(Math.random()*choices.length)].index;if(choices.length>1&&next===selectedLibrary)next=choices[(choices.findIndex(choice=>choice.index===next)+1)%choices.length].index;selectedLibrary=next;renderLibrary();libraryDetail.scrollIntoView({block:'nearest',behavior:'smooth'})};filters.append(randomButton);
const libraryDetail=make('article','', 'poetry-library-detail');
const libraryList=make('div','', 'poetry-library-list');
const galleryNote=make('p','释义围绕校园使用场景整理。名家作品标明作者与篇名；“素材库整理”条目按整理句展示。','poetry-gallery-note');
gallery.append(libraryHeading,fixedQuote,filters,libraryDetail,libraryList,galleryNote);

const editor=make('section','', 'poetry-editor');
const editorTop=make('div','', 'poetry-editor-top');
const editorHeading=make('div');editorHeading.append(make('span','我的诗笺','poetry-kicker'),make('h3','写下这一段青春'));
const newButton=make('button','＋ 新诗笺','poetry-new');newButton.type='button';
editorTop.append(editorHeading,newButton);
const titleLabel=make('label','标题');
const titleInput=document.createElement('input');titleInput.maxLength=30;titleInput.placeholder='例如：晚自习后的风';titleInput.setAttribute('aria-label','诗歌标题');titleLabel.append(titleInput);
const styleLabel=make('label','润色方向');
const styleSelect=document.createElement('select');styleSelect.setAttribute('aria-label','诗歌润色方向');
[['campus','校园清新'],['classical','含蓄古典'],['tanka','日系短歌'],['free','现代自由诗']].forEach(([value,label])=>{const option=make('option',label);option.value=value;styleSelect.append(option)});styleLabel.append(styleSelect);
const contentLabel=make('label','正文');
const content=document.createElement('textarea');content.maxLength=600;content.placeholder='放学铃响以后，\n你故意慢了一步……';content.setAttribute('aria-label','青春诗歌正文');contentLabel.append(content);
const counter=make('small','0 / 600','poetry-counter');
const status=make('p','诗稿只保存在当前浏览器。静态拖拽版可以保存与修改，在线润色需要服务端配置。','poetry-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
const actions=make('div','', 'poetry-actions');
const saveButton=make('button','保存诗笺','poetry-save');saveButton.type='button';
const improveButton=make('button','✦ DeepSeek 润色（需服务端）','poetry-improve');improveButton.type='button';improveButton.disabled=true;improveButton.title='纯静态拖拽部署不会携带 API 密钥。';
const deleteButton=make('button','删除当前诗笺','poetry-delete');deleteButton.type='button';
actions.append(saveButton,improveButton,deleteButton);
const savedHeading=make('div','', 'poetry-saved-heading');const savedTitle=make('h3','已保存');const savedCount=make('small','0 首 · 选择后可以继续修改');savedHeading.append(savedTitle,savedCount);
const savedList=make('div','', 'poetry-saved-list');
editor.append(editorTop,titleLabel,styleLabel,contentLabel,counter,status,actions,savedHeading,savedList);
body.append(gallery,editor);shell.append(header,body);modal.append(shell);document.body.append(modal);

function setStatus(message,state='info'){status.textContent=message;status.dataset.state=state}
function renderLibraryDetail(){const item=library[selectedLibrary]||library[0];libraryDetail.replaceChildren();const meta=make('div','', 'poetry-library-meta');meta.append(make('span',item.lang==='ja'?'日本語':'中文'),make('span',item.mood));libraryDetail.append(meta,make('p',item.text,'poetry-library-original'));if(item.translation)libraryDetail.append(make('p',item.translation,'poetry-library-translation'));libraryDetail.append(make('cite',item.source),make('p',item.meaning,'poetry-library-meaning'))}
function renderLibrary(){filters.querySelectorAll('button').forEach(button=>button.dataset.active=String(button.dataset.filter===libraryFilter));libraryList.replaceChildren();const visible=library.map((item,index)=>({item,index})).filter(({item})=>libraryFilter==='all'||item.lang===libraryFilter);if(!visible.some(({index})=>index===selectedLibrary))selectedLibrary=visible[0]?.index||0;visible.forEach(({item,index})=>{const button=make('button','', 'poetry-library-item');button.type='button';button.dataset.active=String(index===selectedLibrary);button.append(make('span',item.lang==='ja'?'日':'中'),make('strong',item.text.replace(/\n/g,' ').slice(0,34)),make('small',item.source));button.onclick=()=>{selectedLibrary=index;renderLibrary();libraryDetail.scrollIntoView({block:'nearest',behavior:'smooth'})};libraryList.append(button)});renderLibraryDetail()}
function clearEditor(){activeId='';titleInput.value='';styleSelect.value='campus';content.value='';counter.textContent='0 / 600';setStatus('新诗笺已准备好。写完后点击“保存诗笺”。');renderSaved();titleInput.focus()}
function loadPoem(id){const item=poems.find(poem=>poem.id===id);if(!item)return;activeId=item.id;titleInput.value=item.title||'';styleSelect.value=['campus','classical','tanka','free'].includes(item.style)?item.style:'campus';content.value=item.content;counter.textContent=`${content.value.length} / 600`;setStatus(`正在修改“${item.title||'未命名诗笺'}”。保存后会覆盖这一版。`);renderSaved()}
function renderSaved(){savedList.replaceChildren();savedCount.textContent=`${poems.length} 首 · 选择后可以继续修改`;if(!poems.length){savedList.append(make('p','还没有保存的诗笺。先写四个字也可以。','poetry-empty'));deleteButton.disabled=true;return}deleteButton.disabled=!activeId;[...poems].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).forEach(item=>{const button=make('button','', 'poetry-saved-item');button.type='button';button.dataset.active=String(item.id===activeId);button.append(make('strong',item.title||'未命名诗笺'),make('span',(item.content||'').replace(/\s+/g,' ').slice(0,58)||'空白诗笺'),make('small',new Date(item.updatedAt||Date.now()).toLocaleDateString('zh-CN')));button.onclick=()=>loadPoem(item.id);savedList.append(button)})}
function saveCurrent(){const words=content.value.trim();if(words.length<2){setStatus('请先写下一句，再保存。','error');content.focus();return}const now=Date.now();const item={id:activeId||`${now}-${Math.random().toString(16).slice(2)}`,title:titleInput.value.trim().slice(0,30)||'未命名诗笺',content:words.slice(0,600),style:styleSelect.value,updatedAt:now};const index=poems.findIndex(poem=>poem.id===item.id);if(index>=0)poems[index]=item;else poems.push(item);activeId=item.id;persist();renderSaved();globalThis.TakagiVisitMemory?.record('诗笺',`保存《${item.title}》`,item.content.slice(0,70));setStatus('已保存在当前浏览器。下次打开仍可继续修改。','success')}
async function improve(){const words=content.value.trim();if(words.length<4){setStatus('请至少写下四个字，再请 DeepSeek 润色。','error');content.focus();return}busy=true;improveButton.disabled=true;saveButton.disabled=true;improveButton.textContent='DeepSeek 正在读诗…';setStatus('正在保留原意并调整节奏，请稍等。');try{const response=await fetch('/api/poem',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:titleInput.value.trim(),content:words,style:styleSelect.value})});const data=await response.json();if(!response.ok)throw Error(data.error||'静态拖拽版未配置 DeepSeek；诗稿仍可直接保存。');titleInput.value=data.title||titleInput.value;content.value=data.content||content.value;counter.textContent=`${content.value.length} / 600`;setStatus(`${data.note||'润色稿已写入编辑区。'} 请阅读后再保存。`,'success')}catch(error){setStatus(error.message||'DeepSeek 润色暂时不可用。','error')}finally{busy=false;improveButton.disabled=false;saveButton.disabled=false;improveButton.textContent='✦ DeepSeek 润色'}}
function removeCurrent(){if(!activeId)return;const item=poems.find(poem=>poem.id===activeId);if(!confirm(`删除“${item?.title||'这首诗'}”？删除后无法恢复。`))return;poems=poems.filter(poem=>poem.id!==activeId);persist();clearEditor();setStatus('诗笺已删除。')}

newButton.onclick=clearEditor;saveButton.onclick=saveCurrent;improveButton.onclick=improve;deleteButton.onclick=removeCurrent;
content.oninput=()=>{counter.textContent=`${content.value.length} / 600`;if(status.dataset.state==='success')setStatus('内容有新的修改，保存后才会保留。')};
close.onclick=()=>modal.close();modal.addEventListener('click',event=>{if(event.target===modal)modal.close()});
document.addEventListener('click',event=>{const trigger=event.target instanceof Element?event.target.closest('#poetry-open'):null;if(!trigger)return;renderLibrary();renderSaved();if(activeId)loadPoem(activeId);if(!modal.open)modal.showModal()});
renderLibrary();renderSaved();
})();
