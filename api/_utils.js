/**
 * 共享工具 — 内存数据库 + JWT + DeepSeek 封装
 * 用于 Vercel Serverless 环境
 */
const OpenAI = require('openai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ============ JWT ============
const JWT_SECRET = process.env.JWT_SECRET || 'cpp-learning-secret-v1';
function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, nickname: user.nickname || '' }, JWT_SECRET, { expiresIn: '7d' });
}
function verifyToken(header) {
  try {
    if (!header || !header.startsWith('Bearer ')) return null;
    return jwt.verify(header.slice(7), JWT_SECRET);
  } catch { return null; }
}

// ============ 内存数据库 ============
const MEMORY = { users: [], nextId: 1 };

const DB = {
  findUserByEmail(email) {
    return MEMORY.users.find(u => u.email === email) || null;
  },
  findUserById(id) {
    return MEMORY.users.find(u => u.id === id) || null;
  },
  async createUser(email, password, nickname) {
    const existing = this.findUserByEmail(email);
    if (existing) throw new Error('该邮箱已注册');
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: MEMORY.nextId++, email, password: hashed, nickname: nickname || email.split('@')[0], api_key: '', created_at: new Date().toISOString() };
    MEMORY.users.push(user);
    return { id: user.id, email: user.email, nickname: user.nickname };
  },
  async verifyPassword(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) throw new Error('邮箱或密码错误');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('邮箱或密码错误');
    return { id: user.id, email: user.email, nickname: user.nickname };
  },
  updateApiKey(userId, apiKey) {
    const user = MEMORY.users.find(u => u.id === userId);
    if (user) { user.api_key = apiKey; user.updated_at = new Date().toISOString(); return true; }
    return false;
  },
  getUserApiKey(userId) {
    const user = MEMORY.users.find(u => u.id === userId);
    return user?.api_key || process.env.DEEPSEEK_API_KEY || '';
  },
  getUserProfile(userId) {
    const user = MEMORY.users.find(u => u.id === userId);
    if (!user) return null;
    return { id: user.id, email: user.email, nickname: user.nickname, apiKeyConfigured: !!user.api_key, createdAt: user.created_at };
  },
  updateNickname(userId, nickname) {
    const user = MEMORY.users.find(u => u.id === userId);
    if (user) { user.nickname = nickname; return true; }
    return false;
  }
};

// ============ DeepSeek API ============
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

function createClient(apiKey) {
  const key = apiKey || process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error('API Key 未配置，请在个人设置中绑定你的 DeepSeek API Key');
  return new OpenAI({ apiKey: key, baseURL: DEEPSEEK_BASE_URL });
}

async function* chatStream(messages, options = {}) {
  const client = createClient(options.apiKey);
  const stream = await client.chat.completions.create({
    model: options.model || 'deepseek-chat',
    messages, temperature: options.temperature ?? 0.7, max_tokens: options.max_tokens || 4096,
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
    messages: [{ role: 'system', content: '只输出有效 JSON，不要包含其他文字说明。' }, ...messages],
    temperature: options.temperature ?? 0.3, max_tokens: options.max_tokens || 4096,
    response_format: { type: 'json_object' },
  });
  const text = completion.choices[0]?.message?.content || '{}';
  try { return JSON.parse(text); }
  catch (e) {
    const m = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m) return JSON.parse(m[1].trim());
    throw new Error('无法解析 AI 返回为 JSON');
  }
}

function getSystemPrompt(currentSection = null) {
  let p = `你是一个 C++ 编程助教，帮助初学者理解 C++ 知识。\n\n回答原则：\n1. 用中文回答，语言通俗易懂\n2. 尽可能附带代码示例\n3. 涉及内存管理、指针等主动提醒陷阱\n4. 不知道的不要编造\n5. 鼓励动手写代码验证`;
  if (currentSection) p += `\n\n当前用户正在学习: "${currentSection}"。`;
  return p;
}

module.exports = { DB, generateToken, verifyToken, chatStream, chatJSON, getSystemPrompt };
