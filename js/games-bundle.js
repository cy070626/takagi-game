/* js/puzzles.js */
// Original/adapted short puzzles. Cultural labels describe the format, not provenance.
window.TakagiPuzzles = [
  ['expert','中文灯谜','门外有三个开关，屋内有一盏由其中一个开关控制的白炽灯。只能进屋一次，怎样确定对应开关？',['逐个开关后立刻进屋','开一个几分钟后关掉，再开另一个进屋','同时打开两个开关'],1,'灯除了亮灭，还有温度信息。','先开甲几分钟后关掉，再开乙。进屋时灯亮对应乙；灭但热对应甲；灭且冷对应丙。'],
  ['expert','中文灯谜','9 枚外观相同的硬币中有 1 枚较重。无砝码天平最少称几次一定能找出？',['2','3','4'],0,'第一次分成三组，每组 3 枚。','3 对 3。重币在较重一组；若平则在剩余组。再从候选三枚中称 1 对 1，两次确定。一次称量只有三种结果，无法区分九枚。'],
  ['expert','中文灯谜','有 25 匹马，每次最多 5 匹赛跑，只知道每场相对名次且没有计时。至少赛几场能找出最快的 3 匹？',['6','7','8'],1,'先分五组赛，再让五个小组第一名比赛。','先赛5场分组，第6场让各组第一名比赛。由该场次序可排除大部分马，再让仍可能进入前三的5匹赛第7场即可确定。'],
  ['expert','中文灯谜','一根绳子绕地球赤道一圈后加长 2π 米，并均匀抬高。绳子离地约多高？',['约 1 米','约 6.28 米','取决于地球半径'],0,'比较 C=2πr 前后的半径差。','周长增加2π，半径增加量为2π÷2π=1米，与原半径无关。'],
  ['expert','日本语趣','10 人参加将棋循环赛，每两人恰好对局一次。总共进行多少局？',['45','50','90'],0,'每一局对应一对不同选手。','从10人中选2人，C(10,2)=45。'],
  ['expert','日本语趣','两班电车从 7:00 同时发车，甲每 14 分钟一班，乙每 20 分钟一班。下一次同时发车是几点？',['7:40','8:10','9:20'],2,'求14与20的最小公倍数。','最小公倍数为140分钟，7:00后140分钟是9:20。'],
  ['expert','日本语趣','数独某一行已有 1、2、3、4、5、6、7、8，最后一格只能填 9。这个结论单独使用了哪条约束？',['每行数字不重复且包含1至9','每列数字不重复','每个宫数字不重复'],0,'只看这一行就能确定。','仅凭该行缺少9即可确定，不需要列或宫的信息。'],
  ['expert','日本语趣','五种不同口味的和菓子排成一列，抹茶不能放两端，豆沙必须在芝麻左边。有多少种排法？',['24','36','48'],1,'先固定抹茶的位置，再利用豆沙与芝麻左右对称。','抹茶有3个中间位置；其余4种排列共4!=24，其中一半满足豆沙在芝麻左边，所以3×12=36。'],
  ['expert','逻辑推理','某病患病率 1%。检测灵敏度 99%，特异度 95%。随机一人检测阳性，其实际患病概率约为多少？',['16.7%','50%','95%'],0,'比较真阳性0.01×0.99与假阳性0.99×0.05。','真阳性比例0.0099，假阳性0.0495；后验概率0.0099÷0.0594约为1/6，即16.7%。'],
  ['expert','逻辑推理','三扇门后只有一份奖品。你选一扇后，知道答案的主持人从其余门中打开一扇空门，并允许换门。换门获奖概率是多少？',['1/3','1/2','2/3'],2,'第一次选中的概率仍是1/3。','初选正确概率1/3，主持人的动作会把初选错误的2/3概率集中到唯一未开的另一扇门。'],
  ['expert','逻辑推理','公平骰子反复投掷，直到第一次出现 6。所需投掷次数的期望是多少？',['5','6','7'],1,'成功概率为1/6的几何分布期望是1/p。','每次成功概率p=1/6，几何分布的期望等待次数为1/p=6。'],
  ['expert','逻辑推理','甲说“乙在说谎”；乙说“丙在说谎”；丙说“甲乙都在说谎”。三人中恰有一人说真话。谁说真话？',['甲','乙','丙'],1,'逐一假设真话者，检查另外两句。','乙真则丙假；丙说“甲乙都假”为假，且甲说乙说谎也为假，完全符合。其他假设会产生两句真话或矛盾。'],
  ['easy','中文灯谜','上面一片田，下面出力干。按字形打一字。',['男','苗','思'],0,'把田放在力的上面。','“男”字的上下结构分别为田和力。'],
  ['easy','日本语趣','日语 neko（ねこ）是猫。词卡顺序是 ne、ko、ne、ko，两个音为一组，可以读出几次 neko？',['1','2','4'],1,'从第一个音开始，每两个一组。','ne-ko / ne-ko，共两组，也就是两次。'],
  ['easy','逻辑推理','今天是周二，三天后的前一天是星期几？',['周三','周四','周五'],1,'三天后再退一天，相当于向后两天。','周二加两天，是周四。'],
  ['easy','逻辑推理','三杯茶每杯装 200 毫升，合并到一个容量 800 毫升的壶中，还能再装多少毫升？',['100','200','400'],1,'先算三杯茶的总量。','3×200＝600，800−600＝200 毫升。'],
  ['medium','中文灯谜','“木”字下方加一横、标出树根位置，得到哪个字？',['末','本','未'],1,'横的位置在木的下部。','本在木的下部加横；末与未的横在上部。'],
  ['medium','日本语趣','日语 asa（あさ）是早晨，ame（あめ）是雨。将 asa 的第二个假名换成 me（め），再重复整个词一次，得到什么？',['あめあめ','あさめ','めあめあ'],0,'先得到 a-me，再整体重复。','あさ→あめ→あめあめ。按题干给定的音进行两步操作。'],
  ['medium','逻辑推理','长方形周长 30 厘米，长比宽多 3 厘米。面积是多少平方厘米？',['45','54','60'],1,'长加宽是周长的一半。','长宽和为15、差为3，所以长9宽6，面积54。'],
  ['medium','逻辑推理','一本书页码从 1 标到 20，数字 1 一共出现几次？',['11','12','13'],1,'11 有两个 1。','个位为1的是1、11，共2次；十位为1的是10至19，共10次，总计12。'],
  ['hard','中文灯谜','两根香各自燃尽都需 60 分钟，但燃烧速度不均匀。可同时点燃任意端，用它们能准确量出 45 分钟吗？',['可以','不可以','必须知道长度'],0,'一根两头点，另一根只点一头。','第一根30分钟烧完，此时第二根剩30分钟的燃烧量。再点第二根另一头，15分钟烧完，共45分钟。假设各端点火无延迟。'],
  ['hard','日本语趣','夏日祭有 5 盏不同颜色的灯笼排一行，红灯必须在蓝灯左侧，但不要求相邻。有几种排列？',['24','60','120'],1,'交换每个排列中的红、蓝位置可以配对。','总数5!＝120，恰好一半红在蓝左边，所以60。'],
  ['hard','逻辑推理','从 1 到 100 的整数中，能被 3 或 5 整除的共有多少个？',['46','47','53'],1,'同时能被3和5整除的数被重复算了。','3的倍数33个，5的倍数20个，15的倍数6个，33＋20−6＝47。'],
  ['hard','逻辑推理','一个家庭恰有两个孩子，假定性别独立且男女等可能。已知较年长的是女孩，两个都是女孩的概率是多少？',['1/3','1/2','2/3'],1,'指定了年长者，年幼者性别仍独立。','年幼者为女孩的概率仍为1/2。注意这与“至少有一个女孩”的条件不同。'],
  ['easy','中文灯谜','两个月亮并排坐。按字形打一字。',['朋','明','昌'],0,'把两个“月”左右摆放。','“朋”由两个“月”并列构成。'],
  ['easy','中文灯谜','一人靠树歇一歇。按字形打一字。',['林','休','体'],1,'左边是单人旁，右边是木。','人靠着木，组合成“休”。'],
  ['easy','中文灯谜','日月同在。按字形打一字。',['旦','星','明'],2,'两部分左右相邻。','日与月合成“明”。'],
  ['easy','中文灯谜','大口套小口。按字形打一字。',['回','吕','品'],0,'小口在大口里面。','“回”的外框包着一个口。'],
  ['easy','日本语趣','日语里 pan（パン）是面包。哪一种带 pan 的东西不能吃？',['菠萝面包','furaipan（フライパン）','红豆面包'],1,'furaipan 是一种炊具。','フライパン是平底锅。这是利用词尾 pan 的经典日语谜语。'],
  ['easy','日本语趣','日语 kaki（かき）是柿子，kagi（かぎ）是钥匙。给第二个音 ki 加浊点变成 gi，结果是什么？',['柿子','钥匙','雨伞'],1,'变化的是第二个假名。','かき的き变成ぎ，得到かぎ，意思是钥匙。题干给出了所需词义。'],
  ['easy','日本语趣','日语 kasa（かさ）是伞，saka（さか）是坡。把 kasa 的两个假名倒过来是什么？',['坡','雨','花'],0,'交换 ka 和 sa 的顺序。','かさ倒序是さか，也就是坡。所需词义已在题目中给出。'],
  ['easy','日本语趣','夏日祭捞金鱼：池里原有 8 条，捞走 3 条，再放回 1 条，现在池里几条？',['4','6','5'],1,'放回的那条要加回去。','8−3＋1＝6。日本夏日祭情境的原创算术题。'],
  ['easy','逻辑推理','三人排队：小林在小陈前面，小陈在小周前面。谁在中间？',['小林','小周','小陈'],2,'把两个先后关系连起来。','顺序为小林、小陈、小周。'],
  ['easy','逻辑推理','盒中有红球 3 个、蓝球 2 个。闭眼最少拿几个，才能保证有两个同色？',['2','3','4'],1,'最不利的前两次会拿到不同颜色。','只有两种颜色，第三个必定与前两个中的一个同色。'],
  ['easy','逻辑推理','电车每隔 10 分钟发一班，第一班 8:00，第六班几点发？',['8:50','9:00','8:40'],0,'六班之间有几个间隔？','六班有五个间隔，5×10＝50 分钟。'],
  ['easy','逻辑推理','一个正方形剪去一个角，切口穿过该角相邻两条边的内部，剩下几条边？',['3','4','5'],2,'旧的两条边缩短，新增加一条切口。','原来的四条边仍有剩余，加上新切口，共五条。'],
  ['medium','中文灯谜','“日”字正中加一条竖线，竖线穿出上、下两边。打一字。',['田','申','由'],1,'区别在于竖线伸出哪一边。','上下都伸出是申；只上伸出是由；不伸出是田。'],
  ['medium','中文灯谜','“问”字中的“口”换成“心”。打一字。',['闷','闻','间'],0,'外面的门保持不变。','门内放心，组成“闷”。'],
  ['medium','中文灯谜','把“困”字中的“木”换成“人”。打一字。',['囚','因','内'],0,'保留四周完整的框。','四周的囗里面是人，构成“囚”。'],
  ['medium','中文灯谜','“古”字加一笔，成为一个和舌头有关的字。是哪一个？',['苦','舌','告'],1,'在十的上方增加一撇。','古的上方加一撇，形成“舌”。本题按楷书字形拆合。'],
  ['medium','日本语趣','日语中 ika（いか）是鱿鱼，kai（かい）是贝。先把 ika 倒序，再在末尾加 ka（か），得到哪个假名串？',['いかか','かかい','かいか'],2,'先得到 ka-i，再追加 ka。','いか→かい→かいか。这里考查假名顺序，无需猜词义。'],
  ['medium','日本语趣','神社石阶有 20 级。每次上 3 级后退 1 级，到顶就停。需要几次向上走？',['9','10','11'],1,'最后一次到顶不用后退。','前 9 次完整动作净升 18 级，第 10 次向上走时到顶。'],
  ['medium','日本语趣','夏日祭三个摊位顺序为章鱼烧、刨冰、套圈。你从刨冰开始，沿这个顺序循环，每到一个摊位记一次。第 8 次在哪？',['章鱼烧','刨冰','套圈'],2,'第 1 次已经是刨冰。','访问依次是刨冰、套圈、章鱼烧；8 除以 3 余 2，所以是套圈。'],
  ['medium','日本语趣','4×4 迷你数独：每行、每列及每个 2×2 宫都填 1 至 4 且不重复。第一行是 1、空、3、4，空格填几？',['2','3','4'],0,'先使用每行不重复的规则。','该行缺少 2。形式参考数独规则；这是入门规则检查题。'],
  ['medium','逻辑推理','三盒标签为“全苹果”“全橘子”“混合”，标签全部贴错。只从一盒拿一个水果就判断全部，应选哪盒？',['全苹果','全橘子','混合'],2,'写着混合的盒子实际上必定是单一水果。','从“混合”取出的水果确定该盒真实内容，再用其他两盒标签都错这一条件逐一确定。'],
  ['medium','逻辑推理','两枚公平硬币同时抛出。已知至少有一枚正面，两枚都是正面的概率是多少？',['1/2','1/3','1/4'],1,'列出满足条件的等可能结果。','满足条件的结果为正正、正反、反正，只有正正符合，共 1/3。'],
  ['medium','逻辑推理','书和笔共 11 元，书比笔贵 10 元。笔多少钱？',['1 元','0.5 元','1.5 元'],1,'设笔为 x 元，书是 x＋10 元。','2x＋10＝11，所以笔是 0.5 元，书是 10.5 元。'],
  ['medium','逻辑推理','甲比乙年长 4 岁，5 年后两人年龄和为 40。甲现在几岁？',['17','19','22'],0,'现在的年龄和要减去两人的五年。','现在和为 30，差为 4，甲为 (30＋4)÷2＝17。'],
  ['hard','中文灯谜','灯会有 100 盏灯，初始全灭。第 k 轮切换所有编号为 k 的倍数的灯，k 从 1 到 100。最后亮几盏？',['10','50','25'],0,'编号的因数个数什么时候为奇数？','仅完全平方数有奇数个因数，会被切换奇数次。1² 至 10² 共 10 盏。此题为灯会情境逻辑题。'],
  ['hard','中文灯谜','三张灯谜签分别写“奖品在甲”“奖品不在乙”“奖品不在甲”。恰好一句真，奖品在哪？',['甲','乙','丙'],1,'第一句与第三句必有一句真。','第一和第三句互相否定，已经占用唯一真话，因此第二句为假，奖品在乙。'],
  ['hard','中文灯谜','灯会卖票：成人票 8 元、儿童票 5 元。共卖出 20 张，收入 133 元。儿童票几张？',['9','11','7'],0,'先假设全部都是成人票。','全成人为 160 元，差 27 元，每换一张儿童票少 3 元，所以儿童票 9 张。'],
  ['hard','中文灯谜','一张谜签藏在 8 个相同信封之一，只有它使信封略重。用无砝码天平，最坏情况至少称几次能找出？',['2','3','4'],0,'先取 3 个对 3 个称。','若不平，从重侧 3 个取 1 对 1；若平，从剩下 2 个取 1 对 1。两次足够，一次最多区分三种结果，无法区分八个。'],
  ['hard','日本语趣','和菓子店有豆沙、抹茶、芝麻三种口味，同口味不区分。买 4 个且每种至少 1 个，有几种组合？',['3','6','12'],0,'先各拿一个，只剩一个名额。','剩余的 1 个有三种口味可选，所以三种组合。'],
  ['hard','日本语趣','电车 A 每 12 分钟发车，B 每 18 分钟发车。都在 8:00 发过车。8:00 之后、10:00 之前同时发车几次？',['2','3','4'],1,'先求 12 和 18 的最小公倍数。','每 36 分钟同时发车，分别为 8:36、9:12、9:48，共 3 次。'],
  ['hard','日本语趣','社团四人过桥，分别需 1、2、7、10 分钟。最多两人同行，按慢者计时，必须带唯一的灯，有人带灯返回。全部过桥最快几分钟？',['17','19','20'],0,'让最快的两人负责把灯送回，最慢的两人一起过。','1和2过耗2，1回耗1，7和10过耗10，2回耗2，1和2过耗2，总计17。将两个慢者分别护送需21分钟，合并更省。'],
  ['hard','日本语趣','和室座位排成一行。甲、乙、丙、丁四人入座，甲乙不能相邻，共有几种排列？',['8','12','16'],1,'从全排列中减去甲乙相邻。','总数4!＝24；甲乙作为整体有3!种，再乘内部2种，共12种相邻；剩12种。'],
  ['hard','逻辑推理','一枚公平骰子独立掷两次。已知点数和为 8，至少一次为 6 的概率是多少？',['1/3','2/5','1/2'],1,'满足和为 8 的有序对有五个。','(2,6)、(3,5)、(4,4)、(5,3)、(6,2)等可能，其中两对含6，所以2/5。'],
  ['hard','逻辑推理','四位密码不含 0、数字不重复且严格递增，从 1 至 9 中选。共有多少个密码？',['126','3024','84'],0,'每组选定的四个数字只对应一个递增顺序。','从9个数字选4个：9×8×7×6÷(4×3×2×1)＝126。'],
  ['hard','逻辑推理','甲乙各说一句话，且恰有一人说真话。甲：“乙做的。”乙：“我们俩都没做。”已知只有甲乙丙中的一人做了，能确定谁吗？',['甲','丙','无法确定'],2,'分别假设乙做、丙做，检查是否都满足。','乙做时甲真乙假；丙做时甲假乙真，两种都满足。甲做时两句全假，不满足。'],
  ['hard','逻辑推理','一个袋子装 4 个红球、3 个蓝球。无放回随机取 2 个，颜色相同的概率是多少？',['3/7','4/7','1/2'],0,'同为红的组合数加上同为蓝的组合数。','同色组合数为C(4,2)＋C(3,2)＝9，总组合数C(7,2)＝21，概率为3/7。']
].map(([level,category,q,choices,answer,hint,why],i)=>({id:`new-${i}`,level,category,q,choices,answer,hint,why}));

