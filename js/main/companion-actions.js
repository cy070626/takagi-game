let quietMode = false,
  lastActivity = Date.now(),
  lastPromptAt = Date.now(),
  idleIndex = 0;
function markActivity() {
  lastActivity = Date.now();
}
const baseSceneInteract = interact;
interact = function (action) {
  const chapterLines = {
    chocolate: [
      "猜得这么快，会让我怀疑你从早上就在等。再猜一次：是义理巧克力，还是我只想给你的？",
      "她用指尖轻轻按住纸袋。",
    ],
    gift: [
      "我收下了。价格先不问，我更想知道，你挑它的时候想到的是我的哪一点。",
      "回礼被轻轻接了过去。",
    ],
    reason: [
      "让我猜：你怕挑得太郑重，也怕显得随便，所以在两种东西之间犹豫了很久。对吗？",
      "她看了看礼物，又看向你。",
    ],
    stall: [
      "先选一个。苹果糖、捞金鱼，还是站在旁边看别人挑战射的？只能选一个哦。",
      "摊位的灯在身后亮起来。",
    ],
    fireworks: [
      "还有一点时间。第一束升起来的时候，你可别只顾着看天空，忘了刚才想说的话。",
      "远处传来烟花试放的闷响。",
    ],
    find: [
      "走散的话，不准只说“在摊位旁边”。告诉我一个只有我们刚才注意到的东西，我就去那里找你。",
      "人群从你们身边慢慢经过。",
    ],
  };
  if (action === "note" && activeScene === "valentine")
    chapterLines.note = [
      "纸条上只有一句：你先猜，我再告诉你。",
      "一张折好的纸条停在纸袋旁边。",
    ];
  if (action === "walk" && activeScene === "whiteDay")
    chapterLines.walk = [
      "走吧。回礼的理由可以路上慢慢说，我暂时不催你。",
      "她放慢脚步，等你并肩。",
    ];
  if (action === "walk" && activeScene === "festival")
    chapterLines.walk = [
      "跟紧一点。等走到能看见天空的地方，再决定站哪边。",
      "她在人群边回头确认你还在。",
    ];
  if (
    action === "stay" &&
    ["valentine", "whiteDay", "festival"].includes(activeScene)
  ) {
    setQuiet(true);
    chapterLines.stay =
      activeScene === "valentine"
        ? [
            "那就等铃声。纸袋先放在这里，看你还能忍住多久不问。",
            "你们一起等着放学铃。",
          ]
        : activeScene === "whiteDay"
          ? [
              "慢慢说。我想听你挑这个回礼时真正考虑了什么。",
              "三月的暮色停在桌边。",
            ]
          : [
              "好，先站在这里。等第一束烟花升起来再说。",
              "你们暂时把话留到烟花开始。",
            ];
  }
  const item = chapterLines[action];
  if (!item) return baseSceneInteract(action);
  speak(item[0], action === "find" ? "playful" : "warm");
  addContext(item[1]);
  add("assistant", item[0]);
  return { action, reply: item[0] };
};
function setQuiet(value) {
  if (!value && dialogue.topic === "quiet") dialogue.topic = "";
  quietMode = value;
  $("#quiet-mode").setAttribute("aria-pressed", String(value));
  $("#quiet-mode").textContent = value ? "正在安静陪伴 · 继续聊天" : "安静陪伴";
  $("#presence-label").textContent = value
    ? "不用说话，坐一会儿就好"
    : "她在听";
  sceneEl.dataset.mood = value ? "quiet" : "listening";
  if (value) speak("嗯，不用找话题。我们就这样坐一会儿。");
  return { quiet: value };
}
$("#quiet-mode").onclick = () => setQuiet(!quietMode);
