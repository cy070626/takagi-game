/* Original campus situations, not quotations or events attributed to the manga. */
(() => {
 const KEY='takagi-topic-tree-v1';
 const catalog={};
 const extraTerms=[];
 const add=(title,scene,background,branches,extra=false)=>{
  catalog[title]={background,branches:branches.map(([label,keywords,opening,next],id)=>({id:String(id),label,keywords:keywords.split('|'),opening,next}))};
  if(extra)extraTerms.push({title,scene,tag:'校园小事',summary:background,detail:'本站原创校园情境，可顺着玩家的真实经历聊，也可进行符合场景的同人演绎。'+background});
 };
 add('小纸条','classroom','放学前，桌角放着一张折过的便笺。',[
  ['猜纸条内容','纸条|猜|写了什么','我把纸条压在课本下了。你刚才偷偷看了好几次吧。','纸角露出来一点，先猜的人可不能临时改答案。'],
  ['写一句回信','回信|回复|写|一句','这一格留给你写。字少一点也没关系，我会认真看。','你写下的那一句，比猜对纸条更让我在意。'],
  ['藏起来的小秘密','秘密|不说|藏|悄悄','这张先只给你看。走出教室以前，别让别人发现哦。','秘密先停在我们这张桌子上，不急着说给别人听。'],
  ['当面说出来','当面|直接|开口|说出来','明明就坐在旁边，还要用纸条。嗯……也挺像你的。','现在不用纸条也听得见。我把课本合上了。']]);
 add('月考','study','晚自习的练习册摊开，考试日期写在页角。',[
  ['卡住的一道题','题|不会|步骤|数学','先看你卡住的这一行。整张卷子先放旁边，我们就做这一题。','把已经确定的那一步留住，下一步慢一点也行。'],
  ['怕成绩退步','分数|成绩|退步|紧张','你把考试日期圈了两遍。我看见了，今天先陪你做完眼前这一点。','这次的分数还没出来，别先拿它责怪今天的自己。'],
  ['复习里的小赌约','打赌|赌|复习|背','背完这一小段就休息。我来检查，答对了今天算你赢一次。','只赌这一小段，赢了之后也要记得歇一会儿。'],
  ['考完之后的安排','考完|结束|放松|回家','等考完，我们去绕一段远路吧。现在先把这道题写完。','考后的那段路先留着，不用今天就把所有事做完。']]);
 add('食堂排队','cafeteria','午休的队伍慢慢往前挪，窗口的菜还剩几份。',[
  ['选哪个窗口','窗口|队|快|排','这队只前进了两个人。你选它，真的只是因为想吃这道菜吗。','往前挪一小步就好，今天午休不用一直赶。'],
  ['最后一份喜欢的菜','最后|卖完|喜欢|份','最后一份还在。你再犹豫，我可要先替你指给阿姨看了。','刚才还装作不在意，端到餐盘上倒是笑得很明显。'],
  ['交换午餐的小心思','交换|分|尝|菜','我这边留了一点位置。想尝我的那道菜，可以直接说呀。','交换之前先看看你喜欢什么，今天不逼你吃不喜欢的。'],
  ['排队时说的闲话','聊天|刚才|说|同学','队伍还没到我们。刚才下课时你没说完的那句，现在可以接着说。','这里有点吵，不过你站近一点，我就听得清。']]);
 add('透明雨伞','rain','教学楼门口，两个人站在伞能遮到的位置。',[
  ['借伞的小捉弄','借|忘|带伞|故意','伞这边还有位置。你是忘了带，还是想让我先开口呢。','伞先拿稳，刚才的小玩笑不用急着回答。'],
  ['一起等雨小一点','等|雨停|小一点|慢','雨还在敲栏杆。晚一点走也行，我今天没急着离开。','先听这一阵雨，走廊里还有我们能站的位置。'],
  ['被淋湿的小细节','湿|鞋|衣服|冷','你袖口有点湿了。往里面站一点，先别逞强。','别顾着看远处，先看看你自己的鞋边呀。'],
  ['雨天的一段回忆','以前|记得|回忆|那次','这种雨声很容易让人想起以前。你刚才是不是也停了一下。','你说的那次雨天，我想再听一个你还记得的小细节。']]);
 add('放学路','classroom','放学铃后，书包背带被轻轻提起来。',[
  ['多绕一小段路','绕|远|慢|多走','今天走另一边吧。绕一点点，刚才的话也能多说一点。','岔路还没到，先把你刚才那句话接完。'],
  ['买一瓶放学饮料','饮料|买|汽水|水','走到拐角再挑饮料。猜错你的口味，我今天就不捉弄你了。','瓶子凉凉的，适合走路时慢慢喝。'],
  ['路上突然安静','安静|沉默|不说|累','不说话也能一起走。你不用为了填满这段路一直找话题。','脚步慢一点就好，我会跟着你的速度。'],
  ['快到分别的时候','再见|分别|到家|明天','前面就要分开走了。今天没说完的，我先替你记着。','明天见面的时候，就从这里接上。']]);
 add('烟花开始以前','festival','第一束烟花还没升起，摊位的灯照着小路。',[
  ['先逛一个摊位','摊位|金鱼|吃|苹果糖','烟花还没开始，先选一个摊位吧。今天我跟着你的选择走。','刚才那个摊位的声音还听得到，我们不用一口气逛完。'],
  ['人群里别走散','人群|走散|跟|找','你别只看灯笼呀。我在你旁边，走慢一点也不会丢。','人多的时候，先认准旁边的我就好。'],
  ['挑一个观看位置','位置|看|站|前面','这边也看得到天空。抢不到最前排，我们还是能一起看。','选好的位置先留住，不用每次都追着别人换地方。'],
  ['想说却没说的话','话|说|犹豫|心事','你从刚才就像有一句话没说。烟花升起来以前，我还听得见。','不用跟烟花抢声音，小声一点也行。']]);
 add('奶茶','cafeteria','午休结束前，还有挑一杯饮料的时间。',[
  ['猜甜度','甜|糖|猜|口味','我先猜半糖。猜对了，你刚才犹豫的表情就算被我看穿了。','这次只记住你的口味，不拿它当下一次的标准答案。'],
  ['分享一口的邀请','尝|分享|一口|喝','你的那杯看起来和我的不一样。好奇可以直接说，不用一直看。','想不想分享由你决定，我先把自己的杯子放好。'],
  ['喜欢的店和习惯','店|常|习惯|喜欢','每次都去同一家店，听起来很像有个固定的小期待。','熟悉的口味，有时候比新菜单更让人放松。'],
  ['饮料连着的记忆','记忆|第一次|以前|一起','有些口味会让人想起某个下午。你刚才说的，是哪一杯留下来的感觉。','先留住那个下午的一个画面，不用把经过讲得很完整。']]);
 add('晚自习','study','夜色压低了窗外的声音，课桌上的灯还亮着。',[
  ['安静做完一点','专注|写|做题|十分钟','这一小段我先不打扰。写完之后，抬头让我看一下就好。','先把这一行写完，我没有在催你。'],
  ['小声传一句话','纸条|悄悄|小声|说','说小声一点，后排还在写题。不过你这一句，我听见了。','话先停在我们这张桌子上，别影响别人。'],
  ['窗外的夜景','窗|灯|夜|外面','窗外已经黑了。你抬头的那一下，比刚才写题的时候轻松一点。','夜景先看一眼，再决定要不要回到练习册。'],
  ['结束后的回家路','回家|结束|早点|困','今天想早点回去也可以。先收好东西，别把自己的笔落下。','不是每个晚上都要撑到最后，我们可以慢一点收尾。']]);
 add('窗边座位','classroom','夕光落在相邻的课桌上，窗户开着一点缝。',[
  ['窗外的一阵风','风|窗|凉|吹','风把书页翻过去了。你刚才想看我的时候，借口又多了一个。','先把书页压住，风还没打算停下来。'],
  ['同桌的小观察','看|观察|表情|你','你把笔转了三圈。我先猜，你有一句话还没想好怎么说。','我看见的是你刚才的小动作，猜错了也可以纠正我。'],
  ['换一个座位','换|位置|坐|座位','换座位之前先看看窗外。也许你舍不得的，刚好是这里这一点光。','位置可以换，想留下的那个细节先记住。'],
  ['把下午留成一句','诗|一句|记|下午','这个下午适合留一句很短的话。先写你眼前真的看到的东西。','那句话不用写得漂亮，能让你想起今天就够了。']]);
 add('值日结束','classroom','最后一块黑板擦完，教室里还有轻轻的粉笔味。',[
  ['分工的小较量','分工|扫|擦|比赛','你扫这一排，我擦这边。先做完的人，可以给另一位留个小任务。','刚才的分工先完成，输赢等我们把教室收好再说。'],
  ['留到最后的两个人','最后|留下|等|两人','大家都走了，椅子也安静了。你今天留到最后，我倒不觉得无聊。','慢一点收好也没关系，现在没有人催我们离开。'],
  ['发现别人落下的东西','落|忘|东西|笔','桌角还有一支笔。先替它找个安全的位置，明天再问是谁落下的。','有些小东西被人记住，回来找的时候就不会那么着急。'],
  ['收工后的一点奖励','奖励|休息|喝|结束','打扫完就出去透口气吧。今天这一点奖励，我们自己决定。','奖励不必很大，结束的时候有人一起走就挺好了。']]);
 const newRows=[
 ['课间借笔','classroom','上课铃快响了，你在笔袋里找着那支不见的笔。',['先借一支','猜笔去了哪里','笔上的小记号','下课后归还']],
 ['临时换座位','classroom','座位表刚贴出来，大家正搬着课本。',['新位置的视野','还能不能说话','旧课桌的痕迹','给新同桌的第一句']],
 ['午休的空教室','classroom','午休时教室里只有几个人，窗帘轻轻动着。',['趴着歇一会儿','小声聊一句','分享午休零食','窗外的一种声音']],
 ['忘带课本','classroom','上课前翻遍书包，课本还没找到。',['一起看一本','偷偷夹张便笺','下次怎么记住','课本里的旧标记']],
 ['操场边的饮水机','cafeteria','体育课结束，水杯碰在一起发出轻响。',['先喝口水','刚才谁跑得快','休息时说的话','下节课前的约定']],
 ['考试前的一支笔','study','考试开始前，桌上留着一支备用笔。',['借一点好运','检查考试用品','考前的紧张','考完再见的约定']],
 ['错题旁的小涂鸦','study','错题旁边画着一个小小的笑脸。',['看懂错在哪里','猜是谁画的','给自己留一句','下一次的变式题']],
 ['晚自习后的铃声','study','最后一遍铃响起，有人还没合上练习册。',['今天做到这里','想多留五分钟','收书包的顺序','回家的那段路']],
 ['雨后鞋边的水','rain','走过车棚，鞋边沾了一小片水。',['先躲一躲水坑','看见自己的倒影','被雨打断的计划','雨停后的气味']],
 ['伞忘在教室','rain','走到楼下才想起来，伞还靠在教室门边。',['一起回去拿','谁先发现的','多走一层楼','回来再出发']],
 ['食堂最后一个空位','cafeteria','午休最热闹的时候，桌边恰好留出一个位置。',['先坐下来','今天餐盘里的菜','人声里的悄悄话','吃完后去哪里']],
 ['便利店的季节限定','cafeteria','放学时看见一张新饮料海报。',['试一种新口味','猜对方会选什么','还是买熟悉的','海报里的季节感']],
 ['暑假最后一天','classroom','新课本还没翻开，暑假的最后一个下午慢慢过去。',['没做完的小愿望','明天又能见面','整理一件旧物','给夏天留一句']],
 ['夏日祭的集合点','festival','摊位的灯都亮了，需要先约好会合的地方。',['挑一个好认的位置','先去哪个摊位','晚到也能找到','等烟花时的小约定']],
 ['给未来的一句便笺','whiteDay','一张空便笺夹在书里，日期还没有写上。',['写给明天的自己','写给一个朋友','留一句小约定','以后打开时的心情']]
 ];
 const moments={
  '课间借笔':['我这儿有一支。先写，等下课再想怎么谢我。','你把笔袋翻第三遍了。会不会夹在刚才那本练习册里。','这支笔帽上有个小记号，归还的时候可别装作认错了。','下课再还也行，我刚好有借口多留你一会儿。'],
  '临时换座位':['新位置离窗近一点。午后的光落在书页上，应该会很舒服。','坐远了一点，也还有课间呀。你想说的话先留给我。','桌角那道浅浅的笔印还在。你是不是也会认得旧位置。','第一次坐过去，不用想多特别的开场。一句你好就够了。'],
  '午休的空教室':['先趴一会儿吧。今天这一点安静不用急着填满。','你小声说就好。我把窗边的位置往你这边挪一点。','午休零食拿出来之前，先看看别人有没有睡着呀。','操场那边有一点声音传过来。我刚才也跟着听了一会儿。'],
  '忘带课本':['先看我这本。靠近一点才能看清，别只盯着空白的桌面。','这一页夹着张便笺。别急着猜，我先让你看完课文。','出门前把课本放到书包最上面。明天我可以提醒你一次。','这条铅笔线还留着。你上次看到这里的时候，好像也停了一下。'],
  '操场边的饮水机':['先喝口水，喘匀了再说。我不会现在就拉你比赛。','刚才冲过终点的样子挺认真。今天算你先赢一小局。','体育课结束以后说的话，好像总比坐着的时候松快一点。','下节课前还能歇一会儿。铃响了再一起上楼吧。'],
  '考试前的一支笔':['这支先借给你当备用。好运不敢保证，写起来顺手倒是可以。','笔和准考用品先看一遍。把东西放稳了，心里也能松一点。','你刚才攥笔攥得有点紧。先放松手，眼前这一题慢慢看。','考完在走廊见吧。到时候先聊你最想说的那一题。'],
  '错题旁的小涂鸦':['这一步的符号和上一行不一样。先看看是不是从这里拐错了。','笑脸先不用擦。你猜我看见的时候，会先笑还是先看题。','旁边留一句下次注意就好。今天的错误不用写成对自己的责备。','我们只改一个条件再试一次。刚才那一步能不能留住就知道了。'],
  '晚自习后的铃声':['今天做到这里也可以。你已经写下的这一页不会因为休息就消失。','多留五分钟就只做一件事。写完这一行，我们就收书包。','先收散着的纸，再收课本。不然走到门口又得回来找。','楼下的灯还亮着。出去的时候，我们可以把脚步放慢一点。'],
  '雨后鞋边的水':['这块地砖比较干，踩这里。你可别为了走近路把鞋又弄湿。','水里能看见车棚的边。你刚才停下来，是在看那个倒影吧。','计划被这场雨打断了，也可以先改一个小地方。今天还没结束。','雨刚停的空气有点凉。先站这里透口气，再慢慢往前走。'],
  '伞忘在教室':['那就一起回去拿。还好刚走到楼下，今天不用跑很远。','刚才谁先发现没带伞，这一局我可记下了。','多爬一层楼也有多说一句话的时间。你先走，我跟上。','回来以后先看看雨小了没有。急着出发也得拿稳伞呀。'],
  '食堂最后一个空位':['这里有位置。我把餐盘挪一点，你先坐下来。','你今天选的菜和上次不一样。原来不是每次都猜得中你。','食堂有点吵，悄悄话反而不太容易被别人听见。','吃完先到走廊透口气吧。今天不用马上回到练习册里。'],
  '便利店的季节限定':['新口味看着挺有意思。想试就试，不喜欢也算知道了一件事。','我先猜你会拿那瓶浅色的。别为了让我猜错临时换呀。','还是买熟悉的也很好。今天不用每件小事都追求新鲜。','海报上的颜色变了，季节好像也跟着往前走了一点。'],
  '暑假最后一天':['有件小事没做也不等于暑假白过了。你最想留下的那一件先说给我听。','明天又能在教室见面了。这一点，我倒是有点期待。','那张旧票根先别扔。它可能比新课本更容易让你想起这个夏天。','给夏天留一句短话吧。就写你真的见过的光、声音或者一个人。'],
  '夏日祭的集合点':['灯笼下面这一处挺好认。先约在这里，走远了也能回来找。','集合点记住了，下一步就由你选摊位。我今天先听你的。','晚一点到也没关系。先说清楚在哪儿等，就不用一直找。','第一束烟花升起来的时候，先看看旁边的人还在不在。'],
  '给未来的一句便笺':['写给明天的话，不必要求自己突然变得很厉害。留一件能做到的小事吧。','写给朋友的时候，你平常不太好意思说的那句也可以放进来。','约定写小一点，就更容易记得。比如明天放学以后一起走一段。','以后打开时，希望你还认得今天写下这句话的心情。']
 };
 newRows.forEach(([title,scene,bg,labels])=>add(title,scene,bg,labels.map((label,i)=>[label,label+'|'+['先|现在|一点','猜|谁|对方','习惯|以前|为什么','以后|明天|约定'][i],moments[title][i],
  moments[title][i].split(/(?<=[。！？])/).slice(-2).join('')||moments[title][i]]),true));
 const clean=(s,n=90)=>String(s||'').replace(/\s+/g,' ').trim().slice(0,n);
 let state;try{state=JSON.parse(sessionStorage.getItem(KEY)||'null')}catch{}
 if(!state||!state.entries||typeof state.entries!=='object'||Array.isArray(state.entries))state={active:'',entries:{}};
 const persist=()=>{try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch{}};
 const entry=term=>{const e=state.entries[term.title]||{};return{visits:e.visits&&typeof e.visits==='object'?e.visits:{},openings:Array.isArray(e.openings)?e.openings.slice(-8).map(s=>clean(s,160)):[],details:Array.isArray(e.details)?e.details.slice(-4).map(s=>clean(s,150)):[],last:clean(e.last,24),turns:Math.max(0,Number(e.turns)||0)}};
 const tree=term=>catalog[term.title]||{background:clean(term.summary,110),branches:[
  {id:'detail',label:'从一个具体细节聊',keywords:['细节','现在','眼前'],opening:`你点开了“${term.title}”。先从你在意的那一点说起吧。`,next:'刚才那一点我记着，可以接着说。'},
  {id:'memory',label:'说说自己的经历',keywords:['以前','我','学校','经历'],opening:`“${term.title}”让我想到，最容易记住的往往是小事。你自己的那段经历，我想听。`,next:'你刚才提到的经历，我想沿着那个具体细节听下去。'},
  {id:'meaning',label:'换一个角度看',keywords:['为什么','意思','区别','角度'],opening:`“${term.title}”还可以换个角度聊。先看看它和你今天有什么联系。`,next:'换个角度也行，我先不替你的经历定一个答案。'},
  {id:'next',label:'把它留成一句话',keywords:['诗','一句','写','留下'],opening:`把“${term.title}”留成一句话的话，我想先听你自己的说法。`,next:'先写下你想留下的那一点，不必把整段经历解释完。'}]};
 const least=(t,e,exclude='')=>t.branches.filter(b=>b.id!==exclude).sort((a,b)=>(e.visits[a.id]||0)-(e.visits[b.id]||0))[0]||t.branches[0];
 function start(term){const previous=state.active||state.lastTopic;const t=tree(term),e=entry(term),b=least(t,e);if(previous&&previous!==term.title)state.links=[...(Array.isArray(state.links)?state.links.slice(-3):[]),previous+' → '+term.title];const opening=e.openings.includes(b.opening)?`${b.next} 今天从“${b.label}”接着聊。`:b.opening;
  e.openings=[...e.openings.slice(-7),opening];e.last=b.id;e.visits[b.id]=(e.visits[b.id]||0)+1;state.active=term.title;state.scene=term.scene;state.free=false;state.entries[term.title]=e;
  trimEntries();state.lastTopic=term.title;persist();return opening;}
 function plan(term,message){if(!term)return null;const t=tree(term),e=entry(term),s=clean(message,200);
  if(/不聊这个|先不聊|换个话题|说点别的|不说这个/.test(s))return{detached:true,title:term.title};
  let b=t.branches.find(item=>s===item.label),best=0;
  if(!b)for(const candidate of t.branches){const score=candidate.keywords.filter(word=>(word.length>1||['湿','鞋','冷','困','题','伞','猜','笔','风','借'].includes(word))&&s.includes(word)).length;if(score>best){best=score;b=candidate}}
  if(/换个角度|还有呢|别重复|另一种/.test(s))b=least(t,e,e.last);
  b||=t.branches.find(item=>item.id===e.last)||least(t,e);
  return{term,title:term.title,tag:term.tag,scene:term.scene,summary:term.summary,detail:term.detail,background:t.background,branch:b.label,branchId:b.id,direction:b.next,alternatives:t.branches.filter(item=>item.id!==b.id).map(item=>item.label),used:t.branches.filter(item=>e.visits[item.id]).map(item=>item.label),recent:e.details.slice(-3).join('；'),phase:e.turns?'延续':'开始'};
 }
 function commit(p,message,reply){if(!p)return;if(p.detached){state.active='';state.free=true;persist();return}const e=entry(p.term);e.last=p.branchId;e.turns++;e.visits[p.branchId]=(e.visits[p.branchId]||0)+1;e.details=[...e.details.slice(-3),clean(message,65)+' → '+clean(reply,65)];state.active=p.title;state.lastTopic=p.title;state.free=false;state.entries[p.title]=e;state.points=[...(Array.isArray(state.points)?state.points.slice(-3):[]),{user:clean(message,90),reply:clean(reply,90),topic:p.title}];if(p.previous&&p.previous!==p.title)state.links=[...(Array.isArray(state.links)?state.links.slice(-3):[]),p.previous+' → '+p.title];trimEntries();persist();}
 function local(term,message){if(!catalog[term.title])return null;const p=plan(term,message);if(p?.detached)return null;const e=entry(term),b=tree(term).branches.find(item=>item.id===p.branchId);const text=e.turns?b.next:b.opening;return{text,mood:'listening',topic:'term-branch',suggestions:p.alternatives,knowledgeTags:['原创校园情境']};}
 const sceneTitles={classroom:'窗边座位',cafeteria:'食堂排队',study:'晚自习',rain:'透明雨伞',valentine:'情人节的表达',whiteDay:'白色情人节的回礼',festival:'烟花开始以前'};

 // Related topics stay on the current visual scene; these hints never force a transition.
 const groups=[
  ['月考','晚自习','考试前的一支笔','错题旁的小涂鸦','复盘一次卡住','晚自习后的铃声'],
  ['透明雨伞','雨后鞋边的水','伞忘在教室','放学路','值日结束','车站屋檐下的雨宿り'],
  ['食堂排队','食堂最后一个空位','交换一道菜','奶茶','便利店的季节限定','食堂里的选择题'],
  ['小纸条','课间借笔','忘带课本','临时换座位','窗边座位','午休的空教室'],
  ['放学路','暑假最后一天','夏夜的声音','烟花开始以前','夏日祭的集合点','花火结束后的归途'],
  ['小纸条','给未来的一句便笺','写在便笺上的短歌','暑假最后一天','三月回信'],
  ['心情说不清的时候','认真倾听','今天还算顺利的事','周末留白','被误解以后']
 ];
 const aliases={
  '奶茶':['喝杯奶茶','想喝奶茶'], '食堂排队':['食堂的队伍','食堂排队'],
  '月考':['这次考试','考试成绩','考试考砸','月考'], '晚自习':['晚自习'],
  '课间借笔':['借支笔','借一支笔','借个笔'], '忘带课本':['忘带书','忘带课本'],
  '透明雨伞':['一起撑伞','一起打伞','共伞'], '雨后鞋边的水':['鞋湿了','鞋子湿了'],
  '伞忘在教室':['忘带伞','伞忘了'], '便利店的季节限定':['便利店的新饮料','季节限定'],
  '给未来的一句便笺':['写给未来','写给明天'], '临时换座位':['换座位'],
  '午休的空教室':['午休的教室'], '烟花开始以前':['等烟花','看烟花'],
  '夏日祭的集合点':['走散了','集合点'], '心情说不清的时候':['心情说不清'],
 };
 const replySeeds={
  '透明雨伞':['雨声好像小一点了','你也往伞里面站一点','等雨小一点再走吧','我还记得一次很大的雨'],
  '月考':['我卡在这一题了','这次我想先稳住一科','别笑我，我有点紧张','考完想去走一会儿'],
  '食堂排队':['这边的队伍是不是快一点','猜猜我今天选哪道菜','我还是想吃平常那份','先找个位子吧'],
  '小纸条':['我先猜里面写了什么','那我也写一句给你','这句我想当面说','先不让别人看见'],
  '放学路':['我想再走慢一点','这条路我以前也走过','今天绕一下远路吧','路口那里有件小事'],
  '烟花开始以前':['离第一束还有多久呀','你站这里我就找得到','先去看看旁边的摊位','烟花散了也走慢一点'],
  '奶茶':['你先猜我的口味','今天想喝点不太甜的','我还是选熟悉那杯','让我看看新口味'],
  '晚自习':['我先写完这一小题','陪我安静坐一会儿','我有点困了','下课铃响了再收书'],
  '窗边座位':['这边的风刚刚好','那我就坐这里了','你怎么发现那个小细节的','窗外有点好看'],
  '值日结束':['这一排我来收拾','等雨小一点再走','你先把书包拿好','终于安静下来了'],
  '课间借笔':['借我用到下课吧','可能夹在练习册里了','这支笔上有个小记号','下课还你，别忘了提醒我'],
  '雨后鞋边的水':['鞋边湿了一小块','我先擦一下鞋','这条路还有水洼','等下走慢一点'],
 };
 const bridgePhrases={
  '奶茶':'说起来，今天想喝杯奶茶', '食堂排队':'说到吃的，食堂今天人好多',
  '月考':'我又想起这次考试了', '晚自习':'今晚自习陪我一会儿吧',
  '放学路':'放学一起慢慢走吧', '透明雨伞':'等会儿一起撑伞走吧',
  '小纸条':'这句话我想写在小纸条上', '给未来的一句便笺':'把这件小事留给以后的我吧',
  '烟花开始以前':'突然想看看今晚的烟花', '便利店的季节限定':'顺路看看便利店的新口味吧',
  '错题旁的小涂鸦':'这页错题旁边我画了一点东西', '课间借笔':'对了，下节课借我一支笔',
  '食堂最后一个空位':'那我们先去找个空位', '暑假最后一天':'想到开学前那个下午了',
 };
 const trimEntries=()=>{const names=Object.keys(state.entries);while(names.length>30)delete state.entries[names.shift()]};
 function related(term,terms){if(!term)return[];return [...new Set(groups.filter(g=>g.includes(term.title)).flat())].filter(title=>title!==term.title&&terms.some(t=>t.title===title)).sort((a,b)=>entry({title:a}).turns-entry({title:b}).turns).slice(0,4)}
 function resolve(term,message,terms){
  const text=clean(message,1200);const candidates=terms.map(t=>{const cues=[t.title,...(aliases[t.title]||[])];let score=0;
   for(const cue of cues){const at=text.indexOf(cue);if(at<0||/不聊|别聊|不说|不要说/.test(text.slice(Math.max(0,at-5),at)))continue;score=Math.max(score,cue.length+(cue===t.title?3:0))}return{term:t,score};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  // A detail of the current branch has priority over an overlapping topic alias.
  const currentDetail=term&&tree(term).branches.some(b=>b.keywords.some(k=>k.length>1&&text.includes(k)));
  const explicit=candidates.find(x=>x.term.title!==term?.title&&text.includes(x.term.title));
  const next=explicit?.term||(!currentDetail?candidates[0]?.term:null)||term;
  const detached=/不聊这个|先不聊|换个话题|说点别的|不说这个/.test(text)&&!candidates.some(x=>x.term.title!==term?.title);
  if(detached)return{detached:true,title:term?.title||'',previous:term?.title||state.lastTopic||''};
  if(!next)return null;
  const p=plan(next,message.replace(/不聊这个|先不聊|换个话题|说点别的|不说这个/g,''));
  const previous=term?.title||state.lastTopic||'';
  if(previous&&previous!==next.title){p.previous=previous;p.bridge='玩家已从“'+previous+'”转向“'+next.title+'”。接受新话题，只在相关时轻轻承接前文，不追问转场理由。';p.phase='转场';p.recent=[entry({title:previous}).details.at(-1),p.recent].filter(Boolean).join('；')}
  p.related=related(next,terms);return p;
 }
 function handoff(history=[]){
  const points=Array.isArray(state.points)?state.points.filter(x=>x&&typeof x==='object').slice(-4):[];
  return {topic:clean(state.active||state.lastTopic,60),links:Array.isArray(state.links)?state.links.slice(-3).map(x=>clean(x,90)):[],
   details:points.map(x=>'玩家：'+clean(x.user,90)+'；高木：'+clean(x.reply,90)),
   recent:history.slice(-4).map(x=>(x.role==='user'?'玩家：':'高木：')+clean(x.text||x.content,100)),
   choices:Array.isArray(state.choices)?state.choices.slice(-6).map(x=>clean(x,40)):[]};
 }
 const awkward=/信息不足|缺少判断|补充背景|说自己的判断|问一个具体问题|我换个问法|需要更多信息|作为.?AI|请选择交流|根据分析/;
 const choiceKey=s=>s.replace(/[\s，。！？、…~～♡☺♪]/g,'');
 function recommendations(items,p,{chatStyle='gentle',currentMood='calm'}={},terms=[]){
  const previous=Array.isArray(state.choices)?state.choices.slice(-6):[],old=new Set(previous.map(choiceKey));
  const source=(Array.isArray(items)?items:[]).filter(x=>typeof x==='string').map(x=>clean(x,32)).filter(x=>x&&!awkward.test(x));
  const seeds=replySeeds[p?.title]||['我刚才想到一个小细节','这次我想听听你的看法','我也有一件类似的小事','先陪我坐一会儿'];
  const options=related(p?.term,terms);const bridge=options.map(t=>bridgePhrases[t]||'也想聊聊'+t);
  const extra=currentMood==='tired'||currentMood==='low'?['今天先陪我慢一点','让我再说一小会儿']:chatStyle==='playful'?['这次让我猜猜你','别笑，我还没说完呢']:['我再说一个细节','你先说，我听着'];
  const result=[];const keys=new Set();
  const fallback=[...seeds.slice(0,2),...bridge,...extra,...seeds.slice(2)];
  for(const text of [...source,...fallback]){const k=choiceKey(text);if(!keys.has(k)&&!old.has(k)){result.push(text);keys.add(k)}if(result.length===3)break}
  for(const text of [...bridge,...extra,...seeds]){if(result.length>=3)break;const k=choiceKey(text);if(!keys.has(k)){result.push(text);keys.add(k)}}
  state.choices=[...previous,...result].slice(-9);persist();return result;
 }
 globalThis.TakagiTopicTree=Object.freeze({extraTerms,start,plan,resolve,related,handoff,recommendations,commit,local,has:term=>Boolean(catalog[term?.title]),sceneTerm:(terms,scene)=>{if(state.scene!==scene){state.scene=scene;state.free=false;persist()}return state.free?null:terms.find(term=>term.title===sceneTitles[scene])||null},peek:term=>{const t=tree(term);return least(t,entry(term)).opening},suggestions:term=>tree(term).branches.map(b=>b.label),deactivate:()=>{state.active='';state.free=true;persist()},restore:terms=>terms.find(term=>term.title===state.active)||null});
})();
