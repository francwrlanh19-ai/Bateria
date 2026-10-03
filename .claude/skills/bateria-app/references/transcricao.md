# Como transcrever partituras de bateria com segurança

O usuário manda fotos de celular, prints de PDF, scans tortos e imagens pequenas. A leitura precisa ser conferida compasso por compasso. Nunca entregue uma transcrição "de olho" sem verificação.

## 1. Primeira olhada

- Veja a imagem inteira e conte os sistemas (linhas), os compassos por sistema e os sinais de repetição.
- Se os dois compassos de uma linha forem iguais, use 1 compasso (`barras` 1). Se forem diferentes, use `barras: 2`, ou um exercício por compasso quando cada compasso tiver seu próprio sinal de repetição.
- Identifique a fórmula de compasso. Quando a folha não tiver, deduza pela soma das figuras e diga isso ao usuário.
- Repare na escrita: duas vozes (mãos em cima, pés embaixo) ou voz única com hastes para cima.

## 2. Posições na pauta

Use `s` para a distância entre linhas e a linha de cima como posição 0. Valores maiores ficam mais para baixo.

| posição | nota | peça (padrão) |
|---|---|---|
| −1,0 (linha suplementar) | A5 | prato de ataque `cr` (X) |
| −0,5 | G5 | chimbal `hh` (X) |
| 0 | F5 | condução `rd` (X) |
| 0,5 | E5 | tom 1 `t1` |
| 1,0 | D5 | tom 2 `t2` |
| 1,5 | C5 | caixa `sn` |
| 2,5 | A4 | surdo `ft` |
| 3,5 | F4 | bumbo `bd` |
| 4,5 | D4 | chimbal com o pé `hp` (X) |

Na prática as medições saem cerca de 0,2 acima do valor teórico. Cabeças inclinadas também deslocam um pouco. Classifique pela faixa mais próxima e confirme no zoom.

## 3. Método com Python (funcionou em todas as folhas)

1. **Normalize a iluminação:** `norm = img / filtro_maximo_local` (por exemplo, `maximum_filter` de 25 a 41 px seguido de média). Depois limiarize em torno de 0,7.
2. **Ache as linhas da pauta:** faça a projeção horizontal. Em fotos tortas ou curvas, acompanhe as 5 linhas coluna a coluna, usando a mediana do deslocamento, e ajuste um polinômio de grau 2 ou 3 para a linha de cima.
3. **Ache as notas:**
   - Por faixas: para cada instrumento, some os pixels escuros numa faixa horizontal em volta da posição dele e procure "montes" com mais de 3 px de largura.
   - Por hastes: colunas com corrida vertical longa acima da pauta. A cabeça fica na ponta de baixo da haste, à esquerda.
   - Agrupe as detecções em ataques (mesmo x ± 10 px).
4. **Descubra o ritmo**, de um destes jeitos:
   - Se o chimbal repete um desenho fixo (colcheias, ou colcheia + duas semicolcheias), use os X dele como régua de tempo e encaixe as outras notas na casa mais próxima.
   - Pelo espaçamento: o espaço de uma colcheia é cerca de 1,6 vez o de uma semicolcheia. Classifique os intervalos e confira se cada compasso fecha a conta.
   - Pelas vigas: uma viga é colcheia, duas semicolcheia, três fusa. Viga curta só de um lado é a semicolcheia isolada.
   - Pausas: semínima, colcheia (o "7"), semicolcheia e colcheia pontuada.
5. **Valide a soma:** cada compasso precisa somar o total certo (16 casas em 4/4 com semicolcheias).

## 4. Conferência visual (obrigatória)

- Gere recortes ampliados (3 a 6 vezes) de cada compasso, com linhas-guia coloridas nas posições das peças (caixa, bumbo, tom, surdo) e o número da casa sobre cada nota detectada.
- Olhe cada imagem e compare nota por nota: peça, casa e duração.
- Faça checagens cruzadas:
  - **Manulação:** em grooves com a direita no chimbal, todo D cai em chimbal e todo E em caixa. Letra sobre bumbo indica erro na folha ou na leitura; avise.
  - **Quantidade:** o número de ataques detectados tem que bater com o número de notas que você vê.
  - **Repetição:** compassos que parecem iguais devem dar trilhas iguais.
- Depois de montar, abra a versão redesenhada e compare com a original.

## 5. Símbolos e convenções

- `>` vira acento `X`. Nota entre parênteses vira fantasma `g` (fica `e` minúsculo na manulação, quando houver).
- Nota pequena antes da principal (apojatura) vira flam `f`, com mão `"eD"`.
- Nota entre parênteses no bumbo (opcional) vira `g` no `bd`. Avise o usuário.
- X dentro de círculo pode ser chimbal com técnica especial. Use `hh` com `cabecas: {"hh":"g/5/x3"}` e pergunte o que o professor quis dizer.
- "D"/"E" em maiúscula e minúscula: mantenha como na folha.
- Quiálteras: 5 e 7 notas por tempo usam `subs`. Tercinas usam `sub: 3`.

## 6. Imagens difíceis

- **Muito pequenas** (menos de 800 px de largura): amplie 6 vezes e leia com a régua de casas desenhada por cima. A detecção automática erra mais nesses casos.
- **Prints de celular:** recorte só a partitura. Barras do sistema e ícones atrapalham a detecção.
- **Folhas incompletas** (por exemplo, "12 viradas" mostrando só 9): transcreva o que aparece e peça o resto.

## 7. Ao responder

Conte em poucas linhas o que cada grupo de exercícios trabalha e liste só as dúvidas reais: símbolo incomum, nota fora do padrão, letra de mão sobre bumbo. Não esconda incertezas.
