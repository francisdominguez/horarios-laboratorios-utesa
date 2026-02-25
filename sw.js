const CACHE = 'utesa-labs-v11';
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
  '/horarios-laboratorios-utesa/img7.jpeg',
  '/horarios-laboratorios-utesa/img8.jpeg',
  '/horarios-laboratorios-utesa/img9.jpeg',
  '/horarios-laboratorios-utesa/img10.jpeg',
  '/horarios-laboratorios-utesa/img11.jpeg',
  '/horarios-laboratorios-utesa/img12.jpeg',
  '/horarios-laboratorios-utesa/img13.jpeg',
  '/horarios-laboratorios-utesa/img14.jpeg',
  '/horarios-laboratorios-utesa/img15.jpeg',
  '/horarios-laboratorios-utesa/img16.jpeg',
  '/horarios-laboratorios-utesa/img17.jpeg',
  '/horarios-laboratorios-utesa/img18.jpeg',
  '/horarios-laboratorios-utesa/img19.jpeg',
  '/horarios-laboratorios-utesa/img20.jpeg',
  '/horarios-laboratorios-utesa/img21.jpeg',
  '/horarios-laboratorios-utesa/img22.jpeg',
  '/horarios-laboratorios-utesa/img23.jpeg',
  '/horarios-laboratorios-utesa/img24.jpeg',
  '/horarios-laboratorios-utesa/img25.jpeg',
  '/horarios-laboratorios-utesa/img26.jpeg',
  '/horarios-laboratorios-utesa/img27.jpeg',
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
