const fs = require('fs');
const path = 'd:/cpp-learning/scripts/generate-full-knowledge.js';
let content = fs.readFileSync(path, 'utf-8');

// Fix template literal interpolations that were double-escaped
// 1. Fix console.log template literal (line ~3588)
content = content.replace(
  '\\n  阶段数: \\${FULL_KNOWLEDGE.meta.totalStages}',
  '\\n  阶段数: ${FULL_KNOWLEDGE.meta.totalStages}'
);
content = content.replace(
  '\\n  小节数: \\${FULL_KNOWLEDGE.meta.totalSubsections}',
  '\\n  小节数: ${FULL_KNOWLEDGE.meta.totalSubsections}'
);

// 2. Fix forEach template literal (line ~3594)
content = content.replace(
  '\\${String(i + 1).padStart(2)}. \\${s.title} —— \\${s.subsections.length} 小节',
  '${String(i + 1).padStart(2)}. ${s.title} —— ${s.subsections.length} 小节'
);

// 3. Fix final console.log (line ~3600) - both its backtick and interpolation
content = content.replace(
  "console.log(\\`\\\\n✅ 输出: \\\\${outputPath}\\`);",
  'console.log(`\\n✅ 输出: ${outputPath}`);'
);

fs.writeFileSync(path, content, 'utf-8');
console.log('Fixed all template literal interpolations');
