const CACHE='nexa-shell-v1';
const SHELL=['./','./index.html','./config.js','./app.css','./app.js','./manifest.json','./logo.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin===location.origin) e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)));
  // Deliberately do not cache GAS/API responses.
});
