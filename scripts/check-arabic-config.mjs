/**
 * Check Arabic Configuration in i18n.ts
 */

import fs from 'fs';

const i18nPath = 'E:/template1/multilingual-ecommerce-template/frontend/src/config/i18n.ts';
const content = fs.readFileSync(i18nPath, 'utf8');

console.log('\n' + '='.repeat(60));
console.log('   ARABIC CONFIGURATION CHECK');
console.log('='.repeat(60));

// Check 1: Import statement
const importPatterns = [
  /import\s+.*ar.*from.*['"].*ar\.json['"]/,
  /import\s+arTranslations/,
  /import\s+{.*ar.*}.*from/
];

let hasImport = false;
for (const pattern of importPatterns) {
  if (pattern.test(content)) {
    hasImport = true;
    break;
  }
}

console.log(`\n1. Arabic import statement: ${hasImport ? '✅ FOUND' : '❌ MISSING'}`);

// Check 2: Resources object
const resourcesMatch = content.match(/resources\s*[=:]\s*\{[\s\S]*?\}/m);
if (resourcesMatch) {
  const hasArInResources = /ar\s*:\s*\{/.test(resourcesMatch[0]);
  console.log(`2. Arabic in resources: ${hasArInResources ? '✅ FOUND' : '❌ MISSING'}`);
  
  if (!hasArInResources) {
    console.log('\n   📋 Current resources section:');
    console.log('   ' + resourcesMatch[0].slice(0, 300) + '...');
  }
} else {
  console.log('2. Resources object: ❌ NOT FOUND');
}

// Check 3: Supported languages
const supportedMatch = content.match(/supportedLngs\s*[=:]\s*\[[^\]]+\]/);
if (supportedMatch) {
  const hasArSupported = supportedMatch[0].includes("'ar'") || supportedMatch[0].includes('"ar"');
  console.log(`3. Arabic in supportedLngs: ${hasArSupported ? '✅ FOUND' : '❌ MISSING'}`);
  console.log(`   ${supportedMatch[0]}`);
}

// Show relevant parts of file
console.log('\n' + '='.repeat(60));
console.log('   RELEVANT CODE SECTIONS');
console.log('='.repeat(60));

// Find import section
const lines = content.split('\n');
const importLines = lines.filter(l => l.includes('import') && (l.includes('json') || l.includes('Translation')));
console.log('\n📦 Import statements:');
importLines.forEach(l => console.log('   ' + l.trim()));

console.log('\n' + '='.repeat(60));