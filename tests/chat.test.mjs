import test from "node:test";
import assert from "node:assert/strict";
import handler from "../netlify/functions/chat.js";

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
    history: [{ role: "user", text: "上一句" }, { role: "assistant", text: "记得" }],
    profile: { chatStyle: "playful", currentMood: "happy", address: "重影" },
  }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).text, "放学后见。");
  assert.equal(outbound.model, "deepseek-v4-flash");
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
