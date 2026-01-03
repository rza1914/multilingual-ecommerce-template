import fs from 'fs';
import path from 'path';

function searchForPattern(dir, pattern, results = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', 'dist', 'data'].includes(item)) {
        searchForPattern(fullPath, pattern, results);
      }
    } else if (/\.(tsx?|jsx?)$/.test(item)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(pattern)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(pattern)) {
            results.push({
              file: path.relative('E:/template1/multilingual-ecommerce-template/frontend/src', fullPath),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      }
    }
  }
  
  return results;
}

const results = searchForPattern('E:/template1/multilingual-ecommerce-template/frontend/src', 'common:buttons');
console.log('Files containing "common:buttons":');
results.forEach(result => {
  console.log(`${result.file}:${result.line} - ${result.content}`);
});

if (results.length === 0) {
  console.log('No files found containing "common:buttons"');
}