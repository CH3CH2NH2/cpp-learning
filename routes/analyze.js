const express = require('express');
const router = express.Router();
const { chatJSON, getSystemPrompt, getUserApiKey } = require('../services/deepseek');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cpp-learning-secret-key-change-in-production';
const MAX_CODE_LENGTH = 3000;

function getUserId(req) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return null;
    return jwt.verify(header.slice(7), JWT_SECRET).id;
  } catch { return null; }
}

router.post('/', async (req, res) => {
  const { code } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ error: '代码不能为空' });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return res.status(400).json({ error: `代码长度超过限制（最大 ${MAX_CODE_LENGTH} 字符）` });
  }

  const userId = getUserId(req);
  const apiKey = getUserApiKey(userId);

  const systemPrompt = `你是一个 C++ 代码审查专家。

请分析下面的 C++ 代码，返回 JSON 格式的分析结果，包含以下字段：
- bugs: 潜在 bug 数组，每项包含 { description, severity: "high"|"medium"|"low" }
- style: 风格问题数组，每项包含 { description }
- improvements: 可改进点数组，每项包含 { description, suggestion }
- complexity: 复杂度分析对象，包含 { timeComplexity, spaceComplexity, notes }

如果没有发现问题，对应数组返回空数组 []。`;

  const messages = [
    { role: 'system', content: systemPrompt + '\n\n' + getSystemPrompt() },
    { role: 'user', content: `分析这段 C++ 代码：\n\`\`\`cpp\n${code}\n\`\`\`` },
  ];

  try {
    const result = await chatJSON(messages, { temperature: 0.3, apiKey });
    res.json(result);
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({
      error: '代码分析失败',
      bugs: [],
      style: [],
      improvements: [],
      complexity: { timeComplexity: '未知', spaceComplexity: '未知', notes: err.message },
    });
  }
});

module.exports = router;
