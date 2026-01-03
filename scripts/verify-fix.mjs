import fs from 'fs';

const content = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/components/auth/AuthModal.tsx', 'utf8');
// Look for the specific line that was changed
console.log('Checking AuthModal.tsx for the fix:');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('auth.login.title')) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});