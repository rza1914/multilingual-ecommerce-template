import fs from 'fs';
const content = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/config/i18n.ts', 'utf8');

// Find the resources section properly by finding the opening and counting braces
const resourcesStart = content.indexOf('resources');
if (resourcesStart !== -1) {
  const startBrace = content.indexOf('{', content.indexOf(':', resourcesStart));
  let braceCount = 0;
  let pos = startBrace;
  
  // Count braces to find the matching closing brace
  while (pos < content.length) {
    if (content[pos] === '{') {
      braceCount++;
    } else if (content[pos] === '}') {
      braceCount--;
      if (braceCount === 0) {
        break;
      }
    }
    pos++;
  }
  
  if (braceCount === 0) {
    const resourcesSection = content.substring(startBrace, pos + 1);
    console.log('Full resources section:');
    console.log(resourcesSection);
    
    // Check specifically for Arabic
    const hasAr = resourcesSection.includes('ar:');
    console.log('\nArabic (ar:) found in resources:', hasAr);
    
    // Show all language entries
    const langEntries = resourcesSection.match(/[a-z]{2}\s*:/g);
    console.log('All language entries found:', langEntries);
  } else {
    console.log('Could not find complete resources section');
  }
} else {
  console.log('Resources section not found');
}