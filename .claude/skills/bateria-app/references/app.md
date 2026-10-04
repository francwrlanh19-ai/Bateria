# Arquitetura do app (app/index.html)

## Visão geral
- É uma página única: HTML, CSS e JavaScript dentro de `app/index.html`. Arquivos auxiliares:
  - `amostras.js`: sons da bateria em MP3 base64, Virtuosity Drums (CC0).
  - `vendor/vexflow-bravura.js`: desenho da partitura, VexFlow 4.2.5 (MIT).
  - `conteudo.js`: **gerado** por `scripts/montar.mjs`. Não edite.
  - `manifest.webmanifest` e os ícones `icon-*.png`, para instalar como app.
- `dist/sw.js` é gerado na montagem, com uma versão calculada pelo conteúdo, e guarda o app para uso sem internet.
- Tudo o que é de cada pessoa fica no `localStorage` do aparelho, com o prefixo `bateria.`: `cfg`, `recordes`, `edicoes`, `edicoesMao`, `meus`, `mudo`, `sel`, `memoAba`, `rotinas`, `favoritos`, `hoje`, `estudo`, `diario`, `copia`, `instalar` (e `rotina`, a rotina única antiga, lida só na migração). Em `cfg` ficam também `metaDia`, `durHoje` e `etapa` (etapa da trilha escolhida à mão). Não renomeie essas chaves sem migração.
- `sel`, `memoAba` e cada item das `rotinas` guardam o `id` do exercício junto com lista e posição. Ao abrir, `resolve()` acha o exercício pelo id (`acertaItens()`/`acertaRotinas()` fazem isso nas rotinas, sem trocar os objetos de lugar); referências antigas, sem id, são resolvidas pela posição uma vez e ganham o id. Por isso mover grupos de categoria ou reordenar exercícios não estraga a rotina de ninguém.
- `rotinas`: `[{ id, nome, itens: [{ id, lista, ex, min }] }]`. Se não existir, a chave antiga `rotina` vira "Minha rotina". Link de rotina: `#rotina=1;<nome codificado>;<id>*<min>,<id>*<min>` (`linkRotina`, `leLinkRotina`, `cartaoRecebida`); exercícios criados no aparelho não vão no link.
- Estados (`estadoDe`): *novo*, *treinando* (tem recorde ou já tocou, abaixo da meta), *dominado* (recorde ≥ meta) e *revisar* (dominado e sem tocar há 7 dias ou mais, ou sem registro no diário). A meta é o fim da progressão da lista (`metaDe`).
- Treino de hoje (`candidatos`, `planoDeHoje`, `itensHoje`, `cartaoHoje`): um exercício por área, na ordem treinando → revisar → novo (na ordem da trilha, com a etapa escolhida à mão primeiro, `chaveTrilha`) → dominado; favoritos primeiro dentro de cada faixa. O plano do dia fica em `hoje` (`{ dia, ids, feito }`); "Trocar" passa para o próximo candidato. Cada item leva uma faixa de andamento (`faixaHoje`: do recorde − 10 até a meta; na revisão, da meta − 15 até um pouco acima do recorde), que o motor usa só enquanto o treino toca (`eng.faixa`, `iniBpm()`, `fimBpm()`), sem gravar nos ajustes da lista.
- Sequências (treino de hoje e rotinas) tocam por `comecaSessao(itens, info)`, que guarda os itens em `eng.rotina` (`tipo` "hoje" ou "rotina").
- Trilha (`TRILHA`, `ETAPAS`, `etapaAtual`, `renderTrilha`): a etapa atual é a primeira com exercício por dominar, ou a escolhida em `cfg.etapa`.
- Convite para instalar (`cartaoInstalar`, `linhaInstalar`, `atualizaConvite`): um script no `<head>` guarda o `beforeinstallprompt` em `window.pedidoInstalar` e avisa com o evento `instalavel`; `appinstalled` vira o evento `instalou`. O cartão aparece no topo do início no celular (no computador, só quando o navegador oferece) e some quando o app roda instalado (`display-mode`), quando `getInstalledRelatedApps` acha o app (o manifesto aponta para si mesmo em `related_applications`) ou quando `instalar` guarda `{ instalado: true }`. "Agora não" e a recusa na janela do celular guardam `{ adiado: "AAAA-MM-DD" }` e escondem o cartão por 7 dias; nesse tempo, "Neste celular" mostra a opção fixa "Instalar o app". Sem o pedido do navegador, o botão mostra o passo a passo do navegador (`passosInstalar`: Chrome, Samsung Internet, Firefox, iPhone e navegador aberto dentro de outro aplicativo).
- `diario`: `{ "AAAA-MM-DD": { seg, ex: { <id>: { seg, bpm } } } }`, com os segundos tocados por dia e por exercício e o melhor BPM do dia (gravado em `registra`). Guarda cerca de 400 dias. É a base para dias seguidos, semana e revisão.
- Cópia dos dados: `salvaCopia()` baixa `bateria-dados-AAAA-MM-DD.json` no formato `{ app: "estudo-de-bateria", formato: 1, criado, dados: { <chave>: <texto JSON> } }`; `pedeCopia()` e `confirmaCopia()` leem o arquivo e pedem confirmação; `restauraCopia()` liga `congelado` (que bloqueia `LS.set`), troca as chaves e recarrega. `copia` guarda a data da última cópia.

## Telas
- **Hub** (`renderHub`): convite para instalar o app (`cartaoInstalar`), quando couber; cartão "Treino de hoje" (com a linha da trilha e "Ver a trilha"), "Últimos 7 dias" e "Continuar"; a busca (`caixaBusca`, `aplicaBusca`), que mostra os resultados no lugar das áreas; as áreas (`CONTEUDO.areas`), cada uma com uma linha por categoria (`linhaCat`, botão `.cat` com `h3`, contando dominados e em treino); por fim "Neste celular", com "Minhas rotinas", "Meus exercícios" e a cópia dos dados. Uma rotina recebida por link aparece no topo (`cartaoRecebida`).
- **Trilha** (categoria especial `trilha`): as etapas com progresso, objetivo e exercícios; "Estudar esta etapa" e "Voltar ao automático".
- **Categoria**: o texto de cima mostra a área; filtros no topo (`barraFiltro`: todos, novos, treinando, revisar, dominados, favoritos); cada lista mostra título, nível (`nivel`), descrição e fonte (`topoLista`), e cada exercício mostra o estado (`linhaEx`). O voltar devolve para a tela de origem (categoria, busca ou trilha).
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
5. Para o uso diário, teste também: o treino de hoje (escolha, trocar, duração, começar perto do recorde), a semana, a busca, os filtros, os favoritos, as rotinas (criar, renomear, adicionar, enviar e abrir o link noutro contexto) e a trilha (etapa automática e escolhida à mão).
6. Publique com `repo.py publicar`.
