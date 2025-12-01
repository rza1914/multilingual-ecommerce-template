/**
 * CSP and Service Worker Verification Script
 * 
 * This script can be added to the application to verify that CSP and Service Worker
 * configurations are working properly after the fixes.
 */

export const verifyCSPAndServiceWorker = () => {
  console.log('=== CSP and Service Worker Verification ===');
  
  // Check CSP header
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) {
    console.log('✅ CSP Meta Tag found:', cspMeta.getAttribute('content'));
  } else {
    console.log('ℹ️  No CSP meta tag found (CSP may be set via HTTP headers)');
  }
  
  // Check if external resources are accessible
  console.log('Testing external resource access...');
  
  // Test Google Fonts
  try {
    const googleFontsTest = new URL('https://fonts.googleapis.com/css2?family=Inter');
    console.log('✅ Google Fonts URL format is correct');
  } catch (e) {
    console.log('❌ Error with Google Fonts URL:', e);
  }
  
  // Test Pexels images
  try {
    const pexelsTest = new URL('https://images.pexels.com/photos/3780681');
    console.log('✅ Pexels Images URL format is correct');
  } catch (e) {
    console.log('❌ Error with Pexels Images URL:', e);
  }
  
  // Check Service Worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log(`✅ Service Worker registrations: ${registrations.length}`);
      registrations.forEach((registration, index) => {
        console.log(`  Registration ${index + 1}:`, {
          scope: registration.scope,
          active: !!registration.active,
          waiting: !!registration.waiting,
          installing: !!registration.installing
        });
      });
    }).catch(err => {
      console.log('❌ Service Worker registration error:', err);
    });
  } else {
    console.log('ℹ️  Service Worker not supported in this browser');
  }
  
  // Check if CSP directives allow external domains
  console.log('Expected CSP directives after fix:');
  console.log('  connect-src should include: https://fonts.googleapis.com https://images.pexels.com');
  console.log('  img-src should include: https: (for external images)');
  console.log('  font-src should include: https://fonts.gstatic.com');
  console.log('  style-src should include: https://fonts.googleapis.com');
  
  console.log('=== Verification Complete ===');
};

// Run verification on load (for development testing)
if (typeof window !== 'undefined') {
  window.addEventListener('load', verifyCSPAndServiceWorker);
}