import fs from 'fs';
const content = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/config/i18n.ts', 'utf8');

// Find the resources section
const resourcesMatch = content.match(/resources\s*[=:]\s*\{([\s\S]*?)\}/m);
if (resourcesMatch) {
  console.log('Resources section found:');
  console.log(resourcesMatch[0]);
  
  // Check specifically for Arabic
  const hasAr = resourcesMatch[0].includes('ar:');
  console.log('\nArabic (ar:) found in resources:', hasAr);
  
  // Show all language entries
  const langEntries = resourcesMatch[0].match(/[a-z]{2}\s*:/g);
  console.log('All language entries found:', langEntries);
}