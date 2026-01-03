import fs from 'fs';
const arRaw = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json', 'utf8');
const arData = JSON.parse(arRaw);
console.log('Arabic file structure:');
console.log('Keys in root:', Object.keys(arData));
console.log('Has translation object:', 'translation' in arData);
if (arData.translation) {
  console.log('Keys in translation object:', Object.keys(arData.translation).length);
  console.log('Sample keys:', Object.keys(arData.translation).slice(0, 5));
}