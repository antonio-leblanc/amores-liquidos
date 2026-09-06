# Plano — Home Mobile & Leitura de Partitura

> Decisões fechadas em `specs.md`: navegação em 3 níveis (Home → Lista → Partitura) via History API (`pushState`/`popstate`), fechar a partitura volta pra lista, `index2.html` é cópia paralela completa.

## Abordagem geral

Construir em paralelo, sem tocar em `index.html`/`script.js` de produção, até validar no celular de verdade.

## Fase 0 — Setup do entry point paralelo

- Criar `index2.html` a partir de uma cópia de `index.html`, apontando pros mesmos `style.css`, `repertoire-data.js` e módulos JS existentes.
- Novo módulo `js/mobile-home.js` pra concentrar a lógica da home, da lista e da partitura, sem misturar com `script.js` atual.
- Exportar `PLAYLIST_GROUPS` de `js/playlist-ui.js` (hoje é `const` interno) pra reaproveitar na home.

## Fase 1 — Navegação em 3 níveis (Home → Lista → Partitura)

- **Home** (`#view-home`): seções por grupo (Amores / CARNAVAL) com cards tocáveis por playlist, reaproveitando `PLAYLIST_GROUPS`. `init()` não chama `loadSong()` automaticamente — só popula a home e espera o toque.
- **Lista** (`#view-list`): ao tocar num card, aplica o equivalente ao `handlePlaylistChange` atual (inclui modo Medley) e mostra a lista de músicas da playlist escolhida, com busca.
- Cada transição (Home→Lista, Lista→Partitura) chama `history.pushState()` com um estado `{view, playlistKey?, songId?}`; um listener de `popstate` re-renderiza a view a partir do estado, sem empurrar de novo.
- Deep link (`?song=`/`?playlist=`) reconstrói a pilha de histórico (`replaceState` pra home + `pushState` pra lista + `pushState` pra partitura), assim o botão voltar do celular funciona igual mesmo em quem abriu direto num link.

## Fase 2 — Partitura em tela cheia

- **Partitura** (`#view-score`): view full-screen com player compacto (play/pause/prev/next/shuffle/velocidade/share) + a melodia, usando `renderMelodyMarkdown` (`js/melody-viewer.js`) apontado pro container da view.
- Ao tocar numa música na lista: carrega o áudio (`loadSong`) e navega pra partitura.
- Botão de fechar (X) chama `history.back()` — some junto com o botão físico/gesto de voltar do celular, sem handler duplicado.

## Fase 3 — Validação

- Rodar local (`npx http-server .`), abrir `index2.html` no celular de verdade — idealmente num ensaio ou uso real na rua.
- Ajustar com base no uso; só depois decidir se `index2.html` vira o novo `index.html` (substituindo o antigo) ou se ficam os dois.

## Arquivos tocados

- Novo: `index2.html`, `js/mobile-home.js`, e CSS novo (classes em `style.css` ou um `mobile-home.css` separado).
- Sem mudança em: `index.html`, `script.js`, `js/audio-player.js`, `js/melody-viewer.js`, `repertoire-data.js`, `js/playlist-ui.js` (além do rename de grupo/label já aplicado).

## Depois de aprovado

Dá pra eu tocar essa implementação direto, fase por fase, ou delegar pra um agente que constrói e eu reviso o resultado de cada fase antes de seguir pra próxima — sua escolha.
