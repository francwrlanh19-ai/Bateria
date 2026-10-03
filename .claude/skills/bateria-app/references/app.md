# Arquitetura do app (app/index.html)

## Visão geral
- É uma página única: HTML, CSS e JavaScript dentro de `app/index.html`. Arquivos auxiliares:
  - `amostras.js`: sons da bateria em MP3 base64, Virtuosity Drums (CC0).
  - `vendor/vexflow-bravura.js`: desenho da partitura, VexFlow 4.2.5 (MIT).
  - `conteudo.js`: **gerado** por `scripts/montar.mjs`. Não edite.
  - `manifest.webmanifest` e os ícones `icon-*.png`, para instalar como app.
- `dist/sw.js` é gerado na montagem, com uma versão calculada pelo conteúdo, e guarda o app para uso sem internet.
- Tudo o que é de cada pessoa fica no `localStorage` do aparelho, com o prefixo `bateria.`: `cfg`, `recordes`, `edicoes`, `edicoesMao`, `meus`, `mudo`, `sel`, `memoAba`, `rotina`, `estudo`, `diario`, `copia`. Não renomeie essas chaves sem migração.
- `sel`, `memoAba` e cada item da `rotina` guardam o `id` do exercício junto com lista e posição. Ao abrir, `resolve()` acha o exercício pelo id (`acertaRotina()` faz isso na rotina); referências antigas, sem id, são resolvidas pela posição uma vez e ganham o id. Por isso mover grupos de categoria ou reordenar exercícios não estraga a rotina de ninguém.
- `diario`: `{ "AAAA-MM-DD": { seg, ex: { <id>: { seg, bpm } } } }`, com os segundos tocados por dia e por exercício e o melhor BPM do dia (gravado em `registra`). Guarda cerca de 400 dias. É a base para dias seguidos, semana e revisão.
- Cópia dos dados: `salvaCopia()` baixa `bateria-dados-AAAA-MM-DD.json` no formato `{ app: "estudo-de-bateria", formato: 1, criado, dados: { <chave>: <texto JSON> } }`; `pedeCopia()` e `confirmaCopia()` leem o arquivo e pedem confirmação; `restauraCopia()` liga `congelado` (que bloqueia `LS.set`), troca as chaves e recarrega. `copia` guarda a data da última cópia.

## Telas
- **Hub** (`renderHub`): cartões "Continuar de onde parou" e "Rotina do dia"; depois as áreas (`CONTEUDO.areas`), cada uma com uma linha por categoria (`linhaCat`, botão `.cat` com `h3`); por fim o cartão "Neste celular", com "Meus exercícios" e a cópia dos dados.
- **Categoria**: o texto de cima mostra a área; cada lista mostra título, nível (`nivel`), descrição e fonte (`topoLista`).
- **Categoria** (`renderColecao` com `tela==='categoria'`): grupos e exercícios em linhas.
- **Treino**: partitura (foto ou redesenhada), grade, painel de andamento e barra de controles.
- Navegação: `mudaTela(t)` empilha no histórico, para o botão voltar do Android funcionar; `aplicaTela(t)` desenha a tela. Ao sair do treino, o som para.
- No celular, os ajustes abrem como folha inferior (`mostraAjustes`). O modo foco em tela cheia é `mostraFoco`.

## Dados dos exercícios
- `FOLHAS` (grupos) e `ABAS` (categorias) vêm de `window.CONTEUDO`.
- `trilhas(ex)` devolve as trilhas efetivas, já com as edições do usuário e os acentos conforme o modo.
- `passos(ex)` dá o total de casas; `gradeVar(ex)` faz o mapa de casas para exercícios com `subs`.

## Motor de som e tempo
- `iniciar()` e `parar()`. `agenda()` agenda à frente com o relógio do Web Audio. `agendaPasso()` toca cada casa e empurra eventos visuais para `fila`. `aplica(ev)` acende a grade, o cursor e os pulsos.
- `inicioCompasso()` e `fimCompasso()` cuidam da contagem inicial, da levada antes de virada (`tocaLevada`), do "ouvir e repetir", da progressão de andamento, de "tocar a folha inteira" e da rotina.
- Sons: `carregaKit()` decodifica as amostras e `tocaGravado()` escolhe camada (fraca, normal, forte), alternância, pan e corte do chimbal aberto. Há sons sintetizados de reserva.
- Andamento por lista: cada grupo guarda a sua faixa (`andamento` no JSON; valores do usuário em `cfg.porLista`).

## Notação e grade
- `notacao()`: foto da folha (`window.FOTOS`, vazio na versão pública) ou partitura VexFlow. `notacaoFiguras()` cuida dos exercícios com `subs` (quiálteras).
- `renderGrade()`: grade por instrumento, com linha "Mãos" e blocos por compasso. `renderRegua()` é a régua de figuras.
- Edição: botão "Editar notas", que guarda as alterações em `edicoes`/`edicoesMao` no aparelho. Exercícios criados ficam em "Meus".

## Testar mudanças
1. `node scripts/montar.mjs`
2. `python3 <dir-da-skill>/scripts/conferir.py /home/claude/Bateria/dist`, que precisa passar sem problemas.
3. Para mudanças visuais, tire capturas com Playwright em 390×844 (celular), 780×360 (celular deitado) e 1280×860 (computador), e olhe as imagens. Confira também se `document.documentElement.scrollWidth` não passa da largura da tela.
4. Para testar dados salvos (migração, cópia), grave o `localStorage` a partir de outra página do mesmo site, como `manifest.webmanifest`: a página do app grava `estudo` e `diario` ao sair e sobrescreveria o que você injetou.
5. Publique com `repo.py publicar`.
