async function submit(text = input.value, retryTurn = null) {
  const attachment = retryTurn?.attachment || pendingImage;
  if (busy || (!text.trim() && !attachment)) return;
  const siteAction = !attachment && globalThis.TakagiChatHub.intent(text);
  if (siteAction) {
    await runChatAction(siteAction, text.trim().slice(0, 1200));
    return;
  }
  if (profile.modelPreference !== "local" && !passwordInput.value.trim()) {
    passwordStatus.textContent = "请先输入 AI 访问密码，再发送消息。";
    passwordInput.focus();
    return;
  }
  const sent =
    text.trim().slice(0, 1200) ||
    (attachment
      ? "请看看这张图片，先说出你确实观察到的内容，再自然地和我聊下去。"
      : "");
  markActivity();
  if (quietMode) setQuiet(false);
  busy = true;
  recovery.hidden = true;
  const userRow =
    retryTurn?.row ||
    add(
      "user",
      text.trim().slice(0, 1200) || (attachment ? "发来一张图片。" : sent),
    );
  if (attachment && !retryTurn) {
    const image = document.createElement("img");
    image.src = attachment.dataUrl;
    image.alt = attachment.name;
    image.className = "message-image";
    userRow.append(image);
  }
  if (!retryTurn || input.value.trim() === text.trim()) {
    input.value = "";
    pendingImage = null;
    attachmentPreview.hidden = true;
    attachmentPreview.replaceChildren();
  }
  syncComposer();
  document
    .querySelectorAll("#suggestions button")
    .forEach((b) => (b.disabled = true));
  sceneEl.dataset.mood = "listening";
  $("#presence-label").textContent = "她正在听";
  speak(aiMode === "study" ? "让我看看这一步。" : "嗯，我在听。", "listening");
  const typing = textEl("p", "高木正在想怎么回答…", "typing");
  log.append(typing);
  log.scrollTop = log.scrollHeight;
  let response,
    online = profile.modelPreference !== "local";
  try {
    if (!online) throw Error("local");
    response = await requestAI(sent, attachment);
    const modelLabel =
        response.engineName ||
        modelNames[profile.modelPreference] ||
        "在线模型",
      searchLabel = response.webSearchEnabled ? " · 联网搜索已启用" : "",
      stable = profile.modelPreference.startsWith("qwen-")
        ? 0
        : globalThis.TakagiEngineSession?.remaining() || 0,
      switched = response.fallbacks.length
        ? ` · 已自动切换，前序失败：${[...new Set(response.fallbacks.map((item) => item.engineName))].join("、")}`
        : stable
          ? ` · 暂用备用引擎，约 ${stable} 分钟后恢复首选`
          : "";
    if (response.fallbacks.length) addContext("刚才没接上，现在可以继续聊了。");
    $("#ai-status").textContent = response.knowledgeTags.length
      ? `${modelLabel} 在线${searchLabel}${switched} · 本轮参考：${response.knowledgeTags.join("、")}`
      : `${modelLabel} 在线${searchLabel}${switched} · 已结合本次访问记忆`;
    if (response.connectionAttempts > 1)
      $("#ai-status").textContent +=
        ` · 共连接 ${response.connectionAttempts} 次`;
    if (response.visionEnabled) $("#ai-status").textContent += " · 已读取图片";
    failedTurn = null;
  } catch (error) {
    online = false;
    if (error?.message !== "local") {
      showRecovery(error, { text: sent, attachment, row: userRow });
      if (!input.value.trim()) {
        input.value = text.trim();
        pendingImage = attachment;
        showPendingImage();
        syncComposer();
      }
    }
    if (
      error?.code === "INVALID_ADMIN_PASSWORD" ||
      error?.code === "PASSWORD_NOT_CONFIGURED"
    ) {
      try {
        sessionStorage.removeItem("takagi-ai-password");
      } catch {}
      passwordInput.value = "";
      forgetPassword.hidden = true;
      passwordStatus.textContent =
        error.code === "PASSWORD_NOT_CONFIGURED"
          ? "站点尚未配置 AI 访问密码，请联系站点管理员。"
          : "密码不正确，请重新输入后再发送。";
      response = {
        text:
          error.code === "PASSWORD_NOT_CONFIGURED"
            ? "站点还没有配置 AI 访问密码，暂时无法连接在线引擎。"
            : "密码没有通过校验，刚才的内容没有发送给在线引擎。请重新输入密码后再试。",
        mood: "quiet",
        topic: "password-error",
        suggestions: [],
        knowledgeTags: [],
      };
    } else if (error?.message === "local") {
      plannedTopic = globalThis.TakagiTopicTree.resolve(
        activeTerm,
        sent,
        terms,
      );
      if (plannedTopic?.detached) {
        activeTerm = null;
        globalThis.TakagiTopicTree.deactivate();
        plannedTopic = null;
      } else if (plannedTopic?.term) activeTerm = plannedTopic.term;
      response = window.companionLocalReply
        ? window.companionLocalReply(
            sent,
            dialogue,
            activeScene,
            aiMode,
            localKnowledgeReply,
          )
        : dialogue.reply(sent, activeScene, aiMode);
    } else {
      response = {
        text:
          error?.code === "CLIENT_CANCELLED"
            ? "好，先停一下。我就在旁边，想继续时再叫我。"
            : "我可能刚好离开座位一会儿……你可以点一下重试，或者刷新页面，再来找我。别悄悄溜走哦。ふふ。",
        mood: "quiet",
        topic: "engine-error",
        suggestions: [],
        knowledgeTags: [],
      };
    }
    const unavailable =
        error?.engineName || modelNames[profile.modelPreference] || "在线模型",
      status = error?.upstreamStatus ?? error?.status;
    $("#ai-status").textContent =
      error?.code === "INVALID_ADMIN_PASSWORD"
        ? "在线引擎未调用 · AI 访问密码不正确"
        : error?.code === "PASSWORD_NOT_CONFIGURED"
          ? "在线引擎未调用 · 站点尚未配置 AI 访问密码"
          : profile.modelPreference === "local"
            ? "本地陪伴引擎 · 已结合称呼、心情与当前情境"
            : `${unavailable} 调用失败${status !== undefined ? `（状态 ${status}）` : ""} · ${error?.message || "服务暂时不可用"}`;
  }
  if (
    response.topic !== "engine-error" &&
    response.topic !== "password-error"
  ) {
    const topicPlan =
      plannedTopic ||
      globalThis.TakagiTopicTree.resolve(activeTerm, sent, terms);
    globalThis.TakagiTopicTree.commit(topicPlan, sent, response.text);
    if (topicPlan?.term) activeTerm = topicPlan.term;
    rememberTurn(sent + (attachment ? " [本轮附有图片]" : ""), response.text);
    globalThis.TakagiVisitMemory?.record(
      "对话",
      sent.slice(0, 72),
      response.text.slice(0, 72),
    );
  }
  await new Promise((r) =>
    setTimeout(r, online ? 80 : 150 + Math.min(sent.length * 4, 180)),
  );
  typing.remove();
  sceneEl.dataset.mood = response.mood;
  sceneEl.classList.add("speaking");
  $("#presence-label").textContent =
    response.mood === "quiet" ? "陪你坐一会儿" : "她轻声说";
  const row = textEl("div", "", "message assistant");
  const failed = ["engine-error", "password-error"].includes(response.topic);
  row.append(
    failed ? textEl("span", "系统提示") : assistantHeader(response.mood),
  );
  const p = textEl("p", "");
  row.setAttribute("aria-hidden", "true");
  row.append(p);
  log.append(row);
  const chars = Array.from(response.text);
  const reduced =
    failed ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    load("takagi-text-speed") === "instant";
  let skip = false;
  const complete = textEl("button", "显示整句", "reply-complete");
  complete.type = "button";
  complete.onclick = () => {
    skip = true;
  };
  row.append(complete);
  if (reduced) {
    p.textContent = response.text;
  } else {
    for (let i = 0; i < chars.length; i += 3) {
      if (skip || document.hidden) {
        p.textContent = response.text;
        break;
      }
      p.textContent += chars.slice(i, i + 3).join("");
      if (log.scrollHeight - log.scrollTop - log.clientHeight < 160)
        log.scrollTop = log.scrollHeight;
      await new Promise((r) => setTimeout(r, 24));
    }
  }
  complete.remove();
  if (!failed && response.visualCue) addSceneImage(row, response.visualCue);
  row.removeAttribute("aria-hidden");
  if (!failed) {
    attachReactions(row);
    speak(response.text, response.mood);
    TakagiSubtleEffects.trigger(log, TakagiSubtleEffects.detect(response.text));
  }
  sceneEl.classList.remove("speaking");
  busy = false;
  turn++;
  syncComposer();
  renderSuggestions(response.suggestions, plannedTopic);
  document
    .querySelectorAll("#suggestions button")
    .forEach((b) => (b.disabled = false));
  recovery.querySelectorAll("button").forEach((b) => (b.disabled = false));
  $("#presence-label").textContent = "她在听";
  if (response.topic === "quiet") setQuiet(true);
  renderMemory();
  markActivity();
}
try {
  const draft = JSON.parse(
    sessionStorage.getItem("takagi-recovery-draft") || "null",
  );
  if (draft) {
    input.value = String(draft.text || "").slice(0, 1200);
    pendingImage = draft.attachment || null;
    showPendingImage();
    syncComposer();
    sessionStorage.removeItem("takagi-recovery-draft");
  }
} catch {}
chatForm.onsubmit = (e) => {
  e.preventDefault();
  submit();
};
input.oninput = () => {
  syncComposer();
  markActivity();
  if (!busy) {
    sceneEl.dataset.mood = "listening";
    $("#presence-label").textContent = input.value
      ? "慢慢写，她在等你"
      : "她在听";
  }
};
input.onkeydown = (e) => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    submit();
  }
};
function renderMemory() {
  const box = $("#memory-strip");
  if (!box) return;
  const items = dialogue.memorySummary(),
    sessionTurns = Math.floor(aiHistory.length / 2);
  box.replaceChildren();
  if (!items.length && !sessionTurns) {
    box.hidden = true;
    return;
  }
  box.hidden = false;
  box.append(
    textEl(
      "span",
      sessionTurns
        ? `短期记忆 · 已记录 ${Math.min(aiHistory.length, CHAT_CONTEXT_LIMIT)} / ${CHAT_CONTEXT_LIMIT} 条消息`
        : `短期记忆 · 最多 ${CHAT_CONTEXT_LIMIT} 条消息`,
    ),
  );
  items.forEach((item) => box.append(textEl("small", item)));
}
document.querySelectorAll("[data-mode]").forEach(
  (button) =>
    (button.onclick = () => {
      if (busy || button.dataset.mode === aiMode) return;
      aiMode = button.dataset.mode === "study" ? "study" : "chat";
      save("takagi-chat-mode", aiMode);
      document
        .querySelectorAll("[data-mode]")
        .forEach((item) =>
          item.setAttribute(
            "aria-pressed",
            String(item.dataset.mode === aiMode),
          ),
        );
      syncChatContext();
      renderSuggestions();
      addContext(
        aiMode === "study"
          ? "她把练习册往你这边挪了挪。把题目和已经想到的步骤写下来吧。"
          : "她合上练习册，重新看向你。想从哪件小事聊起？",
      );
      $("#bubble").textContent =
        aiMode === "study"
          ? "先看题目。你已经想到哪一步了？"
          : "好，先聊一会儿。";
      input.focus();
    }),
);
sceneEl.addEventListener("pointermove", (e) => {
  if (
    !sceneEl.classList.contains("alive") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const rect = sceneEl.getBoundingClientRect();
  sceneEl.style.setProperty(
    "--look-x",
    ((e.clientX - rect.left) / rect.width - 0.5) * 9 + "px",
  );
  sceneEl.style.setProperty(
    "--look-y",
    ((e.clientY - rect.top) / rect.height - 0.5) * 5 + "px",
  );
});
sceneEl.addEventListener("pointerleave", () => {
  sceneEl.style.setProperty("--look-x", "0px");
  sceneEl.style.setProperty("--look-y", "0px");
});
setInterval(() => {
  if (
    document.hidden ||
    quietMode ||
    busy ||
    focusTimer ||
    input.value ||
    dialog.open ||
    Date.now() - lastActivity < 90000 ||
    Date.now() - lastPromptAt < 180000
  )
    return;
  const lines = [
    "不用一直找话题。坐一会儿也可以。",
    "你忙你的，想说话时再开口。",
    "今天还有什么小事，想留到现在讲吗？",
  ];
  speak(lines[idleIndex++ % lines.length]);
  lastPromptAt = Date.now();
}, 15000);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) markActivity();
});
