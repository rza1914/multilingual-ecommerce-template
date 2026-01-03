/**
 * Compare extracted keys with translation files
 * 
 * This script:
 * 1. Loads the extracted keys from step 1
 * 2. Loads all translation files (fa, en, ar)
 * 3. Finds missing keys in each language
 * 4. Generates a comprehensive report
 * 
 * Run: node scripts/compare-keys.mjs
 */

import fs from 'fs';
import path from 'path';

const CONFIG = {
  extractedKeysFile: 'scripts/extracted-keys-report.json',
  translationFiles: {
    fa: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json',
    en: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json',
    ar: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json'
  },
  outputFile: 'scripts/missing-keys-report.json'
};

// Get nested value from object using dot notation
function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj);
}

// Get all keys from nested object
function getAllKeysFromObject(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getAllKeysFromObject(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔍 COMPARING KEYS WITH TRANSLATION FILES');
  console.log('='.repeat(70));
  
  // Load extracted keys
  console.log('\n📂 Loading extracted keys...');
  let extractedData;
  try {
    extractedData = JSON.parse(fs.readFileSync(CONFIG.extractedKeysFile, 'utf8'));
    console.log(`   Loaded ${extractedData.allUniqueKeys.length} unique keys from code`);
  } catch (error) {
    console.error('❌ Error: Run extract-all-keys.mjs first!');
    process.exit(1);
  }
  
  // Load translation files
  console.log('\n📂 Loading translation files...');
  const translations = {};
  const translationKeys = {};
  
  for (const [lang, filePath] of Object.entries(CONFIG.translationFiles)) {
    try {
      let rawContent = fs.readFileSync(filePath, 'utf8');
      // Remove BOM if present
      if (rawContent.charCodeAt(0) === 0xFEFF) {
        rawContent = rawContent.slice(1);
      }
      translations[lang] = JSON.parse(rawContent);
      
      // Handle Arabic file structure (nested under "translation" key)
      if (lang === 'ar') {
        translations[lang] = translations[lang].translation;
      }
      
      translationKeys[lang] = getAllKeysFromObject(translations[lang]);
      console.log(`   ${lang}.json: ${translationKeys[lang].length} keys`);
    } catch (error) {
      console.error(`   ❌ Error loading ${filePath}:`, error.message);
    }
  }
  
  // Compare and find missing
  console.log('\n🔍 Finding missing keys...');
  
  const report = {
    summary: {
      keysInCode: extractedData.allUniqueKeys.length,
      keysInFa: translationKeys.fa?.length || 0,
      keysInEn: translationKeys.en?.length || 0,
      keysInAr: translationKeys.ar?.length || 0
    },
    missingKeys: {
      fa: [],
      en: [],
      ar: []
    },
    missingBySection: {
      fa: {},
      en: {},
      ar: {}
    },
    unusedKeys: {
      fa: [],
      en: [],
      ar: []
    }
  };
  
  // Find missing keys for each language
  for (const key of extractedData.allUniqueKeys) {
    for (const lang of ['fa', 'en', 'ar']) {
      const value = getNestedValue(translations[lang], key);
      if (value === undefined) {
        report.missingKeys[lang].push(key);
        
        // Categorize by section
        const section = key.split('.')[0];
        if (!report.missingBySection[lang][section]) {
          report.missingBySection[lang][section] = [];
        }
        report.missingBySection[lang][section].push(key);
      }
    }
  }
  
  // Find unused keys (in translation files but not in code)
  for (const lang of ['fa', 'en', 'ar']) {
    for (const key of translationKeys[lang] || []) {
      if (!extractedData.allUniqueKeys.includes(key)) {
        report.unusedKeys[lang].push(key);
      }
    }
  }
  
  // Update summary
  report.summary.missingInFa = report.missingKeys.fa.length;
  report.summary.missingInEn = report.missingKeys.en.length;
  report.summary.missingInAr = report.missingKeys.ar.length;
  
  // Print report
  console.log('\n' + '='.repeat(70));
  console.log('        📊 MISSING KEYS REPORT');
  console.log('='.repeat(70));
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Keys used in code: ${report.summary.keysInCode}`);
  console.log(`   Keys in fa.json: ${report.summary.keysInFa}`);
  console.log(`   Keys in en.json: ${report.summary.keysInEn}`);
  console.log(`   Keys in ar.json: ${report.summary.keysInAr}`);
  console.log('');
  console.log(`   ❌ Missing in fa.json: ${report.summary.missingInFa}`);
  console.log(`   ❌ Missing in en.json: ${report.summary.missingInEn}`);
  console.log(`   ❌ Missing in ar.json: ${report.summary.missingInAr}`);
  
  // Print missing by section
  for (const lang of ['fa', 'en', 'ar']) {
    if (report.missingKeys[lang].length > 0) {
      console.log(`\n❌ MISSING IN ${lang.toUpperCase()}.JSON (${report.missingKeys[lang].length} keys):`);
      
      const sections = Object.keys(report.missingBySection[lang]).sort();
      for (const section of sections) {
        const keys = report.missingBySection[lang][section];
        console.log(`\n   📁 ${section} (${keys.length} keys):`);
        keys.forEach(k => console.log(`      - ${k}`));
      }
    } else {
      console.log(`\n✅ ${lang.toUpperCase()}.JSON: All keys present!`);
    }
  }
  
  // Save report
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(report, null, 2));
  console.log(`\n💾 Full report saved to: ${CONFIG.outputFile}`);
  
  console.log('\n' + '='.repeat(70));
  console.log('        📋 COMPARISON COMPLETE');
  console.log('='.repeat(70) + '\n');
  
  return report;
}

main();