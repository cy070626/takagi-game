const dialogue = new CompanionDialogue();
dialogue.setProfile(profile);
const CHAT_CONTEXT_LIMIT = 12;
function readSessionHistory() {
  try {
    const value = JSON.parse(
      sessionStorage.getItem("takagi-chat-session") || "[]",
    );
    return Array.isArray(value)
      ? value
          .filter(
            (turn) =>
              turn &&
              ["user", "assistant"].includes(turn.role) &&
              typeof turn.text === "string",
          )
          .slice(-CHAT_CONTEXT_LIMIT)
      : [];
  } catch {
    return [];
  }
}
function saveSessionHistory() {
  try {
    sessionStorage.setItem(
      "takagi-chat-session",
      JSON.stringify(aiHistory.slice(-CHAT_CONTEXT_LIMIT)),
    );
  } catch {}
}
function rememberTurn(userText, assistantText) {
  aiHistory.push(
    { role: "user", text: String(userText || "").slice(0, 800) },
    { role: "assistant", text: String(assistantText || "").slice(0, 800) },
  );
  aiHistory.splice(0, Math.max(0, aiHistory.length - CHAT_CONTEXT_LIMIT));
  saveSessionHistory();
}
const aiHistory = readSessionHistory();
activeTerm = globalThis.TakagiTopicTree.restore(terms);
if (activeTerm && activeTerm.scene !== activeScene) {
  activeTerm = null;
  globalThis.TakagiTopicTree.deactivate();
}
if (aiHistory.length)
  addContext(
    `已接上本次标签页里的短期对话记忆，共 ${aiHistory.length} 条。关闭标签页后会清除。`,
  );
let pendingImage = null,
  voiceBase = "",
  voiceState = "idle",
  voiceTimer = null,
  voiceStartedAt = 0,
  voiceFallback = null,
  voiceFallbackText = "",
  voiceFallbackError = "";
const chatForm = $("#chat-form"),
  inputBottom = chatForm.querySelector(".input-bottom"),
  inputHint = inputBottom.querySelector("span");
const passwordInput = $("#ai-password"),
  passwordStatus = $("#password-status"),
  forgetPassword = $("#forget-ai-password");
try {
  passwordInput.value = sessionStorage.getItem("takagi-ai-password") || "";
} catch {}
if (passwordInput.value)
  passwordStatus.textContent =
    "已恢复本标签页中验证过的密码。刷新后仍可用，关闭标签页或点击“清除”后失效。";
forgetPassword.hidden = !passwordInput.value;
passwordInput.addEventListener("input", () => {
  passwordStatus.textContent =
    "输入后发送一条消息即可校验。密码只保留在当前标签页。";
  forgetPassword.hidden = !passwordInput.value;
});
forgetPassword.onclick = () => {
  passwordInput.value = "";
  try {
    sessionStorage.removeItem("takagi-ai-password");
  } catch {}
  forgetPassword.hidden = true;
  passwordStatus.textContent = "已清除当前标签页中的 AI 访问密码。";
  passwordInput.focus();
};
const inputActions = document.createElement("div");
inputActions.className = "input-actions";
const attachButton = textEl("button", "＋ 图片", "input-tool");
attachButton.type = "button";
attachButton.setAttribute("aria-label", "添加聊天图片");
const voiceButton = textEl("button", "◉ 开始听", "input-tool");
voiceButton.type = "button";
voiceButton.setAttribute("aria-label", "开始语音输入");
voiceButton.setAttribute("aria-pressed", "false");
const voiceStatus = textEl(
  "small",
  "点“开始听”录音，再点“停止并转文字”。文字只会写入本页输入框，确认后再发送。",
  "voice-status",
);
voiceStatus.setAttribute("role", "status");
voiceStatus.setAttribute("aria-live", "polite");
voiceStatus.dataset.state = "idle";
const imagePicker = document.createElement("input");
imagePicker.type = "file";
imagePicker.accept = "image/jpeg,image/png,image/webp,image/gif";
imagePicker.hidden = true;
const attachmentPreview = textEl("div", "", "chat-attachment");
attachmentPreview.hidden = true;
chatForm.insertBefore(attachmentPreview, input);
inputActions.append(attachButton, voiceButton, send);
inputBottom.replaceChildren(inputHint, inputActions);
chatForm.insertBefore(voiceStatus, inputBottom);
chatForm.append(imagePicker);
inputHint.textContent = "可输入、语音、粘贴或拖入图片";
