# 高木同学主题网站 V60 Netlify DeepSeek 版

## 目录结构

```text
Takagi-V60-Netlify-DeepSeek/
├── index.html
├── _redirects
├── netlify.toml
├── package.json
├── css/
├── js/
├── assets/
├── games/
├── pages/
└── netlify/
    └── functions/
        └── chat.js
```

`index.html` 是网站入口。`netlify/functions/chat.js` 是服务端函数。浏览器只访问 `/api/chat`，真实的 DeepSeek API 密钥由 Netlify 运行环境读取。

## 在 Netlify 设置密钥

1. 打开 Netlify 中对应的站点。
2. 进入 `Project configuration`，再进入 `Environment variables`。
3. 新建变量，名称填写 `DEEPSEEK_API_KEY`。
4. 值填写你自己的 DeepSeek API Key。
5. 变量作用域选择 Functions 或全部作用域。
6. 保存后重新部署一次站点。

代码中没有密钥占位值。函数只通过下面这一行读取后台环境变量：

```js
const apiKey = process.env.DEEPSEEK_API_KEY;
```

不要把真实密钥写入 `chat.js`、前端 JavaScript、`netlify.toml` 或 Git 仓库。

## 部署方式

这个版本包含 Netlify Function。推荐使用以下任一方式部署：

1. 将整个项目文件夹提交到 GitHub、GitLab 或 Bitbucket，然后在 Netlify 导入该仓库。
2. 在项目根目录使用 Netlify CLI 执行 `netlify deploy --build --prod`。

构建配置已经写入 `netlify.toml`：

```toml
[build]
  publish = "."
  functions = "netlify/functions"
```

普通 Netlify Drop 适合纯静态文件，不会完成 Function 的构建与部署。

## 前端调用

当前网站的 `js/experience.js` 已经完成接入，调用代码的核心形式如下：

```js
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: '今天放学后有点累。',
    mode: 'daily',
    scene: 'classroom',
    history: [
      { role: 'user', content: '刚才在准备考试。' },
      { role: 'assistant', content: '做到哪一部分了？' }
    ]
  })
});

const data = await response.json();
if (!response.ok) throw new Error(data.error || '聊天服务暂时不可用');
console.log(data.text);
```

函数会返回：

```json
{
  "text": "主要回复",
  "mood": "warm",
  "topic": "after-school",
  "suggestions": ["继续聊聊", "先休息一下"],
  "knowledgeTags": ["校园", "学习"]
}
```

## 路由和关键文件

`_redirects` 中的第一条规则把 `/api/chat` 转发到 Function。该规则必须放在单页应用回退规则之前：

```text
/api/chat /.netlify/functions/chat 200
/* /index.html 200
```

不要删除或改名以下文件：

* `index.html`
* `_redirects`
* `netlify.toml`
* `netlify/functions/chat.js`
* `package.json`

`assets/`、`css/`、`js/`、`games/` 和 `pages/` 的相对位置也应保持不变。

## 已实现的保护

* 只接受 POST 和 JSON 请求。
* 拒绝浏览器跨站请求。
* 限制消息、历史记录和图片大小。
* 最多向 DeepSeek 发送最近 12 条短期对话。
* 设置 25 秒上游超时。
* 不向前端返回 DeepSeek 的原始错误正文。
* API 密钥只在 Function 内读取。

聊天默认使用 `deepseek-v4-flash`。在线调用失败时，现有前端会自动使用本地陪伴回复。
