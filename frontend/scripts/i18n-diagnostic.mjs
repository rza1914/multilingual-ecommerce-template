import fs from 'fs';

// Load all translation files
const fa = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json', 'utf8'));

// Get top-level keys for each
const faKeys = Object.keys(fa);
const enKeys = Object.keys(en);
const arKeys = Object.keys(ar.translation);

console.log('=== COMPREHENSIVE SECTION COMPARISON ===');
console.log('fa.json has', faKeys.length, 'sections:', faKeys);
console.log('en.json has', enKeys.length, 'sections:', enKeys);
console.log('ar.json has', arKeys.length, 'sections:', arKeys);

// Find missing sections
const missingInEn = faKeys.filter(key => !enKeys.includes(key));
const missingInAr = faKeys.filter(key => !arKeys.includes(key));
const missingInFa = enKeys.filter(key => !faKeys.includes(key));

console.log('\n=== MISSING SECTIONS ===');
console.log('Sections in fa.json but missing in en.json:', missingInEn);
console.log('Sections in fa.json but missing in ar.json:', missingInAr);
console.log('Sections in en.json but missing in fa.json:', missingInFa);

// Compare section completeness
console.log('\n=== SECTION KEY COUNTS ===');
faKeys.forEach(key => {
  const faCount = typeof fa[key] === 'object' ? Object.keys(fa[key]).length : 0;
  const enCount = en[key] && typeof en[key] === 'object' ? Object.keys(en[key]).length : 0;
  const arCount = ar.translation[key] && typeof ar.translation[key] === 'object' ? Object.keys(ar.translation[key]).length : 0;
  console.log(`${key}: fa=${faCount}, en=${enCount}, ar=${arCount}`);
});