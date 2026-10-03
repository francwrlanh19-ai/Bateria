/* Gerado por scripts/montar.mjs. Guarda o app no aparelho para abrir sem internet. */
const VERSAO='__VERSAO__';
const ARQUIVOS=__ARQUIVOS__;
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSAO).then(c=>c.addAll(ARQUIVOS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSAO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const url=new URL(r.url),mesmoSite=url.origin===location.origin,fonte=/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if(!mesmoSite&&!fonte)return;
  /* responde com o que está guardado e atualiza em segundo plano */
  e.respondWith(caches.open(VERSAO).then(async c=>{
    const guardado=await c.match(r,{ignoreSearch:mesmoSite});
    const rede=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res;}).catch(()=>guardado);
    return guardado||rede;
  }));
});
