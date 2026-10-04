---
name: bateria-app
description: Mantém e publica o app "Estudo de bateria" (repositório GitHub francwrlanh19-ai/Bateria, site https://francwrlanh19-ai.github.io/Bateria/), usado para treinar os músicos da igreja. Use SEMPRE que o usuário mandar partitura, foto, print ou PDF de bateria para virar exercício; pedir para criar, corrigir ou reorganizar exercícios, grupos ou categorias; mudar interface, sons ou recursos do app; ou publicar/fazer deploy. Vale mesmo quando ele não cita o app nem o GitHub ("adicione essas levadas", "coloca no worship", "faz uma aba de...", "atualiza o site").
---

# App Estudo de bateria

## Contexto

- **Usuário:** baterista brasileiro que estuda e treina os músicos da igreja. Responda em português do Brasil, com linguagem simples, e explique termos musicais ou técnicos quando necessário. Ele costuma escrever do celular (Android Samsung).
- **Repositório:** `francwrlanh19-ai/Bateria` (público, branch `main`).
- **Site:** https://francwrlanh19-ai.github.io/Bateria/ (GitHub Pages com origem "GitHub Actions").
- **Publicação:** cada push na `main` dispara o workflow **Publicar**, que valida os JSON, monta `dist/` e publica, em cerca de 1 minuto. Se a validação falhar, nada é publicado e o site continua na versão anterior.

```
app/                    o aplicativo (index.html, amostras.js com os sons, vendor/vexflow, ícones, manifest)
conteudo/areas.json        áreas do início (Mãos, Ritmo e leitura, Coordenação, Levadas e viradas)
conteudo/trilha.json       trilha de estudo: os ids dos exercícios em 7 etapas, na ordem de estudo
conteudo/categorias.json   categorias (id, area, nome, descrição, cor; "rotina" e "meus" são especiais)
conteudo/grupos/<id>.json  um arquivo por lista de exercícios
scripts/validar.mjs     confere os JSON
scripts/montar.mjs      valida, gera dist/ (conteudo.js + sw.js com versão automática)
scripts/previa.mjs      serve dist/ na porta 8080
.github/workflows/publicar.yml
```

## Antes de começar

1. **Token.** Para enviar ao GitHub, peça ao usuário um token *fine-grained* com acesso só ao repositório Bateria: **Contents** (Read and write), **Workflows** (Read and write), **Actions** (Read-only). Guarde com:
   `python3 <dir-da-skill>/scripts/repo.py token 'TOKEN'`
   O token fica em `/tmp/.ghtok`. Nunca escreva o token em arquivos do repositório, commits, mensagens ou na resposta. Se o token enxergar outros repositórios do usuário, não mexa neles.
2. **Clone ou atualize:** `python3 <dir-da-skill>/scripts/repo.py clonar`. Isso usa `/home/claude/Bateria` e faz `git pull` se já existir.
3. Sem token, ainda dá para trabalhar: gere o JSON, valide e entregue o arquivo para o usuário enviar pelo Codespace.

## Fluxo principal: partitura nova → exercícios publicados

1. **Leia a folha com cuidado.** Anote o título, a quantidade de exercícios e compassos, a fórmula de compasso, as figuras, a manulação (D/E), os acentos, os flams e as notas fantasmas. Veja também se os dois compassos de cada linha são iguais. Siga `references/transcricao.md`: ele traz os métodos que funcionaram (linhas da pauta, faixas por instrumento, grade pelo chimbal, zoom anotado) e as armadilhas comuns. Erros de transcrição são o maior risco do projeto: confira cada compasso visualmente.
2. **Decida onde o conteúdo entra:** área › categoria › grupo. Pode ser uma categoria existente em `conteudo/categorias.json` ou uma nova; categoria nova precisa de `area` (uma das de `conteudo/areas.json`). O usuário costuma dizer "coloca no worship" ou "faça uma aba para...". Se não estiver claro, pergunte.
3. **Escreva o JSON** seguindo `references/formato-json.md`.
   - IDs novos, curtos e únicos.
   - **Nunca mude IDs existentes:** os recordes dos músicos ficam presos a eles.
   - Defina um `andamento` sugerido coerente com a dificuldade.
   - Defina o `nivel` (1 a 5) e, quando souber de onde veio o material, a `fonte`.
   - Ponha cada exercício novo numa etapa de `conteudo/trilha.json` (o validador avisa quando algum fica de fora). Se não souber em qual, pergunte ao usuário.
4. **Valide e monte**, dentro do repositório: `node scripts/validar.mjs` e depois `node scripts/montar.mjs`.
5. **Confira no navegador:** `python3 <dir-da-skill>/scripts/conferir.py /home/claude/Bateria/dist`. O script abre todas as categorias e exercícios e aponta os que não renderizam.
6. **Resuma a leitura para o usuário:** o que cada exercício toca e as dúvidas reais, por exemplo "a caixa cai no tempo 1, o que é incomum; conferi e está assim na folha".
7. **Publique:** `python3 <dir-da-skill>/scripts/repo.py publicar "Adiciona <grupo>"`. O script valida, faz commit, `pull --rebase` e push, e acompanha o workflow até terminar. O usuário prefere publicação direta. Só pergunte antes se houver dúvida de leitura que mude o exercício.
8. **Responda** com:
   - o que entrou e onde fica no app (Categoria › Grupo);
   - os pontos a conferir;
   - o link do site;
   - o aviso de que o celular mostra a novidade na segunda abertura do app.

## Fotos das partituras

O site é público. Não publique fotos ou recortes de partituras de terceiros (livros, sites, Instagram, PDFs de cursos) sem o usuário confirmar que tem permissão. A partitura redesenhada e a grade bastam. Quando um material vier de uma fonte identificável, cite a fonte na `descricao` do grupo.

## Mudanças no app (interface, sons, recursos)

- O código fica em `app/index.html`. Leia `references/app.md` antes de mexer: ele descreve as telas, o motor de áudio, a notação e onde ficam os dados de cada pessoa.
- Para ideias amplas de melhoria, **proponha e pergunte antes de aplicar**. O usuário pediu isso, e as opções com botões funcionam bem no celular.
- Para pedidos diretos ("faça um hub", "melhore para Android"), aplique, teste e publique.
- Não quebre os dados salvos dos usuários: chaves `bateria.*` do localStorage e IDs de exercício. Rotina, "continuar" e memória de cada aba guardam o id do exercício, então mover grupos de categoria ou reordenar é seguro; trocar um id não é.
- Teste sempre com `montar.mjs` e `conferir.py` antes de publicar.

## Problemas comuns

- **Push rejeitado:** rode `repo.py clonar`, que faz o pull, e publique de novo. Nunca force push.
- **Workflow falhou em "configure-pages":** o Pages foi desativado. O usuário precisa ir em Settings › Pages › Source: **GitHub Actions**.
- **403 da API do GitHub:** falta permissão no token. Diga qual permissão ativar.
- **403 com `x-deny-reason: host_not_allowed` ao abrir `github.io`:** é o proxy do seu ambiente, não o site. Confirme pelo status do workflow e peça ao usuário para abrir o link.
- **Validação reclamou:** a mensagem diz o arquivo, o exercício e o problema, como o tamanho da trilha ou uma mão sem nota. Corrija o JSON. Não mexa no validador para ele aceitar o erro.
