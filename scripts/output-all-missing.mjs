/**
 * Output ALL missing keys in a format ready for translation
 */

import fs from 'fs';

const report = JSON.parse(fs.readFileSync('scripts/missing-keys-report.json', 'utf8'));

// Since all 3 languages have same missing keys, use fa as reference
const missingKeys = report.missingKeys.fa;
const bySection = report.missingBySection.fa;

console.log('\n' + '='.repeat(80));
console.log('COMPLETE LIST OF ALL 290 MISSING TRANSLATION KEYS');
console.log('='.repeat(80));
console.log('\nFormat: section.key\n');

// Output by section
const sections = Object.keys(bySection).sort();

for (const section of sections) {
  const keys = bySection[section].sort();
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📁 ${section.toUpperCase()} (${keys.length} keys)`);
  console.log('─'.repeat(60));
  
  keys.forEach((key, i) => {
    console.log(`${String(i + 1).padStart(3)}. ${key}`);
  });
}

// Also output as JSON array for easy copying
console.log('\n\n' + '='.repeat(80));
console.log('JSON ARRAY FORMAT (for Architect):');
console.log('='.repeat(80));
console.log(JSON.stringify(missingKeys.sort(), null, 2));

// Output summary
console.log('\n\n' + '='.repeat(80));
console.log('SUMMARY BY SECTION:');
console.log('='.repeat(80));

const sectionCounts = sections.map(s => ({ section: s, count: bySection[s].length }));
sectionCounts.sort((a, b) => b.count - a.count);

console.log('\nSection               | Count');
console.log('─'.repeat(40));
sectionCounts.forEach(({ section, count }) => {
  console.log(`${section.padEnd(20)} | ${count}`);
});
console.log('─'.repeat(40));
console.log(`${'TOTAL'.padEnd(20)} | ${missingKeys.length}`);