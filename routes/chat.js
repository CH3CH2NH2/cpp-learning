const express = require('express');
const router = express.Router();
const { chatStream, getSystemPrompt, getUserApiKey } = require('../services/deepseek');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cpp-learning-secret-key-change-in-production';
const sessions = new Map();
const MAX_HISTORY = 10;

/** 从请求头取用户 ID（可能为空，此时用全局 Key） */
function getUserId(req) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return null;
    const decoded = jwt.verify(header.slice(7), JWT_SECRET);
    return decoded.id;
  } catch { return null; }
}

router.post('/', async (req, res) => {
  const { message, currentSection, sessionId } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: '消息不能为空' });
  }

  // 获取用户 API Key
  const userId = getUserId(req);
  const apiKey = getUserApiKey(userId);

  const sid = sessionId || `session_${Date.now()}`;
  if (!sessions.has(sid)) sessions.set(sid, []);
  const history = sessions.get(sid);

  const messages = [
    { role: 'system', content: getSystemPrompt(currentSection) },
    ...history.slice(-MAX_HISTORY * 2),
    { role: 'user', content: message },
  ];

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    let fullResponse = '';
    for await (const chunk of chatStream(messages, { apiKey })) {
      if (chunk.done) break;
      res.write(`data: ${JSON.stringify({ content: chunk.content, sessionId: sid })}\n\n`);
      fullResponse += chunk.content;
    }
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: fullResponse });
    if (history.length > MAX_HISTORY * 2) {
      history.splice(0, 2);
    }
    res.write(`data: ${JSON.stringify({ done: true, sessionId: sid })}\n\n`);
    res.end();
  } catch (err) {
    console.error('Chat error:', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message || 'AI 服务异常，请检查 API Key 配置' })}\n\n`);
    res.end();
  }
});

module.exports = router;
