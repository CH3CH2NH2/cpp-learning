/**
 * C++ 学习网站 - 主应用入口
 */

const AppState = {
  knowledge: null,
  currentSection: null,
  currentSubsection: null,
  currentView: 'knowledge',
  user: null,
  token: null,
};

// ============ 认证工具 ============
const Auth = {
  TOKEN_KEY: 'cpp_learning_token',
  init() { this.token = localStorage.getItem(this.TOKEN_KEY); },
  saveToken(token) { this.token = token; localStorage.setItem(this.TOKEN_KEY, token); },
  clear() { this.token = null; AppState.user = null; localStorage.removeItem(this.TOKEN_KEY); },
  authHeaders(extra = {}) {
    const h = { ...extra };
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  },
  async login(email, password) {
    const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || '登录失败');
    this.saveToken(d.token); AppState.user = d.user; return d;
  },
  async register(email, password, nickname) {
    const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, nickname }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || '注册失败');
    this.saveToken(d.token); AppState.user = d.user; return d;
  },
  async fetchProfile() {
    const r = await fetch('/api/auth/me', { headers: this.authHeaders() });
    if (!r.ok) { this.clear(); return null; }
    return r.json();
  },
  async saveApiKey(apiKey) {
    const r = await fetch('/api/auth/api-key', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...this.authHeaders() }, body: JSON.stringify({ apiKey }) });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || '保存失败');
    return d;
  },
};

// ============ API 调用 ============
const API = {
  async fetchKnowledge() { const r = await fetch('/api/knowledge'); if (!r.ok) throw Error('加载知识点失败'); return r.json(); },
  async checkStatus() { const r = await fetch('/api/status'); return r.json(); },
  async analyzeCode(code) {
    const r = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json', ...Auth.authHeaders() }, body: JSON.stringify({ code }) });
    return r.json();
  },
  async generateQuiz(section, difficulty = 'basic', excludeTopics = []) {
    const r = await fetch('/api/quiz', { method: 'POST', headers: { 'Content-Type': 'application/json', ...Auth.authHeaders() }, body: JSON.stringify({ section, difficulty, excludeTopics }) });
    return r.json();
  },
  async gradeQuiz(questions, answers) {
    const r = await fetch('/api/quiz/grade', { method: 'POST', headers: { 'Content-Type': 'application/json', ...Auth.authHeaders() }, body: JSON.stringify({ questions, answers }) });
    return r.json();
  },
};

// ============ 视图切换 ============
function switchView(viewName) {
  AppState.currentView = viewName;
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.view-panel').forEach(el => el.classList.add('hidden'));
  document.getElementById('welcomeView')?.classList.add('hidden');

  if (viewName === 'profile') {
    document.getElementById('profileView').classList.remove('hidden');
    loadProfileView();
    return;
  }
  const tab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
  if (tab) tab.classList.add('active');
  const m = { knowledge: 'knowledgeView', analyzer: 'analyzerView', quiz: 'quizView' };
  const id = m[viewName];
  if (id) document.getElementById(id).classList.remove('hidden');
  else document.getElementById('welcomeView').classList.remove('hidden');
}

// ============ 认证 UI ============
function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const userMenu = document.getElementById('userMenu');
  if (Auth.token && AppState.user) {
    loginBtn.classList.add('hidden');
    userMenu.classList.remove('hidden');
    document.getElementById('userNickname').textContent = AppState.user.nickname || AppState.user.email;
  } else {
    loginBtn.classList.remove('hidden');
    userMenu.classList.add('hidden');
  }
}

function showAuthModal(t) {
  document.getElementById('authModal').classList.remove('hidden');
  document.getElementById('loginForm').classList.toggle('hidden', t !== 'login');
  document.getElementById('registerForm').classList.toggle('hidden', t !== 'register');
  document.getElementById('authModalTitle').textContent = t === 'login' ? '登录' : '注册';
  document.getElementById('authError').classList.add('hidden');
}
function hideAuthModal() { document.getElementById('authModal').classList.add('hidden'); }

