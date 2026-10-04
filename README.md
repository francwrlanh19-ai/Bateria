# Bateria

A DRUM APP PILLED WITH GOOD EXERCISES. - BRAZILIAN WORSHIP TO JESUS

App para treinar bateria com os músicos da igreja: grooves, samba, paradiddle, worship, afrobeat, rock, ostinato, técnica de mãos e figuras rítmicas (da semínima à fusa, com quintinas e septinas).

Site: https://francwrlanh19-ai.github.io/Bateria/

## Como funciona

- `app/` é o aplicativo (interface, metrônomo, sons e partituras).
- `conteudo/areas.json` lista as áreas do início, na ordem de um treino: Mãos, Ritmo e leitura, Coordenação, Levadas e viradas.
- `conteudo/categorias.json` lista as categorias; cada uma fica dentro de uma área (`area`).
- `conteudo/grupos/*.json` tem um arquivo por lista de exercícios.
- `conteudo/trilha.json` é a trilha de estudo: os exercícios em sete etapas, na ordem em que vale estudá-los. Exercício novo precisa entrar numa etapa (o validador avisa quando algum fica de fora).
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
- Trilhas: `hh` chimbal, `ho` chimbal aberto, `hp` chimbal no pé, `sn` caixa, `bd` bumbo, `t1` e `t2` tons, `ft` surdo, `rd` condução, `cr` ataque.
- Em cada casa: `.` pausa, `x` nota, `X` acento, `g` nota fantasma, `f` flam.
- `mao` (opcional): uma letra por casa, `D` direita e `E` esquerda.
- Os `id` de exercício nunca devem mudar: os recordes de cada pessoa ficam ligados a eles.

## Comandos (no Codespace)

```
npm run validar   # confere os JSON
npm run previa    # monta e abre em http://localhost:8080
```

Cada aparelho guarda os próprios recordes, rotinas, favoritos, diário de estudo e exercícios criados. No início, em **Neste celular**, dá para salvar uma cópia desses dados (um arquivo `.json`) e restaurá-la, inclusive em outro celular.

## Uso diário

- **Treino de hoje** (15, 30 ou 45 minutos): um exercício de cada área. Primeiro o que você está treinando, depois o que pede revisão, depois o próximo novo na ordem da trilha. Cada exercício começa perto do seu recorde e sobe até a meta da lista.
- **Estados**: cada exercício fica *novo*, *treinando*, *dominado* (chegou no andamento final da lista) ou *revisar* (dominado e parado há 7 dias ou mais).
- **Últimos 7 dias**, dias seguidos e meta diária; **busca**; **filtros** e **favoritos** nas categorias.
- **Minhas rotinas**: várias, com nome. O botão *Enviar link* gera um link para mandar no WhatsApp; quem abre o link guarda a rotina no próprio app.
- **Trilha de estudo**: as sete etapas, com o objetivo de cada uma. A etapa avança sozinha, ou você escolhe uma à mão.
- **Instalar o app**: na primeira entrada pelo celular, o início convida a instalar. No Android, o botão abre a janela de instalação do próprio celular; no iPhone e em navegadores que não têm essa janela, ele mostra o passo a passo. Depois de instalado, o convite some.

## Skill do Claude

A pasta `.claude/skills/bateria-app/` tem as instruções para o Claude manter este projeto: formato dos JSON, como transcrever partituras e como publicar. O Claude Code no Codespace usa essa pasta automaticamente. No claude.ai, instale o arquivo `bateria-app.skill` em Configurações › Capacidades › Skills.

Créditos: sons de Virtuosity Drums (Versilian Studios, CC0); partituras desenhadas com VexFlow (MIT). Alguns exercícios foram transcritos de materiais didáticos de outros autores, a quem pertencem os créditos.
