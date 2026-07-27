// Railway 部署修复 v3 — 强制重新构建
process.on('uncaughtException', (err) => console.error('UNCAUGHT:', err));
process.on('unhandledRejection', (r) => console.error('UNHANDLED:', r));

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
try { require('dotenv').config(); } catch {}

const app = express();
const PORT = process.env.PORT || 3000;

// 健康检查
app.get('/health', (_, res) => res.send('ok'));

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/quiz', require('./routes/quiz'));

app.get('/api/knowledge', (req, res) => {
  const knowledgePath = path.join(__dirname, 'data', 'knowledge.json');
  try {
    if (!fs.existsSync(knowledgePath)) {
      return res.status(503).json({ error: '知识点数据尚未生成', hint: '请先运行: node scripts/parse-markdown.js' });
    }
    res.json(JSON.parse(fs.readFileSync(knowledgePath, 'utf-8')));
  } catch (err) {
    res.status(500).json({ error: '读取知识点数据失败' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', apiKeyConfigured: !!process.env.DEEPSEEK_API_KEY });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API 接口不存在' });
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🚀 C++ 学习网站已启动
  ────────────────────────────
  🌐 端口: ${PORT}
  ${process.env.DEEPSEEK_API_KEY ? '✅ DeepSeek API 已配置' : '⚠️  DEEPSEEK_API_KEY 未配置'}
  ────────────────────────────
  `);
});
server.on('error', (err) => console.error('SERVER ERROR:', err));
setTimeout(() => {
  console.log('Server still running after 5s');
}, 5000);
