# Formato dos JSON de conteúdo

## Sumário
0. trilha.json (no fim deste arquivo)
1. areas.json e categorias.json
2. Grupo (arquivo em conteudo/grupos)
3. Exercício
4. Trilhas e símbolos
5. Manulação (mao)
6. Recursos especiais (exemplos)
7. Checklist antes de publicar

## 1. areas.json e categorias.json

`conteudo/areas.json` lista as áreas do início, na ordem de um treino:
```json
{ "id": "levadas", "nome": "Levadas e viradas", "descricao": "Para tocar no culto", "cor": "--cym" }
```
As áreas atuais são `maos`, `leitura`, `coordenacao` e `levadas`. Mude só se o usuário pedir.

`conteudo/categorias.json` lista as categorias em ordem de exibição; cada uma pertence a uma área:
```json
{ "id": "worship", "area": "levadas", "nome": "Worship", "descricao": "Viradas, levadas e 6/8", "cor": "--cym" }
```
- `area` é obrigatória (exceto nas especiais `trilha`, `rotina` e `meus`). O validador recusa categoria sem área ou com área desconhecida.
- Cada área tem também `curto`, o nome curto que aparece no cartão do Treino de hoje (Mãos, Ritmo, Coordenação, Levadas).
- `cor` usa as variáveis do app: `--sn` azul, `--hh` dourado, `--tom` verde, `--cym` roxo, `--bd` vermelho, `--ft` marrom, `--rd` turquesa, `--hp` cinza, `--brass` latão, `--muted`.
- `rotina` e `meus` têm `"especial": true`. Não remova essas duas.
- Para criar categoria nova, acrescente na posição desejada. O `id` não pode ter espaço.

## 2. Grupo

Arquivo `conteudo/grupos/<id>.json`, com o nome do arquivo igual ao `id`:
```json
{
  "id": "rock-beats-2",
  "categoria": "rock",
  "ordem": 10,
  "titulo": "Rock Beats 2",
  "descricao": "Texto curto que aparece acima dos exercícios.",
  "andamento": { "inicio": 70, "fim": 120, "passo": 5, "reps": 4 },
  "vozUnica": true,
  "exercicios": [ ... ]
}
```
- `ordem`: posição do grupo dentro da categoria (10, 20, 30…).
- `nivel`: dificuldade de 1 a 5, mostrada como "Nível 2 de 5". Referência: 1 figuras e levadas básicas; 2 técnica de base e levadas comuns; 3 semicolcheias no bumbo e na caixa, independência leve; 4 independência completa, quintinas e septinas; 5 avançado. Um exercício também pode ter o próprio `nivel`.
- `fonte` (opcional): crédito do material (livro, autor, curso). Use quando a origem for conhecida; não invente.
- `andamento` (opcional): faixa sugerida da progressão. Cada lista guarda a sua no aparelho do usuário.
- Opções de escrita e treino:
  - `vozUnica`: todas as hastes para cima, numa voz, como nas folhas em que chimbal, caixa e bumbo dividem a haste.
  - `maosPes`: mãos em cima (pratos, caixa, tons) e pés embaixo (bumbo, chimbal com o pé). Use em samba, ostinato e afrobeat.
  - Sem nenhuma das duas: pratos em cima e tambores embaixo.
  - `estilo: "curto"`: notas escritas curtas com pausas, como em algumas folhas de afrobeat.
  - `cabecas`: troca a cabeça de nota de um instrumento. Exemplo: `{"hh":"g/5/x3"}` desenha o X dentro de um círculo.
  - `virada: true`: liga a opção "Levada antes da virada", que toca levada nos compassos anteriores e prato no 1 depois.
  - `panMao: true`: a mão direita soa à direita e a esquerda à esquerda. Use em técnica e figuras.
  - `modoAcento: true`: mostra a chave "Acento no grupo / no tempo". Os exercícios precisam ter `acentos`.

## 3. Exercício

```json
{"id":"rk-1","num":1,"nome":"Levada 1","compasso":[4,4],"sub":4,"trilhas":{"hh":"x.x.x.x.x.x.x.x.","sn":"....x.x.....x...","bd":"x.......x......."}}
```
- `id`: único em todo o app e **fixo para sempre**. Use um prefixo do grupo, como `rk-1`, `sg-3` ou `wv-2`.
- `num`: o que aparece no botão (número ou letra, por exemplo `"A"`). `nome`: o título.
- `compasso`: `[4,4]`, `[3,4]`, `[6,8]`…
- `sub`: casas por tempo. Use 2 para colcheias, 3 para tercinas, 4 para semicolcheias e 8 para fusas. Em 6/8, é o número de casas por **colcheia**: 1 para colcheias, 2 para semicolcheias.
- `barras` (opcional): número de compassos, para exercícios de 2 ou 4 compassos.
- Total de casas = `barras × compasso[0] × sub`. Cada trilha precisa ter exatamente esse tamanho.
- `subs`, no lugar de `sub`, serve para figura diferente em cada tempo: `"subs":[4,5,4,5]` com `"sub":1`. O total de casas é a soma. É usado para quintinas e septinas e mostra a régua em vez da grade.

