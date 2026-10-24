// Club 64 offline support: keeps a copy of the app so it opens without internet.
const CACHE = 'club64-v1';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== self.location.origin) return;
  e.respondWith(
    fetch(r).then(res => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r.mode === 'navigate' ? 'index.html' : r, copy)); } return res; })
      .catch(() => caches.match(r.mode === 'navigate' ? 'index.html' : r, { ignoreSearch: true }).then(m => m || caches.match('index.html')))
  );
});
