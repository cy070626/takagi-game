# Takagi V77 玩家体验微调

本版增加小游戏与诗集快捷入口、回到最新消息按钮，并简化初次说明和对话区等待提示。千问 Flash 默认顺序与原有功能保留。详见 `V77更新说明.md`。

这是一个可直接放入 GitHub 仓库根目录并由 Netlify 部署的静态网站。主入口是 `index.html`，聊天和小游戏的在线判断由 Netlify Functions 转发。

## 目录

```text
.
├─ index.html
├─ assets/                 压缩后的图片素材
├─ css/                    页面样式
├─ js/                     页面逻辑与游戏逻辑
├─ games/                  独立游戏页面
├─ pages/                  独立功能页面
├─ netlify/
│  └─ functions/
│     ├─ chat.js           聊天多引擎代理与访问密码校验
│     └─ game.js           小游戏多引擎代理与访问密码校验
├─ _redirects              /api/chat 与 /api/game 路由
├─ netlify.toml            Netlify 构建配置
├─ package.json
├─ .env.example            环境变量名称示例
└─ .gitignore
```

## Netlify 环境变量

在 Netlify 的站点后台进入 **Site configuration > Environment variables**，添加：

| 名称 | 内容 | 必需 |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | DeepSeek 官方 API Key | 是 |
| `QWEN_API_KEY` | 阿里云百炼千问 API Key | 是 |
| `QWEN_BASE_URL` | 千问指定地域或业务空间的 compatible-mode/v1 地址 | 业务空间 Key 必需 |
| `ADMIN_PASSWORD` | 访问者使用 AI 对话时输入的密码 | 是 |

修改访问密码时，只需更新 Netlify 后台的 `ADMIN_PASSWORD` 并重新部署。代码和 GitHub 仓库中不保存真实密码。

千问业务空间 API Key 的前缀通常为 `sk-ws-`。此类 Key 必须填写 `QWEN_BASE_URL`，函数会拒绝把它发送到公共地址，避免请求落到错误的服务入口。华北 2 区格式为：

```text
https://你的业务空间ID.cn-beijing.maas.aliyuncs.com/compatible-mode/v1
```

从百炼控制台的“按量付费 Base URL”复制完整地址，填入该变量。不要填写花括号，也不要把 API Key 写进地址。修改环境变量后必须触发一次新部署。

## 接口排错

1. DeepSeek 不再启用强制 JSON Output，避免官方已说明的偶发空正文问题。系统提示仍要求 JSON；服务端也兼容普通文本回复。
2. DeepSeek 显式使用非思考模式。偶发空正文会返回 `ENGINE_EMPTY_REPLY`，不会再误报网络故障。
3. 千问返回 `good standing`、`overdue` 或欠费信息时，页面会显示账户状态异常。此类错误需要在阿里云费用与成本页面处理。
4. 千问返回 `Model.AccessDenied` 或权限信息时，需要确认 API Key 所属业务空间已获准调用对应模型。
5. Netlify 日志会记录实际调用的域名、模型、HTTP 状态和经截断的上游错误，不记录密码、API Key、聊天原文或图片数据。

## 密码校验流程

1. 浏览器把访问者输入的密码随聊天请求发送到 `/api/chat`。
2. Netlify Function 使用 `process.env.ADMIN_PASSWORD` 校验。
3. 密码缺失或错误时返回 HTTP 401，并停止处理，不调用 DeepSeek。
4. 校验成功后才读取当前引擎对应的 `QWEN_API_KEY` 或 `DEEPSEEK_API_KEY` 并调用模型。
5. 成功验证的密码只保留在当前浏览器标签页的 `sessionStorage`，关闭标签页后清除。用户也可点击“清除”。

## 当前会话与用量规则

- 当前成功引擎每次接收当前消息、最近 12 条短期对话消息，以及本次标签页中的轻量体验线索。
- 页面以“已记录数量 / 12 条消息”显示当前短期记忆占用量。达到 12 条后，最早的消息依次移出上下文。
- 刷新同一标签页会保留短期对话和已验证密码；关闭标签页后两者清除。
- 当前简化密码版没有两小时有效期、个人调用次数或每日额度。密码保存在标签页期间，每次请求仍由 Netlify Function 重新校验。
- DeepSeek 账户余额、服务商限流和 Netlify 平台额度仍然适用。

## 部署

1. 把本目录的全部内容提交到 GitHub 仓库根目录。
2. 在 Netlify 连接该仓库。
3. Publish directory 保持 `.`。Functions directory 保持 `netlify/functions`。
4. 配置所需环境变量后触发一次新部署。
5. 打开站点，输入错误密码验证出现提示，再输入正确密码完成一轮对话。

## 不能删除或改名的文件

- `index.html` 是站点入口。
- `netlify/functions/chat.js` 负责聊天的服务端密码校验和多引擎调用。
- `netlify/functions/game.js` 负责小游戏在线判断的密码校验和多引擎调用。
- `_redirects` 把 `/api/chat` 与 `/api/game` 映射到 Netlify Functions。
- `netlify.toml` 声明发布目录和函数目录。
- `assets/`、`css/`、`js/`、`games/`、`pages/` 中的相对路径已由页面引用。

## 素材说明

原有压缩图片仍保留。沿用此前的 WebP 与静态封面，页面优先引用这些轻量文件。校验记录见 `assets-sha256.txt`。






