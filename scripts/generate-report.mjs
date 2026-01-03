/**
 * Generate formatted report for Architect
 * 
 * Run: node scripts/generate-report.mjs
 */

import fs from 'fs';

const report = JSON.parse(fs.readFileSync('scripts/missing-keys-report.json', 'utf8'));

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║           📋 I18N COMPLETE AUDIT REPORT FOR ARCHITECT               ║');
console.log('╠══════════════════════════════════════════════════════════════════════╣');
console.log('║                                                                      ║');
console.log(`║  🔢 Keys used in source code: ${String(report.summary.keysInCode).padEnd(36)}║`);
console.log('║                                                                      ║');
console.log('║  📁 Translation Files:                                               ║');
console.log(`║     • fa.json: ${String(report.summary.keysInFa).padEnd(6)} keys (Missing: ${String(report.summary.missingInFa).padEnd(4)})           ║`);
console.log(`║     • en.json: ${String(report.summary.keysInEn).padEnd(6)} keys (Missing: ${String(report.summary.missingInEn).padEnd(4)})           ║`);
console.log(`║     • ar.json: ${String(report.summary.keysInAr).padEnd(6)} keys (Missing: ${String(report.summary.missingInAr).padEnd(4)})           ║`);
console.log('║                                                                      ║');
console.log('╠══════════════════════════════════════════════════════════════════════╣');

for (const lang of ['fa', 'en', 'ar']) {
  const langName = { fa: 'FARSI', en: 'ENGLISH', ar: 'ARABIC' }[lang];
  const missing = report.missingKeys[lang];
  
  if (missing.length === 0) {
    console.log(`║  ✅ ${langName}: All keys present!                                    ║`);
  } else {
    console.log(`║  ❌ ${langName}: ${missing.length} missing keys                                       ║`.slice(0, 75) + '║');
    
    const sections = Object.keys(report.missingBySection[lang]).sort();
    for (const section of sections) {
      const keys = report.missingBySection[lang][section];
      console.log(`║     📁 ${section}: ${keys.length} keys                                            ║`.slice(0, 75) + '║');
    }
  }
  console.log('║                                                                      ║');
}

console.log('╚══════════════════════════════════════════════════════════════════════╝');

// Print all missing keys in a format easy to copy
console.log('\n\n📋 DETAILED MISSING KEYS LIST:\n');

for (const lang of ['fa', 'en', 'ar']) {
  if (report.missingKeys[lang].length > 0) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`${lang.toUpperCase()}.JSON - ${report.missingKeys[lang].length} MISSING KEYS`);
    console.log('='.repeat(50));
    
    const sections = Object.keys(report.missingBySection[lang]).sort();
    for (const section of sections) {
      console.log(`\n[${section}]`);
      report.missingBySection[lang][section].forEach(k => console.log(`  ${k}`));
    }
  }
}

console.log('\n');