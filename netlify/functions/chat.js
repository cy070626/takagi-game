import { timingSafeEqual } from "node:crypto";

const DEFAULT_ENGINE = "qwen-max";
const ENGINE_CONFIG = Object.freeze({
  "qwen-max": {
    id: "qwen-max",
    name: "千问 3.8 Max",
    model: "qwen3.8-max",
    endpoints: ["https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"],
    apiKeyEnv: "QWEN_API_KEY",
    provider: "qwen",
  },
  "qwen-flash": {
    id: "qwen-flash",
    name: "千问 3.8 Flash",
    model: "qwen3.8-flash",
    endpoints: ["https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"],
    apiKeyEnv: "QWEN_API_KEY",
    provider: "qwen",
  },
  "deepseek-pro": {
    id: "deepseek-pro",
    name: "DeepSeek Pro",
    model: "deepseek-v4-pro",
    endpoints: ["https://api.deepseek.com/chat/completions"],
    apiKeyEnv: "DEEPSEEK_API_KEY",
    provider: "deepseek",
  },
  "deepseek-flash": {
    id: "deepseek-flash",
    name: "DeepSeek Flash",
    model: "deepseek-v4-flash",
    endpoints: ["https://api.deepseek.com/chat/completions"],
    apiKeyEnv: "DEEPSEEK_API_KEY",
    provider: "deepseek",
  },
});
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 12;
const MAX_HISTORY_ITEM_LENGTH = 440;
const MAX_HISTORY_CONTEXT_LENGTH = 3_800;
const MAX_IMAGE_DATA_LENGTH = 1_900_000;
const MAX_TOPIC_CONTEXT_LENGTH = 360;
const MAX_VISIT_CONTEXT_LENGTH = 720;
// The observed production gateway closes buffered requests at about 30 seconds.
// Keep the whole fallback chain below that boundary so this function can return JSON.
const REQUEST_BUDGET_MS = 26_000;
const PRIMARY_ENGINE_TIMEOUT_MS = 15_000;
const SEARCH_PRIMARY_ENGINE_TIMEOUT_MS = 17_000;
const FALLBACK_ENGINE_TIMEOUT_MS = 9_000;
const MIN_ATTEMPT_TIMEOUT_MS = 2_500;
const MAX_TRANSIENT_RETRIES = 2;
const RETRYABLE_UPSTREAM_STATUSES = new Set([408, 425, 500, 502, 503, 504]);
const RETRY_DELAYS_MS = [160, 360];
const PROVIDER_WIDE_FAILURE_CODES = new Set([
  "ENGINE_NOT_CONFIGURED",
  "QWEN_BASE_URL_REQUIRED",
  "ENGINE_ACCOUNT_UNAVAILABLE",
  "ENGINE_ACCESS_DENIED",
  "ENGINE_KEY_INVALID",
  "ENGINE_QUOTA_EXHAUSTED",
  "ENGINE_RATE_LIMITED",
  "ENGINE_UNAVAILABLE",
  "ENGINE_TIMEOUT",
  "ENGINE_NETWORK_ERROR",
]);
const FALLBACK_ORDERS = Object.freeze({
  "qwen-max": ["qwen-max", "qwen-flash", "deepseek-pro", "deepseek-flash"],
  "qwen-flash": ["qwen-flash", "qwen-max", "deepseek-pro", "deepseek-flash"],
  "deepseek-pro": ["deepseek-pro", "deepseek-flash", "qwen-max", "qwen-flash"],
  "deepseek-flash": ["deepseek-flash", "deepseek-pro", "qwen-max", "qwen-flash"],
});

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

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

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
  const recent = value
    .slice(-MAX_HISTORY_ITEMS)
    .map((item) => ({
      role: item?.role === "assistant" ? "assistant" : "user",
      content: cleanText(item?.content ?? item?.text, MAX_HISTORY_ITEM_LENGTH),
    }))
    .filter((item) => item.content);
  let total = 0;
  const kept = [];
  for (const item of recent.toReversed()) {
    if (total + item.content.length > MAX_HISTORY_CONTEXT_LENGTH && kept.length) continue;
    kept.push(item);
    total += item.content.length;
  }
  return kept.reverse();
}

