# Specs — Home Mobile & Leitura de Partitura

## Problema

- Hoje, ao abrir o site no celular, o player já carrega e toca automaticamente a primeira música do repertório "💕 Repertorio Amores" (`repertoire-data.js:1161`, `script.js:56-103`) — quase nunca é a música que você foi procurar.
- Isso pesa mais no uso na rua (tocando no bloco): tempo extra até achar a playlist/música certa, com atenção dividida entre instrumento e celular.
- No layout mobile atual, a coluna de partitura fica empilhada acima da lista de playlist (`style.css:522`) — pra só trocar de música já é preciso rolar a tela.

## Objetivo

1. **Home de escolha de playlist**: ao abrir no mobile, a primeira tela é escolher a playlist (Amores / CARNAVAL, com Crack Líquido dentro do grupo CARNAVAL) — nenhuma música carrega ou toca antes dessa escolha.
2. **Leitura de partitura em tela cheia**: ao selecionar uma música, abrir um modal que ocupa a tela toda só com as notas daquela música — fácil de abrir e fechar pra consultar rápido enquanto toca.

## Fora de escopo (por enquanto)

- Desktop: a visão atual de duas colunas lado a lado já funciona bem e não deve ser alterada.
- Não é redesign visual completo — o objetivo é resolver os dois fluxos acima, mantendo o resto (busca, shuffle, velocidade, compartilhar link) como está.

## Restrição

Não quebrar o site em produção. Construir e validar num entry point separado (`index2.html`), reaproveitando os módulos já existentes (`js/audio-player.js`, `js/melody-viewer.js`, `js/playlist-ui.js`) e os dados gerados (`repertoire-data.js`). Só promove pra `index.html` depois de validado no celular de verdade.

## Decisões

- **Navegação em 3 níveis via History API**, não modal simples por cima do conteúdo:
  1. **Home** → cards dos grupos de playlist (reaproveitando `PLAYLIST_GROUPS`, `js/playlist-ui.js:71`).
  2. **Lista** → músicas da playlist escolhida.
  3. **Partitura** → tela cheia com player + melodia da música escolhida.
- Cada transição chama `history.pushState()`. Botão de fechar (X) chama `history.back()`; o botão físico/gesto de voltar do celular funciona de graça, sem precisar interceptar manualmente pra "consertar" o comportamento padrão.
- Fechar a partitura (X ou voltar do celular) volta pra lista da playlist atual (não pra home).
- No mobile, a partitura **substitui** a coluna de melodia — não é uma ação opcional, é o próximo nível da navegação.
- `index2.html` é uma cópia paralela completa (arquivo novo, head/scripts próprios), sem tocar no `index.html` de produção.
