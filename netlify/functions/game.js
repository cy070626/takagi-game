import { timingSafeEqual } from "node:crypto";

const ENGINES = Object.freeze({
  "qwen-max": { id: "qwen-max", name: "千问 3.8 Max", model: "qwen3.8-max", provider: "qwen", key: "QWEN_API_KEY", url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions" },
  "qwen-flash": { id: "qwen-flash", name: "千问 3.8 Flash", model: "qwen3.8-flash", provider: "qwen", key: "QWEN_API_KEY", url: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions" },
  "deepseek-pro": { id: "deepseek-pro", name: "DeepSeek Pro", model: "deepseek-v4-pro", provider: "deepseek", key: "DEEPSEEK_API_KEY", url: "https://api.deepseek.com/chat/completions" },
  "deepseek-flash": { id: "deepseek-flash", name: "DeepSeek Flash", model: "deepseek-v4-flash", provider: "deepseek", key: "DEEPSEEK_API_KEY", url: "https://api.deepseek.com/chat/completions" },
});
const ORDER = Object.freeze({
  "qwen-max": ["qwen-max", "qwen-flash", "deepseek-pro", "deepseek-flash"],
  "qwen-flash": ["qwen-flash", "qwen-max", "deepseek-pro", "deepseek-flash"],
  "deepseek-pro": ["deepseek-pro", "deepseek-flash", "qwen-max", "qwen-flash"],
  "deepseek-flash": ["deepseek-flash", "deepseek-pro", "qwen-max", "qwen-flash"],
});
const GAME_REQUEST_BUDGET_MS = 38_000;
const GAME_PRIMARY_TIMEOUT_MS = 16_000;
const GAME_FALLBACK_TIMEOUT_MS = 8_000;
const GAME_MIN_ATTEMPT_TIMEOUT_MS = 3_000;
const STORIES = Object.freeze({
  umbrella: "她在等同样没有带伞的朋友。雨大后，朋友会放弃独自跑回去，两个人就能一起等家人来接。",
  bell: "这是一次安静自习，墙上的时钟已经到了约定结束的时间，铃声设备当天正在检修。",
  photo: "四个人轮流拿相机拍照，所以每张合照里都只有另外三个人。",
  cocoa: "另一杯是用来给等待的人暖手的。对方不喜欢甜饮，但在寒风里需要一点温度。",
  station: "他在陪一位睡着的朋友回家。自己的车站先到，但朋友的目的地在下一站，他决定先把朋友安全送到。",
  note: "两人事先约定，空白便笺代表今天不方便说话，但会在老地方等对方。便笺本身就是暗号。",
});

const clean = (value, length) => typeof value === "string" ? value.trim().slice(0, length) : "";
const response = (status, data) => Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });

function passwordMatches(input, expected) {
  const supplied = Buffer.from(typeof input === "string" ? input : "", "utf8");
  const configured = Buffer.from(typeof expected === "string" ? expected : "", "utf8");
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
}

