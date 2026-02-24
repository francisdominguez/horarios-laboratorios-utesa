const CACHE = 'utesa-labs-v1';
const ASSETS = [
  '/horarios-laboratorios-utesa/',
  '/horarios-laboratorios-utesa/index.html',
  '/horarios-laboratorios-utesa/manifest.json',
  '/horarios-laboratorios-utesa/icon-192.png',
  '/horarios-laboratorios-utesa/icon-512.png',
  '/horarios-laboratorios-utesa/img0.jpeg',
  '/horarios-laboratorios-utesa/img1.jpeg',
  '/horarios-laboratorios-utesa/img2.jpeg',
  '/horarios-laboratorios-utesa/img3.jpeg',
  '/horarios-laboratorios-utesa/img4.jpeg',
  '/horarios-laboratorios-utesa/img5.jpeg',
  '/horarios-laboratorios-utesa/img6.jpeg',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
