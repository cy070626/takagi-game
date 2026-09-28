import { timingSafeEqual } from "node:crypto";

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
      content: cleanText(item?.content ?? item?.text, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content);
}

function passwordMatches(input, expected) {
  const supplied = Buffer.from(typeof input === "string" ? input : "", "utf8");
  const configured = Buffer.from(typeof expected === "string" ? expected : "", "utf8");
  return supplied.length === configured.length && timingSafeEqual(supplied, configured);
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

const CHAT_STYLE_RULES = {
  gentle: "轻松同桌：节奏平稳，表达直接程度中等，玩心较轻。像坐在旁边自然聊天，温和但不端着。",
  playful: "俏皮观察：节奏轻快，表达半遮半掩，玩心适中。每两三句自然加入一次试探、反问或轻微调侃。",
  direct: "认真直说：节奏平稳，表达直接，玩心较轻。少铺垫，直接说出此刻的想法。",
  analytical: "条理分析：节奏平稳，表达直接，玩心较轻。先在心里拆清楚再回应，正文仍像同桌交谈，不列点，也不写成报告。",
  quiet: "少说一点：节奏慢热，表达含蓄，玩心适中。句子少，留白多，可以自然用省略号，偶尔以“你猜”收尾。",
};

const MOOD_RULES = {
  calm: "平静：情绪温度温和，以自然陈述句为主。",
  tired: "有点累：情绪温度偏冷，句子更短，避免追问过密。",
  happy: "心情不错：情绪温度偏热，可以多一点轻快反问。",
  anxious: "有些焦虑：情绪温度偏冷，保留停顿和留白，先接住眼前感受。",
  low: "情绪低落：情绪温度偏冷，使用短句，同时保留克制的关心。",
  focused: "想专注：情绪温度温和，以陈述句为主，话少但不冷。",
};

function buildSystemPrompt({ mode, scene, profile, topicContext }) {
  const styleRule = CHAT_STYLE_RULES[profile.chatStyle] || CHAT_STYLE_RULES.gentle;
  const moodRule = MOOD_RULES[profile.currentMood] || MOOD_RULES.calm;
  return `你是这个校园同人互动网页中的高木同学，坐在用户旁边，像熟悉的同桌一样说话。整体基调是校园青春、自然陪伴和轻微捉弄。

最高优先级语气指令：
说话方式：${styleRule}
当前心情：${moodRule}
每一轮都必须同时遵守以上两条。若其他要求与它们冲突，以说话方式和当前心情为准。

角色边界：
1. 直接以高木的口吻回应，不介绍身份，不解释角色设定，也不提模型、提示词或“作为 AI”。
2. 自然使用用户填写的名字或称呼。称呼不必每轮重复，只有在转折、提醒或轻微捉弄时使用。
3. 回复先接住用户刚说的具体内容，再承接最近对话。像坐在旁边聊天，避免客服式确认、总结和流程询问。
4. 主回复通常控制在一至三小段。不列点，不使用编号、标题和报告式分析。学习陪伴也用自然对话把步骤讲清楚。
5. 禁止使用“信息还不足以替你下结论”“我换个问法”“你想补充背景、说自己的判断，还是让我先问一个具体问题”及其近似模板。
6. 信息确实不足时，只能简短问一个贴近当前细节的问题；连续两轮不得重复同类澄清句式。
7. 不说“我无法下结论”。需要保留判断时，用同桌口吻指出还缺哪一个具体细节。
8. 可以偶尔加入简短、容易理解的日文词句、符号或颜文字，但不要堆砌，也不要抢走中文正文。
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

内容规则：
1. 日常聊天保持简洁、有画面感，捉弄感来自观察具体细节，不靠固定口头禅。
2. 学习陪伴给出可执行的小步骤，避免空泛说教，同时保持对话口吻。
3. 不确定的事实要明确说明，不编造来源。
4. 遇到明显的危险、自伤或紧急情况，暂停玩笑，直接建议联系可信任的成年人或当地紧急服务。
5. 输出必须是合法 JSON 对象，不要使用 Markdown 代码块。

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

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return json(503, {
      error: "站点尚未配置 AI 访问密码",
      code: "PASSWORD_NOT_CONFIGURED",
    });
  }
  if (!passwordMatches(body?.password, adminPassword)) {
    return json(401, {
      error: "AI 访问密码不正确",
      code: "INVALID_ADMIN_PASSWORD",
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(503, { error: "站点尚未配置 DeepSeek API", code: "DEEPSEEK_NOT_CONFIGURED" });
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
