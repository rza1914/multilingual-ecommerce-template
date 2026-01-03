import fs from 'fs';
const ar = JSON.parse(fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/data/ar.json', 'utf8')).translation;
console.log('Checking for missing keys in ar.json:');
console.log('No description available. exists:', ar['No description available.'] !== undefined);
console.log('Loading products... exists:', ar['Loading products...'] !== undefined);
console.log('common:buttons.save exists:', ar['common:buttons.save'] !== undefined);
console.log('common.buttons.save exists:', ar.common?.buttons?.save !== undefined);