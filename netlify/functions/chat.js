const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_MODEL = "deepseek-v4-flash";
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 12;
const MAX_IMAGE_DATA_LENGTH = 1_900_000;
const REQUEST_TIMEOUT_MS = 25_000;

const ALLOWED_MODES = new Set(["daily", "study"]);
const ALLOWED_MOODS = new Set(["warm", "playful", "quiet", "listening"]);

function json(status, data) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cleanProfile(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    name: cleanText(source.name, 40),
    address: cleanText(source.address, 40) || "同桌",
    identity: cleanText(source.identity, 40) || "学生",
    location: cleanText(source.location, 60),
    context: cleanText(source.context, 120),
    chatStyle: cleanText(source.chatStyle, 30) || "gentle",
    currentMood: cleanText(source.currentMood, 30) || "calm",
    interests: Array.isArray(source.interests)
      ? source.interests.map((item) => cleanText(item, 30)).filter(Boolean).slice(0, 4)
      : [],
    needs: Array.isArray(source.needs)
      ? source.needs.map((item) => cleanText(item, 30)).filter(Boolean).slice(0, 3)
      : [],
  };
}

function cleanHistory(value) {
  if (!Array.isArray(value)) return [];
  return value
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: cleanText(item?.content, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content);
}

function parseModelReply(content) {
  const raw = cleanText(content, 8_000);
  const unfenced = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  let parsed;

  try {
    parsed = JSON.parse(unfenced);
  } catch {
    parsed = { text: raw };
  }

  const text = cleanText(parsed?.text, 1_800);
  if (!text) throw new Error("EMPTY_MODEL_REPLY");

  return {
    text,
    mood: ALLOWED_MOODS.has(parsed?.mood) ? parsed.mood : "warm",
    topic: cleanText(parsed?.topic, 80),
    suggestions: Array.isArray(parsed?.suggestions)
      ? parsed.suggestions.map((item) => cleanText(item, 40)).filter(Boolean).slice(0, 4)
      : [],
    knowledgeTags: Array.isArray(parsed?.knowledgeTags)
      ? parsed.knowledgeTags.map((item) => cleanText(item, 30)).filter(Boolean).slice(0, 4)
      : [],
  };
}

function buildSystemPrompt({ mode, scene, profile, topicContext }) {
  return `你是一个以校园青春和轻微捉弄为基调的中文陪伴角色。主要用户是中国学生。
请自然、克制地回应，可以偶尔加入简短且容易理解的日文词句、符号或颜文字，避免堆砌。不要冒充作品官方角色，也不要声称拥有现实经历。
当前模式：${mode === "study" ? "学习陪伴" : "日常聊天"}
当前场景：${scene || "放学后的校园"}
称呼用户：${profile.address}
用户身份：${profile.identity}
用户当前心情：${profile.currentMood}
期望回应方式：${profile.chatStyle}
用户情境：${profile.context || "未填写"}
兴趣：${profile.interests.join("、") || "未填写"}
希望获得：${profile.needs.join("、") || "轻松陪伴"}
当前话题线索：${topicContext || "无"}

规则：
1. 先回应用户此刻说的话，再自然承接最近对话。
2. 日常聊天保持简洁、有画面感，允许轻微玩笑。
3. 学习陪伴给出可执行的小步骤，避免空泛说教。
4. 不确定的事实要明确说明，不编造来源。
5. 遇到明显的危险、自伤或紧急情况，停止角色化玩笑，建议立即联系可信任的成年人或当地紧急服务。
6. 输出必须是合法 JSON 对象，不要使用 Markdown 代码块。

JSON 格式：
{"text":"主要回复","mood":"warm|playful|quiet|listening","topic":"简短话题标识","suggestions":["可继续回复的短句"],"knowledgeTags":["本轮涉及的主题"]}`;
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return json(405, { error: "只接受 POST 请求" });
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return json(403, { error: "拒绝跨站请求" });
      }
    } catch {
      return json(403, { error: "请求来源无效" });
    }
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json(415, { error: "请求正文必须是 JSON" });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(503, { error: "站点尚未配置 DeepSeek API" });
  }

  let body;
  try {
    const rawBody = await request.text();
    if (rawBody.length > 2_100_000) {
      return json(413, { error: "请求内容过大" });
    }
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { error: "请求 JSON 无效" });
  }

  const message = cleanText(body?.message, MAX_MESSAGE_LENGTH);
  const image = cleanText(body?.image, MAX_IMAGE_DATA_LENGTH);
  if (!message && !image) {
    return json(400, { error: "消息不能为空" });
  }
  if (image && !/^data:image\/(?:jpeg|png|webp);base64,/i.test(image)) {
    return json(400, { error: "图片格式无效" });
  }

  const mode = ALLOWED_MODES.has(body?.mode) ? body.mode : "daily";
  const scene = cleanText(body?.scene, 50);
  const profile = cleanProfile(body?.profile);
  const topicContext = cleanText(body?.topicContext, 300);
  const history = cleanHistory(body?.history);
  const userContent = image
    ? [
        { type: "text", text: message || "请观察图片并自然回应。" },
        { type: "image_url", image_url: { url: image } },
      ]
    : message;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const upstream = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt({ mode, scene, profile, topicContext }) },
          ...history,
          { role: "user", content: userContent },
        ],
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
        temperature: 0.85,
        max_tokens: 700,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return json(429, { error: "DeepSeek 当前请求较多，请稍后再试" });
      }
      if (upstream.status === 401 || upstream.status === 403) {
        return json(502, { error: "DeepSeek API 凭据校验失败" });
      }
      return json(502, { error: "DeepSeek 服务暂时不可用" });
    }

    const result = await upstream.json();
    return json(200, parseModelReply(result?.choices?.[0]?.message?.content));
  } catch (error) {
    if (error?.name === "AbortError") {
      return json(504, { error: "DeepSeek 回复超时，请稍后再试" });
    }
    return json(502, { error: "调用 DeepSeek 时发生网络错误" });
  } finally {
    clearTimeout(timeout);
  }
}
