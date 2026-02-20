# Amores Líquidos & Carnaval - Music Player & Partituras

> **Para IA:** Este README explica a estrutura e fluxo de trabalho do projeto para facilitar automações e manutenção.

## 🎯 **Projeto e Contexto**
- Esse player serve como guia de estudo para fanfarras de 
- Ele comecou como projeto somente das musicas do bloco amores-liquidos e se expandiu para repertorios mais genericos do carnaval

## Origem dos audios
- normalmente eu descubro o tom que a musica e tocada na rua (que nao necessariamente corresponde ao tom da gravacao)
- baixo o mp3 e transponho e adiciono na pasta music

## 🎯 **Origem dos arranhos**

#### Repertorio amores liquidos
- **`raw_songbook/songbook.docx`** - Documento Word com todas as partituras que eh baixado do drive
- **`raw_songbook/songbook.md`** - Versão markdown (gerada via pandoc)
#### Repertorio amores liquidos
- a ideia vai ser escrever aqui neste repo os outros arranjos, diretamente em .md provavelmente e converter com algum script usando o promtp de arranjador


## 🔄 **Fluxo de Trabalho Principal**

O processo de atualizar o songbook, extrair as partituras e gerar os dados para o site foi automatizado em um único script.

### **1. Atualizar Tudo**

Após modificar o `raw_songbook/songbook.docx`, simplesmente execute o script `convert.ps1` na raiz do projeto:

```ps1
.\convert.ps1
```

Este comando irá cuidar de todas as etapas para você.

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

```ps1
# Setup inicial do ambiente Python (só precisa rodar uma vez)
cd scripts
uv sync
cd ..

# Processamento completo (após editar o songbook.docx)
.\convert.ps1

# Servir o site localmente (na porta 8000)
python -m http.server 8000
```

## 🤖 **Para IA Assistente**
- **Seguir prompt**: `ai-agent.md`
- **Arquivos principais:** `index.html`, `script.js`, `style.css`
- **Dados:** `song-data.js` (playlists) + `song-data-final.js` (partituras)
- **Processamento:** Scripts Python em `scripts/`
- **Estilo markdown:** CSS em `.melody-column h1, h2, h3, p, strong`
- **Layout:** Flexbox, 90% altura para partituras, dropdowns horizontais