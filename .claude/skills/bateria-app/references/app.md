# Arquitetura do app (app/index.html)

## Visão geral
- É uma página única: HTML, CSS e JavaScript dentro de `app/index.html`. Arquivos auxiliares:
  - `amostras.js`: sons da bateria em MP3 base64, Virtuosity Drums (CC0).
  - `vendor/vexflow-bravura.js`: desenho da partitura, VexFlow 4.2.5 (MIT).
  - `conteudo.js`: **gerado** por `scripts/montar.mjs`. Não edite.
  - `manifest.webmanifest` e os ícones `icon-*.png`, para instalar como app.
- `dist/sw.js` é gerado na montagem, com uma versão calculada pelo conteúdo, e guarda o app para uso sem internet.
- Tudo o que é de cada pessoa fica no `localStorage` do aparelho, com o prefixo `bateria.`: `cfg`, `recordes`, `edicoes`, `edicoesMao`, `meus`, `mudo`, `sel`, `memoAba`, `rotina`, `estudo`. Não renomeie essas chaves sem migração.

## Telas
- **Hub** (`renderHub`): cartões "Continuar de onde parou", "Rotina do dia" e categorias.
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
3. Para mudanças visuais, tire capturas com Playwright em 390×844 (celular), 780×360 (celular deitado) e 1280×860 (computador), e olhe as imagens.
4. Publique com `repo.py publicar`.
