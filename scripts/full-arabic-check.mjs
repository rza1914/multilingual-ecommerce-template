/**
 * Complete Arabic Language Diagnosis
 */

import fs from 'fs';

console.log('\n' + '='.repeat(70));
console.log('        🔍 COMPLETE ARABIC LANGUAGE DIAGNOSIS');
console.log('='.repeat(70));

// 1. Check i18n.ts content
console.log('\n📂 1. ANALYZING i18n.ts...');
const i18nPath = 'E:/template1/multilingual-ecommerce-template/frontend/src/config/i18n.ts';
let i18nContent;
try {
  i18nContent = fs.readFileSync(i18nPath, 'utf8');
  console.log('   ✅ File found');
} catch(e) {
  console.log('   ❌ File not found at', i18nPath);
  process.exit(1);
}

// 2. Check imports
console.log('\n📦 2. CHECKING IMPORTS...');
const importLines = i18nContent.split('\n').filter(l => l.trim().startsWith('import'));
importLines.forEach(l => {
  if (l.includes('ar') || l.includes('Ar')) {
    console.log('   ✅ Arabic import:', l.trim());
  } else if (l.includes('fa') || l.includes('Fa') || l.includes('en') || l.includes('En')) {
    console.log('   📋 Other import:', l.trim());
  }
});

const hasArImport = importLines.some(l => l.includes('ar.json') || l.includes('arTranslations') || l.includes('arData'));
console.log(`\n   Arabic import exists: ${hasArImport ? '✅ YES' : '❌ NO'}`);

// 3. Check resources configuration
console.log('\n⚙️  3. CHECKING RESOURCES CONFIGURATION...');

// Look for resources object
const resourcesRegex = /resources\s*[=:]\s*\{([\s\S]*?)\n\s*\}/m;
const resourcesMatch = i18nContent.match(resourcesRegex);

if (resourcesMatch) {
  const resourcesBlock = resourcesMatch[0];
  console.log('   Resources block found:');
  console.log('   ' + '-'.repeat(50));
  console.log(resourcesBlock.split('\n').map(l => '   ' + l).join('\n'));
  console.log('   ' + '-'.repeat(50));
  
  const hasAr = resourcesBlock.includes('ar:') || resourcesBlock.includes('ar :');
  const hasFa = resourcesBlock.includes('fa:') || resourcesBlock.includes('fa :');
  const hasEn = resourcesBlock.includes('en:') || resourcesBlock.includes('en :');
  
  console.log(`\n   Languages in resources:`);
  console.log(`      fa: ${hasFa ? '✅' : '❌'}`);
  console.log(`      en: ${hasEn ? '✅' : '❌'}`);
  console.log(`      ar: ${hasAr ? '✅' : '❌'}`);
  
  if (!hasAr) {
    console.log('\n   🚨 PROBLEM FOUND: Arabic is NOT in resources!');
  }
} else {
  console.log('   ❌ Could not find resources configuration');
}

// 4. Check supportedLngs
console.log('\n🌐 4. CHECKING SUPPORTED LANGUAGES...');
const supportedMatch = i18nContent.match(/supportedLngs\s*[=:]\s*\[([^\]]+)\]/);
if (supportedMatch) {
  console.log('   supportedLngs:', supportedMatch[0]);
  const hasArSupported = supportedMatch[1].includes("'ar'") || supportedMatch[1].includes('"ar"');
  console.log(`   Arabic in supportedLngs: ${hasArSupported ? '✅ YES' : '❌ NO'}`);
} else {
  console.log('   ⚠️  supportedLngs not found (might use default)');
}

// 5. Check fallbackLng
console.log('\n🔄 5. CHECKING FALLBACK LANGUAGE...');
const fallbackMatch = i18nContent.match(/fallbackLng\s*[=:]\s*['"]([^'"]+)['"]/);
if (fallbackMatch) {
  console.log('   fallbackLng:', fallbackMatch[1]);
} else {
  console.log('   ⚠️  fallbackLng not explicitly set');
}

// 6. Check ar.json structure
console.log('\n📄 6. CHECKING ar.json STRUCTURE...');
try {
  const rawContent = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json', 'utf8');
  // Remove BOM if present
  const cleanContent = rawContent.charCodeAt(0) === 0xFEFF ? rawContent.slice(1) : rawContent;
  const arData = JSON.parse(cleanContent);
  const topKeys = Object.keys(arData);
  console.log('   Top-level keys:', topKeys.slice(0, 10).join(', '), topKeys.length > 10 ? '...' : '');
  console.log('   Total top-level keys:', topKeys.length);
  
  // Check if wrapped in 'translation'
  if (arData.translation) {
    console.log('   ⚠️  ar.json is WRAPPED in "translation" key');
  } else {
    console.log('   ✅ ar.json has direct keys (no wrapper)');
  }
  
  // Sample a value
  const sampleKey = topKeys[0];
  console.log(`   Sample (${sampleKey}):`, typeof arData[sampleKey] === 'object' ? 'nested object' : arData[sampleKey]);
  
} catch(e) {
  console.log('   ❌ Error reading ar.json:', e.message);
}

// 7. Summary and recommendations
console.log('\n' + '='.repeat(70));
console.log('        📋 DIAGNOSIS SUMMARY');
console.log('='.repeat(70));

if (!hasArImport) {
  console.log('\n❌ ISSUE 1: Arabic translation file is not imported');
  console.log('   FIX: Add import statement for ar.json');
}

if (resourcesMatch && !resourcesMatch[0].includes('ar:')) {
  console.log('\n❌ ISSUE 2: Arabic is not in resources object');
  console.log('   FIX: Add ar: { translation: arTranslations } to resources');
}

console.log('\n' + '='.repeat(70));