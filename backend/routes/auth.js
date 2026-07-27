const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { getDb } = require('../db/init');
const { authMiddleware, generateToken } = require('../middleware/auth');

/**
 * POST /api/auth/register — 注册
 */
router.post('/register', async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '邮箱和密码不能为空' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少 6 位' });
  }

  try {
    const db = getDb();

    // 检查邮箱是否已存在
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: '该邮箱已注册' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = db.prepare(
      'INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)'
    ).run(email, hashed, nickname || email.split('@')[0]);

    const user = { id: result.lastInsertRowid, email, nickname: nickname || email.split('@')[0] };
    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: '注册失败' });
  }
});

/**
 * POST /api/auth/login — 登录
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '邮箱和密码不能为空' });
  }

  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!row) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const valid = await bcrypt.compare(password, row.password);
    if (!valid) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    const user = { id: row.id, email: row.email, nickname: row.nickname };
    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: '登录失败' });
  }
});

/**
 * GET /api/auth/me — 获取当前用户信息
 */
router.get('/me', authMiddleware, (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare('SELECT id, email, nickname, api_key, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!row) return res.status(404).json({ error: '用户不存在' });
    res.json({
      id: row.id,
      email: row.email,
      nickname: row.nickname,
      apiKeyConfigured: !!row.api_key,
      createdAt: row.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

/**
 * PUT /api/auth/api-key — 更新 API Key
 */
router.put('/api-key', authMiddleware, (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey || !apiKey.trim()) {
    return res.status(400).json({ error: 'API Key 不能为空' });
  }

  try {
    const db = getDb();
    db.prepare('UPDATE users SET api_key = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(apiKey.trim(), req.user.id);
    res.json({ message: 'API Key 已保存' });
  } catch (err) {
    res.status(500).json({ error: '保存失败' });
  }
});

/**
 * PUT /api/auth/profile — 更新昵称
 */
router.put('/profile', authMiddleware, (req, res) => {
  const { nickname } = req.body;
  try {
    const db = getDb();
    db.prepare('UPDATE users SET nickname = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(nickname || '', req.user.id);
    res.json({ message: '已更新' });
  } catch (err) {
    res.status(500).json({ error: '更新失败' });
  }
});

module.exports = router;
