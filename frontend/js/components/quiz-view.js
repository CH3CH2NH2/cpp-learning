/**
 * AI 智能测验
 */

let quizQuestions = [];
let quizAnswers = {};
let quizExcludeTopics = [];

function initQuizView() {
  // 填充章节下拉
  const select = document.getElementById('quizSectionSelect');

  // 当知识点数据加载完成后填充
  const checkData = setInterval(() => {
    if (AppState.knowledge && AppState.knowledge.sections) {
      clearInterval(checkData);
      AppState.knowledge.sections.forEach(section => {
        const option = document.createElement('option');
        option.value = section.title;
        option.textContent = section.title;
        select.appendChild(option);
      });
    }
  }, 200);

  document.getElementById('generateQuizBtn').addEventListener('click', generateQuiz);
  document.getElementById('submitQuizBtn').addEventListener('click', submitQuiz);
}

async function generateQuiz() {
  const section = document.getElementById('quizSectionSelect').value;
  if (!section) {
    alert('请先选择章节');
    return;
  }

  const statusEl = document.getElementById('quizStatus');
  const contentEl = document.getElementById('quizContent');
  const submitBtn = document.getElementById('submitQuizBtn');
  const resultEl = document.getElementById('quizResult');

  statusEl.classList.remove('hidden');
  statusEl.textContent = '📝 AI 生成题目中...';
  contentEl.classList.add('hidden');
  resultEl.classList.add('hidden');
  submitBtn.classList.add('hidden');

  quizQuestions = [];
  quizAnswers = {};

  try {
    const result = await API.generateQuiz(section, 'basic', quizExcludeTopics);

    statusEl.classList.add('hidden');

    if (!result.questions || result.questions.length === 0) {
      statusEl.textContent = '❌ 生成题目失败，请重试';
      statusEl.classList.remove('hidden');
      return;
    }

    quizQuestions = result.questions;

    // 记录已出题目的主题，避免重复
    result.questions.forEach(q => {
      const topic = q.question.slice(0, 20);
      if (!quizExcludeTopics.includes(topic)) {
        quizExcludeTopics.push(topic);
      }
    });

    renderQuestions(result.questions);
    contentEl.classList.remove('hidden');
    submitBtn.classList.remove('hidden');

  } catch (err) {
    statusEl.textContent = `❌ 生成失败: ${err.message}`;
  }
}

function renderQuestions(questions) {
  const container = document.getElementById('questionsContainer');
  container.innerHTML = questions.map(q => `
    <div class="question-card" data-qid="${q.id}">
      <div class="question-number">第 ${q.id} 题</div>
      <div class="question-text">${escapeHtml(q.question)}</div>
      <div class="options-list">
        ${q.options.map((opt, i) => {
          const optKey = String.fromCharCode(65 + i); // A, B, C, D
          return `
            <label class="option-item" data-value="${optKey}">
              <input type="radio" name="q_${q.id}" value="${optKey}">
              <span>${escapeHtml(opt)}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  // 选项点击
  container.querySelectorAll('.option-item').forEach(el => {
    el.addEventListener('click', () => {
      const card = el.closest('.question-card');
      const qid = parseInt(card.dataset.qid);
      const value = el.dataset.value;

      // 清除同组其他选中
      card.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');

      // 选中 radio
      const radio = el.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      quizAnswers[qid] = value;
    });
  });
}

async function submitQuiz() {
  // 检查所有题目是否都作答了
  const unanswered = quizQuestions.filter(q => !quizAnswers[q.id]);
  if (unanswered.length > 0) {
    alert(`还有 ${unanswered.length} 道题未作答`);
    return;
  }

  const submitBtn = document.getElementById('submitQuizBtn');
  const resultEl = document.getElementById('quizResult');

  submitBtn.disabled = true;
  submitBtn.textContent = '批改中...';

  try {
    const result = await API.gradeQuiz(quizQuestions, quizAnswers);

    const scoreClass = result.passed ? 'passed' : 'failed';
    const emoji = result.passed ? '🎉' : '💪';

    resultEl.innerHTML = `
      <div class="score ${scoreClass}">${result.score} / ${result.total}</div>
      <div class="message">${emoji} ${result.message}</div>
      <div class="result-detail">
        ${result.results.map(r => `
          <div class="result-detail-item ${r.correct ? 'correct' : 'wrong'}">
            <strong>${r.question}</strong><br>
            你的答案: ${r.userAnswer} | 正确答案: ${r.correctAnswer}
            ${r.correct ? ' ✅' : ' ❌'}
            <br><span style="font-size:13px;color:var(--text-secondary);">${escapeHtml(r.explanation)}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-primary" onclick="retryQuiz()" style="margin-top:16px;">
        ${result.passed ? '进阶挑战' : '重新练习'}
      </button>
    `;

    resultEl.classList.remove('hidden');
    document.getElementById('quizContent').classList.add('hidden');
    submitBtn.classList.add('hidden');

  } catch (err) {
    alert(`批改失败: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '提交答案';
  }
}

function retryQuiz() {
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizContent').classList.remove('hidden');
  document.getElementById('submitQuizBtn').classList.remove('hidden');
  document.getElementById('submitQuizBtn').disabled = false;
  document.getElementById('submitQuizBtn').textContent = '提交答案';
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
