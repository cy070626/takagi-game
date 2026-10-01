function setScene(key, { silent = false } = {}) {
  if (!scenes[key]) throw Error("无效场景");
  if (focusTimer) {
    clearInterval(focusTick);
    focusTimer = null;
    focusEnd = 0;
  }
  activeScene = key;
  if (activeTerm && activeTerm.scene !== key) {
    activeTerm = null;
    globalThis.TakagiTopicTree.deactivate();
  }
  sceneEl.dataset.scene = key;
  const s = scenes[key];
  $("#chapter").textContent = s.chapter;
  $("#scene-time").textContent = s.time;
  $("#scene-caption").textContent = s.caption;
  $("#scene-title").textContent = s.title;
  $("#scene-description").textContent = s.description;
  const phrase = $("#scene-phrase");
  if (phrase) phrase.textContent = s.phrase || "きょうも、おつかれさま。";
  syncChatContext();
  $("#action-hint").textContent = s.hint;
  $("#character").src = s.image;
  $("#character").alt = s.alt;
  document
    .querySelectorAll("[data-scene]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.scene === key)),
    );
  renderSuggestions();
  const actions = $("#actions");
  actions.replaceChildren();
  s.actions.forEach(([action, icon, label]) => {
    const b = document.createElement("button");
    b.dataset.action = action;
    const symbol = document.createElement("span");
    symbol.textContent = icon;
    b.append(symbol, document.createTextNode(label));
    b.onclick = () => interact(action);
    actions.append(b);
  });
  const welcome = welcomeFor(s);
  if (!silent) {
    speak(welcome, "scene");
    addContext(s.intro);
    add("assistant", welcome);
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
    sceneEl.animate(
      [
        { opacity: 0.72, transform: "translateY(3px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 220, easing: "ease-out" },
    );
  save("takagi-scene", key);
  globalThis.TakagiVisitMemory?.record("场景", `进入${s.name}`, s.title);
  renderTermPreview();
  if (window.refreshSceneGallery) window.refreshSceneGallery();
  return { scene: key, name: s.name };
}
let reactionTimer;
document.querySelectorAll("[data-scene]").forEach(
  (b) =>
    (b.onclick = () => {
      if (b.dataset.scene !== activeScene) setScene(b.dataset.scene);
    }),
);
const savedScene = load("takagi-scene");
const initial =
  profile.startScene &&
  profile.startScene !== "last" &&
  scenes[profile.startScene]
    ? profile.startScene
    : savedScene && scenes[savedScene]
      ? savedScene
      : "classroom";
log.replaceChildren();
setScene(initial);
function pulseReaction(kind = "warm") {
  const spark = $("#reaction-spark");
  if (!spark) return;
  spark.textContent =
    { playful: "✦", quiet: "…", focused: "⌁", scene: "↗", listening: "· · ·" }[
      kind
    ] || "♡";
  spark.dataset.show = "true";
  clearTimeout(spark._timer);
  spark._timer = setTimeout(() => (spark.dataset.show = "false"), 850);
}
function speak(text, kind = "warm") {
  const line = text.match(/^.*?[。？！]/)?.[0] || text;
  $("#bubble").textContent = line.length > 58 ? line.slice(0, 58) + "…" : line;
  sceneEl.dataset.mood = kind === "scene" ? "warm" : kind;
  sceneEl.classList.remove("bubble-pop");
  void sceneEl.offsetWidth;
  sceneEl.classList.add("bubble-pop", "reacting");
  pulseReaction(kind);
  clearTimeout(reactionTimer);
  reactionTimer = setTimeout(
    () => sceneEl.classList.remove("reacting", "bubble-pop"),
    900,
  );
}
function interact(action) {
  const s = activeScene;
  let line = "";
  if (action === "wave")
    line = "嗯，我看到你啦。不用挥那么大力，窗户都要替你回应了。";
  if (action === "note")
    line =
      s === "study"
        ? "纸条上写着：先圈出已知条件，再看我。"
        : "纸条上写着：你觉得谁会先忍不住笑？";
  if (action === "bet") {
    challenge++;
    line =
      challenge % 2
        ? "好啊，赌你先笑。现在就开始？"
        : "这次算你赢。看你忍得那么认真，我差点先笑了。";
  }
  if (action === "stay") setQuiet(true);
  if (action === "stay")
    line =
      s === "rain"
        ? "好，靠在这里听一会儿。雨不会因为我们着急就停得更快。"
        : s === "study"
          ? "嗯。先安静一会儿，翻页时轻一点。"
          : "好，就这样坐一会儿。你不用负责让气氛一直热闹。";
  if (action === "share")
    line =
      "先问问你：愿意用一道菜换我的这道吗？答应得太快，我会怀疑你早就盯上了。";
  if (action === "guess")
    line = "让我猜，你在两道菜之间犹豫了很久，最后选了排队短的。";
  if (action === "tea")
    line = "谢谢。你还记得给我也带一杯呀。甜度是不是又按你自己的口味选的？";
  if (action === "question")
    line = "把题目里最不确定的那一步指给我。我们只拆这一处。";
  if (action === "umbrella")
    line = "拿稳一点。伞面会往你那边偏，是因为风，不是因为我哦。";
  if (action === "rain")
    line = "先不说话。听，栏杆上的雨声比车棚那边更轻一点。";
  if (action === "walk") line = "走吧。只有一把伞的话，你可别故意落后半步。";
  if (action === "timer") {
    if (focusTimer) {
      clearInterval(focusTick);
      focusTimer = null;
      line = "十分钟专心时间提前结束。先看看刚才完成了什么。";
    } else {
      focusEnd = Date.now() + 10 * 60 * 1000;
      focusTimer = true;
      line = "好，十分钟。你先专心，我负责在旁边不打扰你。";
      focusTick = setInterval(() => {
        const left = Math.max(0, Math.ceil((focusEnd - Date.now()) / 1000));
        const m = String(Math.floor(left / 60)).padStart(2, "0"),
          sec = String(left % 60).padStart(2, "0");
        const b = $('[data-action="timer"]');
        if (b)
          b.lastChild.textContent = left
            ? "专心 " + m + ":" + sec
            : "专心十分钟";
        if (!left) {
          clearInterval(focusTick);
          focusTimer = null;
          add("assistant", "十分钟到了。先别评价自己，数一数刚才完成了几步。");
          speak("十分钟到了，伸个懒腰吧。");
        }
      }, 1000);
    }
  }
  if (!line) throw Error("无效互动");
  speak(line);
  addContext(
    {
      wave: "她抬眼看过来。",
      note: "一张小纸条停在桌边。",
      bet: "她笑着接下了挑战。",
      stay: "你们暂时把话放下。",
      share: "她看了看你的餐盘。",
      guess: "她想了一下。",
      tea: "她轻轻道了谢。",
      question: "她看向你的练习册。",
      timer: "专心的时间开始了。",
      umbrella: "透明伞柄递到你手边。",
      rain: "你们一起听走廊外的雨。",
      walk: "她把伞往中间挪了一点。",
    }[action],
  );
  add("assistant", line);
  globalThis.TakagiVisitMemory?.record(
    "互动",
    `${scenes[s].name}中完成“${action}”`,
    line.slice(0, 52),
  );
  return { action, reply: line };
}
$("#character-hit").onclick = () => interact("wave");
