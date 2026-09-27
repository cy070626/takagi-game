/* Stateful offline dialogue. No message leaves the browser. */
class CompanionDialogue{
 constructor(){this.name='';this.topic='';this.gentle=false;this.counts={};this.profile={name:'',address:'',identity:'学生',context:'',needs:[]};this.memory={likes:[],dislikes:[],plans:[]}}
 setProfile(profile={}){this.profile={...this.profile,...profile};if(this.profile.name&&!this.name)this.name=this.profile.name}
 address(){return this.profile.address?.trim()||this.name||'你'}
 pick(key,lines){const i=this.counts[key]||0;this.counts[key]=i+1;return lines[i%lines.length]}
 remember(bucket,value){value=value.replace(/[。！!？?，,].*$/,'').trim().slice(0,22);if(!value)return;const list=this.memory[bucket];if(!list.includes(value))list.unshift(value);list.splice(3)}
 memorySummary(){const p=[];if(this.name)p.push(`称呼：${this.name}`);if(this.memory.likes[0])p.push(`喜欢：${this.memory.likes[0]}`);if(this.memory.plans[0])p.push(`待办：${this.memory.plans[0]}`);return p}
 finish(text,mood='listening',topic=this.topic,suggestions=[]){this.topic=topic;return{text,mood,topic,suggestions}}
 study(raw){
  const s=raw.replace(/\s+/g,'').replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/');
  const m=s.match(/^([+-]?\d*\.?\d*)x([+-]\d+(?:\.\d+)?)?=([+-]?\d+(?:\.\d+)?)$/i);
  if(m){let a=m[1];a=a===''||a==='+'?1:a==='-'?-1:Number(a);const b=Number(m[2]||0),c=Number(m[3]);if(a){const moved=c-b,x=moved/a;return this.finish(`先把不含 x 的 ${b>=0?b:'('+b+')'} 移到等号右边，得到 ${a}x = ${moved}。再把两边同时除以 ${a}，所以 x = ${Number(x.toFixed(6))}。代回原式检查，会得到 ${c}。你想自己说说移项为什么要变号吗？`,'focused','study',['为什么移项要变号','再给我一道同类题','检查我的步骤'])}}
  const n=s.match(/^(-?\d+(?:\.\d+)?)([+\-*/])(-?\d+(?:\.\d+)?)=?$/);
  if(n){const a=Number(n[1]),b=Number(n[3]),op=n[2];if(op==='/'&&b===0)return this.finish('这一步会出现除以 0，算式没有定义。先检查题目是不是抄漏了条件。','focused','study',['检查题目条件','换一道题']);const result={'+':a+b,'-':a-b,'*':a*b,'/':a/b}[op];return this.finish(`结果是 ${Number(result.toFixed(8))}。不过只看答案太便宜你了：先说说你准备怎样估算它的范围，我再帮你检查。`,'playful','study',['讲讲估算方法','给我一道变式题'])}
  if(/作文|议论文|阅读理解|概括|中心思想/.test(raw))return this.finish('先别急着组织漂亮句子。把题干要求、材料里反复出现的词，以及你自己的初步判断分别写一行，我们再把它们连成答案。','focused','study',['帮我拆题干','检查我的答案','只提示第一步']);
  if(/英语|单词|语法|时态|完形/.test(raw))return this.finish('把完整句子和你的选择一起发来。语法题只看一个空容易误判，我会先找时间标志、主语和句子结构。','focused','study',['检查一个句子','帮我区分时态','给我一道练习']);
  if(/物理|化学|生物|历史|地理|政治/.test(raw))return this.finish('先写清楚学科、题目给出的条件和你卡住的那一步。条件齐了，我可以陪你画出“已知到结论”的路线；复杂题目前只能做结构化梳理。','focused','study',['整理已知条件','检查我的思路','先问我一个关键问题']);
  return this.finish('把题目完整写下来，再补一句“我已经想到哪里”。我会先找已知条件、目标和第一个缺口。简单算式与一元一次方程，我也可以直接陪你核对。','focused','study',['分析一道方程','检查我的解法','只提示下一步']);
 }
 reply(raw,scene='classroom',mode='chat'){
  const s=raw.trim();if(mode==='study')return this.study(s);
  const named=s.match(/^(?:我叫|叫我|你可以叫我)([\p{L}\p{N}·]{1,12})[。！!，,]?$/u);
  if(named){this.name=named[1];return this.finish(`好，${this.name}。我记住了。下次你突然问我，可别装作只是随口一提。`,'playful','name',['你记得我叫什么吗','那我怎么称呼你','聊聊今天'])}
  if(/我叫什么|记得我的名字/.test(s))return this.finish(this.name?`当然记得，${this.name}。你问之前停顿了一下，是不是已经准备好看我答错时的表情了？`:'你还没告诉我。想让我怎么称呼你？','playful','name',['我叫…','叫我同桌就好']);
  const like=s.match(/我(?:很|最|比较)?喜欢(.{1,24})/);if(like){this.remember('likes',like[1]);return this.finish(`原来你喜欢${this.memory.likes[0]}。记下了。以后拿这个当话题时，你可不能说我观察得太仔细。`,'warm','preference',[`聊聊${this.memory.likes[0]}`,'你还记住了什么','那你喜欢什么'])}
  const dislike=s.match(/我(?:很|最|比较)?不喜欢(.{1,24})/);if(dislike){this.remember('dislikes',dislike[1]);return this.finish(`好，${this.memory.dislikes[0]}就先绕开。能说清楚不喜欢什么，也算是在认真照顾自己。`,'quiet','preference',['换个轻松话题','聊聊我喜欢的','安静坐一会儿'])}
  const plan=s.match(/我(?:等会|待会|今天|明天|周末)?(?:要|得|准备)(.{2,24})/);if(plan){this.remember('plans',plan[1]);return this.finish(`要${this.memory.plans[0]}，对吧。你打算从哪一步开始？说出来以后，就没那么容易偷偷拖到最后了。`,'playful','plan',['先做五分钟','帮我拆成三步','晚点回来报结果'])}
  if(/别.*(?:捉弄|逗)|不要.*(?:开玩笑|捉弄)|认真听|停止|不想开玩笑/.test(s)){this.gentle=true;return this.finish('好，我停下。你慢慢说，我先听完整。','quiet','serious',['我想认真说件事','先陪我坐一会儿','换个话题'])}
  if(/可以.*(?:捉弄|开玩笑)|继续逗我/.test(s)){this.gentle=false;return this.finish('这可是你自己恢复的。那我先从最简单的开始：你刚才是不是想了两秒才发这句话？','playful','tease',['才没有','那你猜猜','来个小挑战'])}
  if(/不想说|不想聊|安静|陪着|静一会/.test(s))return this.finish('嗯。雨声、风声，或者教室里翻书的声音，选一个陪我们坐一会儿。你不用接话。','quiet','quiet',['听雨声','听教室的声音','等我想说再说']);
  if(/晚安|睡觉|再见|拜拜|回家了/.test(s))return this.finish(`那今天先到这里。${this.memory.plans[0]?`你说过要${this.memory.plans[0]}，别忘了。`:''}路上慢一点，明天见。`,'quiet','goodbye',['明天见','再坐一分钟']);
  if(/孤独|孤单|没人陪|一个人/.test(s))return this.finish(this.pick('lonely',['一个人的时候，周围明明有声音，心里还是会显得很空。你愿意说说今天哪个时刻最明显吗？','我可以听你把这段时间讲清楚。要是这种感觉持续很久，也找一个现实里信得过的人说一声。']),'quiet','lonely',['今天午休的时候','回家以后最明显','只想有人听着']);
  if(/难过|伤心|委屈|烦|压力|焦虑|不开心|崩溃/.test(s))return this.finish(this.pick('sad',['我先不逗你。把最刺人的那句话，或者最难受的那个瞬间说出来就好。','听起来这件事还压在心里。你更想让我听经过，还是一起想下一步？']),'quiet','sad',['先听我说经过','一起想下一步','现在不想分析']);
  if(/累|困|没精神|撑不住/.test(s))return this.finish(this.pick('tired',['你打字的语气都慢下来了。今天是事情太多，还是一直没真正休息？','先把肩膀放松一点。现在最适合你的，是喝水、吃点东西，还是把手机放下五分钟？']),'quiet','tired',['事情太多了','一直没休息','陪我安静五分钟']);
  if(/考试|月考|期中|期末|成绩|分数|考砸|排名/.test(s))return this.finish('先把“考得不好”拆开。是知识点没掌握、时间不够，还是看到成绩以后心里过不去？选一个最接近的。','focused','exam',['知识点没掌握','时间不够','看到分数很难受']);
  if(this.topic==='exam'&&/知识点|时间|分数|紧张|粗心/.test(s))return this.finish(`问题更具体了。今晚只做一件可验证的小事：找出一道能代表“${s.slice(0,12)}”的题，把当时的思路写在旁边。你愿意从哪一科开始？`,'focused','exam',['数学','英语','语文','理化']);
  if(/作业|题目|不会做|自习|学习|复习/.test(s))return this.finish('切到“学习陪伴”，再把题目和你已经想到的步骤发来。简单计算和一元一次方程我能直接核对，其他题我会先帮你整理条件。','focused','study',['切到学习陪伴','先整理今天的任务','陪我专心十分钟']);
  if(/食堂|午餐|晚饭|吃饭|吃什么|饿|奶茶|外卖/.test(s))return this.finish(scene==='cafeteria'?'我看了一眼你的餐盘。先猜一下，你真正想吃的那道是不是排队最长？':'先去吃点东西。空着肚子做决定，十次有八次会选最省事的。今天想吃热的，还是清爽一点？','playful','food',['想吃热的','想吃清爽的','去食堂坐坐']);
  if(/下雨|雨伞|淋雨|天气|降温|刮风/.test(s))return this.finish(scene==='rain'?'你果然在看外面的雨。伞在这里，先说好：如果只带了一把，就别走得太快。':'听起来像是雨天的话题。要不要切到走廊？那里能听见雨落在栏杆上的声音。','warm','weather',['切到雨天走廊','我忘带伞了','一起听雨']);
  if(/朋友|同学|室友|同事|吵架|误会|冷战/.test(s))return this.finish('先分清两件事：对方做了什么，以及你猜对方怎么想。前一件通常能确认，后一件容易把人困住。你愿意从发生的那一刻讲起吗？','focused','relationship',['说说发生了什么','我不知道怎么开口','帮我想一句话']);
  if(/上班|工作|加班|开会|领导|老板/.test(s))return this.finish('今天的工作还没从脑子里下班呀。选一件已经结束的事，再选一件明天才处理的事，剩下的先留在门外。','quiet','work',['今天已经做完…','明天再处理…','先聊点别的']);
  if(/周末|放假|休息日|出门|旅行/.test(s))return this.finish('周末计划越写得满，越像另一张课表。留一小块没有安排的时间吧。你最想把哪件事放进去？','warm','weekend',['睡个懒觉','出去走走','什么都不安排']);
  if(/音乐|歌单|耳机|听歌|演唱会/.test(s))return this.finish('有些歌适合走路，有些适合把一天收起来。你现在这首更像哪一种？别只告诉我歌名。','warm','music',['适合放学路','适合睡前','我最近循环一首歌']);
  if(/游戏|开黑|排位|电影|电视剧|番剧|小说|漫画/.test(s))return this.finish('你提到它的时候语速好像快了一点。最想安利我的，是一个角色、一个场面，还是那种看完以后留下来的感觉？','playful','hobby',['一个角色','一个场面','看完后的感觉']);
  if(/开心|高兴|成功|完成|通过|赢了|拿到了/.test(s))return this.finish('这件事值得认真高兴一下。先别急着把它说成“运气好”，你具体做对了什么？','warm','happy',['我坚持下来了','有人帮助我','真的有点运气']);
  if(/谢谢|多谢/.test(s))return this.finish(this.pick('thanks',['嗯，收下了。你每次都这么认真道谢吗？','好，这句谢谢我记着。下次换你接受别人的好意时，也别急着推回去。']),'warm','thanks',['不用客气','那聊点别的','我还有件事']);
  if(/你好|嗨|早上好|中午好|晚上好/.test(s)){const h=new Date().getHours(),p=h<11?'早上':h<18?'白天':'晚上';return this.finish(`${this.address()}，${p}好。你来得正好，我刚在猜：你今天第一句会说心情，还是说发生的事。现在看来，我还得再等一句。`,'playful','greeting',['先说心情','先说今天发生的事','你猜错了'])}
  if(/喜欢你|想你/.test(s))return this.finish(this.gentle?'嗯，我听见了。今天想把哪段时间留在这里？':'突然说得这么直接。你是不是觉得隔着屏幕，我就看不出你发完以后盯着这句话看？','warm','affection',['才没有盯着看','陪我聊十分钟','今天发生了一件事']);
  if(/打赌|挑战|反击|猜猜/.test(s))return this.finish(this.gentle?'可以，先把规则说清楚。':'好啊。猜猜你打开这里以后，最先看的其实是画面，还是我说的第一句话？答得太快也很可疑哦。','playful','challenge',['先看的画面','先看的话','我不告诉你']);
  if(/原作|剧情|第.*集|结局|西片/.test(s))return this.finish('原作里的核心是相邻座位、观察细节和一次次想反击的往返。具体集数和台词我不凭印象乱说；词条里标了已经核对的官方资料。','listening','canon',['打开原作词条','聊人物气质','回到今天的话题']);
  if(/^(嗯+|好[的呀吧]?|是的|对|可以|行)[。！!，,]*$/.test(s))return this.finish(this.topic==='sad'||this.topic==='tired'||this.topic==='quiet'?'嗯，我在。你不用为了让对话继续而硬找一句话。':'答得这么短，是在等我继续猜吧。那我问具体一点：刚才那件事里，哪一秒最让你在意？',this.topic==='sad'?'quiet':'playful',this.topic,['接着刚才说','换个话题','安静一会儿']);
  if(this.topic==='sad'||this.topic==='lonely')return this.finish('我还记得你刚才说的感受。这句话也是那件事的一部分吗？你可以只回答“是”或“不是”。','quiet',this.topic,['是','不是，是另一件事','我想换个话题']);
  if(this.topic==='tired')return this.finish('听起来你还在硬撑。先别规划整个晚上，只决定接下来十分钟做什么。','quiet','tired',['喝水休息','把一件事做完','什么都不做']);
  const detail=s.match(/(?:今天|刚才|然后|因为|其实)(.{2,30})/);if(detail)return this.finish(`你把“${detail[1].replace(/[。！？!?].*$/,'').slice(0,16)}”说得很轻，可听起来它才是重点。要从这里继续吗？`,'listening','detail',['就从这里说','其实还有前因','先换个轻松话题']);
  const context=this.profile.context?.trim();const need=this.profile.needs?.[0];
  return this.finish(this.pick('fallback',[`我听见的是“${s.slice(0,18)}${s.length>18?'…':''}”。如果只挑一个细节继续，你最希望我注意哪一个？`,context?`你设置的当前情境是“${context.slice(0,20)}”。这句话也和它有关吗？`:'这句话里像是藏了前半段。是今天发生了什么，还是你刚刚想到了一件旧事？',need?`${this.address()}今天更需要“${need}”，对吧。那我先不猜太远，你希望我听、问，还是陪你做一步？`:'我可以猜，但你大概又会说我太会观察。给我一个线索：这件事和人、学习，还是心情有关？']),'listening','open',['和人有关','和学习有关','和心情有关']);
 }
}
globalThis.CompanionDialogue=CompanionDialogue;