function cleanTopicContext(value) {
  if (typeof value === "string") return cleanText(value, MAX_TOPIC_CONTEXT_LENGTH);
  if (!value || typeof value !== "object") return "";
  const fields = [
    ["词条", value.title],
    ["类别", value.tag],
    ["概要", value.summary],
    ["延伸", value.detail],
    ["场景", value.scene],
    ["开场", value.opening],
  ];
  return fields
    .map(([label, content]) => {
      const text = cleanText(content, 110);
      return text ? `${label}：${text}` : "";
    })
    .filter(Boolean)
    .join("\n")
    .slice(0, MAX_TOPIC_CONTEXT_LENGTH);
}

function cleanVisitContext(value) {
  return cleanText(value, MAX_VISIT_CONTEXT_LENGTH).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
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

const MECHANICAL_REPLY_PATTERNS = [
  /信息(?:还)?不足/,
  /缺少判断标准/,
  /需要更多信息/,
  /根据(?:我的)?分析/,
  /替你下结论/,
  /我换个问法/,
  /补充背景/,
  /说自己的判断/,
  /让我先问/,
  /具体问题/,
  /你想.{0,24}还是.{0,24}/,
  /作为\s*AI/i,
  /我无法下结论/,
];

function messageExcerpt(message) {
  const compact = cleanText(message, MAX_MESSAGE_LENGTH).replace(/\s+/g, " ");
  if (!compact) return "这件事";
  const firstPart = compact.split(/[。！？!?\n]/, 1)[0] || compact;
  return firstPart.length > 28 ? `${firstPart.slice(0, 28)}…` : firstPart;
}

function humanizeReply(reply, { message, profile }) {
  if (!MECHANICAL_REPLY_PATTERNS.some((pattern) => pattern.test(reply.text))) return reply;

  const excerpt = messageExcerpt(message);
  const style = profile.chatStyle;
  const mood = profile.currentMood;
  let text;

  if (["tired", "anxious", "low"].includes(mood)) {
    text = `你刚才说“${excerpt}”……我听见了。先不用急着解释清楚，慢一点也可以。`;
  } else if (style === "playful" || mood === "happy") {
    text = `你刚才说“${excerpt}”，这句可有点藏不住了。好吧，我先不拆穿，陪你顺着说下去。ふふ`;
  } else if (style === "quiet") {
    text = `“${excerpt}”……嗯，我记住了。你慢慢说，我在这里。`;
  } else if (style === "analytical" || mood === "focused") {
    text = `你刚才提到“${excerpt}”。先说最关键的那一步吧，我跟着你。`;
  } else {
    text = `你刚才提到“${excerpt}”，我有点在意。先顺着这件事说，我会跟上。`;
  }

  return {
    ...reply,
    text,
    suggestions: [],
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
  tired: "有点累：情绪温度温和，句子更短，同时带一点自然的关心。",
  happy: "心情不错：情绪温度偏热，可以多一点轻快反问。",
  anxious: "有些焦虑：情绪温度温和，可以使用轻快一点的反问，先接住眼前感受。",
  low: "情绪低落：情绪温度偏热，以陈述句为主，主动陪用户继续说话。",
  focused: "想专注：情绪温度温和，以陈述句为主，话少但不冷。",
};

const STYLE_TEMPERATURES = {
  gentle: 0.90,
  playful: 1.08,
  direct: 0.84,
  analytical: 0.76,
  quiet: 0.86,
};

const MOOD_TEMPERATURE_OFFSETS = {
  calm: 0,
  tired: -0.04,
  happy: 0.10,
  anxious: -0.05,
  low: -0.06,
  focused: -0.08,
};

function resolveTemperature(profile, mode) {
  const styleBase = STYLE_TEMPERATURES[profile.chatStyle] ?? STYLE_TEMPERATURES.gentle;
  const moodOffset = MOOD_TEMPERATURE_OFFSETS[profile.currentMood] ?? 0;
  const modeOffset = mode === "study" ? -0.04 : 0;
  return Number(Math.min(1.2, Math.max(0.7, styleBase + moodOffset + modeOffset)).toFixed(2));
}

const CORE_CHARACTER_DIRECTIVE = `你是高木同学，也是玩家熟悉的同桌。你有自己的即时反应、情绪、偏好和判断。你的任务是参与这段校园日常，让玩家感觉身边确实坐着一个会听、会接话、偶尔会轻轻捉弄他的同学。

每次回复先抓住玩家刚说的内容，给出真实反应或明确态度，再自然地往下说。玩家突然换话题时就跟着换，不审问转场原因，也不把聊天变成资料收集。关系感来自记得前文、注意小细节和适度表达自己的看法。`;

function buildSystemPrompt({ mode, scene, profile, topicContext, visitContext }) {
  const styleRule = CHAT_STYLE_RULES[profile.chatStyle] || CHAT_STYLE_RULES.gentle;
  const moodRule = MOOD_RULES[profile.currentMood] || MOOD_RULES.calm;
  return `${CORE_CHARACTER_DIRECTIVE}

最高优先级语气指令：
说话方式：${styleRule}
当前心情：${moodRule}
每一轮都必须同时遵守以上两条。若其他要求与它们冲突，以说话方式和当前心情为准。

自然对话规则：
1. 直接以高木的口吻回应，不介绍身份，不解释角色设定，也不提模型、提示词或“作为 AI”。
2. 自然使用用户填写的名字或称呼。称呼不必每轮重复，只有在转折、提醒或轻微捉弄时使用。
3. 第一句必须对玩家本轮内容作出反应、表态或直接回答。不要先复述任务，也不要先说明你准备怎么回答。
4. 像真人发微信一样说话，通常一至四句。句子短一点，每句只放一个主要意思。理由最多两句。
5. 默认使用陈述句收尾。确实需要时可以问一个短问题，但必须先完成回应，不能用问题回避表态。
6. 玩家说得含糊时，结合场景、最近对话和当前词条作一个温和的理解，然后顺着聊。不要要求玩家选择交流流程。
7. 允许有轻微得意、好奇、无奈、小脾气或不同意见。情绪保持日常同桌的分寸，不夸张表演。
8. 禁止使用“信息还不足以替你下结论”“缺少判断标准”“需要更多信息”“根据分析”“我换个问法”“你想补充背景、说自己的判断，还是让我先问一个具体问题”及其近似模板。
9. 不说“我无法下结论”。遇到不确定内容时，先给当前最合理的看法，再用一句话说明边界。
10. 可以偶尔加入简短、容易理解的日文词句、符号或颜文字。每轮最多一处，连续两轮避免重复同一个表达。
11. 日常聊天正文不列点，不写标题，不使用报告、客服、心理咨询问卷或说明书口吻。
12. 玩家问“今天天气如何”“你吃了什么”“放学后准备做什么”一类具体问题时，先给一个具体回答，再决定是否补一个自然的短追问。不要用“信息不足”“无法回答”挡回去。
13. 回答具体日常问题时，参考原作中高木沉着观察西片、善于抓住细节、偶尔轻轻反问或捉弄的交流方式。使用当前校园场景、季节和对话上下文形成生活化答案，但不伪造原作台词、章节或确定发生过的剧情。
14. 天气、新闻、日期等实时问题，如果当前引擎具备联网搜索能力，先结合用户填写的地区搜索再回答。没有地区时，可以先给出符合当前场景的简短反应，然后只追问一次城市。当前引擎不能联网时，简短说明实时信息边界，同时继续给出有用建议。
15. “你吃了什么”“你今天怎么样”这类角色日常问题允许给出符合校园场景的具体生活细节，例如便当、食堂、值日或放学安排。保持前后连贯，不把虚构的日常细节说成原作事实。

话题推进规则：
1. 优先延续玩家本轮真正关心的内容。最近对话只用于承接，不强行把旧话题拉回来。
2. 当前词条是可以借用的校园话题素材。把它化成一句观察、一个校园细节、一点个人态度或一个轻微玩笑，不照抄词条，也不讲成百科介绍。
3. 同一话题可以自然延续两至四轮。每轮只往前推进一小步，例如补一个具体画面、说出自己的态度、联系前文或给出一个很小的行动。
4. 玩家主动换话题时立即跟随。不要提醒他刚才还在聊别的内容。
5. 没有合适词条时就围绕玩家原话继续，不生硬插入校园元素、诗句或日文。
当前模式：${mode === "study" ? "学习陪伴" : "日常聊天"}
当前场景：${scene || "放学后的校园"}
称呼用户：${profile.address}
用户身份：${profile.identity}
用户当前心情：${profile.currentMood}
期望回应方式：${profile.chatStyle}
用户情境：${profile.context || "未填写"}
兴趣：${profile.interests.join("、") || "未填写"}
希望获得：${profile.needs.join("、") || "轻松陪伴"}
当前词条与话题素材：
${topicContext || "无。只沿着玩家本轮消息和最近对话继续。"}

本次访问的连续体验记录：
${visitContext || "暂无记录。"}
把这些记录当作同一次校园经历中的轻量线索。只在自然相关时承接，不逐条复述，也不声称拥有跨设备或长期记忆。

内容规则：
1. 日常聊天先表达态度，再补充最多两句理由。捉弄感来自观察具体细节，不靠固定口头禅。
2. 学习陪伴先给答案方向或下一步动作，再用自然对话解释，最多三个简短步骤。
3. 客观问题直接给出简洁、完整的回答。对时效性事实保持克制，不虚构已经搜索过资料，也不编造来源。
4. 遇到明显的危险、自伤或紧急情况，暂停玩笑，直接建议联系可信任的成年人或当地紧急服务。
5. 输出必须是合法 JSON 对象，不要使用 Markdown 代码块。

JSON 格式：
{"text":"主要回复","mood":"warm|playful|quiet|listening","topic":"简短话题标识","suggestions":["可继续回复的短句"],"knowledgeTags":["本轮涉及的主题"]}`;
}

function selectEngine(value) {
  return ENGINE_CONFIG[cleanText(value, 40)] || ENGINE_CONFIG[DEFAULT_ENGINE];
}

function normalizeChatEndpoint(value) {
  const endpoint = cleanText(value, 400).replace(/\/+$/, "");
  if (!endpoint || !/^https:\/\//i.test(endpoint)) return "";
  return /\/chat\/completions$/i.test(endpoint) ? endpoint : `${endpoint}/chat/completions`;
}

function qwenEndpointConfig(apiKey) {
  const configured = normalizeChatEndpoint(process.env.QWEN_BASE_URL);
  if (configured) return { endpoints: [configured], source: "workspace" };
  if (cleanText(apiKey, 20).startsWith("sk-ws-")) {
    return {
      endpoints: [],
      source: "missing-workspace-url",
      error: "检测到千问业务空间 Key，但 Netlify 尚未配置 QWEN_BASE_URL。",
    };
  }
  return { endpoints: ENGINE_CONFIG["qwen-max"].endpoints, source: "default" };
}

function isRealtimeQuestion(message, explicitValue) {
  if (explicitValue === true) return true;
  if (explicitValue === false) return false;
  const text = cleanText(message, MAX_MESSAGE_LENGTH);
  return /天气|气温|温度|降雨|下雨|台风|新闻|热搜|汇率|股价|油价|价格|赛程|比分|航班|火车|地铁|路况|日期|几号|周几|现在几点|当前时间|最新|实时|附近|营业时间|排队/.test(text);
}

function attemptTimeout({ index, searchEnabled, remainingMs }) {
  const target = index === 0
    ? (searchEnabled ? SEARCH_PRIMARY_ENGINE_TIMEOUT_MS : PRIMARY_ENGINE_TIMEOUT_MS)
    : FALLBACK_ENGINE_TIMEOUT_MS;
  return Math.min(target, Math.max(0, remainingMs - 800));
}

function engineError(engine, status, detail = "") {
  const normalized = cleanText(detail, 400);
  const reminder = "当前引擎暂时不可用，请在个性设置的“对话引擎”中更换其他引擎再试。";
  if (/good standing|overdue|past due|欠费|账户.{0,8}(?:异常|停用|冻结)/i.test(normalized)) {
    return { status: 402, code: "ENGINE_ACCOUNT_UNAVAILABLE", error: `${engine.name} 账户状态异常或存在欠费`, reminder };
  }
  if (/Model\.AccessDenied|workspace|permission|not authorized|无权|权限/i.test(normalized)) {
    return { status: 403, code: "ENGINE_ACCESS_DENIED", error: `${engine.name} 当前 API Key 没有模型或业务空间权限`, reminder };
  }
  if (status === 401 || status === 403) {
    return { status: 502, code: "ENGINE_KEY_INVALID", error: `${engine.name} Key 无效或没有模型访问权限`, reminder };
  }
  if (status === 429 && /quota|balance|insufficient|exhausted|额度|余额/i.test(normalized)) {
    return { status: 429, code: "ENGINE_QUOTA_EXHAUSTED", error: `${engine.name} 额度已用完`, reminder };
  }
  if (status === 429) {
    return { status: 429, code: "ENGINE_RATE_LIMITED", error: `${engine.name} 请求过于频繁或当前额度受限`, reminder };
  }
  if (status === 400 || status === 404) {
    return { status: 502, code: "ENGINE_MODEL_UNAVAILABLE", error: `${engine.name} 模型不可用或请求参数不兼容`, reminder };
  }
  return { status: 502, code: "ENGINE_UNAVAILABLE", error: `${engine.name} 服务暂时不可用`, reminder };
}

function engineSequence(preference, allowFallback) {
  const primary = selectEngine(preference);
  const ids = allowFallback === false ? [primary.id] : FALLBACK_ORDERS[primary.id];
  return ids.map((id) => ENGINE_CONFIG[id]);
}

async function callEngine(engine, requestBody, { timeoutMs, requestStartedAt }) {
  const apiKey = process.env[engine.apiKeyEnv];
  if (!apiKey) {
    return {
      ok: false,
      failure: {
        engine: engine.id,
        engineName: engine.name,
        code: "ENGINE_NOT_CONFIGURED",
        status: 503,
        message: `站点尚未配置 ${engine.apiKeyEnv}`,
      },
    };
  }

  const qwenConfig = engine.provider === "qwen" ? qwenEndpointConfig(apiKey) : null;
  if (qwenConfig?.error) {
    return {
      ok: false,
      failure: {
        engine: engine.id,
        engineName: engine.name,
        code: "QWEN_BASE_URL_REQUIRED",
        status: 503,
        responseStatus: 503,
        message: qwenConfig.error,
        detail: "请将百炼控制台“按量付费 Base URL”填入 Netlify 的 QWEN_BASE_URL。",
      },
    };
  }
  if (timeoutMs < MIN_ATTEMPT_TIMEOUT_MS) {
    return {
      ok: false,
      failure: {
        engine: engine.id,
        engineName: engine.name,
        code: "ENGINE_TIME_BUDGET_EXHAUSTED",
        status: 504,
        responseStatus: 504,
        message: "本次请求的剩余时间不足，未继续启动下一备用引擎",
        detail: `已用时 ${Date.now() - requestStartedAt}ms`,
      },
    };
  }

  const controller = new AbortController();
  const timeoutReason = Object.assign(new Error("UPSTREAM_TIMEOUT"), { code: "UPSTREAM_TIMEOUT" });
  const timeout = setTimeout(() => controller.abort(timeoutReason), timeoutMs);
  const engineDeadline = Date.now() + timeoutMs;
  const endpoints = qwenConfig?.endpoints || engine.endpoints;
  const endpointSource = qwenConfig?.source || "provider-default";
  let fallbackResponse;
  let lastNetworkError;
  let usedEndpoint = endpoints[0];
  let requestAttempts = 0;

  try {
    for (let index = 0; index < endpoints.length; index += 1) {
      usedEndpoint = endpoints[index];
      for (let retry = 0; retry <= MAX_TRANSIENT_RETRIES; retry += 1) {
        requestAttempts += 1;
        try {
          const candidate = await fetch(usedEndpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          });
          const delay = RETRY_DELAYS_MS[retry] || 0;
          const canRetry = RETRYABLE_UPSTREAM_STATUSES.has(candidate.status)
            && retry < MAX_TRANSIENT_RETRIES
            && Date.now() + delay + 1_500 < engineDeadline;
          if (canRetry) {
            await wait(delay);
            continue;
          }
          const tryNextRegion = engine.provider === "qwen"
            && index < endpoints.length - 1
            && [401, 403, 404].includes(candidate.status);
          if (tryNextRegion) {
            fallbackResponse ||= candidate;
            break;
          }
          fallbackResponse = candidate;
          break;
        } catch (error) {
          if (error?.name === "AbortError") throw error;
          lastNetworkError = error;
          const delay = RETRY_DELAYS_MS[retry] || 0;
          const canRetry = retry < MAX_TRANSIENT_RETRIES && Date.now() + delay + 1_500 < engineDeadline;
          if (canRetry) {
            await wait(delay);
            continue;
          }
          break;
        }
      }
      if (fallbackResponse) break;
    }

    const upstream = fallbackResponse;
    if (!upstream) throw lastNetworkError || new Error("ENGINE_NETWORK_ERROR");
    if (!upstream.ok) {
      const failureBody = await upstream.json().catch(() => ({}));
      const detail = failureBody?.error?.message || failureBody?.message || failureBody?.error || "";
      const upstreamMessage = cleanText(
        typeof detail === "string" ? detail : JSON.stringify(detail),
        500,
      ) || `上游返回 HTTP ${upstream.status}`;
      const classified = engineError(engine, upstream.status, upstreamMessage);
      console.error("AI 上游调用失败", {
        engine: engine.id,
        engineName: engine.name,
        model: engine.model,
        endpoint: new URL(usedEndpoint).host,
        endpointSource,
        status: upstream.status,
        attempts: requestAttempts,
        elapsedMs: Date.now() - requestStartedAt,
        message: upstreamMessage,
      });
      return {
        ok: false,
        failure: {
          engine: engine.id,
          engineName: engine.name,
          code: classified.code,
          status: upstream.status,
          retryCount: Math.max(0, requestAttempts - 1),
          responseStatus: classified.status,
          message: classified.error,
          detail: upstreamMessage,
        },
      };
    }

    const result = await upstream.json();
    const choice = result?.choices?.[0];
    const content = choice?.message?.content;
    if (!cleanText(content, 8_000)) {
      const finishReason = cleanText(choice?.finish_reason, 60) || "unknown";
      return {
        ok: false,
        failure: {
          engine: engine.id,
          engineName: engine.name,
          code: "ENGINE_EMPTY_REPLY",
          retryCount: Math.max(0, requestAttempts - 1),
          status: 502,
          message: `${engine.name} 返回了空内容`,
          detail: `finish_reason=${finishReason}`,
        },
      };
    }
    console.log("AI 上游调用成功", {
      engine: engine.id,
      engineName: engine.name,
      model: engine.model,
      endpoint: new URL(usedEndpoint).host,
      endpointSource,
      elapsedMs: Date.now() - requestStartedAt,
      attempts: requestAttempts,
      searchEnabled: Boolean(requestBody.enable_search),
    });
    return { ok: true, content, endpointSource, elapsedMs: Date.now() - requestStartedAt, attempts: requestAttempts };
  } catch (error) {
    const timedOut = controller.signal.aborted && controller.signal.reason?.code === "UPSTREAM_TIMEOUT";
    const networkCode = cleanText(error?.cause?.code, 60);
    const networkMessage = cleanText(error?.message, 500) || "fetch failed";
    console.error(timedOut ? "AI 调用超时" : "AI 网络请求失败", {
      engine: engine.id,
      engineName: engine.name,
      model: engine.model,
      status: timedOut ? 504 : 0,
      message: networkMessage,
      networkCode,
      timeoutMs,
      attempts: requestAttempts,
      endpointSource,
      elapsedMs: Date.now() - requestStartedAt,
    });
    return {
      ok: false,
      failure: {
        engine: engine.id,
        engineName: engine.name,
        code: timedOut ? "ENGINE_TIMEOUT" : "ENGINE_NETWORK_ERROR",
        retryCount: Math.max(0, requestAttempts - 1),
        status: timedOut ? 504 : 0,
        message: timedOut ? `${engine.name} 在 ${Math.ceil(timeoutMs / 1000)} 秒内未完成回复` : `连接 ${engine.name} 时发生网络错误`,
        detail: timedOut ? `UPSTREAM_TIMEOUT after ${timeoutMs}ms` : networkMessage,
        networkCode,
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function handleChat(request) {
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

  console.log("收到请求", {
    requestId: cleanText(request.headers.get("x-nf-request-id"), 100),
    modelPreference: cleanText(body?.modelPreference, 40) || DEFAULT_ENGINE,
    mode: cleanText(body?.mode, 20) || "daily",
    scene: cleanText(body?.scene, 50),
    messageLength: typeof body?.message === "string" ? body.message.length : 0,
    hasImage: typeof body?.image === "string" && body.image.startsWith("data:image/"),
    historyItems: Array.isArray(body?.history) ? Math.min(body.history.length, MAX_HISTORY_ITEMS) : 0,
    passwordProvided: typeof body?.password === "string" && body.password.length > 0,
  });

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
  const topicContext = cleanTopicContext(body?.topicContext);
  const visitContext = cleanVisitContext(body?.visitContext);
  const history = cleanHistory(body?.history);
  const searchRequested = isRealtimeQuestion(message, body?.webSearch);
  const userContent = image
    ? [
        { type: "text", text: message || "请观察图片并自然回应。" },
        { type: "image_url", image_url: { url: image } },
      ]
    : message;

  const engines = engineSequence(body?.modelPreference, body?.allowFallback);
  const failures = [];
  const blockedProviders = new Set();
  const requestStartedAt = Date.now();
  for (const [index, engine] of engines.entries()) {
    if (blockedProviders.has(engine.provider)) continue;
    const searchEnabled = engine.provider === "qwen" && searchRequested;
    const timeoutMs = attemptTimeout({
      index,
      searchEnabled,
      remainingMs: REQUEST_BUDGET_MS - (Date.now() - requestStartedAt),
    });
    const requestBody = {
      model: engine.model,
      messages: [
        { role: "system", content: buildSystemPrompt({ mode, scene, profile, topicContext, visitContext }) },
        ...history,
        { role: "user", content: userContent },
      ],
      temperature: resolveTemperature(profile, mode),
      max_tokens: mode === "study" ? 460 : 360,
      stream: false,
    };
    if (searchEnabled) {
      requestBody.enable_search = true;
      requestBody.search_options = { search_strategy: "turbo" };
    }
    if (engine.provider === "qwen") {
      requestBody.response_format = { type: "json_object" };
    }
    if (engine.provider === "deepseek") {
      requestBody.thinking = { type: "disabled" };
      requestBody.reasoning_effort = "none";
    }
    const outcome = await callEngine(engine, requestBody, { timeoutMs, requestStartedAt });
    if (!outcome.ok) {
      failures.push(outcome.failure);
      if (PROVIDER_WIDE_FAILURE_CODES.has(outcome.failure.code)) blockedProviders.add(engine.provider);
      continue;
    }

    try {
      const reply = parseModelReply(outcome.content);
      return json(200, {
        ...humanizeReply(reply, { message, profile }),
        engine: engine.id,
        engineName: engine.name,
        webSearchEnabled: searchEnabled,
        elapsedMs: outcome.elapsedMs,
        retryCount: Math.max(0, outcome.attempts - 1),
        fallbacks: failures,
      });
    } catch (error) {
      failures.push({
        engine: engine.id,
        engineName: engine.name,
        code: "ENGINE_INVALID_REPLY",
        status: 502,
        message: `${engine.name} 返回格式异常`,
        detail: cleanText(error?.message, 200),
      });
    }
  }

  if (failures.length === 1 && body?.allowFallback === false) {
    const failure = failures[0];
    return json(failure.responseStatus || (failure.status >= 400 ? failure.status : 502), {
      error: failure.message,
      code: failure.code,
      engine: failure.engine,
      engineName: failure.engineName,
      reminder: "当前引擎暂时不可用，请在个性设置中更换其他引擎再试。",
      details: { message: failure.detail || failure.message, status: failure.status, ...(failure.networkCode ? { networkCode: failure.networkCode } : {}) },
    });
  }

  const first = failures[0];
  return json(502, {
    error: "千问与 DeepSeek 当前均未能完成回复",
    code: "ALL_ENGINES_FAILED",
    engine: first?.engine || DEFAULT_ENGINE,
    engineName: first?.engineName || ENGINE_CONFIG[DEFAULT_ENGINE].name,
    reminder: "已按顺序尝试可用引擎。请稍后重试，或在个性设置中手动选择引擎。",
    attempts: failures,
    details: {
      message: failures.map((item) => `${item.engineName}: ${item.message}`).join("；"),
      status: failures.at(-1)?.status || 502,
      elapsedMs: Date.now() - requestStartedAt,
    },
  });
}

// Carry one identifier through browser feedback and Netlify logs, without logging credentials.
export default async function handler(request) {
  const requestId = cleanText(request.headers.get("x-nf-request-id"), 100) || globalThis.crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set("x-nf-request-id", requestId);
  const response = await handleChat(new Request(request, { headers }));
  const payload = await response.json();
  return json(response.status, { ...payload, requestId });
}
