/**
 * CSP Verification Utility
 * 
 * This utility helps verify that CSP changes are actually applied to the application
 * by checking the current CSP headers and testing external resource access.
 */

export function debugCSP() {
  console.log('=== CSP DEBUGGING UTILITY ===');
  
  // 1. Check if CSP is defined in meta tags
  const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (metaCSP) {
    console.log('📋 CSP Meta Tag Found:');
    console.log('  Content:', metaCSP.getAttribute('content'));
  } else {
    console.log('📋 No CSP Meta Tag Found');
  }
  
  // 2. Check external resource access
  console.log('🧪 Testing External Resource Access:');
  
  // Test Google Fonts
  testResource('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap', 'Google Fonts CSS');
  
  // Test Google Fonts assets
  testResource('https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KSvjChPatWI-0mw.woff2', 'Google Fonts Asset');
  
  // Test Pexels images
  testResource('https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=100', 'Pexels Image');
  
  // 3. Check Service Worker status
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        console.log(`🔧 Service Workers: ${registrations.length} registered`);
        registrations.forEach((reg, i) => {
          console.log(`  ${i+1}. Scope: ${reg.scope}`);
          console.log(`     Active: ${reg.active?.scriptURL || 'None'}`);
          console.log(`     State: ${reg.active?.state || 'None'}`);
        });
      })
      .catch(err => {
        console.error('🔧 Error getting Service Worker registrations:', err);
      });
  } else {
    console.log('🔧 Service Worker not supported in this browser');
  }
  
  // 4. Check for Content Security Policy related errors in console
  console.log('📋 Check browser console for CSP errors');
  console.log('   Look for messages like "violates the Content Security Policy"');
  
  // 5. Provide instructions for checking actual CSP headers in DevTools
  console.log('🔍 TO VERIFY CSP HEADERS:');
  console.log('   1. Open DevTools (F12)');
  console.log('   2. Go to Network tab');
  console.log('   3. Reload page');
  console.log('   4. Click on the main HTML request (usually index.html)');
  console.log('   5. Check Response Headers section');
  console.log('   6. Look for "Content-Security-Policy" header');
  console.log('   7. Verify it includes: fonts.googleapis.com and images.pexels.com');
}

// Helper function to test if a resource can be accessed
function testResource(url, description) {
  fetch(url, { method: 'HEAD', mode: 'cors' })
    .then(response => {
      if (response.ok) {
        console.log(`✅ ALLOWED: ${description} - ${url}`);
      } else {
        console.log(`⚠️  STATUS: ${description} - Status ${response.status} (${url})`);
      }
    })
    .catch(error => {
      console.error(`❌ BLOCKED: ${description} - ${error.message} (${url})`);
      console.error('    This could be due to CSP or network issues');
    });
}

// Function to help clear service workers
export async function clearServiceWorkers() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log(`🗑️  Unregistered Service Worker: ${registration.scope}`);
    }
    console.log('🔄 Service Workers cleared. Refresh the page to reload with fresh CSP.');
  }
}

// Function to reload with cache clearing
export function hardRefresh() {
  console.log('🔄 Performing hard refresh to clear caches...');
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      for (const name of names) {
        caches.delete(name);
        console.log(`🗑️  Deleted cache: ${name}`);
      }
    });
  }
  // Force reload to clear memory
  window.location.reload();
}

// Run CSP debug when imported (for development)
if (import.meta.env.DEV) {
  // Add a small delay to let everything load
  setTimeout(debugCSP, 1000);
}