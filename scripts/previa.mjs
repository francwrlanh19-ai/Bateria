// Serve dist/ em http://localhost:8080 para conferir antes de publicar (no Codespace, abra a porta 8080).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.md': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let f = path.join(dist, decodeURIComponent(req.url.split('?')[0]));
  if (f.endsWith(path.sep) || f === dist) f = path.join(f, 'index.html');
  if (!f.startsWith(dist) || !fs.existsSync(f)) { res.writeHead(404); return res.end('Não encontrado'); }
  res.writeHead(200, { 'Content-Type': tipos[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(8080, () => console.log('Prévia em http://localhost:8080'));
