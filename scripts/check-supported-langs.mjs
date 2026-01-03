import fs from 'fs';
const content = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/config/i18n.ts', 'utf8');

// Find the supportedLngs configuration
const supportedLngsMatch = content.match(/SUPPORTED_LANGUAGES\s*[=:]\s*\[([^\]]+)\]/);
if (supportedLngsMatch) {
  console.log('SUPPORTED_LANGUAGES:', supportedLngsMatch[1]);
  const langs = supportedLngsMatch[1].replace(/'/g, '').replace(/"/g, '').split(',').map(l => l.trim());
  console.log('Languages configured:', langs);
  console.log('Arabic (ar) present:', langs.includes('ar') ? '✅ YES' : '❌ NO');
} else {
  console.log('SUPPORTED_LANGUAGES not found');
}

// Also check the actual supportedLngs in the config
const configSupportedMatch = content.match(/supportedLngs\s*[=:]\s*SUPPORTED_LANGUAGES/);
console.log('Config references SUPPORTED_LANGUAGES:', configSupportedMatch ? '✅ YES' : '❌ NO');