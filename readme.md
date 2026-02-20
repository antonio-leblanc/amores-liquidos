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

O processo de atualizar o songbook, extrair as partituras e gerar os dados para o site foi automatizado em um único script que utiliza arquivos YAML como fonte de verdade para as playlists.

### **1. Atualizar Tudo**

Após modificar o `raw_songbook/songbook.docx` ou os arquivos YAML em `arranjos/playlists/`, simplesmente execute o script `convert.ps1` na raiz do projeto:

```ps1
.\convert.ps1
```

### **2. Adicionar Áudio ou Playlists**
- Adicionar MP3 em `music/` (nomenclatura com underscore)
- Atualizar os arquivos YAML em `arranjos/playlists/` (`amores.yml` ou `carnaval.yml`) para incluir a música na lista de `Songs` ou em `Playlists`/`Medleys`.

## 📁 **Estrutura do Repositório**

```
amores-liquidos/
├── index.html              # Aplicação principal
├── script.js               # Lógica do player
├── style.css               # Estilos
├── song-data-final.js      # Dados unificados (GERADO AUTOMATICAMENTE)
├── raw_songbook/           # Fonte da verdade (Amores)
│   ├── songbook.docx       # Documento Word original
│   └── songbook.md         # Markdown convertido
├── arranjos/               # Melodias e Configurações
│   ├── amores/             # Partituras do repertório Amores
│   ├── carnaval/           # Partituras do repertório Carnaval
│   └── playlists/          # Fonte da verdade das Playlists (YAML)
│       ├── amores.yml      # Configuração Amores
│       └── carnaval.yml    # Configuração Carnaval
├── scripts/                # Automação
│   ├── process.markdown.py # Extrai partituras (Amores)
│   └── build_song_data_2.py # Gera song-data-final.js via YAML
├── music/                  # Arquivos MP3
└── prompts/                # Documentação para IA
```

## ⚙️ **Comandos Úteis**

```ps1
# Setup inicial do ambiente Python
cd scripts
uv sync
cd ..

# Processamento completo
.\convert.ps1

# Servir o site localmente
npx http-server .
```

## 🤖 **Para IA Assistente**
- **Seguir prompt**: `ai-agent.md`
- **Fonte de Verdade**: `arranjos/playlists/*.yml` (Songs, Playlists, Medleys)
- **Script de Build**: `scripts/build_song_data_2.py` (V2)
- **Arranjos**: Pastas `arranjos/amores/` e `arranjos/carnaval/`
- **Output**: `song-data-final.js` (não editar manualmente)
- **Estilo markdown**: CSS em `.melody-column h1, h2, h3, p, strong`
