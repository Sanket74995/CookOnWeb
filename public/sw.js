// Service Worker for CookOnWeb PWA
const CACHE_NAME = 'cookonweb-v1.0.0';
const STATIC_CACHE = 'cookonweb-static-v1.0.0';
const DYNAMIC_CACHE = 'cookonweb-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/robots.txt'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/recipes$/,
  /\/api\/recipes\/[^/]+$/,
  /\/api\/collections$/,
  /\/api\/auth\/favorites$/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch(() => {})
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets and pages
  if (request.method === 'GET' && (request.destination === 'document' || request.destination === 'image' || request.destination === 'style' || request.destination === 'script')) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Default network request
  event.respondWith(fetch(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    // keep silent for offline fallback
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for certain endpoints
  if (request.url.includes('/api/recipes') && request.method === 'GET') {
    return new Response(JSON.stringify({
      message: 'You are offline. Previously cached recipes are available.',
      offline: true
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    error: 'Network unavailable and no cached data found'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Handle static requests.
// Documents use network-first to avoid showing an older app shell after deploys.
// Other assets can still use cache-first for speed.
async function handleStaticRequest(request) {
  if (request.destination === 'document') {
    try {
      const networkResponse = await fetch(request, { cache: 'no-store' });
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
  }

  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // keep silent for static fallback

    // Return offline fallback for HTML pages
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/') || new Response(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>CookOnWeb - Offline</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              h1 { color: #3498db; }
              p { color: #666; }
            </style>
          </head>
          <body>
            <h1>CookOnWeb</h1>
            <p>You are currently offline. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }

  return new Response('Offline', { status: 503 });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions like saving recipes, ratings, etc.
  console.log('[SW] Performing background sync');
  // Implementation would depend on what offline actions we want to sync
}

// Push notifications (for future meal reminders)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [100, 50, 100],
      data: data.data
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
