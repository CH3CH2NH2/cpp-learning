const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cpp-learning-secret-key-change-in-production';

/**
 * JWT 认证中间件
 * 从 Authorization header 提取 token，验证后将用户信息挂到 req.user
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录，请先登录' });
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, nickname }
    next();
  } catch (err) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}

/**
 * 生成 JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, nickname: user.nickname || '' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { authMiddleware, generateToken };
