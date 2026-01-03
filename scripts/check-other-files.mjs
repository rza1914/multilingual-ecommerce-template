import fs from 'fs';

// Check LoginForm.tsx
const loginFormContent = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/components/auth/LoginForm.tsx', 'utf8');
console.log('Checking LoginForm.tsx:');
const loginFormLines = loginFormContent.split('\n');
loginFormLines.forEach((line, index) => {
  if (line.includes('auth.login.title')) {
    console.log(`LoginForm Line ${index + 1}: ${line.trim()}`);
  }
});

// Check Header.tsx
const headerContent = fs.readFileSync('E:/template1/multilingual-ecommerce-template/frontend/src/components/Header.tsx', 'utf8');
console.log('\nChecking Header.tsx:');
const headerLines = headerContent.split('\n');
headerLines.forEach((line, index) => {
  if (line.includes('auth.login.title')) {
    console.log(`Header Line ${index + 1}: ${line.trim()}`);
  }
});