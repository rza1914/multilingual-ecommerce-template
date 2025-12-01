// frontend/public/sw.js
const STATIC_CACHE_NAME = 'static-v1';
const IMAGE_CACHE_NAME = 'images-v1';
const API_CACHE_NAME = 'api-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  // Add other static assets that should be cached on install
];

const IMAGE_CACHE_REGEX = /\.(png|jpe?g|webp|gif|svg)$/i;
const API_CACHE_REGEX = /\/api\//; // API endpoints

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Immediately take control of the page
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== IMAGE_CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated and ready to handle requests.');
    })
  );
});

// Fetch event - handle different types of requests with appropriate caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // External domains - let browser handle CSP and network requests directly
  // This prevents Service Worker from interfering with requests that may be blocked by CSP
  if (url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('pexels.com') ||
      url.hostname.includes('via.placeholder.com')) {
    return; // Don't intercept - let fetch proceed normally and let CSP handle it
  }

  // Handle static assets with cache-first strategy
  if (isStaticAssetRequest(request)) {
    event.respondWith(
      handleStaticAssetRequest(request)
    );
  }
  // Handle image requests with cache-first strategy
  else if (request.url.match(IMAGE_CACHE_REGEX)) {
    event.respondWith(
      handleImageRequest(request)
    );
  }
  // Handle API requests with network-first strategy
  else if (request.url.match(API_CACHE_REGEX)) {
    event.respondWith(
      handleApiRequest(request)
    );
  }
  // Default network-first strategy with cache fallback
  else {
    event.respondWith(
      handleDefaultRequest(request)
    );
  }
});

// Check if request is for static assets (CSS, JS, fonts, etc.)
function isStaticAssetRequest(request) {
  const url = new URL(request.url);
  const isStatic = url.pathname.match(/\.(css|js|woff2|woff|ttf)$/);
  return isStatic;
}

// Handle static asset requests (CSS, JS, fonts) - Cache First Strategy
async function handleStaticAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // If not in cache, fetch from network and cache for future use
  const networkResponse = await fetch(request);
  const responseToCache = networkResponse.clone();

  const cache = await caches.open(STATIC_CACHE_NAME);
  await cache.put(request, responseToCache);

  return networkResponse;
}

// Handle image requests - Cache First with Network Update Strategy
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in the background
    updateCacheInBackground(request, IMAGE_CACHE_NAME);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(IMAGE_CACHE_NAME);
      await cache.put(request, responseToCache);
      return networkResponse;
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    // Return fallback if available
    const fallbackResponse = await caches.match('/fallback-image.jpg');
    return fallbackResponse || new Response('Image not available', { status: 500 });
  }
}

// Handle API requests - Network First Strategy (with cache fallback)
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);

    // If successful, cache the response
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(API_CACHE_NAME);
      await cache.put(request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.error('API request failed, trying cache:', error);
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // If neither network nor cache works, return error
    return new Response('Network Error', { status: 500 });
  }
}

// Handle default requests - Network First Strategy
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Network request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for HTML requests
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    return new Response('Network Error', { status: 500 });
  }
}

// Function to update cache in background
async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(cacheName);
      await cache.put(request, responseToCache);
    }
  } catch (error) {
    console.error('Failed to update cache in background:', error);
  }
}