## 4. Trilhas e símbolos

| código | peça | código | peça |
|---|---|---|---|
| `hh` | chimbal (mão) | `sn` | caixa |
| `ho` | chimbal aberto | `t1` | tom 1 |
| `hp` | chimbal com o pé | `t2` | tom 2 |
| `rd` | prato de condução | `ft` | surdo |
| `cr` | prato de ataque | `bd` | bumbo |

Em cada casa: `.` pausa · `x` nota · `X` acento · `g` nota fantasma (parênteses) · `f` flam (nota de enfeite antes).

## 5. Manulação (mao)

- Pode ser uma string com uma letra por casa (`"DEDDEDEE..."`, com `.` onde não há letra) ou uma lista com um item por casa (`["", "D", "eD", ...]`).
- `D` é a direita e `E` a esquerda. Maiúscula indica nota principal ou acento; minúscula, nota normal ou fraca, como na folha original.
- Use `"eD"` para flam: esquerda de enfeite, direita principal.
- O validador exige uma nota de mão (pratos, caixa ou tons) em toda casa com letra. Letra sobre bumbo é erro.
- Confira a lógica: em grooves com mão direita no chimbal, todo D cai no chimbal e todo E na caixa.

## 6. Recursos especiais (exemplos reais)

- **Acentos com dois modos** (lista com `modoAcento`):
  `"acentos":{"grupo":[0,2,4,6,8,10,12,14],"tempo":[0,4,8,12]}`. As trilhas ficam só com `x`; o app põe os `X` conforme o modo escolhido.
- **6/8:**
  `{"compasso":[6,8],"sub":2,"trilhas":{"hh":"x.x.x.x.x.x.","sn":"......x.....","bd":"x..........."}}`
- **Dois compassos:**
  `{"compasso":[4,4],"sub":2,"barras":2,"trilhas":{"hh":"x.x.x.x.x.x.x.x.", ...}}`, com 16 casas.
- **Flam:**
  `"sn":"........f.....x."` com `"mao":[..., "eD", ...]` na mesma casa.
- **Figuras por tempo:**
  `{"compasso":[4,4],"sub":1,"subs":[5,1,5,1],"mao":"DEDEDEDEDEDE","trilhas":{"sn":"XxxxxXXxxxxX"}}`

## 7. Checklist antes de publicar

- O nome do arquivo é igual ao `id` do grupo, e a `categoria` existe e tem `area`.
- O grupo tem `nivel` e, se a origem for conhecida, `fonte`.
- Cada trilha tem o tamanho certo; a soma das figuras de cada tempo bate.
- Os IDs são novos e nenhum ID antigo foi alterado.
- `node scripts/validar.mjs` passa e `conferir.py` não aponta problemas.
- A leitura foi conferida visualmente contra a imagem original.

## 8. trilha.json

A trilha de estudo divide os exercícios em etapas, como um plano de curso:
```json
{
  "nome": "Trilha de estudo",
  "descricao": "Texto que aparece no topo da tela da trilha.",
  "etapas": [
    { "id": "primeiros-passos", "nome": "Primeiros passos", "objetivo": "O que a etapa ensina.",
      "itens": [ { "ex": "mc-1", "meta": 90 }, { "ex": "rk-1", "meta": 100 } ] }
  ]
}
```
- `ex` é o id do exercício; `meta` é o BPM (inteiro de 30 a 300) em que ele conta como concluído. Use uma meta dentro do andamento da lista.
- Cada exercício aparece uma vez. Para repetir em etapa posterior (por exemplo, mais velocidade), a meta tem de ser maior que a anterior.
- A ordem dos itens importa: em cada área o Treino de hoje escolhe entre os **dois primeiros** exercícios ainda não concluídos. Intercale levadas e viradas para dar variedade.
- A área de cada item vem da categoria do exercício. As sessões têm blocos por área: 5 min = mãos 2 + foco 3; 15 min = mãos 3 + ritmo 3 + foco 5 + revisão 4; 30 min = mãos 5 + ritmo 5 + coordenação 7 + levadas 8 + revisão 5 (`MODELOS_TREINO` no app).
- O validador recusa exercício desconhecido, meta fora da faixa e repetição sem meta maior, e **avisa** (sem bloquear) quais exercícios estão fora da trilha.