function qwenUrl() {
  const value = clean(process.env.QWEN_BASE_URL, 400).replace(/\/+$/, "");
  if (!value || !/^https:\/\//i.test(value)) return "";
  return /\/chat\/completions$/i.test(value) ? value : `${value}/chat/completions`;
}

function qwenEndpoint(key, fallbackUrl) {
  const configured = qwenUrl();
  if (configured) return { url: configured, source: "workspace" };
  if (clean(key, 20).startsWith("sk-ws-")) {
    return {
      error: "检测到千问业务空间 Key，但 Netlify 尚未配置 QWEN_BASE_URL。",
      detail: "请将百炼控制台“按量付费 Base URL”填入 Netlify 的 QWEN_BASE_URL。",
    };
  }
  return { url: fallbackUrl, source: "default" };
}

function parseReply(content) {
  const raw = clean(content, 2_000).replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const data = JSON.parse(raw);
  const allowed = new Set(["是", "否", "关系不大", "接近了"]);
  return {
    answer: allowed.has(data?.answer) ? data.answer : "关系不大",
    reply: clean(data?.reply, 180) || "这个方向和真相的关系不大。",
    progress: Math.max(0, Math.min(100, Number(data?.progress) || 0)),
  };
}

async function ask(engine, messages, { timeoutMs, requestStartedAt }) {
  const key = process.env[engine.key];
  if (!key) return { ok: false, failure: { engine: engine.id, engineName: engine.name, status: 503, code: "ENGINE_NOT_CONFIGURED", message: `未配置 ${engine.key}` } };
  const endpoint = engine.provider === "qwen" ? qwenEndpoint(key, engine.url) : { url: engine.url, source: "provider-default" };
  if (endpoint.error) return { ok: false, failure: { engine: engine.id, engineName: engine.name, status: 503, code: "QWEN_BASE_URL_REQUIRED", message: endpoint.error, detail: endpoint.detail } };
  if (timeoutMs < GAME_MIN_ATTEMPT_TIMEOUT_MS) return { ok: false, failure: { engine: engine.id, engineName: engine.name, status: 504, code: "ENGINE_TIME_BUDGET_EXHAUSTED", message: "本次判断的剩余时间不足，未继续启动下一备用引擎", detail: `已用时 ${Date.now() - requestStartedAt}ms` } };
  const controller = new AbortController();
  const timeoutReason = Object.assign(new Error("UPSTREAM_TIMEOUT"), { code: "UPSTREAM_TIMEOUT" });
  const timer = setTimeout(() => controller.abort(timeoutReason), timeoutMs);
  try {
    const body = { model: engine.model, messages, temperature: 0.72, max_tokens: 220, stream: false };
    if (engine.provider === "qwen") body.response_format = { type: "json_object" };
    else { body.thinking = { type: "disabled" }; body.reasoning_effort = "none"; }
    const upstream = await fetch(endpoint.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!upstream.ok) {
      const detail = await upstream.json().catch(() => ({}));
      const message = clean(detail?.error?.message || detail?.message || detail?.error, 300) || `HTTP ${upstream.status}`;
      return { ok: false, failure: { engine: engine.id, engineName: engine.name, status: upstream.status, code: "ENGINE_REJECTED", message } };
    }
    const data = await upstream.json();
    try {
      const result = parseReply(data?.choices?.[0]?.message?.content);
      console.log("小游戏 AI 调用成功", {
        engine: engine.id,
        engineName: engine.name,
        model: engine.model,
        endpoint: new URL(endpoint.url).host,
        endpointSource: endpoint.source,
        elapsedMs: Date.now() - requestStartedAt,
      });
      return { ok: true, result };
    } catch {
      return { ok: false, failure: { engine: engine.id, engineName: engine.name, status: 502, code: "ENGINE_INVALID_REPLY", message: "模型返回格式异常" } };
    }
  } catch (error) {
    const timedOut = controller.signal.aborted && controller.signal.reason?.code === "UPSTREAM_TIMEOUT";
    return { ok: false, failure: { engine: engine.id, engineName: engine.name, status: timedOut ? 504 : 0, code: timedOut ? "ENGINE_TIMEOUT" : "ENGINE_NETWORK_ERROR", message: timedOut ? `${engine.name} 在 ${Math.ceil(timeoutMs / 1000)} 秒内未完成判断` : clean(error?.message, 200) || "网络错误", detail: timedOut ? `UPSTREAM_TIMEOUT after ${timeoutMs}ms` : clean(error?.message, 200), endpointSource: endpoint.source } };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(request) {
  if (request.method !== "POST") return response(405, { error: "只接受 POST 请求" });
  let body;
  try { body = await request.json(); } catch { return response(400, { error: "请求 JSON 无效" }); }

  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return response(503, { error: "站点尚未配置 AI 访问密码", code: "PASSWORD_NOT_CONFIGURED" });
  if (!passwordMatches(body?.password, configuredPassword)) return response(401, { error: "AI 访问密码不正确", code: "INVALID_ADMIN_PASSWORD" });
  if (body?.game !== "lateral") return response(400, { error: "未知游戏类型" });

  const storyId = clean(body?.storyId, 30);
  const truth = STORIES[storyId];
  const question = clean(body?.question, 120);
  if (!truth || question.length < 2) return response(400, { error: "题目或问题无效" });
  const history = Array.isArray(body?.history) ? body.history.map((item) => clean(item, 180)).filter(Boolean).slice(-8).join("\n") : "";
  const visitContext = clean(body?.visitContext, 700);
  const preferred = ENGINES[clean(body?.modelPreference, 40)] ? clean(body.modelPreference, 40) : "qwen-max";
  const ids = body?.allowFallback === false ? [preferred] : ORDER[preferred];
  const failures = [];
  const requestStartedAt = Date.now();
  const messages = [
    { role: "system", content: `你是校园海龟汤游戏的严谨裁判。只根据真相回答玩家的是非问题，不泄露完整答案。回复必须是 JSON：{"answer":"是|否|关系不大|接近了","reply":"一句自然提示","progress":0}。progress 表示玩家接近真相的程度。真相：${truth}` },
    { role: "user", content: `之前问答：${history || "暂无"}\n本次访问线索：${visitContext || "暂无"}\n新问题：${question}` },
  ];

  for (const [index, id] of ids.entries()) {
    const engine = ENGINES[id];
    const remainingMs = GAME_REQUEST_BUDGET_MS - (Date.now() - requestStartedAt);
    const targetTimeout = index === 0 ? GAME_PRIMARY_TIMEOUT_MS : GAME_FALLBACK_TIMEOUT_MS;
    const timeoutMs = Math.min(targetTimeout, Math.max(0, remainingMs - 600));
    const outcome = await ask(engine, messages, { timeoutMs, requestStartedAt });
    if (!outcome.ok) {
      failures.push(outcome.failure);
      console.error("小游戏 AI 调用失败", outcome.failure);
      continue;
    }
    return response(200, { ...outcome.result, engine: engine.id, engineName: engine.name, fallbacks: failures });
  }

  return response(502, {
    error: "千问与 DeepSeek 当前均未能完成判断",
    code: "ALL_ENGINES_FAILED",
    reminder: "已自动尝试备用引擎，本局将继续使用本地判断。",
    attempts: failures,
  });
}
