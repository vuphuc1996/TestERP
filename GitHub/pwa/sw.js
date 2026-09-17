const CACHE='fumeni-v2.1-shell';
const SHELL=['../index.html','../css/app.css','../js/config.js','../js/device.js','../js/api.js','../js/ui.js','../js/install.js','../js/app.js','../modules/employee.js','../modules/attendance.js','../modules/leave.js','../modules/workflow.js','../assets/logo.svg','../assets/apple-touch-icon.png','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r})));
});
