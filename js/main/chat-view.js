const toneMarks = {
  warm: ["☀", "暖意"],
  playful: ["✦", "小得意"],
  quiet: ["☁", "轻声"],
  focused: ["✎", "认真"],
  listening: ["◌", "在听"],
};
function assistantHeader(mood = "warm") {
  const meta = textEl("span", "", "message-meta"),
    tone = toneMarks[mood] || toneMarks.listening;
  meta.append(
    textEl("b", "高木"),
    textEl("i", `${tone[0]} ${tone[1]}`, "tone-sticker"),
  );
  return meta;
}
function add(role, text, mood = "warm") {
  const d = document.createElement("div");
  d.className = "message " + role;
  if (role === "assistant") d.append(assistantHeader(mood));
  const p = document.createElement("p");
  p.textContent = text;
  d.append(p);
  log.append(d);
  void TakagiReplyDisplay.render(p);
  log.scrollTop = log.scrollHeight;
  if (role === "user" || role === "assistant")
    TakagiSubtleEffects.trigger(log, TakagiSubtleEffects.detect(text));
  return d;
}
function attachReactions(row) {
  log.querySelectorAll(".reply-reactions").forEach((item) => item.remove());
  const bar = textEl("div", "", "reply-reactions");
  [
    ["♡", "收到"],
    ["☺", "被你说中"],
    ["…", "安静一下"],
  ].forEach(([symbol, label]) => {
    const b = textEl("button", `${symbol} ${label}`);
    b.type = "button";
    b.onclick = () => {
      bar.querySelectorAll("button").forEach((item) => (item.disabled = true));
      if (symbol === "…") {
        setQuiet(true);
        b.textContent = "… 就坐一会儿";
      } else {
        pulseReaction(symbol === "☺" ? "playful" : "warm");
        b.textContent = symbol === "☺" ? "☺ 看来猜中了" : "♡ 她收到了";
        if (symbol === "☺") addContext("你轻轻点了点头。");
      }
    };
    bar.append(b);
  });
  row.append(bar);
  log.scrollTop = log.scrollHeight;
}
function addContext(text) {
  const d = document.createElement("div");
  d.className = "intro";
  d.textContent = "✧ " + text;
  log.append(d);
  log.scrollTop = log.scrollHeight;
}
function renderSuggestions(items, context = null) {
  const needPrompt = profile.needs.includes("学习督促")
    ? "陪我开始一项任务"
    : profile.needs.includes("认真倾听")
      ? "今天先听我说"
      : profile.needs.includes("任务规划")
        ? "帮我拆一下今天的安排"
        : "";
  const defaults =
    aiMode === "study"
      ? ["分析一道方程", "检查我的解法", "整理已知条件", "只提示下一步"]
      : [needPrompt, ...scenes[activeScene].suggestions].filter(
          (item, index, array) => item && array.indexOf(item) === index,
        );
  const chips = $("#suggestions");
  chips.replaceChildren();
  const suggestions = globalThis.TakagiTopicTree.recommendations(
    items?.length ? items : context ? [] : defaults,
    context || globalThis.TakagiTopicTree.plan(activeTerm, ""),
    profile,
    terms,
  );
  suggestions.forEach((t) => {
    const b = document.createElement("button");
    b.textContent = t;
    b.disabled = busy;
    b.onclick = () => submit(t);
    chips.append(b);
  });
}
function syncChatContext() {
  const modeName = aiMode === "study" ? "结构化学习陪伴" : "上下文陪伴";
  $("#chat-context").textContent = scenes[activeScene].name + " · " + modeName;
  input.placeholder =
    aiMode === "study"
      ? "输入题目、已有步骤和最不确定的一处…"
      : "可以直接说复杂一点，我会沿着上一轮继续…";
}
