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

## Em aberto — preciso da sua decisão antes de fechar o plano

- A home é uma tela/estado novo antes de qualquer player aparecer, ou é só adiar o carregamento automático da música (mostrando o seletor de playlist já aberto/em destaque, sem tela separada)?
- O modal de partitura **substitui** a coluna de melodia no mobile, ou é uma ação extra (ex: botão "tela cheia") mantendo a visão atual como estava?
- Ao fechar o modal, volta pra lista da playlist atual ou pra home de escolha de playlist?
- `index2.html` vai ser uma cópia paralela completa (duplica head/scripts) ou o mesmo `index.html` com um "modo mobile" ativado por JS (`innerWidth <= 768` + ainda sem playlist escolhida na sessão)?
