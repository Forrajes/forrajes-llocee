// Forrajes LLOCEE · funcionamiento sin internet. Versión 202611192226
const CACHE = 'forrajes-llocee-202611192226';
const ARCHIVOS = ["index.html","manifest.webmanifest","icons/apple-touch-icon.png","icons/favicon-32.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","lib/chart.umd.min.js","lib/html2canvas.min.js","lib/jspdf.plugin.autotable.min.js","lib/jspdf.umd.min.js","lib/qrious.min.js","lib/xlsx.full.min.js"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if(r.method !== 'GET') return;
  const u = new URL(r.url);
  // la página: primero internet (para recibir actualizaciones), si no hay, la copia guardada
  if(r.mode === 'navigate' || (u.origin === location.origin && /\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); return res; }).catch(() => caches.match('index.html')));
    return;
  }
  // librerías, íconos y tipografías: la copia guardada, y si no existe se descarga y se guarda
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if(res.ok || res.type === 'opaque'){ const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })));
});
