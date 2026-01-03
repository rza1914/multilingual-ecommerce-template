/**
 * Fix t() calls that return objects instead of strings
 * 
 * Run: node scripts/fix-object-returns.mjs
 */

import fs from 'fs';

// Files that need to be fixed
const FILES_TO_FIX = [
  'E:/template1/multilingual-ecommerce-template/frontend/src/components/auth/AuthModal.tsx',
  'E:/template1/multilingual-ecommerce-template/frontend/src/components/auth/LoginForm.tsx',
  'E:/template1/multilingual-ecommerce-template/frontend/src/components/Header.tsx'
];

function fixFile(filePath) {
  console.log(`\n🔍 Checking ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace t('auth.login') with t('auth.login.title')
  const updatedContent = content.replace(/\{t\('auth\.login'\)\}/g, `{t('auth.login.title')}`);
  
  if (content !== updatedContent) {
    content = updatedContent;
    console.log(`   ✅ Fixed: t('auth.login') -> t('auth.login.title')`);
  }
  
  // Also check for any other instances in the file content
  const regex = /t\(['"]auth\.login['"]\)/g;
  let match;
  let foundOtherInstances = false;
  
  while ((match = regex.exec(originalContent)) !== null) {
    // Check if this instance is NOT already followed by .title
    const fullMatch = originalContent.substring(match.index, match.index + 50);
    if (!fullMatch.includes('.title')) {
      foundOtherInstances = true;
    }
  }
  
  // Replace any remaining t('auth.login') calls (not in JSX curly braces)
  const updatedContent2 = content.replace(/t\(['"]auth\.login['"]\)/g, `t('auth.login.title')`);
  
  if (content !== updatedContent2) {
    content = updatedContent2;
    if (!foundOtherInstances) {
      console.log(`   ✅ Fixed: t('auth.login') -> t('auth.login.title')`);
    }
  }
  
  if (originalContent !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   💾 Saved changes to ${filePath}`);
    return true;
  } else {
    console.log(`   ℹ️  No changes needed`);
    return false;
  }
}

function main() {
  console.log('\n' + '='.repeat(70));
  console.log('        🛠️  FIXING t() CALLS THAT RETURN OBJECTS');
  console.log('='.repeat(70));
  
  let totalFixed = 0;
  
  for (const file of FILES_TO_FIX) {
    try {
      const fixed = fixFile(file);
      if (fixed) totalFixed++;
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`        🎉 COMPLETED - ${totalFixed} files updated`);
  console.log('='.repeat(70) + '\n');
}

main();