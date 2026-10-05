let imagePreparing = false, imagePreparationId = 0;
function syncComposer() {
  send.disabled = busy || imagePreparing || (!input.value.trim() && !pendingImage);
  attachButton.disabled = busy || imagePreparing;
  voiceButton.disabled =
    busy ||
    voiceButton.dataset.supported === "false" ||
    voiceState === "converting" ||
    voiceState === "requesting";
  inputHint.textContent = `${Math.min(input.value.length, 1200)} / 1200 · 可输入、语音、粘贴或拖入图片`;
}
function clearPendingImage() {
  pendingImage = null;
  attachmentPreview.hidden = true;
  attachmentPreview.replaceChildren();
  syncComposer();
}
function showPendingImage() {
  attachmentPreview.replaceChildren();
  if (!pendingImage) {
    attachmentPreview.hidden = true;
    return;
  }
  const image = document.createElement("img");
  image.src = pendingImage.dataUrl;
  image.alt = "待发送图片预览";
  const info = textEl("span", "");
  info.append(
    textEl("strong", pendingImage.name),
    textEl("small", "已压缩 · 仅随本轮发送给在线引擎"),
  );
  const remove = textEl("button", "移除");
  remove.type = "button";
  remove.setAttribute("aria-label", "移除待发送图片");
  remove.onclick = clearPendingImage;
  attachmentPreview.append(image, info, remove);
  attachmentPreview.hidden = false;
  syncComposer();
}
function loadLocalImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file),
      image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(Error("invalid image"));
    };
    image.src = url;
  });
}
async function prepareImage(file) {
  if (
    !file ||
    !/^image\/(jpeg|png|webp|gif)$/i.test(file.type) ||
    file.size > 8 * 1024 * 1024
  ) {
    $("#ai-status").textContent =
      "请选择不超过 8 MB 的 JPG、PNG、WebP 或 GIF 图片。";
    return;
  }
  const preparationId = ++imagePreparationId;
  imagePreparing = true;
  syncComposer();
  $("#ai-status").textContent = "正在压缩图片…";
  try {
    const image = await loadLocalImage(file);
    if (preparationId !== imagePreparationId) return;
    let dataUrl = "";
    for (const [maxSize, quality] of [
      [1280, 0.82],
      [1080, 0.72],
      [900, 0.62],
    ]) {
      const scale = Math.min(
          1,
          maxSize / Math.max(image.naturalWidth, image.naturalHeight),
        ),
        canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      dataUrl = canvas.toDataURL("image/jpeg", quality);
      if (dataUrl.length <= 1850000) break;
    }
    if (dataUrl.length > 1850000) throw Error("too large");
    pendingImage = { name: file.name.slice(0, 80), dataUrl };
    showPendingImage();
    $("#ai-status").textContent =
      "图片已就绪 · 优先使用千问识图，DeepSeek Pro 不接收图片";
  } catch {
    $("#ai-status").textContent = "这张图片暂时无法读取，请换一张再试。";
    clearPendingImage();
  } finally {
    if (preparationId === imagePreparationId) {
      imagePreparing = false;
      syncComposer();
    }
  }
}
attachButton.onclick = () => imagePicker.click();
imagePicker.onchange = () => {
  const file = imagePicker.files?.[0];
  imagePicker.value = "";
  if (file) prepareImage(file);
};
chatForm.addEventListener("dragover", (event) => {
  if (Array.from(event.dataTransfer?.types || []).includes("Files")) {
    event.preventDefault();
    chatForm.classList.add("drop-active");
  }
});
chatForm.addEventListener("dragleave", () =>
  chatForm.classList.remove("drop-active"),
);
chatForm.addEventListener("drop", (event) => {
  event.preventDefault();
  chatForm.classList.remove("drop-active");
  const file = Array.from(event.dataTransfer?.files || []).find((item) =>
    item.type.startsWith("image/"),
  );
  if (file) prepareImage(file);
  else if (event.dataTransfer?.files?.length) $("#ai-status").textContent = "聊天附件目前支持图片；PDF、Word 等文档请截图后上传。";
});
input.addEventListener("paste", (event) => {
  const file = Array.from(event.clipboardData?.files || []).find((item) =>
    item.type.startsWith("image/"),
  );
  if (file) {
    event.preventDefault();
    prepareImage(file);
  }
});
