function openProfileSettings() {
  const form = document.createElement("form");
  form.className = "profile-form";
  const makeField = (labelText, control, hint = "") => {
    const label = textEl("label", labelText, "profile-field");
    label.append(control);
    if (hint) label.append(textEl("small", hint));
    return label;
  };
  const name = document.createElement("input");
  name.name = "name";
  name.maxLength = 12;
  name.value = profile.name;
  name.placeholder = "选填，例如 林夏";
  const address = document.createElement("input");
  address.name = "address";
  address.maxLength = 12;
  address.value = profile.address;
  address.placeholder = "例如 同桌、小林";
  const identity = document.createElement("select");
  ["学生", "大学生", "职场中", "自由职业", "其他"].forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    option.selected = profile.identity === value;
    identity.append(option);
  });
  const location = document.createElement("input");
  location.name = "location";
  location.maxLength = 30;
  location.value = profile.location || "";
  location.placeholder = "选填，例如 上海、成都、东京";
  const difficulty = document.createElement("select");
  difficulty.name = "difficulty";
  [
    ["easy", "入门 · 单步字谜与常识"],
    ["medium", "进阶 · 两步条件与语言转换"],
    ["hard", "成人挑战 · 多步逻辑与概率"],
    ["expert", "高阶 · 信息论、组合与反直觉推理"],
  ].forEach(([value, label]) => {
    const option = textEl("option", label);
    option.value = value;
    difficulty.append(option);
  });
  difficulty.value = ["easy", "medium", "hard", "expert"].includes(
    profile.difficulty,
  )
    ? profile.difficulty
    : "hard";
  const model = document.createElement("select");
  model.name = "model";
  [
    ["qwen-flash", "千问 3.8 Flash · 默认 · 可联网搜索", false],
    ["qwen-max", "千问 3.8 Max · 可联网搜索", false],
    ["deepseek-flash", "DeepSeek Flash", false],
    ["deepseek-pro", "DeepSeek Pro · 仅文本", false],
    ["local", "本地陪伴引擎 · 无需联网", false],
    ["gpt-5.6-luna", "GPT 5.6 Luna · 当前暂不支持", true],
    ["gpt-5.6-terra", "GPT 5.6 Terra · 当前暂不支持", true],
  ].forEach(([value, label, disabled]) => {
    const option = textEl("option", label);
    option.value = value;
    option.disabled = disabled;
    model.append(option);
  });
  model.value = [
    "local",
    "qwen-max",
    "qwen-flash",
    "deepseek-pro",
    "deepseek-flash",
  ].includes(profile.modelPreference)
    ? profile.modelPreference
    : "qwen-flash";
  const chatStyle = document.createElement("select");
  chatStyle.name = "chatStyle";
  [
    ["gentle", "轻松同桌 · 自然、温和"],
    ["playful", "俏皮观察 · 适量小玩笑"],
    ["direct", "认真直说 · 少些铺垫"],
    ["analytical", "条理分析 · 先拆清楚"],
    ["quiet", "少说一点 · 留出停顿"],
  ].forEach(([value, label]) => {
    const option = textEl("option", label);
    option.value = value;
    chatStyle.append(option);
  });
  chatStyle.value = [
    "gentle",
    "playful",
    "direct",
    "analytical",
    "quiet",
  ].includes(profile.chatStyle)
    ? profile.chatStyle
    : "gentle";
  const currentMood = document.createElement("select");
  currentMood.name = "currentMood";
  [
    ["calm", "平静"],
    ["tired", "有点累"],
    ["happy", "心情不错"],
    ["anxious", "有些焦虑"],
    ["low", "情绪低落"],
    ["focused", "想专注"],
  ].forEach(([value, label]) => {
    const option = textEl("option", label);
    option.value = value;
    currentMood.append(option);
  });
  currentMood.value = [
    "calm",
    "tired",
    "happy",
    "anxious",
    "low",
    "focused",
  ].includes(profile.currentMood)
    ? profile.currentMood
    : "calm";
  const context = document.createElement("textarea");
  context.name = "context";
  context.maxLength = 120;
  context.value = profile.context;
  context.placeholder = "例如：工作转换期、准备考试、最近在处理一段关系";
  const startScene = document.createElement("select");
  [
    ["last", "继续上次打开的 Chapter"],
    ["classroom", "放学教室"],
    ["cafeteria", "食堂午后"],
    ["study", "晚自习"],
    ["rain", "雨天走廊"],
    ["valentine", "2月14日"],
    ["whiteDay", "3月14日"],
    ["festival", "夏日祭"],
  ].forEach(([value, label]) => {
    const option = textEl("option", label);
    option.value = value;
    startScene.append(option);
  });
  startScene.value =
    profile.startScene &&
    ["last", ...Object.keys(scenes)].includes(profile.startScene)
      ? profile.startScene
      : "last";
  const startMode = document.createElement("select");
  [
    ["last", "继续上次使用的模式"],
    ["chat", "日常聊天"],
    ["study", "学习陪伴"],
  ].forEach(([value, label]) => {
    const option = textEl("option", label);
    option.value = value;
    startMode.append(option);
  });
  startMode.value = ["last", "chat", "study"].includes(profile.startMode)
    ? profile.startMode
    : "last";
  const guide = textEl(
    "p",
    "新玩家默认使用千问 3.8 Flash。连接失败时先重试两次，再依次尝试千问 Max、DeepSeek Flash、DeepSeek Pro；密码错误不会触发模型切换。场景、互动、聊天与游戏会在当前标签页形成一次连贯记忆。",
    "profile-guide",
  );
  form.append(
    guide,
    textEl("h3", "回应方式", "profile-section-title"),
    makeField(
      "对话引擎",
      model,
      "在线引擎共用高木角色和语气规则。千问可联网搜索；密钥留在 Netlify Function。失败时会显示原因。",
    ),
    makeField("她的说话方式", chatStyle, "控制节奏、直接程度和玩笑密度。"),
    makeField("你现在的心情", currentMood, "调整回应强度和节奏。"),
    textEl("h3", "关于你", "profile-section-title"),
    makeField("你的名字", name, "选填，只用于个性化称呼。"),
    makeField("希望她怎么称呼你", address, "留空时使用“同桌”。"),
    makeField("你现在的身份", identity, "用于选择更贴近你的例子。"),
    makeField("所在地区", location, "选填，用于天气和生活话题，不自动定位。"),
    textEl("h3", "进入页面时", "profile-section-title"),
    makeField("首选 Chapter", startScene, "选择固定场景或继续上次场景。"),
    makeField("首选对话模式", startMode, "选择固定模式或继续上次模式。"),
    textEl("h3", "内容偏好", "profile-section-title"),
    makeField("谜题难度", difficulty, "高难度会增加条件和推理步骤。"),
    makeField("当前情境", context, "选填，最多 120 字。"),
  );
  const interestFieldset = document.createElement("fieldset");
  interestFieldset.className = "need-options";
  interestFieldset.append(textEl("legend", "希望了解的话题 · 最多 4 项"));
  ["中日饮食", "作息与生活", "天气与季节", "地理与旅行"].forEach((value) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.checked = (profile.interests || []).includes(value);
    checkbox.onchange = () => {
      const checked = interestFieldset.querySelectorAll("input:checked");
      if (checked.length > 4) {
        checkbox.checked = false;
        interestNote.textContent = "最多选择 4 项。";
        interestNote.hidden = false;
      }
    };
    label.append(checkbox, document.createTextNode(value));
    interestFieldset.append(label);
  });
  const interestNote = textEl("small", "", "profile-note");
  interestFieldset.append(interestNote);
  form.append(interestFieldset);
  const fieldset = document.createElement("fieldset");
  fieldset.className = "need-options";
  fieldset.append(textEl("legend", "这次更需要什么 · 最多 3 项"));
  [
    "轻松陪伴",
    "认真倾听",
    "学习督促",
    "情绪整理",
    "日常闲聊",
    "任务规划",
  ].forEach((value) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = value;
    checkbox.checked = profile.needs.includes(value);
    checkbox.onchange = () => {
      const checked = fieldset.querySelectorAll("input:checked");
      if (checked.length > 3) {
        checkbox.checked = false;
        const note = fieldset.querySelector("small");
        note.textContent = "最多选择 3 项。";
        note.hidden = false;
      }
    };
    label.append(checkbox, document.createTextNode(value));
    fieldset.append(label);
  });
  fieldset.append(textEl("small", "", "profile-note"));
  form.append(fieldset);
  const actions = document.createElement("div");
  actions.className = "profile-actions";
  const saveButton = textEl("button", "保存并应用", "profile-save");
  saveButton.type = "submit";
  const motionButton = textEl(
    "button",
    sceneEl.classList.contains("alive") ? "暂停人物动态" : "开启人物动态",
    "profile-motion",
  );
  motionButton.type = "button";
  motionButton.onclick = () => {
    $("#motion").click();
    motionButton.textContent = sceneEl.classList.contains("alive")
      ? "暂停人物动态"
      : "开启人物动态";
  };
  const resetButton = textEl("button", "填写默认值", "profile-reset");
  resetButton.type = "button";
  resetButton.onclick = () => {
    name.value = "";
    address.value = "同桌";
    identity.value = "学生";
    location.value = "";
    difficulty.value = "hard";
    model.value = "qwen-flash";
    chatStyle.value = "gentle";
    currentMood.value = "calm";
    startScene.value = "last";
    startMode.value = "last";
    context.value = "";
    interestFieldset
      .querySelectorAll("input")
      .forEach((input) => (input.checked = false));
    fieldset
      .querySelectorAll("input")
      .forEach((input) => (input.checked = input.value === "轻松陪伴"));
    const note = fieldset.querySelector("small");
    note.textContent = "默认值已填入，点击“保存并应用”后生效。";
    note.hidden = false;
  };
  const clearButton = textEl("button", "清除本机偏好", "profile-clear");
  clearButton.type = "button";
  clearButton.onclick = () => {
    if (
      !confirm(
        "清除这台设备上的称呼、场景、短期对话、游戏与音乐偏好？本地相册和青春诗笺不会被删除。",
      )
    )
      return;
    [
      "takagi-profile",
      "takagi-scene",
      "takagi-motion",
      "takagi-pose",
      "takagi-chat-mode",
      "takagi-arcade-difficulty",
      "takagi-arcade-last-game",
      "takagi-lateral-mode",
      "takagi-music-scene",
      "takagi-music-effects",
      "takagi-music-fit",
      "takagi-guide-seen-v1",
    ].forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });
    try {
      sessionStorage.removeItem("takagi-chat-session");
      sessionStorage.removeItem("takagi-ai-password");
      sessionStorage.removeItem("takagi-visit-memory-v1");
      sessionStorage.removeItem("takagi-topic-tree-v1");
      sessionStorage.removeItem("takagi-engine-session-v1");
    } catch {}
    location.reload();
  };
  actions.append(saveButton, motionButton, resetButton, clearButton);
  form.append(actions);
  form.onsubmit = (e) => {
    e.preventDefault();
    globalThis.TakagiEngineSession?.reset();
    const needs = Array.from(
      fieldset.querySelectorAll("input:checked"),
      (item) => item.value,
    ).slice(0, 3);
    const interests = Array.from(
      interestFieldset.querySelectorAll("input:checked"),
      (item) => item.value,
    ).slice(0, 4);
    profile = {
      name: name.value.trim(),
      address: address.value.trim() || "同桌",
      identity: identity.value,
      location: location.value.trim(),
      difficulty: difficulty.value,
      difficultyVersion: 3,
      context: context.value.trim(),
      interests,
      needs: needs.length ? needs : ["轻松陪伴"],
      modelPreference: model.value,
      chatStyle: chatStyle.value,
      currentMood: currentMood.value,
      startScene: startScene.value,
      startMode: startMode.value,
    };
    save("takagi-profile", JSON.stringify(profile));
    dialogue.setProfile(profile);
    window.dispatchEvent(new Event("takagi-profile-change"));
    renderProfileSummary();
    renderSuggestions();
    syncChatContext();
    dialog.close();
    const line = `记住了，${preferredAddress()}。${profile.context ? `最近是“${profile.context}”，我会留意。` : "我们慢慢聊。"}`;
    addContext(`${preferredAddress()}的个性设置已更新。`);
    add("assistant", line);
    speak(line, "warm");
  };
  openDialog("个性设置 · 回应偏好", form);
  model.focus();
}
$("#settings").onclick = openProfileSettings;
$("#profile-summary").onclick = openProfileSettings;
renderProfileSummary();
