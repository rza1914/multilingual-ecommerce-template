/**
 * Diagnose Arabic Translation Issues
 * 
 * Run: node scripts/diagnose-arabic.mjs
 */

import fs from 'fs';

const CONFIG = {
  files: {
    fa: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json',
    en: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json',
    ar: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json'
  },
  i18nConfig: 'E:/template1/multilingual-ecommerce-template/frontend/src/config/i18n.ts'
};

// Get all keys from nested object
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔍 DIAGNOSING ARABIC TRANSLATION ISSUES');
  console.log('='.repeat(70));
  
  // 1. Check if ar.json exists and is valid
  console.log('\n📂 Checking ar.json file...');
  let arTranslations;
  try {
    let rawContent = fs.readFileSync(CONFIG.files.ar, 'utf8');
    // Remove BOM if present
    if (rawContent.charCodeAt(0) === 0xFEFF) {
      rawContent = rawContent.slice(1);
    }
    arTranslations = JSON.parse(rawContent);
    console.log('   ✅ ar.json exists and is valid JSON');
    console.log(`   📊 File size: ${fs.statSync(CONFIG.files.ar).size} bytes`);
  } catch (e) {
    console.log('   ❌ Error reading ar.json:', e.message);
    return;
  }
  
  // 2. Check i18n.ts configuration
  console.log('\n📂 Checking i18n.ts configuration...');
  let i18nContent = fs.readFileSync(CONFIG.i18nConfig, 'utf8');
  
  const hasArImport = i18nContent.includes("import") && (i18nContent.includes("ar.json") || i18nContent.includes("arTranslations"));
  const hasArInResources = i18nContent.includes("ar:") && i18nContent.includes("resources");
  const hasArInSupported = i18nContent.includes("'ar'") || i18nContent.includes('"ar"');
  
  console.log(`   ${hasArImport ? '✅' : '❌'} Arabic import statement`);
  console.log(`   ${hasArInResources ? '✅' : '❌'} Arabic in resources object`);
  console.log(`   ${hasArInSupported ? '✅' : '❌'} Arabic in supported languages`);
  
  // 3. Check the structure of ar.json - it might be nested under "translation"
  let actualArTranslations = arTranslations;
  if (arTranslations.translation) {
    actualArTranslations = arTranslations.translation;
    console.log('   ℹ️  ar.json has nested "translation" object structure');
  }
  
  // Compare key counts
  console.log('\n📊 Comparing translation key counts...');
  let faRawContent = fs.readFileSync(CONFIG.files.fa, 'utf8');
  let enRawContent = fs.readFileSync(CONFIG.files.en, 'utf8');
  if (faRawContent.charCodeAt(0) === 0xFEFF) faRawContent = faRawContent.slice(1);
  if (enRawContent.charCodeAt(0) === 0xFEFF) enRawContent = enRawContent.slice(1);
  
  const faTranslations = JSON.parse(faRawContent);
  const enTranslations = JSON.parse(enRawContent);
  
  const faKeys = getAllKeys(faTranslations);
  const enKeys = getAllKeys(enTranslations);
  const arKeys = getAllKeys(actualArTranslations);
  
  console.log(`   fa.json: ${faKeys.length} keys`);
  console.log(`   en.json: ${enKeys.length} keys`);
  console.log(`   ar.json: ${arKeys.length} keys`);
  
  // 4. Find keys missing in Arabic
  const allKeys = [...new Set([...faKeys, ...enKeys])];
  const missingInAr = allKeys.filter(k => !arKeys.includes(k));
  
  if (missingInAr.length > 0) {
    console.log(`\n❌ Keys missing in ar.json (${missingInAr.length}):`);
    missingInAr.slice(0, 20).forEach(k => console.log(`   - ${k}`));
    if (missingInAr.length > 20) {
      console.log(`   ... and ${missingInAr.length - 20} more`);
    }
  } else {
    console.log('\n✅ ar.json has all keys from fa.json and en.json');
  }
  
  // 5. Check for potential issues in i18n.ts
  console.log('\n📋 i18n.ts Analysis:');
  
  // Extract resources section
  const resourcesMatch = i18nContent.match(/resources\s*[=:]\s*\{([\s\S]*?)\}/m);
  if (resourcesMatch) {
    const resourcesSection = resourcesMatch[0];
    console.log('\n   Resources section found:');
    
    if (!resourcesSection.includes('ar')) {
      console.log('   ❌ PROBLEM: Arabic (ar) is NOT in resources!');
      console.log('   💡 FIX: Add ar to resources object in i18n.ts');
    } else {
      console.log('   ✅ Arabic (ar) is in resources object');
    }
  }
  
  // Check if Arabic is in supportedLngs
  const supportedLngsMatch = i18nContent.match(/supportedLngs.*?(\[.*?\])/s);
  if (supportedLngsMatch) {
    const supportedLngsSection = supportedLngsMatch[1];
    if (!supportedLngsSection.includes("'ar'") && !supportedLngsSection.includes('"ar"')) {
      console.log('   ❌ PROBLEM: Arabic (ar) is NOT in supportedLngs!');
      console.log('   💡 FIX: Add "ar" to supportedLngs array in i18n.ts');
    } else {
      console.log('   ✅ Arabic (ar) is in supportedLngs array');
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('        📋 DIAGNOSIS COMPLETE');
  console.log('='.repeat(70) + '\n');
}

main();