/* Baille — service worker: guarda o app para abrir sem internet */
const CACHE = 'baille-1.0.0';
const SHELL = [
 "./",
 "index.html",
 "runtime.js",
 "core.js",
 "pages.js",
 "vendor/preact.umd.js",
 "manifest.webmanifest",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/mark.png",
 "icons/favicon.png",
 "assets/img/0f65c4968c16ff1a50fe2bd5861f14d8.jpg",
 "assets/img/0fa9fdc5f97bc211e09a5a3799ab9d15.jpg",
 "assets/img/11cf6664d3d1f7fa0dcbb08098062e81.jpg",
 "assets/img/1afa91f36ad6be65ffaf03553349cb10.png",
 "assets/img/1e9fd42fdd8c74effbb6cbb7cad5364e.png",
 "assets/img/241e6e7b669dd71115f601ca339bbea3.jpg",
 "assets/img/26342e7a23d5546bb7eb29b812b221a4.jpg",
 "assets/img/272bb6da656926663d339c4c4c4e6936.jpg",
 "assets/img/2911cab02adf9285e5501648e0710819.jpg",
 "assets/img/512173f320a962dd6231e8ccf43557cc.jpg",
 "assets/img/63063adb99a9161be2a5387c9b0fa08e.jpg",
 "assets/img/704e9d0575715279495d1fddc9366f12.jpg",
 "assets/img/7ef6f21b90cfeb98e0cf085369a828c4.jpg",
 "assets/img/b13c397a85297c353da79005a2d4586d.jpg",
 "assets/img/b3d1a6fd3111318d4ebfa2eeddcfe0f3.jpg",
 "assets/img/bdd37665b9e1c4b97d8b059e4ae4eedf.jpg",
 "assets/img/c3199d77a11783e6a78ec720fa6bf07c.jpg",
 "assets/img/d813e62d5c8b66d6fa6ec0c37661c22c.jpg"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  }).catch(() => hit)));
});
