# Bateria

A DRUM APP PILLED WITH GOOD EXERCISES. - BRAZILIAN WORSHIP TO JESUS

App para treinar bateria com os músicos da igreja: grooves, samba, paradiddle, worship, tribais, afrobeat, rock, ostinato, técnica de mãos e figuras rítmicas (da semínima à fusa, com quintinas e septinas).

Site: https://francwrlanh19-ai.github.io/Bateria/

## Como funciona

- `app/` é o aplicativo (interface, metrônomo, sons e partituras).
- `conteudo/areas.json` lista as áreas do início: **Leitura** e **Levadas e viradas** (as principais) e **Outros**.
- `conteudo/categorias.json` lista as categorias; cada uma fica dentro de uma área (`area`).
- `conteudo/grupos/*.json` tem um arquivo por lista de exercícios.
- `conteudo/trilha.json` é a trilha de estudo: os exercícios em nove etapas, na ordem em que vale estudá-los. Exercício novo precisa entrar numa etapa (o validador avisa quando algum fica de fora).
- A cada envio para a branch `main`, o GitHub Actions valida os JSON, monta o site e publica no GitHub Pages. Se a validação falhar, nada é publicado e o site continua na versão anterior.

## Formato de um grupo

```json
{
  "id": "rock-beats-2",
  "categoria": "rock",
  "ordem": 10,
  "nivel": 2,
  "titulo": "Rock Beats 2",
  "descricao": "Texto curto que aparece acima dos exercícios.",
  "fonte": "Livro ou autor de onde veio o material (opcional)",
  "andamento": { "inicio": 70, "fim": 120, "passo": 5, "reps": 4 },
  "exercicios": [
    {"id":"rk-1","num":1,"nome":"Levada 1","compasso":[4,4],"sub":4,
     "trilhas":{"hh":"x.x.x.x.x.x.x.x.","sn":"....x.x.....x...","bd":"x.......x......."}}
  ]
}
```

- `nivel`: dificuldade da lista, de 1 (mais fácil) a 5. Aparece ao lado do título.
- `fonte` (opcional): crédito do material, mostrado embaixo da descrição.
- `sub`: casas por tempo (2 colcheias, 3 tercinas, 4 semicolcheias, 8 fusas). Em 6/8, casas por colcheia.
- `subs`: no lugar de `sub`, uma lista com quantas notas há em cada tempo (para quintinas, septinas etc.).
- `barras`: quantos compassos o exercício tem (padrão 1).
- Trilhas: `hh` chimbal, `ho` chimbal aberto, `hm` chimbal meio aberto, `hp` chimbal no pé, `sn` caixa, `bd` bumbo, `t1` e `t2` tons, `ft` surdo, `rd` condução, `rb` cúpula do ride, `cr` ataque.
- Na partitura, o app escreve o nome do prato (Chimbal, Cond., Cúpula, Ataque) em cima da primeira nota de cada prato, põe `o` no chimbal aberto, `ø` no meio aberto e `+` no chimbal que fecha logo depois de abrir, e desenha a cúpula com cabeça de losango. Acentos, marcas e mãos ganham espaço em cima da pauta (a partitura é medida e redesenhada quando falta espaço).
- Em cada casa: `.` pausa, `x` nota, `X` acento, `g` nota fantasma, `f` flam.
- `mao` (opcional): uma letra por casa, `D` direita e `E` esquerda.
- `leitura` (opcional): transforma o exercício num *sistema com leitura*. O valor é a peça que lê (`bd`, `sn`, `ft`, `hp`…), que precisa estar livre no sistema. O sistema tem 1 compasso, em 4/4 com `sub` 2 ou 4; o app repete o sistema por 1 ou 2 compassos e gera por cima uma linha de leitura nova, em 5 níveis (curso **Sistemas com leitura**, em Coordenação).
- `levadas` (opcional, no grupo): ids de levadas de 1 compasso, como `["rk-5", "rk-6"]`. Numa lista de viradas, a pessoa escolhe a levada como escolhe o nível da leitura: o primeiro compasso é a levada (com prato no 1 depois da virada) e o segundo é a virada, com a levada até a virada começar. Em **Viradas simples para worship** ficam as levadas 5 a 16 do Rock Beats 2.
- Os `id` de exercício nunca devem mudar: os recordes de cada pessoa ficam ligados a eles.

## Comandos (no Codespace)

```
npm run validar   # confere os JSON
npm run previa    # monta e abre em http://localhost:8080
```

Cada aparelho guarda os próprios recordes, rotinas, favoritos, diário de estudo e exercícios criados. No início, em **Neste celular**, dá para salvar uma cópia desses dados (um arquivo `.json`) e restaurá-la, inclusive em outro celular.

## Uso diário

