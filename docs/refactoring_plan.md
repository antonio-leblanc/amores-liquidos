# Plano de Refatoração e Modernização

> Atualizado após análise geral do projeto (2026-08-13). Itens já concluídos foram removidos — ver histórico do git se precisar consultar o plano antigo.
>
> **2026-08-13**: CSS (variáveis de tema) e JS (modularização) concluídos via subagentes. `style.css` agora usa custom properties em `:root`; `script.js` virou orquestrador que importa `js/audio-player.js`, `js/melody-viewer.js` e `js/playlist-ui.js`. Pasta `deprecated/` (arquivos órfãos não referenciados) removida. `scripts/tests/test_utils.py` criado, cobrindo `slugify`, `normalize_song_title`, `slug_to_title` e `format_instrument_name` (roda com `uv run python -m unittest tests.test_utils -v` de dentro de `scripts/`).

## Pendências (baixa prioridade — nice-to-have, não bloqueiam nada)

### 1. Revisar `music/verificar_tom/`
- Tem um mp3 avulso (`Mulú, Duda Beat, Lux & Tróia - Meu Jeito de Amar.mp3`) fora do padrão `slug.mp3` — parece arquivo de trabalho pra conferir tom de uma música candidata ao repertório, não conteúdo do site em si.

### 2. Acessibilidade (frontend)
- Botões de ícone em `index.html` (`play`, `prev`, `next`, `random`) não têm `aria-label`/`title`. Apenas `share` e `speed-btn` têm.

### 3. Supply chain / CDNs
- `marked.js` e Font Awesome são carregados via CDN sem atributo `integrity` (SRI).

---

## Plano de Verificação
- Rodar `.\convert.ps1` após qualquer mudança em Python, para garantir que a geração de dados não quebrou.
- Verificar o console do navegador para erros de JS após mudanças no frontend.
- Validar visualmente a troca de tema Carnaval e a navegação de playlist/áudio.
