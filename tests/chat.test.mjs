import test from "node:test";
import assert from "node:assert/strict";
import handler from "../netlify/functions/chat.js";

process.env.QWEN_API_KEY = "test-qwen-api-key";

function request(body) {
  return new Request("https://example.netlify.app/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://example.netlify.app" },
    body: JSON.stringify(body),
  });
}

test("错误密码返回 401 且不会调用 DeepSeek", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; throw new Error("不应调用"); };
  const response = await handler(request({ message: "你好", password: "wrong" }));
  assert.equal(response.status, 401);
  assert.equal((await response.json()).code, "INVALID_ADMIN_PASSWORD");
  assert.equal(calls, 0);
});

test("未配置 ADMIN_PASSWORD 时返回 503 且不会调用 DeepSeek", async () => {
  delete process.env.ADMIN_PASSWORD;
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; throw new Error("不应调用"); };
  const response = await handler(request({ message: "你好", password: "anything" }));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, "PASSWORD_NOT_CONFIGURED");
  assert.equal(calls, 0);
});

test("正确密码才调用 DeepSeek，并传入短期上下文", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  let outbound;
  globalThis.fetch = async (_url, options) => {
    outbound = JSON.parse(options.body);
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "放学后见。", mood: "warm", suggestions: ["好呀"] }) } }] });
  };
  const response = await handler(request({
    message: "还记得上一句吗？",
    password: "configured-secret",
    modelPreference: "deepseek-flash",
    history: [{ role: "user", text: "上一句" }, { role: "assistant", text: "记得" }],
    profile: { chatStyle: "playful", currentMood: "happy", address: "重影" },
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).text, "放学后见。");
  assert.equal(outbound.model, "deepseek-v4-flash");
  assert.equal(outbound.temperature, 1.18);
  assert.equal(outbound.response_format, undefined);
  assert.equal(outbound.reasoning_effort, "none");
  assert.match(outbound.messages[0].content, /最高优先级语气指令/);
  assert.match(outbound.messages[0].content, /俏皮观察/);
  assert.match(outbound.messages[0].content, /心情不错/);
  assert.match(outbound.messages[0].content, /称呼用户：重影/);
  assert.match(outbound.messages[0].content, /信息还不足以替你下结论/);
  assert.match(outbound.messages[0].content, /不列点/);
  assert.deepEqual(outbound.messages.slice(1, 3), [
    { role: "user", content: "上一句" },
    { role: "assistant", content: "记得" },
  ]);
});

test("默认调用千问 3.8 Max，并开启联网搜索和统一提示词", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "test-qwen-api-key";
  let calledUrl;
  let outbound;
  globalThis.fetch = async (url, options) => {
    calledUrl = url;
    outbound = JSON.parse(options.body);
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "今天风有点大，记得把外套拉好。" }) } }] });
  };

  const response = await handler(request({
    message: "今天天气怎么样？",
    password: "configured-secret",
    profile: { location: "上海", chatStyle: "gentle", currentMood: "calm" },
  }));
  const reply = await response.json();

  assert.equal(response.status, 200);
  assert.equal(calledUrl, "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions");
  assert.equal(outbound.model, "qwen3.8-max");
  assert.equal(outbound.enable_search, true);
  assert.match(outbound.messages[0].content, /今天天气如何/);
  assert.match(outbound.messages[0].content, /参考原作中高木/);
  assert.equal(reply.engineName, "千问 3.8 Max");
  assert.equal(reply.webSearchEnabled, true);
});

test("千问失败后按顺序切换到备用引擎并返回提示依据", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "test-qwen-api-key";
  process.env.DEEPSEEK_API_KEY = "test-deepseek-api-key";
  const models = [];
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    models.push(body.model);
    if (body.model.startsWith("qwen")) return Response.json({ error: { message: "quota exhausted" } }, { status: 429 });
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "已经换到备用引擎了。" }) } }] });
  };
  const result = await handler(request({ message: "继续", password: "configured-secret", modelPreference: "qwen-max", allowFallback: true, visitContext: "刚刚玩过默契二选一" }));
  const data = await result.json();
  assert.equal(result.status, 200);
  assert.deepEqual(models, ["qwen3.8-max", "qwen3.8-flash", "deepseek-v4-pro"]);
  assert.equal(data.engineName, "DeepSeek Pro");
  assert.deepEqual(data.fallbacks.map((item) => item.engineName), ["千问 3.8 Max", "千问 3.8 Flash"]);
});

