import fs from 'fs';
const translations = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json', 'utf8'));
console.log('auth.login structure:', JSON.stringify(translations.auth.login, null, 2));