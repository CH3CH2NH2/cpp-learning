/**
 * 知识树视图 - 渲染左侧目录树和右侧内容
 */

// 搜索过滤
let searchTimer = null;
document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => filterTree(searchBox.value), 200);
    });
  }
});

function filterTree(keyword) {
  const items = document.querySelectorAll('.tree-item');
  const sections = document.querySelectorAll('.tree-section');

  if (!keyword.trim()) {
    items.forEach(el => el.style.display = '');
    sections.forEach(el => el.querySelector('.tree-subsections')?.classList.remove('collapsed'));
    return;
  }

  const kw = keyword.toLowerCase();
  sections.forEach(section => {
    let hasMatch = false;
    const subsectionEl = section.querySelector('.tree-subsections');
    const items = section.querySelectorAll('.tree-item');

    items.forEach(item => {
      const match = item.textContent.toLowerCase().includes(kw);
      item.style.display = match ? '' : 'none';
      if (match) hasMatch = true;
    });

    if (subsectionEl) {
      if (hasMatch) subsectionEl.classList.remove('collapsed');
      else subsectionEl.classList.add('collapsed');
    }
  });
}

/**
 * 渲染知识树
 */
function renderKnowledgeTree(data) {
  const container = document.getElementById('treeContainer');
  if (!data || !data.sections || data.sections.length === 0) {
    container.innerHTML = '<div class="loading">暂无知识点数据</div>';
    return;
  }

  let html = '';
  data.sections.forEach((section, si) => {
    html += `
      <div class="tree-section" data-section-id="${section.id}">
        <div class="tree-section-header" data-index="${si}">
          <span class="arrow">▼</span>
          <span>${section.title}</span>
          <span class="section-count">${section.subsections.length}</span>
        </div>
        <div class="tree-subsections">
          ${section.subsections.map((sub, ii) => `
            <div class="tree-item" data-section="${section.id}" data-subsection="${sub.id}" data-si="${si}" data-ii="${ii}">
              ${sub.title}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // 折叠/展开
  container.querySelectorAll('.tree-section-header').forEach(header => {
    header.addEventListener('click', () => {
      const subs = header.nextElementSibling;
      const arrow = header.querySelector('.arrow');
      if (subs) {
        subs.classList.toggle('collapsed');
        if (arrow) arrow.classList.toggle('collapsed');
      }
    });
  });

  // 点击知识点
  container.querySelectorAll('.tree-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.tree-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      const sectionId = item.dataset.section;
      const subsectionId = item.dataset.subsection;
      const si = parseInt(item.dataset.si);
      const ii = parseInt(item.dataset.ii);
      showKnowledgeContent(si, ii, sectionId, subsectionId);
    });
  });
}

/**
 * 显示选中知识点的内容
 */
function showKnowledgeContent(sectionIndex, subsectionIndex, sectionId, subsectionId) {
  const data = AppState.knowledge;
  if (!data || !data.sections[sectionIndex]) return;

  const section = data.sections[sectionIndex];
  const subsection = section.subsections[subsectionIndex];
  if (!subsection) return;

  AppState.currentSection = section.title;
  AppState.currentSubsection = subsection.title;

  const container = document.getElementById('knowledgeContent');
  const content = subsection.content || '暂无内容';

  // 使用 marked 渲染 Markdown
  const renderedContent = marked.parse(content, { breaks: true });

  container.innerHTML = `
    <div class="knowledge-section">
      <h2>${section.title}</h2>
      <div class="knowledge-subsection">
        <h3>${subsection.title}</h3>
        <div class="markdown-body">${renderedContent}</div>
        <button class="quiz-inline-btn" onclick="startQuizFromKnowledge('${section.title}', '${subsection.title}')">
          📝 AI 测验 — ${subsection.title}
        </button>
      </div>
    </div>
  `;

  // 高亮代码块
  container.querySelectorAll('pre code').forEach(block => {
    hljs.highlightElement(block);
  });

  // 确保切换到知识视图
  switchView('knowledge');
}

/**
 * 从知识点页面启动测验
 */
function startQuizFromKnowledge(section, subsection) {
  switchView('quiz');
  // 延迟等视图切换完成
  setTimeout(() => {
    const select = document.getElementById('quizSectionSelect');
    // 找到匹配的章节选项
    for (const opt of select.options) {
      if (opt.text.includes(section)) {
        select.value = opt.value;
        break;
      }
    }
    document.getElementById('generateQuizBtn').click();
  }, 100);
}

// Make function globally accessible for inline onclick
window.startQuizFromKnowledge = startQuizFromKnowledge;