test("三个新增在线引擎都使用各自模型与同一份系统提示词", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "test-qwen-api-key";
  process.env.DEEPSEEK_API_KEY = "test-deepseek-api-key";
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "我在听。" }) } }] });
  };

  for (const modelPreference of ["qwen-flash", "deepseek-pro"]) {
    const response = await handler(request({ message: "继续聊", password: "configured-secret", modelPreference }));
    assert.equal(response.status, 200);
  }

  assert.equal(calls[0].body.model, "qwen3.8-flash");
  assert.equal(calls[0].body.enable_search, undefined);
  assert.deepEqual(calls[0].body.response_format, { type: "json_object" });
  assert.equal(calls[1].body.model, "deepseek-v4-pro");
  assert.equal(calls[1].body.enable_search, undefined);
  assert.equal(calls[1].body.response_format, undefined);
  assert.equal(calls[1].body.reasoning_effort, "none");
  assert.equal(calls[0].body.messages[0].content, calls[1].body.messages[0].content);
});

test("千问业务空间 Key 缺少专属地址时不访问公共地址", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "sk-ws-test-workspace-key";
  delete process.env.QWEN_BASE_URL;
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; throw new Error("不应调用公共地址"); };

  const response = await handler(request({
    message: "你好",
    password: "configured-secret",
    modelPreference: "qwen-max",
    allowFallback: false,
  }));
  const failure = await response.json();

  assert.equal(response.status, 503);
  assert.equal(failure.code, "QWEN_BASE_URL_REQUIRED");
  assert.equal(calls, 0);
  assert.match(failure.details.message, /QWEN_BASE_URL/);
});

test("千问账户状态异常时返回准确原因", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "test-qwen-api-key";
  globalThis.fetch = async () => Response.json({
    error: { message: "Access denied, please make sure your account is in good standing." },
  }, { status: 400 });

  const response = await handler(request({ message: "你好", password: "configured-secret", modelPreference: "qwen-max", allowFallback: false }));
  const failure = await response.json();

  assert.equal(response.status, 402);
  assert.equal(failure.code, "ENGINE_ACCOUNT_UNAVAILABLE");
  assert.match(failure.error, /账户状态异常或存在欠费/);
  assert.equal(failure.details.status, 400);
});

test("DeepSeek 空正文会被识别为模型空回复", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-deepseek-api-key";
  globalThis.fetch = async () => Response.json({
    choices: [{ finish_reason: "stop", message: { content: "", reasoning_content: "内部推理" } }],
  });

  const response = await handler(request({ message: "再说一句", password: "configured-secret", modelPreference: "deepseek-pro", allowFallback: false }));
  const failure = await response.json();

  assert.equal(response.status, 502);
  assert.equal(failure.code, "ENGINE_EMPTY_REPLY");
  assert.match(failure.error, /空内容/);
  assert.deepEqual(failure.details, { message: "finish_reason=stop", status: 502 });
});

test("QWEN_BASE_URL 使用业务空间专属地址", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "test-qwen-api-key";
  process.env.QWEN_BASE_URL = "https://workspace-id.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
  let calledUrl;
  globalThis.fetch = async (url) => {
    calledUrl = url;
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "收到。" }) } }] });
  };

  const response = await handler(request({ message: "你好", password: "configured-secret", modelPreference: "qwen-max", allowFallback: false }));
  delete process.env.QWEN_BASE_URL;

  assert.equal(response.status, 200);
  assert.equal(calledUrl, "https://workspace-id.cn-beijing.maas.aliyuncs.com/compatible-mode/v1/chat/completions");
});

test("上游 Key 失效时返回具体原因和更换引擎提醒", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "invalid-key";
  globalThis.fetch = async () => Response.json({ error: { message: "invalid api key" } }, { status: 401 });

  const response = await handler(request({ message: "你好", password: "configured-secret", modelPreference: "qwen-max", allowFallback: false }));
  const failure = await response.json();

  assert.equal(response.status, 502);
  assert.equal(failure.code, "ENGINE_KEY_INVALID");
  assert.match(failure.error, /千问 3\.8 Max Key 无效/);
  assert.match(failure.reminder, /更换其他引擎/);
  assert.deepEqual(failure.details, { message: "invalid api key", status: 401 });
});

