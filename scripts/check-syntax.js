const fs = require('fs');
const content = fs.readFileSync('d:/cpp-learning/scripts/generate-full-knowledge.js', 'utf-8');

// Count backticks
let backtickCount = 0;
let i = 0;
while (i < content.length) {
  if (content[i] === '`') {
    // Check if escaped
    if (i > 0 && content[i-1] === '\\') {
      i++;
      continue;
    }
    backtickCount++;
  }
  i++;
}

console.log('Total backticks:', backtickCount);
console.log('Even?', backtickCount % 2 === 0);

// Count template literal starts (content: backtick patterns)
// A heuristic: count lines that have "content:" followed by a backtick
// and lines that end with ` or `,
const lines = content.split('\n');
let contentStarts = 0;
let contentEnds = 0;
for (const line of lines) {
  const trimmed = line.trim();
  if (/^content:\s*`/.test(trimmed)) contentStarts++;
  if (/`,\s*$/.test(trimmed) || /`\s*$/.test(trimmed)) contentEnds++;
}

console.log('"content: `" lines:', contentStarts);
console.log('Lines ending with ` or `,:', contentEnds);
