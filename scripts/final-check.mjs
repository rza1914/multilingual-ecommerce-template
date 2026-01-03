/**
 * Final check - find actual missing keys (excluding comments)
 * 
 * Run: node scripts/final-check.mjs
 */

import fs from 'fs';
import path from 'path';

const CONFIG = {
  srcDir: 'E:/template1/multilingual-ecommerce-template/frontend/src',
  translations: {
    fa: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json',
    en: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json',
    ar: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json'
  }
};

// Get nested value
function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj);
}

// Get all keys from object
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
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

// Get all files
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', 'dist', 'data'].includes(item)) {
        getAllFiles(fullPath, files);
      }
    } else if (/\.(tsx?|jsx?)$/.test(item)) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract t() calls more precisely (avoiding comments)
function extractTCalls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // More precise regex that avoids matching inside comments
  // This matches t('...') or t("...") but tries to avoid commented lines
  const lines = content.split('\n');
  const calls = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip lines that look like comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*') || line.trim().startsWith('*/')) {
      continue;
    }
    
    // Find t() calls in the line
    const pattern = /\bt\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = pattern.exec(line)) !== null) {
      calls.push(match[1]);
    }
  }
  
  return [...new Set(calls)];
}

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔍 FINAL CHECK - ACTUAL MISSING KEYS (excluding comments)');
  console.log('='.repeat(70));
  
  // Load all translations
  const translations = {};
  for (const [lang, file] of Object.entries(CONFIG.translations)) {
    let rawContent = fs.readFileSync(file, 'utf8');
    // Remove BOM if present
    if (rawContent.charCodeAt(0) === 0xFEFF) {
      rawContent = rawContent.slice(1);
    }
    translations[lang] = JSON.parse(rawContent);
    
    // Handle Arabic file structure (nested under "translation" key)
    if (lang === 'ar') {
      translations[lang] = translations[lang].translation;
    }
  }
  
  // Get all files and extract t() calls
  const files = getAllFiles(CONFIG.srcDir);
  const allUsedKeys = new Set();
  
  for (const file of files) {
    const keys = extractTCalls(file);
    keys.forEach(k => allUsedKeys.add(k));
  }
  
  console.log(`\n📊 Total unique t() calls found (excluding comments): ${allUsedKeys.size}`);
  
  // Find keys missing in ALL languages (these show as raw)
  const rawKeys = [];
  
  for (const key of allUsedKeys) {
    // Skip keys that look like namespace examples from comments
    if (key.includes(':') && (key.includes('example') || key.includes('t(') || key.includes(')'))) {
      continue;
    }
    
    const inFa = getNestedValue(translations.fa, key) !== undefined;
    const inEn = getNestedValue(translations.en, key) !== undefined;
    const inAr = getNestedValue(translations.ar, key) !== undefined;
    
    if (!inFa && !inEn && !inAr) {
      rawKeys.push({ key, fa: false, en: false, ar: false });
    } else if (!inFa || !inEn || !inAr) {
      // Partially missing
      rawKeys.push({ key, fa: inFa, en: inEn, ar: inAr });
    }
  }
  
  if (rawKeys.length === 0) {
    console.log('\n✅ All t() keys exist in all translation files!');
  } else {
    // Completely missing (raw in all languages)
    const completelyMissing = rawKeys.filter(k => !k.fa && !k.en && !k.ar);
    const partiallyMissing = rawKeys.filter(k => k.fa || k.en || k.ar);
    
    if (completelyMissing.length > 0) {
      console.log(`\n❌ KEYS MISSING IN ALL LANGUAGES (${completelyMissing.length}):`);
      console.log('   These will show as RAW text in UI:\n');
      completelyMissing.forEach(k => console.log(`   - ${k.key}`));
    }
    
    if (partiallyMissing.length > 0) {
      console.log(`\n⚠️  KEYS PARTIALLY MISSING (${partiallyMissing.length}):`);
      console.log('   Key                                      | fa  | en  | ar');
      console.log('   ' + '-'.repeat(60));
      partiallyMissing.forEach(k => {
        const faStatus = k.fa ? '✅' : '❌';
        const enStatus = k.en ? '✅' : '❌';
        const arStatus = k.ar ? '✅' : '❌';
        console.log(`   ${k.key.padEnd(42)} | ${faStatus}  | ${enStatus}  | ${arStatus}`);
      });
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('        📋 FINAL CHECK COMPLETE');
  console.log('='.repeat(70) + '\n');
}

main();