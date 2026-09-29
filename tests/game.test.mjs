import test from "node:test";
import assert from "node:assert/strict";
import handler from "../netlify/functions/game.js";

function request(body) {
  return new Request("https://example.netlify.app/.netlify/functions/game", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

test("小游戏密码错误时不调用模型", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; };
  const result = await handler(request({ game: "lateral", storyId: "umbrella", question: "和朋友有关吗", password: "wrong" }));
  assert.equal(result.status, 401);
  assert.equal(calls, 0);
});

test("小游戏默认优先千问并在失败后切换 DeepSeek", async () => {
  process.env.ADMIN_PASSWORD = "configured-secret";
  process.env.QWEN_API_KEY = "qwen-key";
  process.env.DEEPSEEK_API_KEY = "deepseek-key";
  const models = [];
  globalThis.fetch = async (_url, options) => {
    const body = JSON.parse(options.body);
    models.push(body.model);
    if (body.model.startsWith("qwen")) return Response.json({ error: { message: "quota exhausted" } }, { status: 429 });
    return Response.json({ choices: [{ message: { content: JSON.stringify({ answer: "是", reply: "这个方向有关。", progress: 42 }) } }] });
  };
  const result = await handler(request({ game: "lateral", storyId: "umbrella", question: "和朋友有关吗", password: "configured-secret", modelPreference: "qwen-max", allowFallback: true }));
  const data = await result.json();
  assert.equal(result.status, 200);
  assert.deepEqual(models, ["qwen3.8-max", "qwen3.8-flash", "deepseek-v4-pro"]);
  assert.equal(data.engineName, "DeepSeek Pro");
  assert.equal(data.answer, "是");
  assert.equal(data.fallbacks.length, 2);
});
