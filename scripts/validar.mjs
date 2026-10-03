// Confere todos os grupos de exercícios antes de publicar.
// Uso: node scripts/validar.mjs   (sai com erro se algo estiver errado)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INSTRUMENTOS = ['cr', 'rd', 'hh', 'ho', 't1', 't2', 'sn', 'ft', 'bd', 'hp'];
const DE_MAO = ['cr', 'rd', 'hh', 'ho', 't1', 't2', 'sn', 'ft'];

export function validar() {
  const erros = [];
  const categorias = JSON.parse(fs.readFileSync(path.join(raiz, 'conteudo/categorias.json'), 'utf8'));
  const idsCategoria = new Set(categorias.map(c => c.id));
  const dir = path.join(raiz, 'conteudo/grupos');
  const idsGrupo = new Set();
  const idsExercicio = new Set();

  for (const arquivo of fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()) {
    const E = m => erros.push(`${arquivo}: ${m}`);
    let g;
    try { g = JSON.parse(fs.readFileSync(path.join(dir, arquivo), 'utf8')); }
    catch (e) { E(`JSON inválido (${e.message})`); continue; }

    if (!g.id) E('falta "id"');
    else if (idsGrupo.has(g.id)) E(`id de grupo repetido: ${g.id}`);
    else idsGrupo.add(g.id);
    if (g.id && arquivo !== `${g.id}.json`) E(`o arquivo deveria se chamar ${g.id}.json`);
    if (!idsCategoria.has(g.categoria)) E(`categoria desconhecida: "${g.categoria}"`);
    if (!g.titulo) E('falta "titulo"');
    if (!Array.isArray(g.exercicios) || !g.exercicios.length) { E('não tem exercícios'); continue; }

    g.exercicios.forEach((ex, i) => {
      const P = `exercício ${ex.id || '#' + (i + 1)}`;
      if (!ex.id) E(`${P}: falta "id"`);
      else if (idsExercicio.has(ex.id)) E(`${P}: id repetido (os ids precisam ser únicos em todo o app)`);
      else idsExercicio.add(ex.id);
      if (!ex.nome) E(`${P}: falta "nome"`);

      const [num, den] = ex.compasso || [];
      if (!(num >= 1 && num <= 12 && [2, 4, 8].includes(den))) E(`${P}: compasso inválido ${JSON.stringify(ex.compasso)}`);
      let casas;
      if (ex.subs) {
        if (!Array.isArray(ex.subs) || ex.subs.some(q => !(Number.isInteger(q) && q >= 1 && q <= 12))) E(`${P}: "subs" inválido`);
        casas = (ex.subs || []).reduce((a, b) => a + b, 0);
      } else {
        if (!(Number.isInteger(ex.sub) && ex.sub >= 1 && ex.sub <= 12)) E(`${P}: "sub" inválido`);
        casas = (ex.barras || 1) * num * ex.sub;
      }

      const trilhas = ex.trilhas || {};
      if (!Object.keys(trilhas).length) E(`${P}: não tem trilhas`);
      for (const [k, v] of Object.entries(trilhas)) {
        if (!INSTRUMENTOS.includes(k)) E(`${P}: instrumento desconhecido "${k}"`);
        if (typeof v !== 'string' || v.length !== casas) E(`${P}: trilha "${k}" tem ${v && v.length} casas, deveria ter ${casas}`);
        else if (/[^.xXgf]/.test(v)) E(`${P}: trilha "${k}" tem caractere inválido (use . x X g f)`);
      }

      if (ex.mao) {
        const maos = Array.isArray(ex.mao) ? ex.mao : [...ex.mao];
        if (maos.length !== casas) E(`${P}: "mao" tem ${maos.length} casas, deveria ter ${casas}`);
        maos.forEach((t, p) => {
          if (!t || t === '.') return;
          if (!/^[DEde]+$/.test(t)) E(`${P}: mão inválida "${t}" na casa ${p + 1}`);
          else if (!DE_MAO.some(k => trilhas[k] && trilhas[k][p] && trilhas[k][p] !== '.'))
            E(`${P}: "${t}" na casa ${p + 1}, mas não há nota de mão ali`);
        });
      }
    });
  }
  return { erros, grupos: idsGrupo.size, exercicios: idsExercicio.size };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = validar();
  if (r.erros.length) {
    console.error(`Encontrei ${r.erros.length} problema(s):\n- ` + r.erros.join('\n- '));
    process.exit(1);
  }
  console.log(`Tudo certo: ${r.grupos} grupos, ${r.exercicios} exercícios.`);
}
