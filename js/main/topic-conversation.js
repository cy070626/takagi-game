const topicLexicons = {
  中日饮食: [
    "吃",
    "饭",
    "菜",
    "茶",
    "早餐",
    "午餐",
    "晚餐",
    "夜宵",
    "料理",
    "和食",
    "味噌",
    "便当",
    "食堂",
    "口味",
    "忌口",
    "外卖",
  ],
  作息文化: [
    "睡",
    "困",
    "熬夜",
    "早起",
    "起床",
    "午睡",
    "作息",
    "加班",
    "通勤",
    "自习",
    "休息",
    "效率",
  ],
  天气气候: [
    "天气",
    "下雨",
    "雨季",
    "梅雨",
    "台风",
    "降温",
    "炎热",
    "寒冷",
    "下雪",
    "湿度",
    "风",
    "带伞",
  ],
  地理常识: [
    "地理",
    "旅行",
    "城市",
    "地区",
    "南方",
    "北方",
    "关东",
    "关西",
    "北海道",
    "九州",
    "高原",
    "盆地",
    "沿海",
  ],
  中国校园: ["学校", "校园", "月考", "晚自习", "食堂", "同学", "放学"],
  原作背景: ["原作", "高木", "西片", "剧情", "漫画", "动画", "角色"],
  人物语气: ["玩笑", "捉弄", "认真", "语气", "聊天", "距离"],
  成年日常: [
    "下班",
    "回家",
    "通勤",
    "周末",
    "今天",
    "一天",
    "无聊",
    "休息",
    "放空",
  ],
  关系与边界: [
    "朋友",
    "同事",
    "室友",
    "家人",
    "对象",
    "伴侣",
    "误会",
    "冷战",
    "吵架",
    "拒绝",
    "边界",
  ],
  选择与计划: [
    "选择",
    "纠结",
    "决定",
    "计划",
    "拖延",
    "该不该",
    "目标",
    "开始",
    "坚持",
  ],
  兴趣与作品: [
    "音乐",
    "歌",
    "电影",
    "动画",
    "漫画",
    "小说",
    "游戏",
    "摄影",
    "运动",
    "作品",
  ],
  季节与生活: [
    "春天",
    "夏天",
    "秋天",
    "冬天",
    "蝉",
    "樱花",
    "烟花",
    "暑假",
    "季节",
  ],
  情绪整理: [
    "焦虑",
    "难过",
    "委屈",
    "烦",
    "压力",
    "孤独",
    "生气",
    "失望",
    "心情",
  ],
  学习与复盘: [
    "学习",
    "复习",
    "考试",
    "论文",
    "作业",
    "题目",
    "卡住",
    "专注",
    "复盘",
  ],
  日本青春: [
    "放课后",
    "图书室",
    "部活",
    "汽水",
    "短歌",
    "便笺",
    "车站",
    "雨宿り",
    "鞋柜",
    "回信",
    "花火",
    "烟花",
    "归途",
    "青春",
  ],
};
function termPrompts(t) {
  return globalThis.TakagiTopicTree.suggestions(t);
}
function termOpening(t) {
  return globalThis.TakagiTopicTree.peek(t);
}
function selectLocalTerm(message) {
  const text = message.toLowerCase();
  let best = activeTerm,
    bestScore = activeTerm ? 2 : 0;
  for (const term of terms) {
    let score = 0;
    if (text.includes(term.title.toLowerCase())) score += 6;
    for (const word of topicLexicons[term.tag] || [])
      if (text.includes(word)) score += 2;
    if (
      profile.interests?.some((item) =>
        term.tag.includes(
          item
            .replace("与生活", "")
            .replace("与季节", "")
            .replace("与旅行", ""),
        ),
      )
    )
      score++;
    if (score > bestScore) {
      best = term;
      bestScore = score;
    }
  }
  return bestScore >= 2 ? best : null;
}
function localKnowledgeReply(message) {
  const route = globalThis.TakagiTopicTree.resolve(activeTerm, message, terms);
  const term = route?.detached ? null : route?.term || selectLocalTerm(message);
  if (!term) return null;
  activeTerm = term;
  localTopicTurns++;
  const branchReply = globalThis.TakagiTopicTree.local(term, message);
  if (branchReply) return branchReply;
  const prompts = termPrompts(term),
    place = profile.location?.trim(),
    fact = (
      term.detail.split("。").find((part) => part.length > 12) || term.summary
    ).trim();
  let text = "";
  if (term.tag === "中日饮食")
    text = /比较|区别|一样吗/.test(message)
      ? `可以比较，但先固定一个具体对象。就“${term.title}”来说，${fact}。你想比较做法、用餐场景，还是它背后的地域原因？`
      : `你提到的细节比“中餐或日料”这种大标签有用。${place ? `结合你在${place}的日常，` : ""}你更在意口味、时间、预算，还是和谁一起吃？`;
  else if (term.tag === "作息文化")
    text = /几[点时]|多久|小时/.test(message)
      ? `${fact}。这个只能作一般参考，我还需要知道你固定起床时间和白天最困的时段，才能把建议放进真实作息。`
      : `先不急着做完整时间表。你最近哪一个时段最容易失控，发生前通常在做什么？`;
  else if (term.tag === "天气气候")
    text = /今天|现在|明天|温度|预报/.test(message)
      ? `我没有实时气象数据，不能替你报具体温度或降雨概率。${place ? `你设置在${place}，` : ""}把今天看到的天气告诉我，我可以继续判断它会怎样影响通勤、吃饭和心情。`
      : `${fact}。你想聊长期气候差异，还是今天这场天气带来的具体感受？`;
  else if (term.tag === "地理常识")
    text = `${fact}。如果把它放回生活里，地形会继续影响气候、交通和吃什么。${place ? `从${place}出发，` : ""}你最想沿哪条线索展开？`;
  else if (term.tag === "原作背景")
    text = `${fact}。比起复述剧情，我更想知道你为什么点开它：是人物之间的距离、叙事节奏，还是某个细节像你经历过的事？`;
  else if (term.tag === "成年日常")
    text = `${fact}。先选一种节奏吧：把今天复盘清楚、处理一个具体问题，还是只让我陪你说几句？`;
  else if (term.tag === "关系与边界")
    text = `${fact}。你希望我先听事实、帮你区分感受，还是一起整理一句能对对方说的话？`;
  else if (term.tag === "选择与计划")
    text = `${fact}。先告诉我你最想保住什么，以及哪种结果最不能接受，我们再比较选项。`;
  else if (term.tag === "兴趣与作品")
    text = `${fact}。它最先留给你的是一个声音、画面、人物，还是某段和作品连在一起的生活？`;
  else if (term.tag === "季节与生活")
    text = `${fact}。${place ? `你在${place}，` : ""}此刻最明显的季节线索是什么？`;
  else if (term.tag === "情绪整理")
    text = `${fact}。你现在更希望我听完整、帮你找最重的部分，还是先安静一下？`;
  else if (term.tag === "学习与复盘")
    text = `${fact}。把你已经做过的步骤和最不确定的一处发来，我只从那里继续。`;
  else if (term.tag === "日本青春")
    text =
      localTopicTurns % 3 === 1
        ? `${fact}。先选一个细节吧：光、声音、动作，或者当时没说出口的话。`
        : localTopicTurns % 3 === 2
          ? `我还记得我们在聊“${term.title}”。如果镜头再往前走十秒，你觉得谁会先开口，又会说什么？`
          : `这个画面已经有一点轮廓了。你想把它留成一句话、五行短句，还是继续讲当时真正发生的事？`;
  else
    text =
      localTopicTurns % 2
        ? `${term.summary}。这句话落到你身上，最接近的是哪一段具体经历？`
        : `我记得我们正在聊“${term.title}”。你刚才那句话里，最值得继续的是哪个细节？`;
  return {
    text,
    mood: /睡|累|雨|情绪/.test(message) ? "quiet" : "listening",
    topic: "term-" + term.tag,
    suggestions: prompts,
    knowledgeTags: [term.tag],
  };
}
function startTermConversation(t) {
  dialog.close();
  if (activeScene !== t.scene) setScene(t.scene, { silent: true });
  activeTerm = t;
  localTopicTurns = 0;
  const opening = globalThis.TakagiTopicTree.start(t);
  addContext(
    `${scenes[t.scene].name} · “${t.title}”这条线索会在后续对话中保留`,
  );
  add("assistant", opening);
  speak(opening, t.tag === "人物语气" ? "playful" : "warm");
  renderSuggestions([], globalThis.TakagiTopicTree.plan(t, ""));
  aiHistory.push({
    role: "assistant",
    text: `【当前话题：${t.title}】${opening}`,
  });
  aiHistory.splice(0, Math.max(0, aiHistory.length - CHAT_CONTEXT_LIMIT));
  saveSessionHistory();
  document
    .querySelector(".chat")
    .scrollIntoView({ behavior: "smooth", block: "center" });
  input.focus();
}
const modelNames = {
  local: "本地陪伴",
  "gpt-5.6-luna": "GPT 5.6 Luna",
  "gpt-5.6-terra": "GPT 5.6 Terra",
  "qwen-max": "千问 3.8 Max",
  "qwen-flash": "千问 3.8 Flash",
  "deepseek-pro": "DeepSeek Pro",
  "deepseek-flash": "DeepSeek Flash",
};
function renderProfileSummary() {
  const box = $("#profile-summary");
  if (!box) return;
  const styleNames = {
    gentle: "轻松同桌",
    playful: "俏皮观察",
    direct: "认真直说",
    analytical: "条理分析",
    quiet: "少说一点",
  };
  const moodNames = {
    calm: "平静",
    tired: "有点累",
    happy: "心情不错",
    anxious: "有些焦虑",
    low: "情绪低落",
    focused: "想专注",
  };
  box.replaceChildren();
  const words = document.createElement("span");
  words.append(
    textEl("strong", preferredAddress()),
    textEl(
      "small",
      `${modelNames[profile.modelPreference] || "本地陪伴"} · ${styleNames[profile.chatStyle] || "轻松同桌"} · ${moodNames[profile.currentMood] || "平静"}`,
    ),
  );
  box.append(words, textEl("em", "调整 ›"));
  box.title = profile.context
    ? `当前情境：${profile.context}`
    : "设置模型、称呼、心情和当前情境";
  const status = $("#ai-status");
  if (status && !busy)
    status.textContent =
      profile.modelPreference === "local"
        ? "本地陪伴引擎 · 已结合称呼、心情与当前情境"
        : `${modelNames[profile.modelPreference] || "在线模型"} · 访问密码由 Netlify Function 校验${profile.modelPreference.startsWith("qwen-") ? " · 可按需联网搜索" : ""}`;
}
