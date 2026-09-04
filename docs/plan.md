# Plano — Home Mobile & Leitura de Partitura

> Depende das decisões em aberto no `specs.md`. Este plano assume as respostas mais prováveis (home como tela separada; modal substitui a coluna no mobile; fecha modal volta pra lista) — ajustar depois que você confirmar.

## Abordagem geral

Construir em paralelo, sem tocar em `index.html`/`script.js` de produção, até validar no celular de verdade.

## Fase 0 — Setup do entry point paralelo

- Criar `index2.html` a partir de uma cópia de `index.html`, apontando pros mesmos `style.css`, `repertoire-data.js` e módulos JS existentes.
- Novo módulo `js/mobile-home.js` pra concentrar a lógica da home e do modal, sem misturar com `script.js` atual.

## Fase 1 — Home de escolha de playlist

- Tela inicial com os grupos de playlist como cards grandes, tocáveis — reaproveitando `PLAYLIST_GROUPS` de `js/playlist-ui.js`.
- O `init()` do `index2.html` não chama `loadSong()` automaticamente: só popula a home e espera o toque numa playlist.
- Ao escolher, aplica o equivalente ao `handlePlaylistChange` atual e só aí mostra o player + lista de músicas daquela playlist (fluxo de hoje, reaproveitado).

## Fase 2 — Modal de partitura em tela cheia

- Novo elemento fixed, full-screen, escondido por padrão (`#score-modal`).
- Ao tocar numa música na lista: carrega o áudio e abre o modal com a partitura, usando `renderMelodyMarkdown` (`js/melody-viewer.js`) apontado pro conteúdo do modal em vez da coluna lateral.
- Botão de fechar óbvio (X grande, canto superior) — fecha o modal e volta pra lista/player.

## Fase 3 — Validação

- Rodar local (`npx http-server .`), abrir `index2.html` no celular de verdade — idealmente num ensaio ou uso real na rua.
- Ajustar com base no uso; só depois decidir se `index2.html` vira o novo `index.html` (substituindo o antigo) ou se ficam os dois.

## Arquivos tocados

- Novo: `index2.html`, `js/mobile-home.js`, e CSS novo (classes em `style.css` ou um `mobile-home.css` separado).
- Sem mudança em: `index.html`, `script.js`, `js/audio-player.js`, `js/melody-viewer.js`, `repertoire-data.js`, `js/playlist-ui.js` (além do rename de grupo/label já aplicado).

## Depois de aprovado

Dá pra eu tocar essa implementação direto, fase por fase, ou delegar pra um agente que constrói e eu reviso o resultado de cada fase antes de seguir pra próxima — sua escolha.