/* js/puzzles-extra.js */
window.TakagiPuzzles.push(
  {level:'medium',category:'脑筋急转弯',q:'5 台相同机器用 5 分钟做出 5 个零件。100 台机器做出 100 个零件需要多久？',choices:['5 分钟','20 分钟','100 分钟'],answer:0,hint:'先算每台机器做一个零件要多久。',why:'每台机器 5 分钟做 1 个零件，100 台并行仍只需 5 分钟。',source:'https://nrich.maths.org/problems/twisty-logic',sourceLabel:'NRICH 逻辑题型'},
  {level:'medium',category:'脑筋急转弯',q:'池塘里的浮萍每天覆盖面积翻倍，第 48 天刚好盖满池塘。哪一天盖了一半？',choices:['第 24 天','第 47 天','第 46 天'],answer:1,hint:'从盖满的前一天倒推。',why:'每天翻倍，所以盖满前一天正好是一半，即第47天。'},
  {level:'medium',category:'脑筋急转弯',q:'桌上有 3 个苹果，你拿走 2 个。你现在有几个苹果？',choices:['1 个','2 个','3 个'],answer:1,hint:'问的是你手里拥有的数量。',why:'你拿走的两个苹果在你手里，所以你有2个。'},
  {level:'medium',category:'脑筋急转弯',q:'鱼缸里有 10 条鱼，2 条“淹死”，3 条游到角落。鱼缸里还剩几条？',choices:['5 条','8 条','10 条'],answer:2,hint:'鱼不会因在水里而淹死，也没有离开鱼缸。',why:'所有鱼仍在鱼缸里，共10条。'},
  {level:'medium',category:'脑筋急转弯',q:'一只狗朝森林深处跑。它最多能跑进森林多远？',choices:['跑完整片森林','跑到森林正中间','取决于体力'],answer:1,hint:'过了中点以后，它跑的方向相对于森林变了。',why:'到中点之前是在跑进森林，过了中点就是在跑出森林。'},
  {level:'medium',category:'脑筋急转弯',q:'有一个问题，你在清醒时不能诚实地回答“是”。它是什么？',choices:['你睡着了吗','你饿了吗','你认识我吗'],answer:0,hint:'回答本身证明了你处于什么状态。',why:'能够清醒回答，就说明没有睡着。'},
  {level:'hard',category:'脑筋急转弯',q:'球拍和球共 1.10 元，球拍比球贵 1 元。球多少钱？',choices:['0.05 元','0.10 元','0.15 元'],answer:0,hint:'设球为 x，球拍为 x＋1。',why:'2x＋1＝1.10，所以球是0.05元，球拍是1.05元。'},
  {level:'hard',category:'脑筋急转弯',q:'医生给你 3 片药，要求每隔 30 分钟吃 1 片。从第一片到吃完共经过多久？',choices:['60 分钟','90 分钟','120 分钟'],answer:0,hint:'第一片在起点立即吃。',why:'第0分钟、第30分钟和第60分钟各吃一片，共经过60分钟。'},
  {level:'hard',category:'脑筋急转弯',q:'一只钟敲 6 下用了 5 秒。按相同节奏敲 12 下需要多久？',choices:['10 秒','11 秒','12 秒'],answer:1,hint:'敲6下只有5个时间间隔。',why:'每个间隔1秒；敲12下有11个间隔，需要11秒。'},
  {level:'hard',category:'脑筋急转弯',q:'蜗牛爬 10 米高的墙，白天上升 3 米，夜里下滑 2 米。第几天到顶？',choices:['第 7 天','第 8 天','第 10 天'],answer:1,hint:'到顶后的那个夜晚不再下滑。',why:'第7夜后在7米，第8天上升3米到顶，因此是第8天。'},
  {level:'hard',category:'脑筋急转弯',q:'一场会议从 9:00 开始，每 50 分钟讨论后休息 10 分钟。第三次讨论结束是几点？',choices:['11:30','11:50','12:00'],answer:1,hint:'第三次讨论结束前只经历两次休息。',why:'三段讨论共150分钟，两次休息共20分钟，总计170分钟，即11:50。'},
  {level:'hard',category:'脑筋急转弯',q:'一个家庭有两个孩子。已知较年长的是女孩，年幼者为女孩的概率是多少？',choices:['1/3','1/2','2/3'],answer:1,hint:'年长者的信息不会改变年幼者的独立性。',why:'年幼者性别仍然等可能，因此概率为1/2。',source:'https://nrich.maths.org/articles/why-do-people-find-probability-unintuitive-and-difficult',sourceLabel:'NRICH 概率讨论'},
  {level:'expert',category:'脑筋急转弯',q:'有 1000 瓶药，其中 1 瓶有毒。毒性在一天后显现，有 10 只实验鼠且只能测试一轮。能否确定毒药？',choices:['可以，最多可区分1024瓶','不可以，至少需要100只鼠','只能缩小到10瓶'],answer:0,hint:'每只鼠只有“有反应/无反应”两种结果，把瓶号写成二进制。',why:'10只鼠产生2¹⁰＝1024种结果。按瓶号二进制位安排取样，一天后反应组合唯一对应瓶号。'},
  {level:'expert',category:'脑筋急转弯',q:'两扇门中一扇安全。守卫甲永远说真话，乙永远说假话，但你不知道谁是谁，只能问其中一人一个问题。问什么能找到安全门？',choices:['问“另一人会说哪扇安全”，然后选相反的门','问“你是真话者吗”','任意问一扇是否安全'],answer:0,hint:'让真假两人给出同一个错误指向。',why:'问任何一人“另一人会指哪扇安全门”，真话者会转述假话，假话者会扭曲真话，两者都会指向危险门。因此选择另一扇。'},
  {level:'expert',category:'脑筋急转弯',q:'100 名乘客依次登机。第一人随机坐座位，之后每人若自己的座位空着就坐自己的，否则随机坐空位。最后一人坐到自己座位的概率是多少？',choices:['1/100','1/2','99/100'],answer:1,hint:'过程最终只取决于“第一人的座位”和“最后一人的座位”谁先被随机选中。',why:'每次冲突都会把随机选择传递下去，直到选中第一人或最后一人的座位；两者对称，所以概率为1/2。'},
  {level:'expert',category:'脑筋急转弯',q:'两个沙漏分别计时 7 分钟和 11 分钟。怎样从同时开始准确量出 15 分钟？',choices:['11分钟漏完时翻转7分钟沙漏','7分钟漏完翻7分钟；11分钟漏完再翻7分钟','只翻11分钟沙漏一次'],answer:1,hint:'观察第11分钟时，7分钟沙漏上下两层各有多少分钟的沙。',why:'0分钟同时开始；7分钟时翻转7分钟沙漏。到11分钟，它又漏了4分钟，下层有4分钟的沙。此时再次翻转，4分钟后刚好到第15分钟。'},
  {level:'expert',category:'脑筋急转弯',q:'一枚硬币连续出现 9 次正面。若硬币公平，第 10 次出现正面的概率是多少？',choices:['小于1/2','等于1/2','大于1/2'],answer:1,hint:'独立试验没有记忆。',why:'过去结果不改变下一次公平投掷的概率，第10次仍为1/2。'},
  {level:'expert',category:'脑筋急转弯',q:'袋中有红球和蓝球。随机取两球，同色概率为 1/2。仅凭这句话能确定两种球各有多少个吗？',choices:['能，必为各2个','能，必为3红1蓝','不能，可能有多组数量'],answer:2,hint:'尝试总数为4和5的不同配置。',why:'条件只给出一个概率方程，可能存在不同整数解；没有总球数时无法唯一确定。'},
  {level:'medium',category:'猜谜底',q:'我有很多“键”，却打不开任何一把锁；我有“空格”，却没有房间。我是什么？',choices:['键盘','地图','钢琴'],answer:0,hint:'“空格”也是一个按键名称。',why:'键盘有按键和空格键，却不开锁也没有房间。'},
  {level:'medium',category:'猜谜底',q:'我有城市却没有房屋，有河流却没有水，有道路却没有车。我是什么？',choices:['地图','梦','书架'],answer:0,hint:'这些事物以符号的形式出现。',why:'地图标示城市、河流和道路，但不包含实体。',source:'https://www.gutenberg.org/ebooks/36571',sourceLabel:'Project Gutenberg 谜语传统'},
  {level:'medium',category:'猜谜底',q:'我有眼却看不见，有身体却没有骨头，常带着线穿过布。我是什么？',choices:['针','纽扣','剪刀'],answer:0,hint:'“眼”是穿线的小孔。',why:'针眼用于穿线，针身没有骨头。'},
  {level:'medium',category:'猜谜底',q:'我有颈却没有头，肚子里能装水。猜一件物品。',choices:['瓶子','水壶','杯子'],answer:0,hint:'瓶颈是它的一部分。',why:'瓶子有瓶颈和瓶身，没有真正的头。'},
  {level:'medium',category:'猜谜底',q:'我有脊背却没有骨头，打开以后能带你去许多地方。我是什么？',choices:['书','椅子','道路'],answer:0,hint:'装订处常被称为“书脊”。',why:'书有书脊，内容能把读者带入不同地点和时代。'},
  {level:'medium',category:'猜谜底',q:'我有许多牙齿，每天沿着一条轨道走，却从不吃东西。我是什么？',choices:['拉链','梳子','齿轮'],answer:0,hint:'两排牙齿合上以后，衣物就闭合了。',why:'拉链的链牙沿拉链轨道咬合。'},
  {level:'hard',category:'猜谜底',q:'没有嘴却能回答你，没有耳朵却只在听见你后出现。我是什么？',choices:['回声','影子','倒影'],answer:0,hint:'它重复声音。',why:'回声由声音反射形成，仿佛在回答。'},
  {level:'hard',category:'猜谜底',q:'你从我这里拿走得越多，留在身后的我反而越多。我是什么？',choices:['脚印','时间','空气'],answer:0,hint:'每走一步就会增加一个。',why:'走得越多，身后留下的脚印越多。'},
  {level:'hard',category:'猜谜底',q:'我出生时很高，活得越久越矮；我能带来光，也会留下眼泪。我是什么？',choices:['蜡烛','冰柱','树木'],answer:0,hint:'“眼泪”会凝固在身体旁。',why:'蜡烛燃烧时逐渐变短，蜡油像眼泪。'},
  {level:'hard',category:'猜谜底',q:'我总在你前面，却永远不会来到；每天过去，我的名字都会换成另一天。我是什么？',choices:['明天','影子','未来'],answer:0,hint:'它一旦来到，就有了新的名字。',why:'明天到来时就成为今天，新的明天仍在前方。'},
  {level:'hard',category:'猜谜底',q:'我能填满整个房间，却不占用房间里的空间。我是什么？',choices:['光','空气','声音'],answer:0,hint:'开灯后它立刻到达各处。',why:'光可以照亮整个房间，却不挤占物体所占空间。'},
  {level:'hard',category:'猜谜底',q:'我被开采出来，关进木头里，此后很少重见天日，却几乎每天被人使用。我是什么？',choices:['铅笔芯里的石墨','木炭','铁钉'],answer:0,hint:'它会在纸上留下痕迹。',why:'石墨来自矿物，被封在木质铅笔中并用于书写。',source:'https://www.gutenberg.org/ebooks/36571',sourceLabel:'Project Gutenberg 谜语传统'},
  {level:'expert',category:'猜谜底',q:'一个英文单词有 5 个字母，依次去掉 4 个字母后，读音仍与原词相同。它是什么？',choices:['queue','quiet','quite'],answer:0,hint:'最后只剩下字母 Q。',why:'queue 读作字母Q的音；依次去掉末尾字母，最终剩Q，读音仍相同。这是一道英文拼写谜。'},
  {level:'expert',category:'猜谜底',q:'哪个英文单词包含连续三组双写字母？',choices:['bookkeeper','committee','mississippi'],answer:0,hint:'观察 oo、kk、ee。',why:'bookkeeper 中连续出现 oo、kk、ee 三组双写字母。'},
  {level:'expert',category:'猜谜底',q:'英文中，正着读表示“重量单位”，倒着读表示“没有”。是哪一个词？',choices:['ton','gram','ounce'],answer:0,hint:'把三个字母倒序。',why:'ton 是吨，倒序为 not，表示“不”或“没有”。'},
  {level:'expert',category:'猜谜底',q:'“一人一张口，口下长只手”。按汉字结构打一字。',choices:['拿','合','拾'],answer:0,hint:'上部是“合”，下部是“手”。',why:'人、一、口组成“合”，合下加手成为“拿”。',source:'https://arxiv.org/abs/2206.13778',sourceLabel:'CC-Riddle 字谜研究'},
  {level:'expert',category:'猜谜底',q:'“一口咬掉牛尾巴”。按增减字形打一字。',choices:['告','先','午'],answer:0,hint:'把“牛”的尾部去掉，再加一个“口”。',why:'牛字去掉下方竖尾，再与口组合，形成“告”。'},
  {level:'expert',category:'猜谜底',q:'日语中 pan（パン）是面包。哪一种 pan 可以煎鸡蛋，却不能当面包吃？',choices:['furaipan（フライパン，平底锅）','anpan（あんパン，红豆面包）','shokupan（食パン，吐司）'],answer:0,hint:'这个外来语完整写作 fry pan。',why:'フライパン来自英语 fry pan，意思是平底锅。它以パン结尾，却不是面包，属于日语词尾双关。',source:'https://www.city.suwa.lg.jp/uploaded/attachment/47255.pdf',sourceLabel:'日本学校谜语活动'}
);