async function loadProfileView() {
  try {
    const p = await Auth.fetchProfile();
    if (p) {
      document.getElementById('profileEmail').textContent = p.email;
      document.getElementById('profileNickname').textContent = p.nickname || '(未设置)';
      const ks = document.getElementById('profileKeyStatus');
      if (p.apiKeyConfigured) { ks.textContent = '✅ 已配置'; ks.className = 'profile-key-status configured'; }
      else { ks.textContent = '⚪ 未配置'; ks.className = 'profile-key-status not-configured'; }
    }
  } catch (e) { console.error('loadProfile fail'); }
}

// ============ 初始化 ============
async function init() {
  Auth.init();
  // 导航
  document.querySelectorAll('.nav-tab').forEach(el => el.addEventListener('click', () => switchView(el.dataset.view)));
  // 登录按钮
  document.getElementById('loginBtn').addEventListener('click', () => showAuthModal('login'));
  document.getElementById('authModalClose').addEventListener('click', hideAuthModal);
  document.getElementById('switchToRegister').addEventListener('click', e => { e.preventDefault(); showAuthModal('register'); });
  document.getElementById('switchToLogin').addEventListener('click', e => { e.preventDefault(); showAuthModal('login'); });

  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const err = document.getElementById('authError'); err.classList.add('hidden');
    try { await Auth.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value); hideAuthModal(); updateAuthUI(); }
    catch (e) { err.textContent = e.message; err.classList.remove('hidden'); }
  });
  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const err = document.getElementById('authError'); err.classList.add('hidden');
    try { await Auth.register(document.getElementById('registerEmail').value, document.getElementById('registerPassword').value, document.getElementById('registerNickname').value); hideAuthModal(); updateAuthUI(); }
    catch (e) { err.textContent = e.message; err.classList.remove('hidden'); }
  });

  // 用户菜单
  const uMenu = document.getElementById('userMenu');
  const uDrop = document.getElementById('userDropdown');
  uMenu.addEventListener('click', e => { e.stopPropagation(); uDrop.classList.toggle('hidden'); });
  document.addEventListener('click', () => uDrop.classList.add('hidden'));
  document.getElementById('profileBtn').addEventListener('click', () => { uDrop.classList.add('hidden'); switchView('profile'); });
  document.getElementById('logoutBtn').addEventListener('click', () => { Auth.clear(); updateAuthUI(); uDrop.classList.add('hidden'); switchView('knowledge'); });
  document.getElementById('saveApiKeyBtn').addEventListener('click', async () => {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) return alert('请输入 API Key');
    try { await Auth.saveApiKey(key); alert('✅ API Key 已保存！'); loadProfileView(); }
    catch (e) { alert('保存失败: ' + e.message); }
  });

  // 服务器状态
  try {
    const s = await API.checkStatus();
    const el = document.getElementById('apiStatus');
    if (s.apiKeyConfigured) { el.textContent = '✅ 全局 API 就绪'; el.className = 'api-status ok'; }
    else { el.textContent = '⚠️ 需要绑定 API Key'; el.className = 'api-status error'; }
  } catch (e) { document.getElementById('apiStatus').textContent = '❌ 连接失败'; }

  // 恢复登录
  if (Auth.token) {
    try {
      const p = await Auth.fetchProfile();
      if (p) AppState.user = { id: p.id, email: p.email, nickname: p.nickname };
    } catch (e) { Auth.clear(); }
  }
  updateAuthUI();

  // 知识数据
  try {
    AppState.knowledge = await API.fetchKnowledge();
    renderKnowledgeTree(AppState.knowledge);
  } catch (e) {
    document.getElementById('treeContainer').innerHTML = `<div class="loading" style="color:#f87171;">加载失败: ${e.message}<br><span style="font-size:12px;">请确认已运行: node scripts/parse-markdown.js</span></div>`;
  }

  initChatView();
  initAnalyzerView();
  initQuizView();
}

document.addEventListener('DOMContentLoaded', init);
