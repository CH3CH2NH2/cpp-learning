const express = require('express');
const router = express.Router();
const { chatJSON, getSystemPrompt, getUserApiKey } = require('../services/deepseek');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cpp-learning-secret-key-change-in-production';

function getUserId(req) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) return null;
    return jwt.verify(header.slice(7), JWT_SECRET).id;
  } catch { return null; }
}

router.post('/', async (req, res) => {
  const { section, subsections, difficulty = 'basic', excludeTopics = [] } = req.body;
  if (!section) {
    return res.status(400).json({ error: '请指定知识点章节' });
  }

  const userId = getUserId(req);
  const apiKey = getUserApiKey(userId);

  const difficultyPrompt = difficulty === 'advanced'
    ? '题目难度较高，考察深入理解和易混淆的知识点'
    : '题目难度基础，考察基本概念和常见用法';
  const excludePrompt = excludeTopics.length > 0
    ? `请避免出以下主题的题目：${excludeTopics.join('、')}`
    : '';

  const systemPrompt = `你是一个 C++ 出题老师。

请根据指定的知识点生成 3 道选择题，返回以下 JSON 格式：
{
  "questions": [
    {
      "id": 1,
      "question": "题目文字",
      "options": ["A. 选项A", "B. 选项B", "C. 选项C", "D. 选项D"],
      "answer": "A",
      "explanation": "为什么这个答案正确"
    }
  ]
}

要求：
1. 每题 4 个选项
2. 答案必须准确
3. 每道题都要有详细的解析
4. 题目不能与已经出过的题目重复`;

  const messages = [
    { role: 'system', content: systemPrompt + '\n\n' + getSystemPrompt() },
    {
      role: 'user',
      content: `知识点章节: ${section}${subsections ? `, 小节: ${subsections.join(', ')}` : ''}
难度: ${difficultyPrompt}
${excludePrompt}
请生成 3 道高质量选择题。`,
    },
  ];

  try {
    const result = await chatJSON(messages, { temperature: 0.7, apiKey });
    res.json(result);
  } catch (err) {
    console.error('Quiz generation error:', err.message);
    res.status(500).json({ error: '生成题目失败，请重试', questions: [] });
  }
});

router.post('/grade', async (req, res) => {
  const { questions, answers } = req.body;
  if (!questions || !answers) {
    return res.status(400).json({ error: '缺少题目或答案数据' });
  }

  let correctCount = 0;
  const results = questions.map((q) => {
    const userAnswer = answers[q.id];
    const correct = userAnswer === q.answer;
    if (correct) correctCount++;
    return {
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.answer,
      correct,
      explanation: q.explanation,
    };
  });

  const total = questions.length;
  const score = correctCount;
  const passed = score > total / 2;

  res.json({
    score,
    total,
    results,
    passed,
    nextDifficulty: passed ? 'advanced' : 'basic',
    message: passed
      ? `答对 ${score}/${total}，掌握得不错！试试进阶题目吧`
      : `答对 ${score}/${total}，建议复习一下再试一次`,
  });
});

module.exports = router;