- **Treino de hoje** (15, 30 ou 45 minutos): um exercício de cada área. Primeiro o que você está treinando, depois o que pede revisão, depois o próximo novo na ordem da trilha. Cada exercício começa perto do seu recorde e sobe até a meta da lista.
- **Clique que some** (Ajustes › Treino): 3 e 1, 2 e 2 ou 1 e 3 compassos com e sem clique. Nos compassos sem clique o app fica em silêncio e a pessoa segura o tempo sozinha.
- **Sortear a ordem** (Ajustes › Treino): com *Tocar a folha inteira*, os exercícios vêm em ordem sorteada, passando por todos antes de repetir. Bom para as viradas.
- **Estados**: cada exercício fica *novo*, *treinando*, *dominado* (chegou no andamento final da lista) ou *revisar* (dominado e parado há 7 dias ou mais).
- **Últimos 7 dias**, dias seguidos e meta diária; **busca**; **filtros** e **favoritos** nas categorias.
- **Minhas rotinas**: várias, com nome. O botão *Enviar link* gera um link para mandar no WhatsApp; quem abre o link guarda a rotina no próprio app.
- **Trilha de estudo**: as sete etapas, com o objetivo de cada uma. A etapa avança sozinha, ou você escolhe uma à mão.
- **Instalar o app**: na primeira entrada pelo celular, o início convida a instalar. No Android, o botão abre a janela de instalação do próprio celular; no iPhone e em navegadores que não têm essa janela, ele mostra o passo a passo. Depois de instalado, o convite some.

## Skill do Claude

A pasta `.claude/skills/bateria-app/` tem as instruções para o Claude manter este projeto: formato dos JSON, como transcrever partituras e como publicar. O Claude Code no Codespace usa essa pasta automaticamente. No claude.ai, instale o arquivo `bateria-app.skill` em Configurações › Capacidades › Skills.

Créditos: sons de Virtuosity Drums (Versilian Studios, CC0); partituras desenhadas com VexFlow (MIT). Alguns exercícios foram transcritos de materiais didáticos de outros autores, a quem pertencem os créditos.

## Áreas principais: leitura e levadas com viradas

- `conteudo/areas.json` tem três áreas. As duas principais (`"principal": true`) vêm primeiro no início, com as categorias numeradas como passos: **Leitura** (Figuras, Leitura na caixa, Sistemas com leitura e Ditado rítmico), que destrava a coordenação, e **Levadas e viradas** (Viradas com levada), que trabalha a condução. Depois vem **Outros**, com o resto. No Treino de hoje cada área principal ganha um exercício de cada categoria, e Outros entra com um (hoje: três de leitura, um de levadas e viradas e um de outros). Os botões anterior e próximo da tela de leitura atravessam os passos da área principal.
- **Figuras** tem um módulo por figura: Semínima e colcheia, Tercina, Semicolcheia, Quintina, Sextina, Septina e Fusa. Em cada um, a figura vem primeiro com respiro (uma semínima no tempo seguinte), depois sozinha e, por fim, ligada às figuras de base (colcheia, tercina e semicolcheia) e às vizinhas. Semicolcheia e Fusa terminam com a escada subindo e descendo.
- **Mistura de figuras** (o último módulo de Figuras): o app sorteia a figura de cada tempo. A pessoa escolhe até que figura entra, de 1 (colcheia) a 7 (fusa), nos botões em cima da partitura ou na coluna da esquerda da tela de leitura (teclado: 1 a 7 e N para uma mistura nova). A figura do nível aparece em todo compasso; *com respiro*, um tempo é semínima. A mistura muda a cada andamento novo e com *Nova mistura*; tocando, a troca entra na próxima volta. No JSON, `"mistura": "respiro"` ou `"continua"`.
- **Tela de leitura**: folha branca na tela inteira, com o título, anterior e próximo em cima e só o andamento e o Tocar à direita. Liga sozinha com o celular deitado; no computador e no tablet, abre pelo botão de tela cheia (⛶) e fecha no ✕, no Esc ou no voltar. Teclado: espaço toca e para, setas para cima e para baixo mudam o BPM, setas para os lados trocam de exercício.
- **Nível da leitura na tela de leitura**: nos exercícios com leitura, a coluna da esquerda escolhe o nível (Sem, 1 a 5; "Sem" deixa só o sistema) e pede uma leitura nova (Nova). Parado, a mudança vale na hora; tocando, o botão fica tracejado e a mudança entra quando a leitura recomeça, para a linha não trocar no meio. O mesmo vale para os botões da leitura na tela normal. Teclado: 1 a 5 escolhem o nível, 0 deixa só o sistema e N pede uma leitura nova.
- Exercício com `leitura` e sem nenhuma nota no sistema (como "Só a caixa") fica sempre com a leitura ligada.
- **Ditado rítmico** (o 4º passo da Leitura): o app toca um compasso na caixa, depois de um compasso de contagem, e mostra quatro partituras. O compasso sai do gerador da leitura, nos mesmos 5 níveis. Entre as opções só mudam 2 tempos (níveis 1 e 2) ou 3 (níveis 3 a 5), e cada tempo que muda aparece em metade das opções, então não dá para acertar só olhando. Depois de responder, cada opção toca quando você encosta nela, para comparar. O app guarda acertos e sequência por nível; com 10 seguidas o nível fica dominado. Ajustes: andamento, clique no ditado ou só na contagem e quantas vezes o compasso toca. No computador: espaço ouve, 1 a 4 respondem e Enter passa para o próximo.
