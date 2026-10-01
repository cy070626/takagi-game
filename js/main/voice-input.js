function paintVoice(state, message) {
  voiceState = state;
  voiceStatus.dataset.state = state;
  voiceStatus.textContent = message;
  voiceButton.setAttribute("aria-pressed", String(state === "listening"));
  voiceButton.textContent =
    state === "listening"
      ? "■ 停止并转文字"
      : state === "requesting"
        ? "◌ 等待麦克风…"
        : state === "converting"
          ? "◌ 云端转写中…"
          : state === "unsupported"
            ? "语音暂不可用"
            : "◉ 开始听";
  voiceButton.setAttribute(
    "aria-label",
    state === "listening"
      ? "停止录音并转换成文字"
      : state === "unsupported"
        ? "语音转写当前不可用"
        : "开始语音输入",
  );
  syncComposer();
}
function releaseVoiceStream() {
  window.dispatchEvent(
    new CustomEvent("takagi:voice-recording", { detail: { active: false } }),
  );
}
function writeBrowserSpeech(words) {
  const text = String(words || "").trim();
  if (!text) return false;
  input.value = [voiceBase, text].filter(Boolean).join(voiceBase ? " " : "");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}
function startBrowserSpeech() {
  const SpeechInput =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechInput) return false;
  voiceBase = input.value.trim();
  voiceFallbackText = "";
  voiceFallbackError = "";
  paintVoice("requesting", "正在启动浏览器语音识别…");
  try {
    voiceFallback = new SpeechInput();
    voiceFallback.lang = "zh-CN";
    voiceFallback.interimResults = true;
    voiceFallback.continuous = true;
    voiceFallback.maxAlternatives = 1;
    voiceFallback.onstart = () => {
      voiceStartedAt = Date.now();
      paintVoice("listening", "正在听你说。说完后点“停止并转文字”。");
      $("#presence-label").textContent = "她在听你说";
      window.dispatchEvent(
        new CustomEvent("takagi:voice-recording", { detail: { active: true } }),
      );
      voiceTimer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - voiceStartedAt) / 1000),
          minutes = String(Math.floor(elapsed / 60)).padStart(2, "0"),
          seconds = String(elapsed % 60).padStart(2, "0");
        voiceStatus.textContent = `正在听你说 ${minutes}:${seconds}。说完后点“停止并转文字”。`;
        if (elapsed >= 90) stopVoice();
      }, 1000);
    };
    voiceFallback.onresult = (event) => {
      let words = "";
      for (let i = 0; i < event.results.length; i++)
        words += event.results[i][0]?.transcript || "";
      voiceFallbackText = words.trim();
      if (writeBrowserSpeech(voiceFallbackText))
        voiceStatus.textContent =
          "正在识别并写入输入框。说完后点“停止并转文字”。";
    };
    voiceFallback.onerror = (event) => {
      voiceFallbackError = event.error || "unavailable";
    };
    voiceFallback.onend = () => {
      clearInterval(voiceTimer);
      releaseVoiceStream();
      const words = voiceFallbackText;
      const error = voiceFallbackError;
      voiceFallback = null;
      $("#presence-label").textContent = "她在听";
      if (writeBrowserSpeech(words)) {
        paintVoice(
          "done",
          "已使用浏览器语音识别写入输入框。请确认内容，再点击发送。",
        );
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      } else if (error === "not-allowed" || error === "service-not-allowed") {
        paintVoice(
          "error",
          "麦克风权限未开放。请在地址栏允许麦克风后，再点一次“开始听”。",
        );
      } else if (error === "network") {
        paintVoice("error", "浏览器语音识别需要网络连接。请检查网络后再试。");
      } else {
        paintVoice(
          "error",
          "这次没有听清。请靠近麦克风再试一次，也可以直接输入文字。",
        );
      }
      syncComposer();
    };
    voiceFallback.start();
    return true;
  } catch {
    voiceFallback = null;
    paintVoice("error", "浏览器语音识别未能启动。请刷新页面后再试。");
    return true;
  }
}
function stopVoice() {
  if (voiceFallback) {
    paintVoice("converting", "正在整理识别到的文字…");
    voiceFallback.stop();
  }
}
async function startVoice() {
  if (startBrowserSpeech()) return;
  paintVoice(
    "unsupported",
    "当前浏览器没有可用的语音识别。请使用 Chrome、Edge 或 Safari，并允许麦克风。",
  );
  voiceButton.dataset.supported = "false";
}
voiceButton.dataset.supported =
  window.SpeechRecognition || window.webkitSpeechRecognition ? "true" : "false";
if (voiceButton.dataset.supported === "false") {
  inputHint.textContent = "可输入、粘贴或拖入图片";
  paintVoice(
    "unsupported",
    "当前浏览器没有可用的语音识别。请使用 Chrome、Edge 或 Safari，并允许麦克风。",
  );
}
voiceButton.onclick = () =>
  voiceState === "listening" ? stopVoice() : startVoice();
window.addEventListener("pagehide", () => {
  clearInterval(voiceTimer);
  if (voiceFallback)
    try {
      voiceFallback.stop();
    } catch {}
  releaseVoiceStream();
});
