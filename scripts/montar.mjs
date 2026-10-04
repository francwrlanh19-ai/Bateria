// Monta o site em dist/: valida, junta os JSON em conteudo.js, copia o app e gera o sw.js.
// Uso: node scripts/montar.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validar } from './validar.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');

const r = validar();
if (r.erros.length) {
  console.error(`Não publiquei: ${r.erros.length} problema(s):\n- ` + r.erros.join('\n- '));
  process.exit(1);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(raiz, 'app'), dist, { recursive: true });

const areas = JSON.parse(fs.readFileSync(path.join(raiz, 'conteudo/areas.json'), 'utf8'));
const categorias = JSON.parse(fs.readFileSync(path.join(raiz, 'conteudo/categorias.json'), 'utf8'));
const trilha = JSON.parse(fs.readFileSync(path.join(raiz, 'conteudo/trilha.json'), 'utf8'));
const ordemCat = Object.fromEntries(categorias.map((c, i) => [c.id, i]));
const dirG = path.join(raiz, 'conteudo/grupos');
const grupos = fs.readdirSync(dirG).filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(dirG, f), 'utf8')))
  .sort((a, b) => (ordemCat[a.categoria] - ordemCat[b.categoria]) || ((a.ordem ?? 999) - (b.ordem ?? 999)) || a.id.localeCompare(b.id));
fs.writeFileSync(path.join(dist, 'conteudo.js'),
  '/* Gerado por scripts/montar.mjs a partir de conteudo/. Não edite à mão. */\n' +
  'window.CONTEUDO=' + JSON.stringify({ areas, categorias, grupos, trilha }) + ';\n');

// sw.js com versão calculada pelo conteúdo: os celulares atualizam sozinhos quando algo muda
const listar = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? listar(path.join(d, e.name)) : [path.join(d, e.name)]);
const arquivos = listar(dist).map(f => path.relative(dist, f).split(path.sep).join('/')).sort();
const hash = crypto.createHash('sha256');
for (const a of arquivos) hash.update(a).update(fs.readFileSync(path.join(dist, a)));
const versao = 'bateria-' + hash.digest('hex').slice(0, 10);
const modelo = fs.readFileSync(path.join(raiz, 'scripts/sw.template.js'), 'utf8');
fs.writeFileSync(path.join(dist, 'sw.js'), modelo
  .replace('__VERSAO__', versao)
  .replace('__ARQUIVOS__', JSON.stringify(['./', ...arquivos.map(a => './' + a)])));

for (const a of r.avisos || []) console.log('Aviso: ' + a);
console.log(`Site montado em dist/ (${r.grupos} grupos, ${r.exercicios} exercícios, versão ${versao}).`);