window.TakagiPuzzles.push(
  {level:'medium',category:'日本语趣',q:'朋友说「駅のはしで待っている」。如果汉字写作「端」，他最可能在哪里等？',choices:['车站边缘或一端','车站的桥上','拿着筷子的地方'],answer:0,hint:'同音词要看汉字和地点关系。',why:'「端」读作 hashi，表示边缘或一端。「橋」是桥，「箸」是筷子。'},
  {level:'medium',category:'日本语趣',q:'「放課後、家にかえる」里的 kaeru 最合适写成哪个汉字？',choices:['帰る','蛙','変える'],answer:0,hint:'前面有目的地「家に」。',why:'「家に帰る」表示回家。蛙是青蛙，変える表示改变。'},
  {level:'medium',category:'日本语趣',q:'只听到一个词「ame」，没有上下文，能确定说的是雨还是糖吗？',choices:['能，一定是雨','能，一定是糖','不能，要靠音调或上下文'],answer:2,hint:'日语里存在同音或近同音词。',why:'雨「雨」与糖「飴」都可写作 ame。实际交流常依靠音调和上下文区分。'},
  {level:'medium',category:'日本语趣',q:'下面哪一句正好有五个日语拍，适合作为五七五开头？',choices:['なつのそら','あおいなつぞら','ゆうぐれのそら'],answer:0,hint:'按假名发音单位逐个数。',why:'な・つ・の・そ・ら共五拍。另两项都超过五拍。'},
  {level:'medium',category:'日本语趣',q:'下面哪一个日语词从前往后和从后往前读都相同？',choices:['しんぶんし','ほうかご','なつまつり'],answer:0,hint:'逐个假名倒过来读。',why:'し・ん・ぶ・ん・し倒序仍是し・ん・ぶ・ん・し，是常见的回文结构。'},
  {level:'medium',category:'日本语趣',q:'想表达“在车站等”，下面哪一句使用地点助词最自然？',choices:['駅で待つ','駅を待つ','駅が待つ'],answer:0,hint:'等待这个动作发生在车站。',why:'动作发生的地点常用「で」，所以「駅で待つ」最自然。'},
  {level:'hard',category:'日本语趣',q:'在理发店听到「かみを切ります」。这里的 kami 最合理指什么？',choices:['头发','纸','神明'],answer:0,hint:'地点会缩小同音词的解释范围。',why:'在理发店的语境中，「髪を切ります」表示剪头发。语境排除了另外两个同音词。'},
  {level:'hard',category:'逻辑推理',q:'教室一排有窗边、中间、走道三个座位，春、由纪、美咲各坐一处。由纪不坐窗边；春坐在窗边座位的旁边；美咲不坐中间。谁坐窗边？',choices:['春','由纪','美咲'],answer:2,hint:'窗边座位只有中间座位与它相邻。',why:'春必须坐中间。由纪不坐窗边，只能坐走道，因此美咲坐窗边。'},
  {level:'hard',category:'逻辑推理',q:'四位同学在文化祭各给其他每个人写一张便笺，每两人之间只交换一次。总共有多少次交换？',choices:['4 次','6 次','12 次'],answer:1,hint:'计算不分方向的两人组合。',why:'从4人中任选2人，共 C(4,2)=6 组，因此有6次交换。'},
  {level:'hard',category:'逻辑推理',q:'七夕有红、蓝、白、金四种短册。任选两种不同颜色挂在一起，不计左右顺序，共有多少种搭配？',choices:['4 种','6 种','12 种'],answer:1,hint:'第一种和第二种对调不产生新搭配。',why:'不计顺序时是组合数 C(4,2)=6。'},
  {level:'expert',category:'日本语趣',q:'把「きつつき」逐个假名倒序，得到什么？',choices:['きつつき','つきつき','ききつつ'],answer:0,hint:'写成 き・つ・つ・き 再倒过来。',why:'倒序仍是 き・つ・つ・き，因此它构成回文。词义是啄木鸟。'},
  {level:'expert',category:'逻辑推理',q:'夏日祭有三只纸袋，分别贴着“苹果糖”“金鱼”“两样都有”，三个标签全贴错。你只能从一只袋里摸出一样东西。应先摸哪只袋？',choices:['标“两样都有”的袋','标“苹果糖”的袋','任意一袋都一样'],answer:0,hint:'全贴错意味着“两样都有”标签下不可能是混合袋。',why:'先从标“两样都有”的袋摸。摸到什么，该袋就只能装那一种；再利用另外两个标签也都错误，便可依次确定其余两袋。'}
);

