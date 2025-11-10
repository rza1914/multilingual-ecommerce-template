// frontend/public/sw.js
const CACHE_NAME = 'images-v1';
const IMAGE_CACHE_REGEX = /\.(png|jpe?g|webp|gif|svg)$/i;

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting(); // Immediately take control of the page
});

// Fetch event - handle image caching
self.addEventListener('fetch', (event) => {
  // Only cache image requests
  if (event.request.url.match(IMAGE_CACHE_REGEX)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          // Return cached version if available
          if (response) {
            // Update cache in the background (refresh strategy)
            fetchAndUpdateCache(event.request, cache);
            return response;
          }
          
          // If not in cache, fetch from network
          return fetch(event.request).then((networkResponse) => {
            // Add to cache if successful
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // If network fails, return a fallback image
            return caches.match('/fallback-image.jpg').then(fallback => {
              return fallback || new Response('No fallback image available', { status: 500 });
            });
          });
        });
      })
    );
  }
});

// Function to update cache in background
function fetchAndUpdateCache(request, cache) {
  fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
  }).catch((error) => {
    console.error('Failed to update cache:', error);
  });
}

// Cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});