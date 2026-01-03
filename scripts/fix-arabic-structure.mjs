/**
 * Fix Arabic Translation File Structure
 * 
 * Problem: ar.json might have double-wrapped structure
 * Expected: { common: {...}, nav: {...} }
 * Actual might be: { translation: { common: {...}, nav: {...} } }
 */

import fs from 'fs';

const AR_PATH = 'E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json';
const FA_PATH = 'E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json';

console.log('\n' + '='.repeat(60));
console.log('   FIXING ARABIC TRANSLATION STRUCTURE');
console.log('='.repeat(60));

// Load files
const fa = JSON.parse(fs.readFileSync(FA_PATH, 'utf8'));
let ar = JSON.parse(fs.readFileSync(AR_PATH, 'utf8'));

console.log('\n📊 Current Structure Analysis:');
console.log('   fa.json top keys:', Object.keys(fa).slice(0, 5).join(', '));
console.log('   ar.json top keys:', Object.keys(ar).slice(0, 5).join(', '));

// Check if ar.json has wrong structure
let fixed = false;

// Case 1: ar.json is wrapped in 'translation'
if (ar.translation && typeof ar.translation === 'object') {
  console.log('\n🔴 PROBLEM FOUND: ar.json is wrapped in "translation" key');
  console.log('   Unwrapping...');
  
  // Backup
  fs.writeFileSync(AR_PATH + '.backup2', JSON.stringify(ar, null, 2));
  console.log('   ✅ Backup created: ar.json.backup2');
  
  // Unwrap
  ar = ar.translation;
  fixed = true;
}

// Case 2: ar.json has only one key that contains everything
if (Object.keys(ar).length === 1 && !ar.common && !ar.nav) {
  const onlyKey = Object.keys(ar)[0];
  if (typeof ar[onlyKey] === 'object' && ar[onlyKey].common) {
    console.log(`\n🔴 PROBLEM FOUND: ar.json is wrapped in "${onlyKey}" key`);
    console.log('   Unwrapping...');
    
    // Backup
    fs.writeFileSync(AR_PATH + '.backup2', JSON.stringify(ar, null, 2));
    
    // Unwrap
    ar = ar[onlyKey];
    fixed = true;
  }
}

// Verify structure matches fa.json
console.log('\n📊 Structure Comparison:');
const faKeys = Object.keys(fa);
const arKeys = Object.keys(ar);

console.log('   fa.json keys count:', faKeys.length);
console.log('   ar.json keys count:', arKeys.length);

// Check for missing top-level keys
const missingInAr = faKeys.filter(k => !arKeys.includes(k));
if (missingInAr.length > 0) {
  console.log('\n⚠️  Missing top-level keys in ar.json:', missingInAr.join(', '));
}

// Test a specific key
console.log('\n📋 Sample Value Test:');
console.log('   fa.common.storeName:', fa.common?.storeName);
console.log('   ar.common.storeName:', ar.common?.storeName);
console.log('   fa.nav.home:', fa.nav?.home);
console.log('   ar.nav.home:', ar.nav?.home);

if (fixed) {
  // Save fixed file
  fs.writeFileSync(AR_PATH, JSON.stringify(ar, null, 2));
  console.log('\n✅ ar.json has been fixed and saved!');
  console.log('   New top keys:', Object.keys(ar).slice(0, 10).join(', '));
} else {
  console.log('\n✅ ar.json structure appears correct (no fix needed)');
  
  // But let's double-check the actual values
  if (ar.common?.storeName === 'LuxStore' || !ar.common?.storeName) {
    console.log('\n⚠️  BUT: Arabic values might be missing or using English!');
    console.log('   ar.common.storeName should be Arabic, got:', ar.common?.storeName);
  }
}

console.log('\n' + '='.repeat(60));