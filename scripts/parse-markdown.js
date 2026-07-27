/**
 * 将 C++基础入门.md 解析为结构化 knowledge.json
 *
 * 用法: node scripts/parse-markdown.js <input-path> <output-path>
 * 默认: node scripts/parse-markdown.js
 *   - 输入: d:\下载\文件\C++基础入门.md
 *   - 输出: backend/data/knowledge.json
 */

const fs = require('fs');
const path = require('path');

// 默认路径
const DEFAULT_INPUT = 'd:\\下载\\文件\\C++基础入门.md';
const DEFAULT_OUTPUT = path.join(__dirname, '..', 'backend', 'data', 'knowledge.json');

function parseMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const sections = [];
  let currentSection = null;
  let currentSubsection = null;
  let currentContent = [];
  let inCodeBlock = false;

  function flushContent() {
    const text = currentContent.join('\n').trim();
    if (!text) return null;
    // Extract code examples
    const codeExamples = [];
    const cleanLines = [];
    let inLocalCode = false;
    let codeBuffer = [];
    for (const line of currentContent) {
      if (line.startsWith('```')) {
        if (inLocalCode) {
          codeExamples.push(codeBuffer.join('\n'));
          codeBuffer = [];
          inLocalCode = false;
        } else {
          inLocalCode = true;
          codeBuffer = [];
        }
      } else if (inLocalCode) {
        codeBuffer.push(line);
      } else {
        cleanLines.push(line);
      }
    }
    return {
      content: text,
      codeExamples: codeExamples
    };
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track code blocks to ignore markdown inside them
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      currentContent.push(line);
      continue;
    }

    // H2 heading = section (## 标题)
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      // Flush previous subsection
      if (currentSubsection && currentContent.length > 0) {
        const parsed = flushContent();
        if (parsed) {
          currentSubsection.content = parsed.content;
          currentSubsection.codeExamples = parsed.codeExamples;
        }
        currentContent = [];
      }
      // Flush previous section's last subsection
      if (currentSection && currentSubsection) {
        currentSection.subsections.push(currentSubsection);
        currentSubsection = null;
      }

      const title = trimmed.replace(/^##\s+/, '');
      const id = title.toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/(^-|-$)/g, '');

      currentSection = {
        id,
        title,
        subsections: []
      };
      sections.push(currentSection);
      currentSubsection = null;
      currentContent = [];
      continue;
    }

    // H3 heading = subsection (### 标题)
    if (line.startsWith('### ')) {
      // Flush previous subsection content
      if (currentSubsection && currentContent.length > 0) {
        const parsed = flushContent();
        if (parsed) {
          currentSubsection.content = parsed.content;
          currentSubsection.codeExamples = parsed.codeExamples;
        }
        currentContent = [];
      }
      // Push previous subsection to section
      if (currentSection && currentSubsection) {
        currentSection.subsections.push(currentSubsection);
      }

      const title = trimmed.replace(/^###\s+/, '');
      const id = title.toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/(^-|-$)/g, '');

      currentSubsection = {
        id,
        title,
        content: '',
        codeExamples: []
      };
      currentContent = [];
      continue;
    }

    // Skip images and empty lines at start of content blocks
    if (trimmed.startsWith('![')) {
      // Keep image references but wrap them in a div for styling
      currentContent.push(line);
      continue;
    }

    currentContent.push(line);
  }

  // Flush last subsection
  if (currentSubsection && currentContent.length > 0) {
    const parsed = flushContent();
    if (parsed) {
      currentSubsection.content = parsed.content;
      currentSubsection.codeExamples = parsed.codeExamples;
    }
  }
  if (currentSection && currentSubsection) {
    currentSection.subsections.push(currentSubsection);
  }

  return { sections };
}

// CLI
const inputPath = process.argv[2] || DEFAULT_INPUT;
const outputPath = process.argv[3] || DEFAULT_OUTPUT;

console.log(`📖 解析 Markdown: ${inputPath}`);
const knowledge = parseMarkdown(inputPath);

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(knowledge, null, 2), 'utf-8');

// Stats
const totalSubsections = knowledge.sections.reduce((sum, s) => sum + s.subsections.length, 0);
console.log(`✅ 解析完成:
  章节数: ${knowledge.sections.length}
  小节数: ${totalSubsections}
  输出: ${outputPath}`);
