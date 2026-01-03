/**
 * Extract ALL translation keys from source code
 * 
 * This script scans all .tsx, .ts, .jsx, .js files and extracts:
 * - t('key') calls
 * - t("key") calls
 * - t(`key`) calls
 * - i18n.t('key') calls
 * - useTranslation patterns
 * 
 * Run: node scripts/extract-all-keys.mjs
 */

import fs from 'fs';
import path from 'path';

const CONFIG = {
  srcDir: 'E:/template1/multilingual-ecommerce-template/frontend/src',
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  excludeDirs: ['node_modules', 'dist', 'build', '.git', 'data'],
  outputFile: 'scripts/extracted-keys-report.json'
};

// Patterns to match translation function calls
const PATTERNS = [
  /\bt\(['"`]([^'"`]+)['"`]\)/g,
  /\bi18n\.t\(['"`]([^'"`]+)['"`]\)/g,
  /\btranslate\(['"`]([^'"`]+)['"`]\)/g,
  /\buseTranslation.*?t\(['"`]([^'"`]+)['"`]\)/g
];

// Store results
const results = {
  totalFiles: 0,
  totalKeysFound: 0,
  uniqueKeys: new Set(),
  keysByFile: {},
  keysBySection: {}
};

// Recursively get all files
function getAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!CONFIG.excludeDirs.includes(item)) {
        getAllFiles(fullPath, files);
      }
    } else if (CONFIG.extensions.includes(path.extname(item))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Extract keys from file content
function extractKeysFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const keys = [];
  
  for (const pattern of PATTERNS) {
    // Reset regex state
    pattern.lastIndex = 0;
    
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      // Skip dynamic keys (containing variables)
      if (!key.includes('${') && !key.includes('+')) {
        keys.push(key);
      }
    }
  }
  
  // Also look for common patterns like:
  // t('section.key')
  const simplePattern = /[^a-zA-Z]t\(['"]([a-zA-Z][a-zA-Z0-9_.]+)['"]\)/g;
  let match;
  while ((match = simplePattern.exec(content)) !== null) {
    const key = match[1];
    if (!keys.includes(key)) {
      keys.push(key);
    }
  }
  
  return [...new Set(keys)];
}

// Categorize key by section
function categorizeKey(key) {
  const section = key.split('.')[0];
  return section;
}

// Main execution
function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        📝 EXTRACTING ALL TRANSLATION KEYS FROM SOURCE CODE');
  console.log('='.repeat(70));
  
  // Get all source files
  console.log(`\n📂 Scanning ${CONFIG.srcDir}...`);
  const files = getAllFiles(CONFIG.srcDir);
  results.totalFiles = files.length;
  console.log(`   Found ${files.length} source files`);
  
  // Extract keys from each file
  console.log('\n🔍 Extracting translation keys...');
  
  for (const file of files) {
    const keys = extractKeysFromFile(file);
    
    if (keys.length > 0) {
      const relativePath = path.relative(CONFIG.srcDir, file);
      results.keysByFile[relativePath] = keys;
      
      for (const key of keys) {
        results.uniqueKeys.add(key);
        results.totalKeysFound++;
        
        // Categorize by section
        const section = categorizeKey(key);
        if (!results.keysBySection[section]) {
          results.keysBySection[section] = [];
        }
        if (!results.keysBySection[section].includes(key)) {
          results.keysBySection[section].push(key);
        }
      }
    }
  }
  
  // Summary
  console.log('\n📊 EXTRACTION SUMMARY:');
  console.log(`   Total files scanned: ${results.totalFiles}`);
  console.log(`   Files with translations: ${Object.keys(results.keysByFile).length}`);
  console.log(`   Total key usages: ${results.totalKeysFound}`);
  console.log(`   Unique keys: ${results.uniqueKeys.size}`);
  
  // Keys by section
  console.log('\n📁 KEYS BY SECTION:');
  const sortedSections = Object.keys(results.keysBySection).sort();
  for (const section of sortedSections) {
    console.log(`   ${section}: ${results.keysBySection[section].length} keys`);
  }
  
  // Prepare output
  const output = {
    summary: {
      totalFiles: results.totalFiles,
      filesWithTranslations: Object.keys(results.keysByFile).length,
      totalKeyUsages: results.totalKeysFound,
      uniqueKeys: results.uniqueKeys.size
    },
    keysBySection: results.keysBySection,
    keysByFile: results.keysByFile,
    allUniqueKeys: Array.from(results.uniqueKeys).sort()
  };
  
  // Save to file
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify(output, null, 2));
  console.log(`\n💾 Full report saved to: ${CONFIG.outputFile}`);
  
  // Print all unique keys
  console.log('\n📋 ALL UNIQUE KEYS:');
  const allKeys = Array.from(results.uniqueKeys).sort();
  allKeys.forEach((key, i) => {
    console.log(`   ${i + 1}. ${key}`);
  });
  
  console.log('\n' + '='.repeat(70));
  console.log('        ✅ EXTRACTION COMPLETE');
  console.log('='.repeat(70) + '\n');
  
  return output;
}

main();