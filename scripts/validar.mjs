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
  const lerJson = (rel, padrao) => {
    try { return JSON.parse(fs.readFileSync(path.join(raiz, rel), 'utf8')); }
    catch (e) { erros.push(`${rel}: ${e.code === 'ENOENT' ? 'arquivo não encontrado' : 'JSON inválido (' + e.message + ')'}`); return padrao; }
  };

  // Áreas do início (Mãos, Ritmo e leitura, Coordenação, Levadas e viradas)
  const areas = lerJson('conteudo/areas.json', []);
  const idsArea = new Set();
  if (!Array.isArray(areas) || !areas.length) erros.push('areas.json: precisa ser uma lista com pelo menos uma área');
  else areas.forEach((a, i) => {
    const A = m => erros.push(`areas.json, área ${a.id || '#' + (i + 1)}: ${m}`);
    if (!a.id || /\s/.test(a.id)) A('"id" vazio ou com espaço');
    else if (idsArea.has(a.id)) A('id repetido');
    else idsArea.add(a.id);
    if (!a.nome) A('falta "nome"');
  });

  // Categorias: cada uma pertence a uma área; "rotina" e "meus" são especiais
  const categorias = lerJson('conteudo/categorias.json', []);
  const idsCategoria = new Set(), especiais = new Set();
  (Array.isArray(categorias) ? categorias : []).forEach((c, i) => {
    const C = m => erros.push(`categorias.json, categoria ${c.id || '#' + (i + 1)}: ${m}`);
    if (!c.id || /\s/.test(c.id)) C('"id" vazio ou com espaço');
    else if (idsCategoria.has(c.id)) C('id repetido');
    else idsCategoria.add(c.id);
    if (!c.nome) C('falta "nome"');
    if (c.especial) { especiais.add(c.id); return; }
    if (!c.area) C(`falta "area" (use uma destas, de conteudo/areas.json: ${[...idsArea].join(', ')})`);
    else if (!idsArea.has(c.area)) C(`área desconhecida "${c.area}" (as áreas ficam em conteudo/areas.json: ${[...idsArea].join(', ')})`);
  });
  for (const id of ['rotina', 'meus']) if (!especiais.has(id)) erros.push(`categorias.json: a categoria especial "${id}" precisa existir, com "especial": true`);

  const nivelOk = n => Number.isInteger(n) && n >= 1 && n <= 5;
  const LIM = { inicio: [30, 300], fim: [30, 300], bpmFixo: [30, 300], passo: [1, 30], reps: [1, 64] };
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
    else if (especiais.has(g.categoria)) E(`a categoria "${g.categoria}" é especial e não recebe grupos`);
    if (!g.titulo) E('falta "titulo"');
    if (g.nivel != null && !nivelOk(g.nivel)) E('"nivel" precisa ser um número inteiro de 1 a 5');
    if (g.fonte != null && (typeof g.fonte !== 'string' || !g.fonte.trim())) E('"fonte" precisa ser um texto');
    if (g.andamento != null) {
      if (typeof g.andamento !== 'object') E('"andamento" precisa ser um objeto');
      else {
        for (const [k, v] of Object.entries(g.andamento)) {
          if (!LIM[k]) E(`"andamento" tem um campo desconhecido: "${k}"`);
          else if (!(Number.isFinite(v) && v >= LIM[k][0] && v <= LIM[k][1])) E(`"andamento.${k}" precisa estar entre ${LIM[k][0]} e ${LIM[k][1]}`);
        }
        if (g.andamento.inicio != null && g.andamento.fim != null && g.andamento.inicio > g.andamento.fim) E('"andamento": o início é maior que o fim');
      }
    }
    if (!Array.isArray(g.exercicios) || !g.exercicios.length) { E('não tem exercícios'); continue; }

    g.exercicios.forEach((ex, i) => {
      const P = `exercício ${ex.id || '#' + (i + 1)}`;
      if (!ex.id) E(`${P}: falta "id"`);
      else if (idsExercicio.has(ex.id)) E(`${P}: id repetido (os ids precisam ser únicos em todo o app)`);
      else idsExercicio.add(ex.id);
      if (!ex.nome) E(`${P}: falta "nome"`);
      if (ex.nivel != null && !nivelOk(ex.nivel)) E(`${P}: "nivel" precisa ser um número inteiro de 1 a 5`);

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
  // Trilha de estudo: etapas com exercícios e metas de andamento
  const avisos = [];
  const trilha = lerJson('conteudo/trilha.json', null);
  let nEtapas = 0;
  if (trilha) {
    const T = m => erros.push(`trilha.json: ${m}`);
    if (!Array.isArray(trilha.etapas) || !trilha.etapas.length) T('precisa de "etapas" com pelo menos uma etapa');
    else {
      const idsEtapa = new Set(), metaAntes = new Map(), naTrilha = new Set();
      trilha.etapas.forEach((e, i) => {
        const P = `etapa ${e.id || '#' + (i + 1)}`;
        if (!e.id || /\s/.test(e.id)) T(`${P}: "id" vazio ou com espaço`);
        else if (idsEtapa.has(e.id)) T(`${P}: id repetido`);
        else idsEtapa.add(e.id);
        if (!e.nome) T(`${P}: falta "nome"`);
        if (!Array.isArray(e.itens) || !e.itens.length) { T(`${P}: não tem itens`); return; }
        const nesta = new Set();
        e.itens.forEach((it, j) => {
          const Q = `${P}, item ${j + 1}`;
          if (!it || !idsExercicio.has(it.ex)) { T(`${Q}: exercício desconhecido "${it && it.ex}"`); return; }
          if (!(Number.isInteger(it.meta) && it.meta >= 30 && it.meta <= 300)) T(`${Q} (${it.ex}): "meta" precisa ser um número inteiro de 30 a 300`);
          if (nesta.has(it.ex)) T(`${Q}: ${it.ex} aparece duas vezes na mesma etapa`);
          nesta.add(it.ex);
          if (metaAntes.has(it.ex) && !(it.meta > metaAntes.get(it.ex))) T(`${Q}: ${it.ex} já apareceu numa etapa anterior; para repetir, a meta precisa ser maior (${metaAntes.get(it.ex)})`);
          metaAntes.set(it.ex, it.meta); naTrilha.add(it.ex);
        });
      });
      nEtapas = idsEtapa.size;
      const fora = [...idsExercicio].filter(id => !naTrilha.has(id));
      if (fora.length) avisos.push(`${fora.length} exercício(s) fora da trilha (decida em que etapa entram): ${fora.join(', ')}`);
    }
  }
  return { erros, avisos, areas: idsArea.size, etapas: nEtapas, grupos: idsGrupo.size, exercicios: idsExercicio.size };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = validar();
  if (r.erros.length) {
    console.error(`Encontrei ${r.erros.length} problema(s):\n- ` + r.erros.join('\n- '));
    process.exit(1);
  }
  for (const a of r.avisos) console.log('Aviso: ' + a);
  console.log(`Tudo certo: ${r.areas} áreas, ${r.grupos} grupos, ${r.exercicios} exercícios, trilha com ${r.etapas} etapas.`);
}
