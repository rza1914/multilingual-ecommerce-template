/**
 * Find t() calls that might return objects instead of strings
 * 
 * Run: node scripts/find-object-returns.mjs
 */

import fs from 'fs';
import path from 'path';

const CONFIG = {
  srcDir: 'E:/template1/multilingual-ecommerce-template/frontend/src',
  translations: 'E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json'
};

// Load translations
const translations = JSON.parse(fs.readFileSync(CONFIG.translations, 'utf8'));

// Get value from nested path
function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : undefined, obj);
}

// Check if value is an object (not string)
function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

// Extract t() calls from file
function extractTCalls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pattern = /\bt\(['"]([^'"]+)['"]\)/g;
  const calls = [];
  let match;
  
  while ((match = pattern.exec(content)) !== null) {
    calls.push({
      key: match[1],
      file: path.relative(CONFIG.srcDir, filePath)
    });
  }
  
  return calls;
}

// Get all files recursively
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

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🔍 FINDING t() CALLS THAT RETURN OBJECTS');
  console.log('='.repeat(70));
  
  const files = getAllFiles(CONFIG.srcDir);
  const problematicCalls = [];
  
  for (const file of files) {
    const calls = extractTCalls(file);
    
    for (const call of calls) {
      const value = getNestedValue(translations, call.key);
      
      if (isObject(value)) {
        problematicCalls.push({
          ...call,
          valueType: 'OBJECT',
          objectKeys: Object.keys(value)
        });
      }
    }
  }
  
  if (problematicCalls.length === 0) {
    console.log('\n✅ No problematic t() calls found!');
  } else {
    console.log(`\n❌ Found ${problematicCalls.length} t() calls returning OBJECTS:\n`);
    
    for (const call of problematicCalls) {
      console.log(`📁 ${call.file}`);
      console.log(`   Key: t('${call.key}')`);
      console.log(`   Returns: Object with keys [${call.objectKeys.join(', ')}]`);
      console.log(`   Fix: Use t('${call.key}.${call.objectKeys[0]}') instead\n`);
    }
  }
  
  console.log('='.repeat(70) + '\n');
  
  return problematicCalls;
}

main();