test("未提供语气参数时使用轻松同桌和平静", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  let outbound;
  globalThis.fetch = async (_url, options) => {
    outbound = JSON.parse(options.body);
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "嗯，继续说吧。" }) } }] });
  };
  const response = await handler(request({
    message: "今天有点慢。",
    password: "configured-secret",
  }));
  assert.equal(response.status, 200);
  assert.match(outbound.messages[0].content, /轻松同桌/);
  assert.match(outbound.messages[0].content, /平静/);
});

test("短期上下文严格保留最近 12 条消息", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  let outbound;
  globalThis.fetch = async (_url, options) => {
    outbound = JSON.parse(options.body);
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "接上了。" }) } }] });
  };
  const history = Array.from({ length: 14 }, (_, index) => ({
    role: index % 2 ? "assistant" : "user",
    text: `消息 ${index + 1}`,
  }));
  const response = await handler(request({
    message: "继续",
    password: "configured-secret",
    history,
  }));
  assert.equal(response.status, 200);
  const context = outbound.messages.slice(1, -1);
  assert.equal(context.length, 12);
  assert.equal(context[0].content, "消息 3");
  assert.equal(context.at(-1).content, "消息 14");
});

test("机械式澄清回复会被替换成承接玩家原话的陈述句", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  globalThis.fetch = async () => Response.json({
    choices: [{ message: { content: JSON.stringify({
      text: "信息还不足以替你下结论。你想补充背景、说自己的判断，还是让我先问一个具体问题？",
      mood: "warm",
      suggestions: ["补充背景", "说我的判断", "问一个具体问题"],
    }) } }],
  });

  const response = await handler(request({
    message: "我跟同桌吵了一点，感觉怪怪的。",
    password: "configured-secret",
    profile: { chatStyle: "playful", currentMood: "happy" },
  }));
  const reply = await response.json();

  assert.equal(response.status, 200);
  assert.doesNotMatch(reply.text, /信息(?:还)?不足|替你下结论|补充背景|具体问题/);
  assert.match(reply.text, /我跟同桌吵了一点/);
  assert.doesNotMatch(reply.text, /[？?]$/);
  assert.deepEqual(reply.suggestions, []);
});

test("个性温度严格限制在 0.7 到 1.2", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  const temperatures = [];
  globalThis.fetch = async (_url, options) => {
    temperatures.push(JSON.parse(options.body).temperature);
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "好，我陪你继续。" }) } }] });
  };

  await handler(request({
    message: "帮我理一下这道题。",
    password: "configured-secret",
    mode: "study",
    profile: { chatStyle: "analytical", currentMood: "focused" },
  }));
  await handler(request({
    message: "今天想开个玩笑。",
    password: "configured-secret",
    mode: "daily",
    profile: { chatStyle: "playful", currentMood: "happy" },
  }));

  assert.deepEqual(temperatures, [0.7, 1.18]);
  assert.ok(temperatures.every((value) => value >= 0.7 && value <= 1.2));
});

test("网页词条对象会转成可用的话题素材", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.DEEPSEEK_API_KEY = "test-api-key";
  let outbound;
  globalThis.fetch = async (_url, options) => {
    outbound = JSON.parse(options.body);
    return Response.json({ choices: [{ message: { content: JSON.stringify({ text: "那张纸条，我可记得很清楚。" }) } }] });
  };

  const response = await handler(request({
    message: "说起纸条，我突然想起一件事。",
    password: "configured-secret",
    topicContext: {
      title: "传纸条",
      tag: "校园日常",
      summary: "课间写下没说出口的话",
      opening: "纸条折了两次，停在课本旁边。",
    },
  }));

  assert.equal(response.status, 200);
  assert.match(outbound.messages[0].content, /词条：传纸条/);
  assert.match(outbound.messages[0].content, /概要：课间写下没说出口的话/);
  assert.match(outbound.messages[0].content, /不照抄词条/);
});
