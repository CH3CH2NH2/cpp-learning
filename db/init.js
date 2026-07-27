/**
 * 纯 JS 数据库 — 内存存储 + JSON 文件持久化
 * 无需任何原生模块，兼容 Railway/Vercel 等 Serverless 环境
 */
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'db.json');

// 内存数据
let data = { users: [], nextId: 1 };

// 从文件恢复
function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch { /* 文件损坏就重新开始 */ }
}

// 保存到文件
function save() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) { console.error('保存数据失败:', e.message); }
}

// 初始化加载
load();

const DB = {
  getDb() {
    return {
      prepare(sql) {
        return {
          get(...params) {
            if (sql.includes('SELECT id FROM users WHERE email')) {
              return data.users.find(u => u.email === params[0]) || undefined;
            }
            if (sql.includes('SELECT * FROM users WHERE email')) {
              return data.users.find(u => u.email === params[0]) || undefined;
            }
            if (sql.includes('SELECT id, email, nickname, api_key, created_at FROM users WHERE id')) {
              const u = data.users.find(x => x.id === params[0]);
              return u ? { id: u.id, email: u.email, nickname: u.nickname, api_key: u.api_key, created_at: u.created_at } : undefined;
            }
            if (sql.includes('SELECT * FROM users WHERE id')) {
              return data.users.find(u => u.id === params[0]) || undefined;
            }
            if (sql.includes('SELECT api_key FROM users WHERE id')) {
              const u = data.users.find(x => x.id === params[0]);
              return u ? { api_key: u.api_key } : undefined;
            }
            return undefined;
          },
          run(...params) {
            if (sql.startsWith('INSERT INTO users')) {
              const user = {
                id: data.nextId++,
                email: params[0],
                password: params[1],
                nickname: params[2] || params[0].split('@')[0],
                api_key: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              data.users.push(user);
              save();
              return { lastInsertRowid: user.id, changes: 1 };
            }
            if (sql.startsWith('UPDATE users SET api_key')) {
              const u = data.users.find(x => x.id === params[1]);
              if (u) { u.api_key = params[0]; u.updated_at = new Date().toISOString(); save(); return { changes: 1 }; }
              return { changes: 0 };
            }
            if (sql.startsWith('UPDATE users SET nickname')) {
              const u = data.users.find(x => x.id === params[1]);
              if (u) { u.nickname = params[0]; u.updated_at = new Date().toISOString(); save(); return { changes: 1 }; }
              return { changes: 0 };
            }
            return { changes: 0 };
          }
        };
      }
    };
  },
  close() { save(); }
};

// 定期保存
setInterval(save, 60000);

module.exports = { getDb: () => DB.getDb() };
