# Bateria

A DRUM APP PILLED WITH GOOD EXERCISES. - BRAZILIAN WORSHIP TO JESUS

App para treinar bateria com os músicos da igreja: grooves, samba, paradiddle, worship, afrobeat, rock, ostinato, técnica de mãos e figuras rítmicas (da semínima à fusa, com quintinas e septinas).

Site: https://francwrlanh19-ai.github.io/Bateria/

## Como funciona

- `app/` é o aplicativo (interface, metrônomo, sons e partituras).
- `conteudo/areas.json` lista as áreas do início, na ordem de um treino: Mãos, Ritmo e leitura, Coordenação, Levadas e viradas.
- `conteudo/categorias.json` lista as categorias; cada uma fica dentro de uma área (`area`).
- `conteudo/grupos/*.json` tem um arquivo por lista de exercícios.
- `conteudo/trilha.json` é a trilha de estudo: etapas com exercícios e uma meta de BPM para cada um. O botão **Treino de hoje**, no início, monta treinos de 5, 15 ou 30 minutos com os exercícios da etapa em que a pessoa está.
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

Cada aparelho guarda os próprios recordes, rotina, diário de estudo e exercícios criados. No início, em **Neste celular**, dá para salvar uma cópia desses dados (um arquivo `.json`) e restaurá-la, inclusive em outro celular.

## Skill do Claude

A pasta `.claude/skills/bateria-app/` tem as instruções para o Claude manter este projeto: formato dos JSON, como transcrever partituras e como publicar. O Claude Code no Codespace usa essa pasta automaticamente. No claude.ai, instale o arquivo `bateria-app.skill` em Configurações › Capacidades › Skills.

Créditos: sons de Virtuosity Drums (Versilian Studios, CC0); partituras desenhadas com VexFlow (MIT). Alguns exercícios foram transcritos de materiais didáticos de outros autores, a quem pertencem os créditos.