window.TakagiPuzzles.push(
  {level:'hard',category:'逻辑推理',q:'三人甲、乙、丙分别说：“甲：乙在说谎。乙：丙在说谎。丙：甲和乙都在说谎。”已知三人中恰有一人说真话，谁说真话？',choices:['甲','乙','丙'],answer:1,hint:'分别假设三人的话为真，检查是否只剩一真。',why:'乙说真则丙说假，甲“乙说谎”也为假，正好只有乙为真。'},
  {level:'hard',category:'逻辑推理',q:'四张卡片一面是字母、一面是数字。桌上显示 A、D、4、7。规则是“若一面是元音字母，另一面必须是偶数”。至少翻哪两张才能检验规则？',choices:['A 和 4','A 和 7','D 和 4'],answer:1,hint:'找可能直接推翻规则的组合。',why:'要翻A确认背面不是奇数，也要翻7确认背面不是元音。D和4都无法反证该规则。'},
  {level:'hard',category:'逻辑推理',q:'一张纸对折三次后打一个孔，完全展开后最多有几个孔？',choices:['4 个','6 个','8 个'],answer:2,hint:'每次对折使纸层数翻倍。',why:'三次对折形成 2³＝8 层。若孔不在折线处，展开后最多出现8个孔。'},
  {level:'hard',category:'脑筋急转弯',q:'有 9 个外观相同的球，其中一个较重。用天平最少称几次一定找出它？',choices:['1 次','2 次','3 次'],answer:1,hint:'每次称量有三种结果。',why:'一次可把9球分成3组，每组3球；先称两组，再从可疑3球中称两个，最多2次。'},
  {level:'expert',category:'逻辑推理',q:'某岛居民要么永远说真话，要么永远说假话。你遇到两人，A说“我们俩类型相同”，B保持沉默。A是？',choices:['真话者','假话者','无法确定'],answer:2,hint:'A的说法在两种组合下都可能成立。',why:'若A真，则两人同为真话者；若A假，则两人不同且B为真话者。两种都自洽，信息不足。'},
  {level:'expert',category:'逻辑推理',q:'盒中有红蓝两类卡。抽一张后看见正面是红色，已知每张卡两面颜色独立且四种组合数量相等。它另一面是红色的概率是多少？',choices:['1/4','1/3','1/2'],answer:2,hint:'已看到一面红时，可能来自 RR、RB、BR 三类“红面”。',why:'按看到的红色面计数，RR贡献两面，RB与BR各贡献一面，共4个红面，其中2个来自RR，所以概率为1/2。'},
  {level:'medium',category:'日本语趣',q:'日语里“雨”读作 ame，“糖”读作 ame。若朋友说“雨が好き”，通常是在说什么？',choices:['喜欢下雨','喜欢糖果','两者都可'],answer:0,hint:'句中的 が 常连接主语和喜欢。',why:'“雨が好き”直译为“喜欢雨”。糖果一般会结合食べる等动词或更具体语境说明。'},
  {level:'medium',category:'中文灯谜',q:'“一边是水，一边是山，猜一汉字。”按偏旁结构猜一字。',choices:['汕','仙','江'],answer:0,hint:'左边三点水，右边是山。',why:'三点水加山构成“汕”。'},
  {level:'hard',category:'中文灯谜',q:'“有口难言，欲走还留”。按字形和语义猜一字。',choices:['闷','问','困'],answer:0,hint:'把“心”放进“门”里。',why:'“门”中有“心”为“闷”，对应有话难说、心里堵住的状态。'},
  {level:'hard',category:'猜谜底',q:'我有十三颗心，却没有肺和血液；我常被洗牌，也能决定一局的走向。我是什么？',choices:['一副扑克牌','一串项链','一把钥匙'],answer:0,hint:'“心”指一种花色。',why:'一副扑克牌有13张红心牌，没有真实器官。'},
  {level:'expert',category:'猜谜底',q:'我能把“今天”带到昨天，把“明天”带到今天，却从不移动时间。我是什么？',choices:['日历','时区','照片'],answer:1,hint:'跨过经度线会改变日期。',why:'跨越国际日期变更线会改变当地日期标签，时间连续流逝本身没有被移动。'},
  {level:'expert',category:'日本语趣',q:'日语中「生」可读 sei、shou、nama 等。菜单写着「生ビール」时最合适的读法和意思是？',choices:['sei biiru，生物啤酒','nama biiru，生啤酒','shou biiru，小杯啤酒'],answer:1,hint:'它常用于表示未经加热处理的饮品。',why:'「生ビール」读作 nama biiru，通常指生啤酒。多读音汉字必须依靠词语和语境判断。'}
);

/* js/leisure.js */
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
    if(theaterModal.open)theaterModal.close();
    document.body.classList.remove('music-theater-open');
    if(stop){theaterFrame.src='about:blank';theaterModal.remove();theaterModal=null;theaterFrame=null;openTheater.textContent='♫ 进入音乐小剧场'}
    else openTheater.textContent='♫ 继续音乐小剧场';
  }
  function showTheater(){
    if(!theaterModal){
      theaterModal=document.createElement('dialog');theaterModal.className='music-theater-modal';theaterModal.setAttribute('aria-label','音乐小剧场');
      theaterFrame=document.createElement('iframe');theaterFrame.src='./pages/music-theater.html?v=2';theaterFrame.title='高木同学音乐小剧场';theaterFrame.loading='eager';theaterFrame.allow='autoplay; encrypted-media; fullscreen; picture-in-picture';theaterFrame.setAttribute('allowfullscreen','');
      theaterModal.append(theaterFrame);document.body.append(theaterModal);
      theaterModal.addEventListener('cancel',event=>{event.preventDefault();closeTheater(false)});
    }
    document.body.classList.add('music-theater-open');theaterModal.showModal();
  }
  openTheater.onclick=showTheater;
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==theaterFrame?.contentWindow||event.data?.type!=='takagi-music-theater')return;
    const data=event.data;
    if(data.sceneTitle){sceneName.textContent=data.sceneTitle;sceneTrack.textContent=`${data.trackTitle} · ${data.artist}`;sceneImage.src=data.thumb;save('takagi-music-title',data.sceneTitle);save('takagi-music-track-title',sceneTrack.textContent);save('takagi-music-thumb',data.thumb);globalThis.TakagiVisitMemory?.record('音乐',data.sceneTitle,sceneTrack.textContent)}
    if(data.action==='minimize')closeTheater(false);else if(data.action==='stop-close')closeTheater(true);
  });
  area.append(arcade,games,music);$('.interactions').after(area);
  window.addEventListener('pagehide',()=>{if(theaterFrame)theaterFrame.src='about:blank'});
})();

