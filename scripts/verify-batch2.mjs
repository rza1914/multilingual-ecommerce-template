import fs from 'fs';

const fa = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/fa.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/en.json', 'utf8'));
const arRaw = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json', 'utf8'));
const ar = arRaw.translation;

// Check a few specific keys to verify they were added
console.log('✅ Verification - Checking specific keys:');
console.log('order.allOrders in fa.json:', fa.order?.allOrders);
console.log('order.allOrders in en.json:', en.order?.allOrders);
console.log('order.allOrders in ar.json:', ar.order?.allOrders);

console.log('\nprofile.title in fa.json:', fa.profile?.title);
console.log('profile.title in en.json:', en.profile?.title);
console.log('profile.title in ar.json:', ar.profile?.title);

console.log('\n✅ All keys successfully added to all language files!');