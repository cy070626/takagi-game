function showGuide() {
  const body = document.createElement("div");
  body.className = "guide-dialog";
  body.append(
    textEl("p", "使い方 · 先选场景，再聊天、游戏或写诗。", "guide-lead"),
  );
  const steps = document.createElement("ol");
  [
    [
      "聊天也能带路",
      "可以直接说“打开音乐小剧场”“我想玩小游戏”“打开猜心对决”或“打开诗集”。明确的站内操作无需聊天密码，不调用 AI。还可以说“给我看雨天的图片”，使用已有站内配图。",
    ],
    ["选择 Chapter", "场景决定画面、开场和校园话题。"],
    [
      "设置对话",
      "默认千问 3.8 Flash，依次尝试 Max、DeepSeek Flash、DeepSeek Pro。临时连接失败会重连两次；全部失败保留原消息，可重试或刷新。也可手动选择引擎。",
    ],
    [
      "输入与记忆",
      "每条最多 1200 字。最近 12 条对话与本次标签页的场景、互动、游戏等轻量线索会共同承接。",
    ],
    [
      "密码与用量",
      "密码保存在当前标签页，每次请求仍由服务器校验。当前没有两小时或固定次数限制。",
    ],
    [
      "小游戏",
      "手机端可从顶部菜单直接进入；难度由玩家选择。一句话推理可使用本地题库或四个在线引擎。",
    ],
    ["青春诗笺", "可以读诗、保存自己的诗稿并继续修改。"],
  ].forEach(([title, detail]) => {
    const item = document.createElement("li");
    item.append(textEl("strong", title), textEl("span", detail));
    steps.append(item);
  });
  body.append(steps);
  const actions = document.createElement("div");
  actions.className = "guide-actions";
  const settingsButton = textEl("button", "打开个性设置", "setting");
  settingsButton.onclick = () => {
    dialog.close();
    openProfileSettings();
  };
  const poemButton = textEl("button", "打开诗集分享", "setting");
  poemButton.onclick = () => {
    dialog.close();
    $("#poetry-open")?.click();
  };
  const accessButton = textEl("button", "查看隐私说明", "setting");
  accessButton.onclick = () => {
    dialog.close();
    $("#access-open").click();
  };
  actions.append(settingsButton, poemButton, accessButton);
  body.append(actions);
  openDialog("使用说明 · はじめに", body);
}
const guideButton = $("#guide-open");
if (guideButton) guideButton.onclick = showGuide;
const quickGuide = textEl("aside", "", "quick-guide");
quickGuide.hidden = Boolean(load("takagi-guide-seen-v1"));
const quickWords = document.createElement("span");
quickWords.append(
  textEl("strong", "今天，想做点什么？"),
  textEl(
    "small",
    "选个场景，聊聊今天的小事。也可以一起玩一局，或者留下几句青春。",
  ),
);
const quickOpen = textEl("button", "查看说明");
quickOpen.type = "button";
quickOpen.onclick = showGuide;
const quickClose = textEl("button", "知道了", "quick-guide-close");
quickClose.type = "button";
quickClose.onclick = () => {
  quickGuide.hidden = true;
  save("takagi-guide-seen-v1", "yes");
};
quickGuide.append(quickWords, quickOpen, quickClose);
$(".chat-scroll").before(quickGuide);
$("#access-open").onclick = () => {
  const body = document.createElement("div");
  const online = !["localhost", "127.0.0.1"].includes(location.hostname);
  body.append(
    textEl("h3", "访问范围"),
    textEl("p", "网站公开访问，无需登录。"),
    textEl("h3", "当前状态"),
    textEl("p", online ? "正在访问公开站点。" : "当前是本地预览。"),
    textEl("h3", "会话与隐私"),
    textEl(
      "p",
      "在线回复会把本轮消息、最近 12 条对话、个性设置和本次标签页的轻量体验线索发送给最终使用的引擎。千问可按需联网搜索。图片只随本轮发送，API 密钥只在 Netlify Function 中。关闭标签页后短期记忆失效，其他偏好留在本浏览器。",
    ),
    textEl("h3", "密码有效范围"),
    textEl(
      "p",
      "密码只保存在当前标签页，服务器每次请求都会核对 ADMIN_PASSWORD。",
    ),
    textEl("h3", "当前调用限制"),
    textEl(
      "p",
      "当前没有两小时、个人次数或每日额度限制。千问、DeepSeek 与 Netlify 的账户额度仍会生效。",
    ),
  );
  openDialog("访问权限", body);
};
$("#share-site").onclick = async () => {
  const data = {
    title: "放学后 · 高木同学",
    text: "一个可以聊天、学习陪伴和体验校园情景的同人互动网页。",
    url: location.origin,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      speak("已经打开分享啦。你会先发给谁呢？");
    } else {
      await navigator.clipboard.writeText(data.url);
      speak("网址复制好了。别只复制，记得真的发出去哦。");
    }
  } catch (error) {
    if (error?.name !== "AbortError")
      speak("没有复制成功，可以直接从地址栏复制网址。");
  }
};
if (document.modelContext?.registerTool) {
  const life = new AbortController();
  const register = (name, description, inputSchema, execute) =>
    Promise.resolve(
      document.modelContext.registerTool(
        {
          name,
          description,
          inputSchema,
          annotations: { readOnlyHint: false },
          execute,
        },
        { signal: life.signal },
      ),
    ).catch(() => {});
  try {
    register(
      "set_character_pose",
      "切换高木同学的展示取景",
      {
        type: "object",
        properties: {
          pose: {
            type: "string",
            enum: ["daily", "close", "portrait", "wide"],
          },
        },
        required: ["pose"],
        additionalProperties: false,
      },
      (v) => pose(v?.pose),
    );
    register(
      "select_scene",
      "选择高木同学的互动场景",
      {
        type: "object",
        properties: {
          scene: {
            type: "string",
            enum: [
              "classroom",
              "cafeteria",
              "study",
              "rain",
              "valentine",
              "whiteDay",
              "festival",
            ],
          },
        },
        required: ["scene"],
        additionalProperties: false,
      },
      (v) => setScene(v?.scene),
    );
    register(
      "interact_with_character",
      "触发当前场景中的一个可用互动",
      {
        type: "object",
        properties: { action: { type: "string" } },
        required: ["action"],
        additionalProperties: false,
      },
      (v) => {
        if (!scenes[activeScene].actions.some((a) => a[0] === v?.action))
          throw Error("此场景没有这个互动");
        return interact(v.action);
      },
    );
    addEventListener("pagehide", () => life.abort(), { once: true });
  } catch {}
}
