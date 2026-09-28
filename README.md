# Takagi V60 Netlify DeepSeek

这是一个可直接放入 GitHub 仓库根目录并由 Netlify 部署的静态网站。主入口是 `index.html`，DeepSeek 请求由 `netlify/functions/chat.js` 转发。

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
│     └─ chat.js           DeepSeek 代理与访问密码校验
├─ _redirects              /api/chat 路由
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
| `ADMIN_PASSWORD` | 访问者使用 AI 对话时输入的密码 | 是 |

修改访问密码时，只需更新 Netlify 后台的 `ADMIN_PASSWORD` 并重新部署。代码和 GitHub 仓库中不保存真实密码。

## 密码校验流程

1. 浏览器把访问者输入的密码随聊天请求发送到 `/api/chat`。
2. Netlify Function 使用 `process.env.ADMIN_PASSWORD` 校验。
3. 密码缺失或错误时返回 HTTP 401，并停止处理，不调用 DeepSeek。
4. 校验成功后才读取 `DEEPSEEK_API_KEY` 并调用 DeepSeek。
5. 成功验证的密码只保留在当前浏览器标签页的 `sessionStorage`，关闭标签页后清除。用户也可点击“清除”。

## 部署

1. 把本目录的全部内容提交到 GitHub 仓库根目录。
2. 在 Netlify 连接该仓库。
3. Publish directory 保持 `.`。Functions directory 保持 `netlify/functions`。
4. 配置两项环境变量后触发一次新部署。
5. 打开站点，输入错误密码验证出现提示，再输入正确密码完成一轮对话。

## 不能删除或改名的文件

- `index.html` 是站点入口。
- `netlify/functions/chat.js` 负责服务端密码校验和 DeepSeek 调用。
- `_redirects` 把 `/api/chat` 映射到 Netlify Function。
- `netlify.toml` 声明发布目录和函数目录。
- `assets/`、`css/`、`js/`、`games/`、`pages/` 中的相对路径已由页面引用。

## 素材说明

`assets/` 来自用户提供的 TinyPNG 压缩素材包。本版本只做原样复制，并通过 SHA-256 校验确认 128 个文件与输入目录一致。校验记录见 `assets-sha256.txt`。

