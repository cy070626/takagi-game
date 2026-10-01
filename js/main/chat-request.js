const recovery = textEl("div", "", "chat-recovery");
recovery.hidden = true;
recovery.setAttribute("role", "status");
$("#password-status").after(recovery);
let failedTurn = null;
function showRecovery(error, turn) {
  failedTurn = turn;
  recovery.replaceChildren();
  recovery.hidden = false;
  const retry = textEl("button", "重试这条消息");
  retry.type = "button";
  retry.disabled = busy;
  retry.onclick = () => {
    if (!busy && failedTurn) submit(failedTurn.text, failedTurn);
  };
  const restore = textEl("button", "恢复原文编辑");
  restore.type = "button";
  restore.onclick = () => {
    if (busy) return;
    if (input.value.trim() && input.value.trim() !== turn.text) {
      passwordStatus.textContent = "输入框已有新草稿，请先保存草稿再恢复原文。";
      return;
    }
    input.value = turn.text;
    if (turn.attachment) pendingImage = turn.attachment;
    showPendingImage();
    syncComposer();
    input.focus();
  };
  const details = document.createElement("details"),
    heading = textEl("summary", "查看失败原因");
  const diagnostics = (error.attempts || [])
    .map(
      (item) =>
        `${item.engineName || item.engine}：${item.message}（状态 ${item.status}，重试 ${item.retryCount || 0} 次）`,
    )
    .join("；");
  details.append(
    heading,
    textEl(
      "p",
      `${error.engineName || "在线引擎"}：${error.upstreamMessage || error.message}。${diagnostics} 请求编号：${error.requestId || "未收到服务器响应"}。`,
    ),
  );
  const refresh = textEl("button", "刷新页面重连");
  refresh.type = "button";
  refresh.onclick = () => {
    if (busy) return;
    try {
      sessionStorage.setItem(
        "takagi-recovery-draft",
        JSON.stringify({
          text: input.value.trim() || turn.text,
          attachment: pendingImage || turn.attachment,
        }),
      );
    } catch {
      passwordStatus.textContent = "草稿暂时无法保存，请先复制原文再刷新。";
      return;
    }
    location.reload();
  };
  recovery.append(retry, restore, refresh, details);
}
let recentChatImage = null,
  plannedTopic = null;
async function requestAI(message, image) {
  plannedTopic = globalThis.TakagiTopicTree.resolve(
    activeTerm || globalThis.TakagiTopicTree.sceneTerm(terms, activeScene),
    message,
    terms,
  );
  if (plannedTopic?.detached) {
    activeTerm = null;
    globalThis.TakagiTopicTree.deactivate();
    plannedTopic = null;
  }
  const topicContext = plannedTopic;
  const referred =
    recentChatImage &&
    Date.now() - recentChatImage.at < 5 * 60000 &&
    /这张|那张|图中|图片|上图|刚才的图|这道题|图里|第[一二三四五六七八九十0-9]+题/.test(
      message,
    )
      ? recentChatImage
      : null;
  const requestImage = image || referred;
  const searchRequested =
    /联网|查一下|查查|查一查|帮我查|搜一下|搜一搜|核实|查资料|查证|查来源|最新|实时/.test(
      message,
    );
  const rethinkRequested = /换个模型|换一个模型|换模型想|试试更强的模型/.test(
    message,
  );
  const baseModel = profile.modelPreference.startsWith("qwen-")
    ? profile.modelPreference
    : globalThis.TakagiEngineSession?.preference(profile.modelPreference) ||
      profile.modelPreference;
  const selected =
    searchRequested && !baseModel.startsWith("qwen-")
      ? "qwen-flash"
      : rethinkRequested
        ? baseModel.startsWith("qwen-")
          ? "qwen-max"
          : "deepseek-pro"
        : baseModel;
  const cancel = textEl("button", "停止等待", "chat-cancel");
  cancel.type = "button";
  $("#ai-status").before(cancel);
  const controller = new AbortController();
  cancel.onclick = () => controller.abort();
  const stop = () => controller.abort();
  window.addEventListener("pagehide", stop, { once: true });
  try {
    const data = await globalThis.TakagiChatChain.run(
      {
        message,
        image: requestImage?.dataUrl,
        password: passwordInput.value,
        mode: aiMode,
        scene: activeScene,
        profile,
        modelPreference: selected,
        history: aiHistory.slice(-CHAT_CONTEXT_LIMIT),
        topicContext,
        conversationContext: globalThis.TakagiTopicTree.handoff(aiHistory),
        ...(searchRequested ? { webSearch: true } : {}),
        visitContext: globalThis.TakagiVisitMemory?.context() || "",
      },
      {
        signal: controller.signal,
        onProgress: (step) => {
          const state = `${step.engineName}${searchRequested && step.engine.startsWith("qwen-") ? " · 将按需联网查资料" : rethinkRequested ? " · 换个引擎继续想" : ""} · ${step.attempt === 1 ? "正在连接" : `重试连接 ${step.attempt - 1}/2`}${step.image ? " · 图片识别" : ""}`;
          $("#ai-status").textContent = state;
          const typing = document.querySelector("#log .typing");
          if (typing)
            typing.textContent =
              step.attempt === 1
                ? "高木正在听你说……"
                : "刚才没接上，正在重新连接……";
        },
      },
    );
    try {
      sessionStorage.setItem("takagi-ai-password", passwordInput.value);
    } catch {}
    forgetPassword.hidden = false;
    passwordStatus.textContent =
      "密码已验证并保存在当前标签页。刷新后仍可用，关闭标签页或点击“清除”后失效。";
    if (image) recentChatImage = { ...image, at: Date.now() };
    if (!profile.modelPreference.startsWith("qwen-"))
      globalThis.TakagiEngineSession?.accept(profile.modelPreference, data);
    return {
      visualCue: typeof data.visualCue === "string" ? data.visualCue : "",
      engine: data.engine || "",
      requestId: data.requestId || "",
      retryCount: data.retryCount || 0,
      connectionAttempts: data.connectionAttempts || 1,
      visionEnabled: Boolean(data.visionEnabled),
      text: data.text.trim(),
      mood: data.mood || "listening",
      topic: data.topic || "chat",
      suggestions: Array.isArray(data.suggestions)
        ? data.suggestions.slice(0, 3)
        : [],
      knowledgeTags: Array.isArray(data.knowledgeTags)
        ? data.knowledgeTags
        : [],
      engineName: data.engineName || "",
      webSearchEnabled: Boolean(data.webSearchEnabled),
      fallbacks: Array.isArray(data.fallbacks)
        ? data.fallbacks.filter((item) => item.engine !== data.engine)
        : [],
    };
  } catch (error) {
    console.error("[AI 调用失败]", {
      engine: error.engineName,
      code: error.code,
      status: error.status,
      message: error.upstreamMessage || error.message,
      requestId: error.requestId,
      attempts: error.attempts,
    });
    throw error;
  } finally {
    cancel.remove();
    window.removeEventListener("pagehide", stop);
  }
}
