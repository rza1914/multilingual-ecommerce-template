import fs from 'fs';
import path from 'path';

// Load translation files
const fa = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json', 'utf8'));
const ar = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json', 'utf8'));

// Get all nested keys from an object
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Get keys for specific sections
const sections = ['footer', 'checkout', 'blog', 'careers', 'common', 'nav', 'auth'];

console.log('\n' + '='.repeat(80));
console.log('                    MISSING TRANSLATION KEYS REPORT');
console.log('='.repeat(80));

sections.forEach(section => {
  const faKeys = fa[section] ? getAllKeys(fa[section], section) : [];
  const enKeys = en[section] ? getAllKeys(en[section], section) : [];
  const arKeys = ar[section] ? getAllKeys(ar[section], section) : [];
  
  // Find the superset (all possible keys)
  const allKeys = [...new Set([...faKeys, ...enKeys, ...arKeys])];
  
  const missingInFa = allKeys.filter(k => !faKeys.includes(k));
  const missingInEn = allKeys.filter(k => !enKeys.includes(k));
  const missingInAr = allKeys.filter(k => !arKeys.includes(k));
  
  console.log(`\n📁 ${section.toUpperCase()}`);
  console.log(`   Total unique keys: ${allKeys.length}`);
  console.log(`   fa.json: ${faKeys.length} keys`);
  console.log(`   en.json: ${enKeys.length} keys`);
  console.log(`   ar.json: ${arKeys.length} keys`);
  
  if (missingInFa.length > 0) {
    console.log(`\n   ❌ Missing in fa.json (${missingInFa.length}):`);
    missingInFa.forEach(k => console.log(`      - ${k}`));
  }
  
  if (missingInEn.length > 0) {
    console.log(`\n   ❌ Missing in en.json (${missingInEn.length}):`);
    missingInEn.forEach(k => console.log(`      - ${k}`));
  }
  
  if (missingInAr.length > 0) {
    console.log(`\n   ❌ Missing in ar.json (${missingInAr.length}):`);
    missingInAr.forEach(k => console.log(`      - ${k}`));
  }
});

// Also check what keys components are using
console.log('\n' + '='.repeat(80));
console.log('                    COMPONENT KEYS VS AVAILABLE KEYS');
console.log('='.repeat(80));

// Footer component keys (from diagnostic report)
const footerComponentKeys = [
  'footer.description',
  'footer.emailAddress', 
  'footer.phone',
  'footer.address',
  'footer.privacyPolicy',
  'footer.termsOfService',
  'footer.company',
  'footer.customerService',
  'footer.allRightsReserved',
  'footer.careers',
  'footer.blog',
  'footer.support',
  'footer.shippingInfo',
  'footer.returns',
  'footer.faq',
  'footer.cookiePolicy'
];

const faFooterKeys = fa.footer ? getAllKeys(fa.footer, 'footer') : [];
const enFooterKeys = en.footer ? getAllKeys(en.footer, 'footer') : [];

console.log('\n📋 Footer Component Analysis:');
console.log(`   Component uses ${footerComponentKeys.length} keys`);

const missingInFaFooter = footerComponentKeys.filter(k => !faFooterKeys.includes(k));
const missingInEnFooter = footerComponentKeys.filter(k => !enFooterKeys.includes(k));

if (missingInFaFooter.length > 0) {
  console.log(`\n   ❌ Keys used by component but MISSING in fa.json (${missingInFaFooter.length}):`);
  missingInFaFooter.forEach(k => console.log(`      - ${k}`));
}

if (missingInEnFooter.length > 0) {
  console.log(`\n   ❌ Keys used by component but MISSING in en.json (${missingInEnFooter.length}):`);
  missingInEnFooter.forEach(k => console.log(`      - ${k}`));
}

console.log('\n' + '='.repeat(80));
console.log('                              END OF REPORT');
console.log('='.repeat(80));