/* js/arcade-v2.js */
(() => {
  const shelf = document.querySelector('.arcade-shelf');
  if (!shelf) return;
  const make = (tag, text = '', cls = '') => { const node = document.createElement(tag); if (text) node.textContent = text; if (cls) node.className = cls; return node };
  const shuffle = values => { const out = [...values]; for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]] } return out };
  let reactionLine = null;
  const say = (text, mood = 'playful') => {
    if (reactionLine) {
      reactionLine.dataset.mood = mood;
      reactionLine.textContent = `高木：${text}`;
      reactionLine.animate?.([{ opacity:.45, transform:'translateY(3px)' }, { opacity:1, transform:'translateY(0)' }], { duration:220, easing:'ease-out' });
    }
    try { if (typeof speak === 'function') speak(text, mood) } catch {}
  };
  const read = key => { try { return localStorage.getItem(key) || '' } catch { return '' } };
  const write = (key, value) => { try { localStorage.setItem(key, value) } catch {} };
  const levels = { easy: '入门', medium: '进阶', hard: '成人挑战', expert: '高阶' };
  const levelOrder = { easy: 0, medium: 1, hard: 2, expert: 3 };
  let difficulty = read('takagi-arcade-difficulty') || (typeof profile !== 'undefined' && levels[profile.difficulty] ? profile.difficulty : 'medium');
  const info = {
    code: { name: '数字密码', icon: '0·1', mode: '本地', time: '2–5 分钟', brief: '用位置反馈排除四位密码。' },
    words: { name: '禁止词', icon: '言', mode: '本地', time: '2–4 分钟', brief: '绕开诱导词完成五轮回答。' },
    gomoku: { name: '五子棋', icon: '●', mode: '本地', time: '3–8 分钟', brief: '在 9×9 棋盘和高木对弈。' },
    harmony: { name: '默契二选一', icon: '♡', mode: '本地', time: '2–3 分钟', brief: '同时选择，看看彼此会不会想到一起。' },
    truth: { name: '真假捉弄', icon: '?', mode: '本地', time: '3–5 分钟', brief: '找出三句话中唯一不成立的一句。' },
    chain: { name: '中日词语接龙', icon: 'し', mode: '本地', time: '3–6 分钟', brief: '选择中文或日语假名，与高木轮流接词。' },
    memory: { name: '记忆翻牌', icon: '▦', mode: '本地', time: '2–5 分钟', brief: '记住校园与季节图案的位置并完成配对。' },
    lateral: { name: '一句话推理', icon: '…', mode: '本地 / 多引擎 AI', time: '5–10 分钟', brief: '通过是非问题还原反常情境的真相。' },
    mind: { name: '猜心对决', icon: '心', mode: '独立玩法', time: '5–10 分钟', brief: '观察选项与反应，在误导中猜中高木的想法。', external: './games/mind-duel.html?v=74' },
    eraser: { name: '橡皮对决', icon: '橡', mode: '独立玩法', time: '3–8 分钟', brief: '控制力度和方向，把橡皮弹向得分区域。', external: './games/eraser-duel.html?v=61' }
  };
  const keys = Object.keys(info);
  let scores;
  try { scores = JSON.parse(read('takagi-arcade-score-v2') || '{}') } catch { scores = {} }
  if (!scores || typeof scores !== 'object') scores = {};
  keys.forEach(key => { if (!scores[key]) scores[key] = { played: 0, wins: 0, losses: 0, draws: 0 } });
  const saveScores = () => write('takagi-arcade-score-v2', JSON.stringify(scores));
  const record = (key, result) => { const item = scores[key]; item.played++; if (result === 'win') item.wins++; else if (result === 'loss') item.losses++; else item.draws++; saveScores(); paintScore(); globalThis.TakagiVisitMemory?.record('游戏', `${info[key].name}完成一局`, `${levels[difficulty]} · ${result}`) };

  shelf.replaceChildren();
  const summary = document.createElement('summary');
  summary.append(make('strong', '和高木玩一局'), make('span', '10 个可运行游戏 · 本地玩法与 AI 推理可选'), make('em', '展开'));
  const body = make('div', '', 'arcade-body arcade-v2');
  const top = make('div', '', 'arcade-toolbar');
  const difficultyLabel = make('label', '统一难度');
  const difficultySelect = document.createElement('select');
  difficultySelect.setAttribute('aria-label', '小游戏统一难度');
  Object.entries(levels).forEach(([value, label]) => { const option = make('option', label); option.value = value; difficultySelect.append(option) });
  difficultySelect.value = difficulty;
  difficultyLabel.append(difficultySelect);
  const overviewButton = make('button', '玩法总览'); overviewButton.type = 'button';
  const statsButton = make('button', '我的战绩'); statsButton.type = 'button';
  const randomButton = make('button', '随机一局'); randomButton.type = 'button';
  const topActions = make('div', '', 'arcade-toolbar-actions'); topActions.append(randomButton, statsButton, overviewButton);
  top.append(difficultyLabel, topActions);
  const scoreLine = make('small', '', 'arcade-score'); scoreLine.setAttribute('role', 'status');
  const tabs = make('div', '', 'arcade-tabs arcade-game-grid');
  const stage = make('div', '', 'arcade-stage');
  reactionLine = make('div', '高木：选一个吧。规则我会说清楚，输赢也会认真记。', 'arcade-reaction');
  reactionLine.setAttribute('role', 'status');
  body.append(make('p', '统一难度对标准小游戏生效；猜心对决与橡皮对决保留各自设置。切换游戏会保留本次页面中的进度；智能模式优先调用千问，失败时依次尝试备用引擎。', 'arcade-intro'), top, tabs, scoreLine, reactionLine, stage);
  shelf.append(summary, body);

  let active = keys.includes(read('takagi-arcade-last-game')) ? read('takagi-arcade-last-game') : 'harmony';
  const states = {};
  function paintScore() {
    const total = Object.values(scores).reduce((sum, item) => sum + Number(item.played || 0), 0);
    const wins = Object.values(scores).reduce((sum, item) => sum + Number(item.wins || 0), 0);
    const rate = total ? Math.round(wins / total * 100) : 0;
    scoreLine.textContent = total ? `本设备记录：${total} 局 · 获胜 ${wins} 局 · 胜率 ${rate}% · 当前难度：${levels[difficulty]}` : `本设备暂无对局记录 · 当前难度：${levels[difficulty]}`;
  }
  function button(label, fn, cls = '') { const node = make('button', label, cls); node.type = 'button'; node.onclick = fn; return node }
  function heading(key, rule) {
    const head = make('div', '', 'arcade-game-head');
    const title = make('div', '', 'arcade-title-line');
    title.append(make('h3', info[key].name), make('span', info[key].mode, info[key].mode.includes('AI') ? 'game-badge ai' : 'game-badge local'), make('span', info[key].external ? '自带设置' : levels[difficulty], 'game-badge'));
    const rules = make('details', '', 'game-rules');
    rules.append(make('summary', '查看完整规则'), make('p', rule));
    head.append(title, make('p', info[key].brief, 'game-lead'), make('small', `预计 ${info[key].time}`, 'game-subline'), rules);
    return head;
  }
  function status(text) { const node = make('p', text, 'arcade-status'); node.setAttribute('role', 'status'); return node }
  function progress(current, total, label = '') { const safe = Math.min(current,total), name = label || '本局进度'; const wrap = make('div', '', 'game-progress'); const line = make('div', '', 'game-progress-line'); line.append(make('span', name), make('b', `${safe} / ${total}`)); const track = make('div', '', 'game-progress-track'), bar = make('i'); track.setAttribute('role', 'progressbar'); track.setAttribute('aria-label', name); track.setAttribute('aria-valuemin', '0'); track.setAttribute('aria-valuemax', String(total)); track.setAttribute('aria-valuenow', String(safe)); bar.style.width = `${total ? Math.min(100, Math.round(safe / total * 100)) : 0}%`; track.append(bar); wrap.append(line, track); return wrap }
  function finishCard(title, text, actionText, action) { const box = make('div', '', 'game-finish'); const actions = make('div', '', 'arcade-actions'); actions.append(button(actionText, action, 'setting'), button('换个游戏', () => { tabs.scrollIntoView({ behavior:'smooth', block:'center' }); tabs.querySelector('button')?.focus(); say('好，这一局先记下。再挑一个。', 'warm') })); box.append(make('span', 'RESULT', 'game-finish-kicker'), make('h4', title), make('p', text), actions); return box }
  function resetActive() { delete states[active]; render(active) }
  difficultySelect.onchange = () => { difficulty = difficultySelect.value; write('takagi-arcade-difficulty', difficulty); if (!info[active].external) delete states[active]; paintScore(); render(active); say(info[active].external ? `统一难度调成${levels[difficulty]}。当前独立游戏仍使用自己的设置。` : `难度调成${levels[difficulty]}。这一局重新开始。`, 'warm') };

  function openOverview() {
    const wrap = make('div', '', 'game-overview');
    wrap.append(make('p', '八项游戏都有明确结束条件，可以随时退出或重新开始。成绩只保存在当前浏览器。'));
    keys.forEach(key => { const card = make('section', '', 'game-overview-card'); const line = make('div', '', 'arcade-title-line'); line.append(make('h3', `${info[key].icon} ${info[key].name}`), make('span', info[key].mode, info[key].mode.includes('AI') ? 'game-badge ai' : 'game-badge local')); card.append(line, make('p', info[key].brief), make('small', `预计 ${info[key].time}`)); wrap.append(card) });
    wrap.append(make('h3', '四档难度'), make('p', '入门提供更多提示和更短局数；进阶保持平衡；成人挑战增加题量和判断干扰；高阶减少提示并提高对手策略。'));
    if (typeof openDialog === 'function') openDialog('小游戏玩法总览', wrap);
  }
  overviewButton.onclick = openOverview;
  function openStats() {
    const wrap = make('div', '', 'arcade-stats');
    const total = Object.values(scores).reduce((sum, item) => sum + Number(item.played || 0), 0);
    const wins = Object.values(scores).reduce((sum, item) => sum + Number(item.wins || 0), 0);
    const hero = make('div', '', 'arcade-stats-hero');
    hero.append(make('strong', String(total)), make('span', '累计对局'), make('strong', total ? `${Math.round(wins / total * 100)}%` : '0%'), make('span', '当前胜率'));
    wrap.append(hero);
    keys.forEach(key => { const item = scores[key], card = make('section', '', 'arcade-stat-card'); card.append(make('b', `${info[key].icon} ${info[key].name}`), make('span', info[key].external ? '独立结算' : `${item.played} 局`), make('small', info[key].external ? '成绩显示在游戏内部' : `胜 ${item.wins} · 负 ${item.losses} · 平 ${item.draws}`)); wrap.append(card) });
    wrap.append(make('p', '战绩保存在当前浏览器，清理浏览器数据后会重新统计。', 'arcade-stat-note'));
    if (typeof openDialog === 'function') openDialog('我的小游戏战绩', wrap);
  }
  statsButton.onclick = openStats;
  randomButton.onclick = () => { const choices = keys.filter(key => key !== active); const key = choices[Math.floor(Math.random() * choices.length)] || 'harmony'; render(key); tabs.querySelector(`[data-game="${key}"]`)?.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' }); say(`随机抽到“${info[key].name}”。这一局就玩它。`, 'playful') };

  function renderCode() {
    if (!states.code) states.code = { secret: shuffle('0123456789'.split('')).slice(0, 4).join(''), attempts: [], over: false, recorded: false };
    const s = states.code, limit = [10, 8, 7, 6][levelOrder[difficulty]];
    stage.replaceChildren(heading('code', `四个数字互不重复，可以包含 0。输入后会显示“位置正确”和“数字正确”。本档最多猜 ${limit} 次。`));
    stage.append(status(s.over ? `答案是 ${s.secret}。` : `还可以猜 ${limit - s.attempts.length} 次。`), progress(s.attempts.length, limit, '尝试次数'));
    const form = document.createElement('form'); form.className = 'code-form';
    const input = document.createElement('input'); input.inputMode = 'numeric'; input.maxLength = 4; input.placeholder = '例如 5072'; input.disabled = s.over; input.setAttribute('aria-label', '输入四位数字密码');
    const submit = make('button', '确认猜测'); submit.type = 'submit'; submit.disabled = s.over; form.append(input, submit);
    const feedback = make('small', '', 'arcade-feedback'), history = make('div', '', 'code-history');
    s.attempts.forEach((item, index) => { const row = make('div', '', 'code-row'); row.append(make('b', String(index + 1).padStart(2, '0')), make('strong', item.guess), make('span', `位置正确 ${item.exact} · 数字正确 ${item.misplaced}`)); history.append(row) });
    form.onsubmit = event => { event.preventDefault(); const guess = input.value.trim(); if (!/^\d{4}$/.test(guess) || new Set(guess).size !== 4) { feedback.textContent = '请输入四个互不重复的数字。'; return } let exact = 0, misplaced = 0; [...guess].forEach((digit, index) => { if (digit === s.secret[index]) exact++; else if (s.secret.includes(digit)) misplaced++ }); s.attempts.push({ guess, exact, misplaced }); if (exact === 4) { s.over = true; if (!s.recorded) { s.recorded = true; record('code', 'win') } say('被你猜中了。最后一步是排除，还是直觉？') } else if (s.attempts.length >= limit) { s.over = true; if (!s.recorded) { s.recorded = true; record('code', 'loss') } say('这次密码守住了。看完答案再换一组？', 'warm') } renderCode() };
    stage.append(form, feedback, history, button(s.over ? '再来一局' : '换一组密码', () => { delete states.code; renderCode() }));
  }

  const wordPacks = [
    { min:0, ban: ['是', '不是'], questions: ['你今天已经打开这个页面了吗？', '夏日祭里最先想到的是烟花吗？', '你觉得我在故意引你回答吗？', '这轮比想象中难吗？', '最后一题，你确定不会说出禁词吗？'] },
    { min:0, ban: ['有', '没有'], questions: ['今天发生过让你记住的小事吗？', '桌边现在放着饮料吗？', '你觉得这轮还剩陷阱吗？', '刚才的回答里藏着犹豫吗？', '要承认你已经快赢了吗？'] },
    { min:1, ban: ['喜欢', '不喜欢'], questions: ['夏天和冬天，你偏向哪一个？', '雨天通常带给你什么感觉？', '怎样评价一首愿意循环的歌？', '你会怎样形容烟花升起？', '用一句话评价这轮游戏。'] },
    { min:2, ban: ['我', '你'], questions: ['今天是谁先来到这里的？', '如果有人赢了，这个人会是谁？', '怎样称呼坐在对面的人？', '这轮最难避开的字是什么？', '不使用人称结束这一局。'] }
  ];
  function renderWords() {
    if (!states.words) { const max = [4, 5, 5, 5][levelOrder[difficulty]], available = wordPacks.filter(item => item.min <= levelOrder[difficulty]); states.words = { pack: shuffle(available)[0] || wordPacks[0], max, index: 0, user: 0, takagi: 0, answers: [], over: false, recorded: false } }
    const s = states.words; stage.replaceChildren(heading('words', `连续回答 ${s.max} 个问题，同时避开本轮两个禁词。说中禁词，高木得分；成功绕开，你得分。`));
    const score = make('p', `你 ${s.user} ： ${s.takagi} 高木`, 'duel-score'), bans = make('div', '', 'ban-list'); bans.append(make('span', '本轮禁词'), ...s.pack.ban.map(word => make('b', word))); stage.append(score, progress(s.index, s.max, '问题进度'), bans);
    if (s.over) { const won = s.user > s.takagi; stage.append(finishCard(won ? '你赢了' : s.user < s.takagi ? '高木赢了' : '平局', won ? '大部分诱导都被你绕开了。' : '重新组织一句话，会比急着回答更有效。', '换一组禁词', () => { delete states.words; renderWords() })); return }
    const question = make('p', s.pack.questions[s.index], 'duel-question');
    const form = document.createElement('form'); form.className = 'duel-form'; const input = document.createElement('input'); input.maxLength = 80; input.placeholder = '换一种说法，避开禁词…'; const submit = make('button', '回答'); submit.type = 'submit'; form.append(input, submit); const feedback = make('small', '同义表达、动作描述和换角度回答都可以。', 'arcade-feedback');
    form.onsubmit = event => { event.preventDefault(); const answer = input.value.trim(); if (answer.length < 2) { feedback.textContent = '至少写两个字。'; return } const hit = s.pack.ban.find(word => answer.includes(word)); if (hit) { s.takagi++; say(`抓到了，“${hit}”。这一分归我。`) } else { s.user++; say('绕得很自然。看来你早有准备。') } s.answers.push(answer); s.index++; if (s.index >= s.max) { s.over = true; if (!s.recorded) { s.recorded = true; record('words', s.user > s.takagi ? 'win' : s.user < s.takagi ? 'loss' : 'draw') } } renderWords() };
    stage.append(question, form, feedback, button('重新抽取禁词', () => { delete states.words; renderWords() }));
  }

  function five(board, index, stone) { const row = Math.floor(index / 9), col = index % 9; return [[1,0],[0,1],[1,1],[1,-1]].some(([dr,dc]) => { let count = 1; for (const sign of [-1,1]) { let r = row + dr * sign, c = col + dc * sign; while (r >= 0 && r < 9 && c >= 0 && c < 9 && board[r * 9 + c] === stone) { count++; r += dr * sign; c += dc * sign } } return count >= 5 }) }
  function lineScore(board, index, stone) { const row = Math.floor(index / 9), col = index % 9; let score = 0; [[1,0],[0,1],[1,1],[1,-1]].forEach(([dr,dc]) => { let count = 1, open = 0; for (const sign of [-1,1]) { let r = row + dr * sign, c = col + dc * sign; while (r >= 0 && r < 9 && c >= 0 && c < 9 && board[r * 9 + c] === stone) { count++; r += dr * sign; c += dc * sign } if (r >= 0 && r < 9 && c >= 0 && c < 9 && !board[r * 9 + c]) open++ } score += count * count * (open + 1) }); return score }
  function renderGomoku() {
    if (!states.gomoku) states.gomoku = { board: Array(81).fill(''), over: false, thinking: false, recorded: false, message: '你执黑先行。' };
    const s = states.gomoku; stage.replaceChildren(heading('gomoku', '你执黑，高木执白。横、竖或斜线率先连成五子获胜；难度越高，对手越重视进攻与封堵。'), status(s.message));
    const board = make('div', '', 'gomoku-board'); board.setAttribute('role', 'grid');
    const empty = () => s.board.map((value, index) => value ? -1 : index).filter(index => index >= 0);
    const aiMove = () => { const choices = empty(); for (const stone of ['w','b']) for (const index of choices) { s.board[index] = stone; const win = five(s.board, index, stone); s.board[index] = ''; if (win) return index } if (difficulty === 'easy') return choices[Math.floor(Math.random() * choices.length)]; let best = choices[0], bestScore = -1; choices.forEach(index => { const row = Math.floor(index / 9), col = index % 9, near = s.board.some((stone, other) => stone && Math.abs(Math.floor(other / 9) - row) <= 1 && Math.abs(other % 9 - col) <= 1); const attack = difficulty === 'expert' ? 6 : 4, defend = difficulty === 'hard' || difficulty === 'expert' ? 5 : 3; const value = lineScore(s.board, index, 'w') * attack + lineScore(s.board, index, 'b') * defend + (near ? 12 : 0) - Math.abs(4 - row) - Math.abs(4 - col) + Math.random(); if (value > bestScore) { bestScore = value; best = index } }); return best };
    const finish = (result, message) => { s.over = true; s.message = message; if (!s.recorded) { s.recorded = true; record('gomoku', result) } say(result === 'win' ? '这一步我没有挡住。你埋了多久？' : result === 'loss' ? '五个连起来了。要复盘刚才的缺口吗？' : '棋盘下满了。算平局。') };
    s.board.forEach((stone, index) => { const cell = make('button', '', stone ? `stone ${stone}` : ''); cell.type = 'button'; cell.disabled = Boolean(stone) || s.over || s.thinking; cell.setAttribute('aria-label', `第${Math.floor(index / 9) + 1}行第${index % 9 + 1}列`); cell.onclick = () => { s.board[index] = 'b'; if (five(s.board, index, 'b')) { finish('win', '你连成五子，本局获胜。'); renderGomoku(); return } if (!empty().length) { finish('draw', '棋盘已满，本局平局。'); renderGomoku(); return } s.thinking = true; s.message = '高木正在看棋盘…'; renderGomoku(); setTimeout(() => { const move = aiMove(); s.board[move] = 'w'; s.thinking = false; if (five(s.board, move, 'w')) finish('loss', '高木连成五子，本局结束。'); else s.message = '轮到你落黑子。'; renderGomoku() }, 240) }; board.append(cell) });
    stage.append(board, button('重新开局', () => { delete states.gomoku; renderGomoku() }));
  }

  const harmonyQuestions = [
    ['夏日祭先做什么？','先逛摊位','先找烟花位置'],['雨天放学怎么走？','共撑一把伞','在走廊等雨小'],['收到礼物时？','当面拆开','回家再看'],['周末更想去？','安静书店','热闹商店街'],['午后饮料？','冰汽水','热茶'],['旅行留下什么？','拍很多照片','记下一句话'],['遇到难题时？','先独自想','先和人讨论'],['海边停留到？','夕阳落下','天完全黑'],['一封短消息？','直接说重点','先铺一点气氛'],['纪念品选择？','实用的小物','好看的摆件'],['考试结束后？','立刻对答案','先去吃东西'],['烟花升起时？','专心看天空','看看身边的人']
  ];
  function renderHarmony() {
    if (!states.harmony) { const count = [5,6,8,10][levelOrder[difficulty]], deck = shuffle(harmonyQuestions).slice(0, count); states.harmony = { deck, index: 0, same: 0, picks: deck.map(() => Math.random() < .5 ? 0 : 1), history: [], reveal: null, over: false, recorded: false } }
    const s = states.harmony; stage.replaceChildren(heading('harmony', `共 ${s.deck.length} 题。高木已经藏好选择；你选完才会同时揭晓。结果只表示这一轮碰巧想到一起的次数。`));
    if (s.over) { const rate = Math.round(s.same / s.deck.length * 100), title = rate >= 75 ? '很有默契' : rate >= 45 ? '想到一起不少次' : '这轮分歧更多'; stage.append(finishCard(`${title} · ${rate}%`, rate >= 75 ? '有些选择几乎不用解释。' : rate >= 45 ? '相同和不同都留下了继续聊的入口。' : '答案差得远，反而更容易发现彼此在意什么。', '再测一次', () => { delete states.harmony; renderHarmony() })); return }
    const [question, left, right] = s.deck[s.index]; stage.append(progress(s.index, s.deck.length, '默契进度'), status(`${s.index + 1} / ${s.deck.length} · ${question}`));
    if (s.reveal) {
      const reveal = make('div', '', `harmony-reveal ${s.reveal.same ? 'same' : 'different'}`);
      const mine = make('div'); mine.append(make('small', '你的选择'), make('strong', s.reveal.mine));
      const other = make('div'); other.append(make('small', '高木的选择'), make('strong', s.reveal.other));
      reveal.append(mine, make('b', s.reveal.same ? '想到一起了' : '这次不同'), other);
      stage.append(reveal, button(s.index === s.deck.length - 1 ? '查看默契结果' : '下一题', () => { s.index++; s.reveal = null; if (s.index >= s.deck.length) { s.over = true; if (!s.recorded) { s.recorded = true; record('harmony', s.same >= Math.ceil(s.deck.length * .6) ? 'win' : 'draw') } } renderHarmony() }), button('重新抽题', () => { delete states.harmony; renderHarmony() }));
      return;
    }
    const choices = make('div', '', 'harmony-choices');
    [left, right].forEach((label, index) => choices.append(button(label, () => { const otherIndex = s.picks[s.index], same = index === otherIndex, other = s.deck[s.index][otherIndex + 1]; if (same) s.same++; s.reveal = { mine:label, other, same }; s.history.push({ question, mine:label, other, same }); say(same ? '一样。被你猜中了。' : `这次不一样。我选了“${other}”。`); renderHarmony() })));
    stage.append(choices, make('small', `当前相同 ${s.same} 次。选择后会先停下来揭晓双方答案。`, 'arcade-feedback'), button('重新抽题', () => { delete states.harmony; renderHarmony() }));
  }

  const truthSets = [
    { min:0, title:'雨后走廊', statements:['湿地面会让反光更明显','同一时刻，离光源更近的物体影子一定更长','云层变化会改变画面的明暗'], false:1, why:'影子长度取决于光源角度、物体位置和投影面，距离更近并不必然更长。' },
    { min:0, title:'教室观察', statements:['声音可能被窗帘和书本吸收一部分','所有金属物体在室温下一定比木头温度更低','窗边与走廊侧的亮度可能不同'], false:1, why:'触感受导热速度影响；同处一室的物体可以接近相同温度。' },
    { min:0, title:'时间问题', statements:['一分钟等于六十秒','下午三点到五点经过两小时','23:50 再过二十分钟仍是同一天'], false:2, why:'23:50 再过二十分钟是次日 00:10。' },
    { min:1, title:'日本生活语趣', statements:['“いただきます”常在用餐前说','“おかえり”常用于迎接回家的人','“おやすみ”通常用来表示早安'], false:2, why:'“おやすみ”用于睡前道晚安；早安常说“おはよう”。' },
    { min:1, title:'概率小陷阱', statements:['掷一枚公平硬币，正反面概率相同','连续三次正面后，下一次必定更容易出现反面','两次掷硬币可能出现四种有序结果'], false:1, why:'每次独立投掷的正反面概率仍各为二分之一。' },
    { min:1, title:'语言线索', statements:['“日”和“月”可以组成“明”','“木”和“木”可以组成“林”','“人”和“人”只能组成“从”，不能出现在其他汉字结构中'], false:2, why:'两个“人”形部件还会出现在其他字形分析中，“只能”使陈述不成立。' },
    { min:2, title:'排列问题', statements:['三本不同的书排成一列共有六种次序','固定其中一本在最左侧后，另外两本仍有两种次序','三本不同的书任意排列共有九种次序'], false:2, why:'三本不同的书共有 3×2×1，也就是六种排列。' },
    { min:2, title:'平均数', statements:['一组数加入一个等于原平均数的数，平均数不变','中位数一定等于平均数','极端值通常比对中位数更影响平均数'], false:1, why:'中位数与平均数是不同统计量，只在部分分布中相等。' },
    { min:2, title:'条件推理', statements:['若 A 推出 B，且 B 为假，则 A 为假','若 A 推出 B，且 B 为真，则 A 必为真','若 A 与 B 互斥，则二者不能同时为真'], false:1, why:'B 为真可能由其他条件导致，不能据此反推 A 必然为真。' },
    { min:3, title:'信息与证据', statements:['支持假设的证据也可能支持其他解释','重复观察到相同结果必然证明因果关系','更具体的预测通常更容易被新证据检验'], false:1, why:'重复相关结果仍可能来自共同原因、选择偏差或其他机制，不能自动证明因果。' },
    { min:3, title:'选择偏差', statements:['只询问留下来的用户可能高估满意度','更大的样本可以自动消除所有系统偏差','随机抽样通常有助于降低选择偏差'], false:1, why:'扩大带有系统偏差的样本只会更精确地估计偏差后的结果。' },
    { min:3, title:'贝叶斯直觉', statements:['罕见事件的阳性结果仍需考虑基础发生率','检测准确率高就意味着阳性者几乎一定患病','假阳性率会影响阳性结果的解释'], false:1, why:'当基础发生率很低时，即使检测准确率较高，假阳性也可能占阳性结果的显著部分。' }
  ];
  function renderTruth() {
    if (!states.truth) { const pool = truthSets.filter(item => item.min <= levelOrder[difficulty]), rounds = [4,5,6,7][levelOrder[difficulty]]; states.truth = { deck: shuffle(pool).slice(0, Math.min(rounds, pool.length)), index: 0, score: 0, resolved: false, choice: -1, over: false, recorded: false } }
    const s = states.truth; stage.replaceChildren(heading('truth', '每轮三句话中只有一句不成立。选择后会锁定答案并显示理由；看完解析再进入下一题。'));
    if (s.over) { stage.append(finishCard(`答对 ${s.score} / ${s.deck.length}`, s.score === s.deck.length ? '每个限定词都被你看见了。' : '容易出错的地方通常藏在“一定”“只能”和反向推断里。', '换一组题', () => { delete states.truth; renderTruth() })); return }
    const item = s.deck[s.index]; stage.append(progress(s.index, s.deck.length, '判断进度'), status(`${s.index + 1} / ${s.deck.length} · ${item.title}`)); const list = make('div', '', 'truth-options');
    item.statements.forEach((line, index) => { const option = button(`${String.fromCharCode(65 + index)}. ${line}`, () => { if (s.resolved) return; s.choice = index; s.resolved = true; if (index === item.false) { s.score++; say('这一句里的限定被你看见了。') } else say('这句可以成立。再看看哪句话把条件说得太满。', 'warm'); renderTruth() }); if (s.resolved) { option.disabled = true; option.dataset.result = index === item.false ? 'correct' : index === s.choice ? 'wrong' : '' } list.append(option) }); stage.append(list);
    if (s.resolved) { stage.append(make('p', `不成立的是 ${String.fromCharCode(65 + item.false)}。${item.why}`, 'truth-explain'), button(s.index === s.deck.length - 1 ? '查看结果' : '下一题', () => { s.index++; s.resolved = false; s.choice = -1; if (s.index >= s.deck.length) { s.over = true; if (!s.recorded) { s.recorded = true; record('truth', s.score >= Math.ceil(s.deck.length * .65) ? 'win' : 'loss') } } renderTruth() })) }
    else stage.append(make('small', `当前得分 ${s.score}。每题只有一次选择机会。`, 'arcade-feedback'));
  }

  const chainWords = {
    zh: ['夏日','日光','光影','影子','子夜','夜空','空想','想念','念书','书桌','桌面','面包','包容','容貌','貌似','似乎','湖面','面前','前方','方向','向日葵','葵花','花火','火光','光线','线索','索引','引路','路灯','灯火','火花','花园','园林','林间','间隔','隔壁','壁画','画面','面容','容器','器材','材料','料理','理解','解答','答案','案头','头发','发现','现在','在场','场景','景色','色彩','彩虹','虹桥','桥边','边界','界面','面向','向往','往日','日期','期待','待会','会议','议题','题目','目标','标记','记忆','忆念','校园','园地','地图','图片','片段','段落','落日','日本','本子','子弹','弹琴','琴声','声音','音乐','乐园'],
    jp: ['なつ','つき','きつね','ねこ','こえ','えき','きせつ','つくえ','えがお','おと','とけい','いえ','えんぴつ','つばさ','さくら','らじお','おかし','しお','おもいで','でんしゃ','やま','まつり','りんご','ごはん','はなび','びんせん','せかい','いす','すいか','かぜ','ぜひ','ひかり','りす','すな','なみ','みち','ちず','ずこう','うみ','みせ','せんせい','いろ','ろうか','かばん','ばんごう','うた','たび','びわ','わらい']
  };
  const chainEnd = (word, lang) => { const clean = word.trim(); if (lang === 'jp') { const last = clean.slice(-1); const small = { 'ゃ':'や','ゅ':'ゆ','ょ':'よ','っ':'つ' }; return small[last] || last } return clean.slice(-1) };
  function renderChain() {
    if (!states.chain) { const lang = 'zh', bank = chainWords[lang], seed = shuffle(bank)[0]; states.chain = { lang, bank, current: seed, used: [seed], turns: 0, target: [5,7,9,12][levelOrder[difficulty]], over: false, recorded: false, message: `高木先说：${seed}` } }
    const s = states.chain; stage.replaceChildren(heading('chain', '中文使用末字接首字；日语使用平假名末音接首音。日语词以“ん”结尾立即失败，同一词不能重复。本地版检查字形与接续，请使用常见词。'));
    const language = document.createElement('select'); language.setAttribute('aria-label', '接龙语言'); [['zh','中文接龙'],['jp','日本語しりとり']].forEach(([value,label]) => { const option = make('option', label); option.value = value; language.append(option) }); language.value = s.lang; language.onchange = () => { const lang = language.value, bank = chainWords[lang], seed = shuffle(bank)[0]; states.chain = { lang, bank, current: seed, used: [seed], turns: 0, target: [5,7,9,12][levelOrder[difficulty]], over: false, recorded: false, message: `高木先说：${seed}` }; renderChain() };
    const langLine = make('div', '', 'game-mode-row'); langLine.append(make('label', '语言'), language); stage.append(langLine, progress(s.turns, s.target, '接龙轮次'), status(s.message));
    if (s.over) { stage.append(finishCard(s.result === 'win' ? '你赢了' : '这一局归高木', s.result === 'win' ? `完成 ${s.turns} 轮后，高木没有可接的词。` : '检查末字或末音，再换一条词路。', '重新开始', () => { delete states.chain; renderChain() })); return }
    const need = chainEnd(s.current, s.lang), form = document.createElement('form'); form.className = 'duel-form'; const input = document.createElement('input'); input.maxLength = 12; input.placeholder = s.lang === 'jp' ? `输入以“${need}”开头的平假名词` : `输入以“${need}”开头的词`; input.setAttribute('aria-label', '输入接龙词'); const submit = make('button', '接这个词'); submit.type = 'submit'; form.append(input, submit); const feedback = make('small', `目标完成 ${s.target} 轮 · 已完成 ${s.turns} 轮`, 'arcade-feedback');
    form.onsubmit = event => { event.preventDefault(); const value = input.value.trim(); const validChars = s.lang === 'jp' ? /^[ぁ-んー]{2,8}$/ : /^[\u3400-\u9fff]{2,6}$/; if (!validChars.test(value)) { feedback.textContent = s.lang === 'jp' ? '请输入 2 至 8 个平假名。' : '请输入 2 至 6 个汉字。'; return } if (!value.startsWith(need)) { feedback.textContent = `要从“${need}”开始。`; return } if (s.used.includes(value)) { feedback.textContent = '这个词已经用过了。'; return } if (s.lang === 'jp' && value.endsWith('ん')) { s.over = true; s.result = 'loss'; if (!s.recorded) { s.recorded = true; record('chain', 'loss') } s.message = `“${value}”以“ん”结尾。`; say('しりとり里，以“ん”结尾就输了哦。'); renderChain(); return } s.used.push(value); s.turns++; const tail = chainEnd(value, s.lang), replies = s.bank.filter(word => word.startsWith(tail) && !s.used.includes(word)); if (!replies.length || s.turns >= s.target) { s.over = true; s.result = 'win'; if (!s.recorded) { s.recorded = true; record('chain', 'win') } s.message = !replies.length ? `高木暂时接不上“${tail}”。` : `你完成了 ${s.target} 轮。`; say('这条词路被你接通了。算你赢。'); renderChain(); return } const reply = replies[Math.floor(Math.random() * replies.length)]; s.used.push(reply); if (s.lang === 'jp' && reply.endsWith('ん')) { s.over = true; s.result = 'win'; if (!s.recorded) { s.recorded = true; record('chain', 'win') } s.message = `高木说了“${reply}”，以“ん”结尾。`; renderChain(); return } s.current = reply; s.message = `你：${value}　高木：${reply}`; say(`那我接“${reply}”。下一个是“${chainEnd(reply, s.lang)}”。`); renderChain() };
    const used = make('div', '', 'chain-history'); s.used.slice(-8).forEach(word => used.append(make('span', word))); stage.append(form, feedback, used, button('认输并换词', () => { if (!s.recorded) { s.recorded = true; record('chain', 'loss') } delete states.chain; renderChain() }));
  }

  const memorySymbols = ['花火','雨伞','汽水','纸条','月亮','风铃','书本','海浪','樱花','列车','星光','团扇'];
  function renderMemory() {
    if (!states.memory) { const pairCount = [6,8,10,12][levelOrder[difficulty]], symbols = shuffle(memorySymbols).slice(0, pairCount); states.memory = { cards: shuffle([...symbols,...symbols]).map((symbol, id) => ({ symbol, id, open: false, found: false })), first: -1, lock: false, moves: 0, found: 0, pairCount, over: false, recorded: false } }
    const s = states.memory; stage.replaceChildren(heading('memory', `翻开两张卡片寻找相同图案。共 ${s.pairCount} 对；连续翻牌时，未配对的卡片会短暂停留后盖回。`), progress(s.found, s.pairCount, '配对进度'), status(`已找到 ${s.found} / ${s.pairCount} 对 · 翻牌 ${s.moves} 次`));
    if (s.over) { const target = s.pairCount * 2 + [8,10,12,14][levelOrder[difficulty]], good = s.moves <= target; stage.append(finishCard(good ? '记得很清楚' : '全部找到了', `共翻牌 ${s.moves} 次。${good ? '大部分位置只看了一两次。' : '再玩一轮时，先记住四个角会更稳。'}`, '重新洗牌', () => { delete states.memory; renderMemory() })); return }
    const grid = make('div', '', `memory-board pairs-${s.pairCount}`);
    s.cards.forEach((card, index) => { const cell = make('button', card.open || card.found ? card.symbol : '✦', `memory-card${card.open || card.found ? ' open' : ''}${card.found ? ' found' : ''}`); cell.type = 'button'; cell.disabled = s.lock || card.open || card.found; cell.setAttribute('aria-label', card.open || card.found ? card.symbol : `第 ${index + 1} 张未翻开卡片`); cell.onclick = () => { card.open = true; if (s.first < 0) { s.first = index; renderMemory(); return } const first = s.cards[s.first]; s.moves++; if (first.symbol === card.symbol) { first.found = card.found = true; first.open = card.open = false; s.found++; s.first = -1; if (s.found === s.pairCount) { s.over = true; if (!s.recorded) { s.recorded = true; record('memory', 'win') } say('最后一对也找到了。你记得比刚才说的清楚。') } renderMemory() } else { s.lock = true; renderMemory(); setTimeout(() => { first.open = card.open = false; s.first = -1; s.lock = false; renderMemory() }, difficulty === 'easy' ? 1250 : difficulty === 'medium' ? 950 : 700) } }; grid.append(cell) }); stage.append(grid, button('重新洗牌', () => { delete states.memory; renderMemory() }));
  }

  const lateralStories = [
    { id:'umbrella', title:'等雨更大', prompt:'放学后，她明明没有带伞，却故意等到雨更大才离开。为什么？', truth:'她在等同样没有带伞的朋友。雨大后，朋友会放弃独自跑回去，两个人就能一起等家人来接。', yes:['等人','朋友','一起','家人','接','没有伞'], no:['讨厌小雨','想淋湿','伞坏','忘记回家'], hints:['她关注的不是雨量本身。','这件事与另一个人有关。','两个人都没有伞。'] },
    { id:'bell', title:'没有响的铃', prompt:'教室里的铃没有响，大家却同时收起书本离开了。为什么？', truth:'这是一次安静自习，墙上的时钟已经到了约定结束的时间，铃声设备当天正在检修。', yes:['时间','时钟','约定','检修','坏','自习'], no:['老师命令','停电','考试作弊'], hints:['大家拥有同一个时间线索。','线索就在教室里。','铃声设备正在检修。'] },
    { id:'photo', title:'少一个人的合照', prompt:'四个人一起旅行，合照里每次却只有三个人。没人使用自拍杆，也没有请路人帮忙。为什么？', truth:'四个人轮流拿相机拍照，所以每张合照里都只有另外三个人。', yes:['相机','拍照','轮流','摄影'], no:['有人失踪','镜子','照片坏'], hints:['四个人都好好地在旅行。','拍摄方式是关键。','其中一人每次都在拿相机。'] },
    { id:'cocoa', title:'没有喝的热可可', prompt:'她买了两杯热可可，一杯始终没人喝，她却说目的已经达到了。为什么？', truth:'另一杯是用来给等待的人暖手的。对方不喜欢甜饮，但在寒风里需要一点温度。', yes:['暖手','取暖','冷','温度','不喜欢喝'], no:['祭奠','打翻','送错'], hints:['重点不是喝下去。','当天的气温很低。','杯子可以用来暖手。'] },
    { id:'station', title:'坐过站', prompt:'他明明看见了自己的车站，却没有下车。到下一站后，他反而松了一口气。为什么？', truth:'他在陪一位睡着的朋友回家。自己的车站先到，但朋友的目的地在下一站，他决定先把朋友安全送到。', yes:['朋友','陪','送','睡着','安全'], no:['逃票','迷路','车门坏'], hints:['他知道自己在哪里。','车上还有一个重要的人。','他在陪睡着的朋友到站。'] },
    { id:'note', title:'空白便笺', prompt:'她收到一张完全空白的便笺，却立刻知道是谁写的，也明白对方想说什么。为什么？', truth:'两人事先约定，空白便笺代表今天不方便说话，但会在老地方等对方。便笺本身就是暗号。', yes:['暗号','约定','事先','老地方','等待'], no:['隐形墨水','盲文','透光'], hints:['纸上确实什么也没有。','两个人以前谈过这件事。','空白本身就是约定的暗号。'] }
  ];
  function renderLateral() {
    if (!states.lateral) { const storyPool = difficulty === 'easy' ? lateralStories.slice(0,3) : lateralStories; const savedMode = read('takagi-lateral-mode'); const validModes = ['local','auto','qwen-max','qwen-flash','deepseek-pro','deepseek-flash']; states.lateral = { story: shuffle(storyPool)[0], mode: validModes.includes(savedMode) ? savedMode : savedMode === 'ai' ? 'auto' : 'local', asks: [], progress: 0, hints: 0, max: [15,12,10,8][levelOrder[difficulty]], over: false, loading: false, recorded: false, message: '可以开始提问。' } }
    const s = states.lateral; stage.replaceChildren(heading('lateral', '通过只能用“是、否、关系不大”回答的问题还原真相。智能自动模式按千问 Max、千问 Flash、DeepSeek Pro、DeepSeek Flash 的顺序尝试。'));
    const mode = document.createElement('select'); [['local','本地题库'],['auto','智能自动切换 · 千问优先'],['qwen-max','千问 3.8 Max'],['qwen-flash','千问 3.8 Flash'],['deepseek-pro','DeepSeek Pro'],['deepseek-flash','DeepSeek Flash']].forEach(([value,label]) => { const option = make('option', label); option.value = value; mode.append(option) }); mode.value = s.mode; mode.onchange = () => { s.mode = mode.value; write('takagi-lateral-mode', s.mode); s.message = s.mode === 'local' ? '本地模式按题库关键词判断，不发送网络请求。' : '问题会发送给所选引擎；调用失败时会自动尝试备用引擎。'; renderLateral() };
    const usesAI = s.mode !== 'local'; const modeRow = make('div', '', 'game-mode-row'); const badge = make('span', usesAI ? '多引擎 API' : '不调用 API', usesAI ? 'game-badge ai' : 'game-badge local'); modeRow.append(make('label', '判断方式'), mode, badge); stage.append(modeRow, progress(s.asks.length, s.max, '提问次数'), make('div', '', 'lateral-prompt')); stage.lastElementChild.append(make('small', s.story.title), make('p', s.story.prompt)); stage.append(status(`${s.message} · 剩余 ${Math.max(0, s.max - s.asks.length)} 问`));
    if (s.over) { stage.append(finishCard('真相', s.story.truth, '换一个情境', () => { delete states.lateral; renderLateral() })); return }
    const form = document.createElement('form'); form.className = 'duel-form'; const input = document.createElement('input'); input.maxLength = 180; input.placeholder = '例如：她是在等人吗？'; input.disabled = s.loading; const submit = make('button', s.loading ? '判断中…' : '提问'); submit.type = 'submit'; submit.disabled = s.loading; form.append(input, submit);
    const localJudge = question => { const yes = s.story.yes.find(word => question.includes(word)), no = s.story.no.find(word => question.includes(word)); if (yes) { s.progress = Math.min(95, s.progress + 18); return { answer: s.progress >= 72 ? '接近了' : '是', reply: s.progress >= 72 ? '接近了，沿着这个方向把关系说完整。' : '是，这个方向有关。' } } if (no) return { answer: '否', reply: '否，这不是造成反常情境的原因。' }; return { answer: '关系不大', reply: '关系不大。可以问人物、时间或目的。' } };
    form.onsubmit = async event => { event.preventDefault(); const question = input.value.trim(); if (question.length < 2) { s.message = '请写出一个完整问题。'; renderLateral(); return } s.loading = true; s.message = '正在判断…'; renderLateral(); let result; if (s.mode !== 'local') { try { const password = document.querySelector('#ai-password')?.value || sessionStorage.getItem('takagi-ai-password') || ''; if (!password) throw new Error('请先在聊天区输入 AI 访问密码'); const response = await fetch('/api/game', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ game:'lateral', storyId:s.story.id, question, password, modelPreference:globalThis.TakagiEngineSession?.preference(s.mode === 'auto' ? 'qwen-max' : s.mode)||(s.mode === 'auto' ? 'qwen-max' : s.mode), allowFallback:true, history:s.asks.map(item => `问：${item.q} 答：${item.a}`), visitContext:globalThis.TakagiVisitMemory?.context() || '' }) }); const data = await response.json(); if (!response.ok) throw new Error([data.error, data.reminder].filter(Boolean).join('。') || 'AI 判断失败'); globalThis.TakagiEngineSession?.accept(s.mode === 'auto' ? 'qwen-max' : s.mode,data); const switched = data.fallbacks?.length ? `${data.fallbacks.map(item => item.engineName).join('、')}调用失败，已切换到${data.engineName}。` : `${data.engineName}完成判断。`; result = { answer:data.answer, reply:`${switched}${data.reply}` }; s.progress = Math.max(s.progress, Number(data.progress) || 0) } catch (error) { result = localJudge(question); result.reply = `${error.message || '在线引擎暂不可用'}。已继续使用本地判断：${result.reply}` } } else result = localJudge(question); s.asks.push({ q:question, a:result.answer }); s.loading = false; s.message = `${result.answer}。${result.reply}`; globalThis.TakagiVisitMemory?.record('推理游戏', question.slice(0,60), s.message.slice(0,80)); if (s.asks.length >= s.max) { s.over = true; if (!s.recorded) { s.recorded = true; record('lateral', 'loss') } } say(s.message, result.answer === '接近了' ? 'playful' : 'warm'); renderLateral() };
    const actions = make('div', '', 'arcade-actions'); actions.append(button('给一点提示', () => { s.message = `提示：${s.story.hints[Math.min(s.hints, s.story.hints.length - 1)]}`; s.hints++; renderLateral() }), button('我猜到了，揭晓', () => { s.over = true; if (!s.recorded) { s.recorded = true; record('lateral', s.progress >= 55 || s.asks.length >= 3 ? 'win' : 'draw') } renderLateral() }), button('换一题', () => { delete states.lateral; renderLateral() }));
    const history = make('div', '', 'lateral-history'); s.asks.slice(-6).forEach((item, index) => history.append(make('p', `${s.asks.length - Math.min(6,s.asks.length) + index + 1}. ${item.q}　${item.a}`))); stage.append(form, actions, history);
  }

  function openStandalone(key) {
    const item = info[key], modal = make('dialog', '', 'arcade-game-modal');
    const shell = make('div', '', 'arcade-game-modal-shell'), bar = make('div', '', 'arcade-game-modal-bar');
    const title = make('div'); title.append(make('strong', item.name), make('small', '独立游戏 · 原版界面'));
    const close = button('返回 ×', () => modal.close(), 'arcade-game-modal-close'); close.setAttribute('aria-label', `关闭${item.name}`);
    const frame = document.createElement('iframe'); frame.title = item.name; frame.loading = 'eager'; frame.allow = 'fullscreen'; frame.setAttribute('allowfullscreen', '');
    const status=make('div','正在加载游戏…','game-load-status');status.setAttribute('role','status');
    const hint=make('span',''),retry=button('重新加载',()=>loadFrame()),back=button('返回小游戏',()=>modal.close());
    const retryPanel=make('div','','game-load-recovery');retryPanel.hidden=true;retryPanel.append(hint,retry,back);
    const viewport=make('div','','game-frame-viewport');viewport.append(frame,status,retryPanel);
    let loadTimer,closed=false;
    const loadFrame=()=>{if(closed)return;clearTimeout(loadTimer);status.hidden=false;status.textContent='正在加载游戏…';retryPanel.hidden=true;frame.src=item.external;loadTimer=setTimeout(()=>{status.hidden=true;hint.textContent='加载时间较长，可以继续等待，或重新加载。';retryPanel.hidden=false},12000)};
    frame.onload=()=>{if(closed)return;try{const doc=frame.contentDocument;if(!doc?.querySelector('script'))throw Error('页面未完整返回')}catch{clearTimeout(loadTimer);status.hidden=true;hint.textContent='游戏页面加载失败，请重试。';retryPanel.hidden=false;return}clearTimeout(loadTimer);status.hidden=true;retryPanel.hidden=true;globalThis.TakagiVisitMemory?.record('游戏进入',item.name)};
    frame.onerror=()=>{clearTimeout(loadTimer);status.hidden=true;hint.textContent='游戏页面加载失败，请重试。';retryPanel.hidden=false};
    bar.append(title, close); shell.append(bar, viewport);loadFrame(); modal.append(shell); document.body.append(modal); document.body.classList.add('arcade-game-open');
    const cleanup = () => { closed=true;clearTimeout(loadTimer);frame.src = 'about:blank'; document.body.classList.remove('arcade-game-open'); modal.remove() };
    modal.addEventListener('close', cleanup, { once:true });
    modal.addEventListener('cancel', event => { event.preventDefault(); modal.close() });
    modal.showModal(); close.focus();
  }
  function renderStandalone(key) {
    const item = info[key], card = make('div', '', 'standalone-game-card');
    card.append(make('span', item.icon, 'standalone-game-mark'), make('h4', item.name), make('p', `${item.brief} 游戏会在独立窗口中运行，保留原有规则、设置和结算。`), make('small', '点击下方按钮进入完整游戏。', 'standalone-game-hint'), button(`▶ 点击进入${item.name}`, () => openStandalone(key), 'standalone-game-launch'));
    stage.replaceChildren(heading(key, '此游戏保留提交版本的原有玩法和界面。打开后可使用游戏内部的规则与设置；关闭窗口即可回到小游戏中心。'), card);
  }

  const renders = { code:renderCode, words:renderWords, gomoku:renderGomoku, harmony:renderHarmony, truth:renderTruth, chain:renderChain, memory:renderMemory, lateral:renderLateral, mind:()=>renderStandalone('mind'), eraser:()=>renderStandalone('eraser') };
  function render(key = active) { active = key; write('takagi-arcade-last-game', key); shelf.dataset.activeGame = key; tabs.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.game === key))); renders[key](); stage.animate?.([{ opacity:.55, transform:'translateY(5px)' }, { opacity:1, transform:'translateY(0)' }], { duration:180, easing:'ease-out' }) }
  keys.forEach(key => { const item = info[key], tab = button('', () => render(key), 'arcade-tab-card'); tab.dataset.game = key; tab.setAttribute('aria-pressed', String(key === active)); tab.append(make('b', item.icon), make('span', item.name), make('small', item.mode)); tabs.append(tab) });
  shelf.addEventListener('toggle', () => { summary.querySelector('em').textContent = shelf.open ? '收起' : '展开'; if (shelf.open && !stage.childElementCount) render() });
  paintScore();
})();

