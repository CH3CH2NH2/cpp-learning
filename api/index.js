/**
 * C++ 学习网站 — Vercel Serverless 主入口
 * 处理所有 /api/* 请求
 */
const { DB, generateToken, verifyToken, chatStream, chatJSON, getSystemPrompt } = require('./_utils');
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// 会话历史（内存）
const sessions = new Map();
const MAX_HISTORY = 10;

// CORS
const setCORS = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
};

const sendJSON = (res, status, data) => {
  res.status(status).json(data);
};

// ============================================================
// 路由分发
// ============================================================
module.exports = async (req, res) => {
  setCORS(res);
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  // 解析路由 — req.url like /api/chat or /api/auth/login
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const parts = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '').split('/');
  const route = parts[0];
  const sub = parts[1];

  // 解析 JSON body
  let body = {};
  if (req.method !== 'GET' && req.headers['content-type']?.includes('json')) {
    try { body = await new Promise((resolve) => { let d = ''; req.on('data', c => d += c); req.on('end', () => resolve(JSON.parse(d || '{}')); }); } catch { body = {}; }
  }

  try {
    switch (route) {
      // ========== 状态 & 知识 ==========
      case 'status':
        return sendJSON(res, 200, { status: 'ok', apiKeyConfigured: !!process.env.DEEPSEEK_API_KEY });

      case 'knowledge': {
        const kp = path.join(__dirname, '..', 'data', 'knowledge.json');
        if (!fs.existsSync(kp)) return sendJSON(res, 503, { error: '知识库数据不存在' });
        return sendJSON(res, 200, JSON.parse(fs.readFileSync(kp, 'utf-8')));
      }

      // ========== 认证 ==========
      case 'auth': {
        if (req.method === 'POST' && sub === 'register') {
          const { email, password, nickname } = body;
          if (!email || !password) return sendJSON(res, 400, { error: '邮箱和密码不能为空' });
          if (password.length < 6) return sendJSON(res, 400, { error: '密码至少 6 位' });
          try {
            const user = await DB.createUser(email, password, nickname);
            return sendJSON(res, 201, { token: generateToken(user), user });
          } catch (e) { return sendJSON(res, 409, { error: e.message }); }
        }

        if (req.method === 'POST' && sub === 'login') {
          const { email, password } = body;
          if (!email || !password) return sendJSON(res, 400, { error: '邮箱和密码不能为空' });
          try {
            const user = await DB.verifyPassword(email, password);
            return sendJSON(res, 200, { token: generateToken(user), user });
          } catch (e) { return sendJSON(res, 401, { error: e.message }); }
        }

        if (req.method === 'GET' && sub === 'me') {
          const u = verifyToken(req.headers.authorization);
          if (!u) return sendJSON(res, 401, { error: '未登录' });
          const p = DB.getUserProfile(u.id);
          return p ? sendJSON(res, 200, p) : sendJSON(res, 404, { error: '用户不存在' });
        }

        if (req.method === 'PUT' && sub === 'api-key') {
          const u = verifyToken(req.headers.authorization);
          if (!u) return sendJSON(res, 401, { error: '未登录' });
          const { apiKey } = body;
          if (!apiKey?.trim()) return sendJSON(res, 400, { error: 'API Key 不能为空' });
          DB.updateApiKey(u.id, apiKey.trim());
          return sendJSON(res, 200, { message: 'API Key 已保存' });
        }

        if (req.method === 'PUT' && sub === 'profile') {
          const u = verifyToken(req.headers.authorization);
          if (!u) return sendJSON(res, 401, { error: '未登录' });
          DB.updateNickname(u.id, body.nickname || '');
          return sendJSON(res, 200, { message: '已更新' });
        }

        return sendJSON(res, 404, { error: '接口不存在' });
      }

      // ========== AI 对话（流式 SSE） ==========
      case 'chat': {
        const { message, currentSection, sessionId } = body;
        if (!message?.trim()) return sendJSON(res, 400, { error: '消息不能为空' });

        const u = verifyToken(req.headers.authorization);
        const apiKey = u ? DB.getUserApiKey(u.id) : process.env.DEEPSEEK_API_KEY;

        const sid = sessionId || `s_${Date.now()}`;
        if (!sessions.has(sid)) sessions.set(sid, []);
        const history = sessions.get(sid);

        const msgs = [
          { role: 'system', content: getSystemPrompt(currentSection) },
          ...history.slice(-MAX_HISTORY * 2),
          { role: 'user', content: message },
        ];

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        try {
          let full = '';
          for await (const chunk of chatStream(msgs, { apiKey })) {
            if (chunk.done) break;
            res.write(`data: ${JSON.stringify({ content: chunk.content, sessionId: sid })}\n\n`);
            full += chunk.content;
          }
          history.push({ role: 'user', content: message }, { role: 'assistant', content: full });
          if (history.length > MAX_HISTORY * 2) history.splice(0, 2);
          res.write(`data: ${JSON.stringify({ done: true, sessionId: sid })}\n\n`);
          res.end();
        } catch (err) {
          res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
          res.end();
        }
        return;
      }

      // ========== 代码分析 ==========
      case 'analyze': {
        const { code } = body;
        if (!code?.trim()) return sendJSON(res, 400, { error: '代码不能为空' });
        if (code.length > 3000) return sendJSON(res, 400, { error: '代码长度超过限制（最大 3000 字符）' });

        const u = verifyToken(req.headers.authorization);
        const apiKey = u ? DB.getUserApiKey(u.id) : process.env.DEEPSEEK_API_KEY;

        const systemP = `你是一个 C++ 代码审查专家。\n分析下面代码，返回 JSON: bugs[], style[], improvements[], complexity{timeComplexity,spaceComplexity,notes}`;

        try {
          const result = await chatJSON([
            { role: 'system', content: systemP },
            { role: 'user', content: `分析代码：\n\`\`\`cpp\n${code}\n\`\`\`` },
          ], { apiKey, temperature: 0.3 });
          return sendJSON(res, 200, result);
        } catch (err) {
          return sendJSON(res, 500, { error: '分析失败', bugs: [], style: [], improvements: [], complexity: { notes: err.message } });
        }
      }

      // ========== 测验 ==========
      case 'quiz': {
        if (sub === 'grade') {
          const { questions, answers } = body;
          if (!questions || !answers) return sendJSON(res, 400, { error: '缺少数据' });
          let correct = 0;
          const results = questions.map(q => {
            const ok = answers[q.id] === q.answer;
            if (ok) correct++;
            return { questionId: q.id, question: q.question, userAnswer: answers[q.id], correctAnswer: q.answer, correct: ok, explanation: q.explanation };
          });
          const total = questions.length;
          return sendJSON(res, 200, { score: correct, total, results, passed: correct > total / 2, nextDifficulty: correct > total / 2 ? 'advanced' : 'basic', message: correct > total / 2 ? `答对 ${correct}/${total}，掌握得不错！` : `答对 ${correct}/${total}，建议复习一下` });
        }

        const { section, subsections, difficulty = 'basic', excludeTopics = [] } = body;
        if (!section) return sendJSON(res, 400, { error: '请指定知识点章节' });

        const usr = verifyToken(req.headers.authorization);
        const apiKey = usr ? DB.getUserApiKey(usr.id) : process.env.DEEPSEEK_API_KEY;

        const systemP = `你是一个 C++ 出题老师。生成 3 道选择题，返回 JSON: {questions: [{id, question, options:["A. ..."], answer:"A", explanation:""}]}`;

        try {
          const result = await chatJSON([
            { role: 'system', content: systemP },
            { role: 'user', content: `章节: ${section}\n难度: ${difficulty === 'advanced' ? '进阶' : '基础'}` },
          ], { apiKey, temperature: 0.7 });
          return sendJSON(res, 200, result);
        } catch (err) {
          return sendJSON(res, 500, { error: '生成题目失败', questions: [] });
        }
      }

      default:
        return sendJSON(res, 404, { error: 'API 接口不存在' });
    }
  } catch (err) {
    console.error(err.message);
    return sendJSON(res, 500, { error: '服务器内部错误' });
  }
};
