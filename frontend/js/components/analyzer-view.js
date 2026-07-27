/**
 * AI 代码分析器
 */

function initAnalyzerView() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const clearBtn = document.getElementById('clearCodeBtn');

  analyzeBtn.addEventListener('click', analyzeCode);
  clearBtn.addEventListener('click', () => {
    document.getElementById('codeEditor').value = '';
    document.getElementById('analyzerResults').classList.add('hidden');
    document.getElementById('analyzerStatus').classList.add('hidden');
  });
}

async function analyzeCode() {
  const code = document.getElementById('codeEditor').value.trim();
  if (!code) {
    alert('请先粘贴 C++ 代码');
    return;
  }

  const statusEl = document.getElementById('analyzerStatus');
  const resultsEl = document.getElementById('analyzerResults');

  statusEl.classList.remove('hidden');
  statusEl.textContent = '🔍 AI 分析中...';
  resultsEl.classList.add('hidden');

  try {
    const result = await API.analyzeCode(code);

    statusEl.classList.add('hidden');
    resultsEl.classList.remove('hidden');

    // 渲染各个部分
    renderAnalysisList('bugsList', result.bugs || [], (item) => {
      const sev = item.severity || 'low';
      const sevClass = `severity-${sev}`;
      return `<span class="severity-tag ${sevClass}">${sev}</span> ${escapeHtml(item.description)}`;
    });

    renderAnalysisList('styleList', result.style || [], (item) => {
      return escapeHtml(item.description);
    });

    renderAnalysisList('improvementsList', result.improvements || [], (item) => {
      let text = escapeHtml(item.description);
      if (item.suggestion) {
        text += `<br><span style="font-size:12px;color:var(--text-secondary);">建议: ${escapeHtml(item.suggestion)}</span>`;
      }
      return text;
    });

    const complexity = result.complexity || {};
    document.getElementById('complexityDetail').innerHTML = `
      <p><strong>时间复杂度：</strong> ${complexity.timeComplexity || '未分析'}</p>
      <p><strong>空间复杂度：</strong> ${complexity.spaceComplexity || '未分析'}</p>
      ${complexity.notes ? `<p><strong>备注：</strong> ${escapeHtml(complexity.notes)}</p>` : ''}
    `;

  } catch (err) {
    statusEl.textContent = `❌ 分析失败: ${err.message}`;
  }
}

function renderAnalysisList(elementId, items, renderFunc) {
  const container = document.getElementById(elementId);
  if (!items || items.length === 0) {
    container.innerHTML = '<div class="result-item" style="color:var(--text-secondary);">暂无发现问题 ✅</div>';
    return;
  }
  container.innerHTML = items.map((item, i) => `
    <div class="result-item">${renderFunc(item)}</div>
  `).join('');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
