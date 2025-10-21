# Amores Líquidos - Music Player & Partituras

> **Para IA:** Este README explica a estrutura e fluxo de trabalho do projeto para facilitar automações e manutenção.

## 🎯 **Fonte da Verdade**
- **`raw_songbook/songbook.docx`** - Documento Word com todas as partituras
- **`raw_songbook/songbook.md`** - Versão markdown (gerada via pandoc)

## 🔄 **Fluxo de Trabalho Atual**

### **1. Atualizar Songbook**
```bash
# Converter Word → Markdown
pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"
```

### **2. Processar Partituras**
```bash
# Extrair partituras individuais por instrumento
uv run .\scripts\process.markdown.py
```

### **3. Gerar Dados Finais**
```bash
# Criar song-data-final.js com mapeamento completo
uv run .\scripts\build_song_data.py
```

### **4. Adicionar Áudio**
- Adicionar MP3 em `music/` (nomenclatura com underscore)
- Atualizar `song-data.js` (playlists)

## 📁 **Estrutura do Repositório**

```
amores-liquidos/
├── index.html              # Aplicação principal
├── script.js               # Lógica do player
├── style.css               # Estilos (inclui markdown renderizado)
├── song-data.js            # Playlists e configurações
├── song-data-final.js      # Dados unificados (partituras + músicas)
├── raw_songbook/           # Fonte da verdade
│   ├── songbook.docx       # Documento Word original
│   └── songbook.md         # Markdown convertido
├── scripts/                # Automação
│   ├── process.markdown.py # Extrai partituras por instrumento
│   └── build_song_data.py  # Gera dados finais
├── markdown/               # Partituras individuais (164 arquivos)
│   ├── musica_instrumento.md
│   └── ...
├── music/                  # Arquivos MP3 (72 músicas)
└── prompts/                # Documentação para IA
    ├── ai-agent.md         # Protocolo de desenvolvimento
    ├── criador_de_json.md  # Prompt para conversão
    └── especialista_amores.md # Prompt musical
```

## 🎵 **Funcionalidades**

- **Player:** 3 playlists (Alfabética, Novas 2026, GIG)
- **Partituras:** 4 instrumentos (Sax Alto, Trombone, Trompete, Sax Tenor)
- **Layout:** Player esquerda, partituras direita (90% altura)
- **Controles:** Dropdowns lado a lado, busca integrada

## ⚙️ **Comandos Úteis**

```bash
# Setup inicial
uv sync

# Processamento completo (após editar songbook)
pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"
uv run .\scripts\process.markdown.py
uv run .\scripts\build_song_data.py

# Servir localmente
python -m http.server 8000
```

## 🤖 **Para IA Assistente**

- **Arquivos principais:** `index.html`, `script.js`, `style.css`
- **Dados:** `song-data.js` (playlists) + `song-data-final.js` (partituras)
- **Processamento:** Scripts Python em `scripts/`
- **Estilo markdown:** CSS em `.melody-column h1, h2, h3, p, strong`
- **Layout:** Flexbox, 90% altura para partituras, dropdowns horizontais