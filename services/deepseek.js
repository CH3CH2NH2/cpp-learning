/**
 * DeepSeek API 封装服务
 * 使用 OpenAI 兼容接口调用 DeepSeek 模型
 */
const OpenAI = require('openai');

const { getDb } = require('../db/init');

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

/**
 * 获取用户绑定的 API Key
 * 优先返回用户自己的 Key，其次 fallback 到全局 env
 */
function getUserApiKey(userId) {
  if (!userId) return process.env.DEEPSEEK_API_KEY || '';
  try {
    const db = getDb();
    const row = db.prepare('SELECT api_key FROM users WHERE id = ?').get(userId);
    return row?.api_key || process.env.DEEPSEEK_API_KEY || '';
  } catch {
    return process.env.DEEPSEEK_API_KEY || '';
  }
}

function createClient(apiKey) {
  const key = apiKey || process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error('API Key 未配置，请在个人设置中绑定你的 DeepSeek API Key');
  }
  return new OpenAI({ apiKey: key, baseURL: DEEPSEEK_BASE_URL });
}

async function chat(messages, options = {}) {
  const client = createClient(options.apiKey);
  const completion = await client.chat.completions.create({
    model: options.model || 'deepseek-chat',
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens || 2048,
  });
  return completion.choices[0]?.message?.content || '';
}

async function* chatStream(messages, options = {}) {
  const client = createClient(options.apiKey);
  const stream = await client.chat.completions.create({
    model: options.model || 'deepseek-chat',
    messages,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.max_tokens || 4096,
    stream: true,
  });
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    yield { content, done: false };
  }
  yield { content: '', done: true };
}

async function chatJSON(messages, options = {}) {
  const client = createClient(options.apiKey);
  const completion = await client.chat.completions.create({
    model: options.model || 'deepseek-chat',
    messages: [
      { role: 'system', content: '你是一个严格的 JSON 输出助手。只输出有效 JSON，不要包含其他文字说明或 markdown 代码块。' },
      ...messages,
    ],
    temperature: options.temperature ?? 0.3,
    max_tokens: options.max_tokens || 4096,
    response_format: { type: 'json_object' },
  });
  const text = completion.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) return JSON.parse(jsonMatch[1].trim());
    throw new Error(`无法解析 AI 返回为 JSON: ${e.message}`);
  }
}

function getSystemPrompt(currentSection = null) {
  let prompt = `你是一个 C++ 编程助教，帮助初学者理解 C++ 知识。

回答原则：
1. 用中文回答，语言通俗易懂，面向 C++ 初学者
2. 尽可能附带简洁的代码示例来说明概念
3. 如果问题涉及内存管理、指针等容易出错的内容，主动提醒常见陷阱
4. 不知道的不要编造，直接说"这个我无法确认"
5. 鼓励学习者动手写代码验证`;
  if (currentSection) {
    prompt += `\n\n当前用户正在学习: "${currentSection}"。请结合这个知识点背景来回答问题。`;
  }
  return prompt;
}

module.exports = { chat, chatStream, chatJSON, getSystemPrompt, getUserApiKey };
