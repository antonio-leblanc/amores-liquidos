# Plano de Refatoração e Modernização

> Atualizado após análise geral do projeto (2026-08-13). Itens já concluídos foram removidos — ver histórico do git se precisar consultar o plano antigo.
>
> **2026-08-13**: CSS (variáveis de tema) e JS (modularização) concluídos via subagentes. `style.css` agora usa custom properties em `:root`; `script.js` virou orquestrador que importa `js/audio-player.js`, `js/melody-viewer.js` e `js/playlist-ui.js`.

## Pendências

### 1. Limpeza de arquivos órfãos
- Remover `deprecated/build_song_data.py` e `deprecated/song-data_deprecated.js` — não são referenciados em nenhum lugar do projeto (confirmado via grep), e já estão preservados no histórico do git.
- Revisar `music/verificar_tom/` — tem um mp3 avulso fora do padrão `slug.mp3`, parece arquivo de trabalho esquecido.

### 2. Acessibilidade (frontend)
- Botões de ícone em `index.html` (`play`, `prev`, `next`, `random`) não têm `aria-label`/`title`. Apenas `share` e `speed-btn` têm. Adicionar em todos para leitores de tela.

### 3. Supply chain / CDNs
- `marked.js` e Font Awesome são carregados via CDN sem atributo `integrity` (SRI). Adicionar hashes ou considerar self-host para reduzir risco de supply chain.

### 4. Testes
- `scripts/utils.py` tem regexes frágeis (remoção de acentos, extração do nome do instrumento a partir do título) sem nenhum teste unitário. Uma regressão nessas regras passa despercebida até quebrar um caso específico de música. Vale um `tests/test_utils.py` simples cobrindo os casos conhecidos (acentos, `%`, nomes com instrumento embutido).

---

## Plano de Verificação
- Rodar `.\convert.ps1` após qualquer mudança em Python, para garantir que a geração de dados não quebrou.
- Verificar o console do navegador para erros de JS após mudanças no frontend.
- Validar visualmente a troca de tema Carnaval e a navegação de playlist/áudio.
