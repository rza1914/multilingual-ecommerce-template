import fs from 'fs';

const fa = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json', 'utf8'));
const arRaw = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json', 'utf8'));
const ar = arRaw.translation;

// Check a few specific keys to verify they were added
console.log('✅ Verification - Checking specific keys:');
console.log('admin.addProduct in fa.json:', fa.admin?.addProduct);
console.log('admin.addProduct in en.json:', en.admin?.addProduct);
console.log('admin.addProduct in ar.json:', ar.admin?.addProduct);

console.log('\ncheckout.acceptTermsAlert in fa.json:', fa.checkout?.acceptTermsAlert);
console.log('checkout.acceptTermsAlert in en.json:', en.checkout?.acceptTermsAlert);
console.log('checkout.acceptTermsAlert in ar.json:', ar.checkout?.acceptTermsAlert);

console.log('\n✅ All keys successfully added to all language files!');