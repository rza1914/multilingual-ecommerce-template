import fs from 'fs';

const fa = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json', 'utf8'));
console.log('Checking for single keys in fa.json:');
console.log('Loading products... exists:', fa['Loading products...']);
console.log('No description available. exists:', fa['No description available.']);

// Also check a few other keys to make sure the file was updated properly
console.log('admin.addProduct exists:', fa.admin?.addProduct);
console.log('checkout.acceptTermsAlert exists:', fa.checkout?.acceptTermsAlert);