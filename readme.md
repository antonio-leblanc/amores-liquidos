# Amores Líquidos & Carnaval - Music Player & Partituras

> **Para IA:** Este README explica a estrutura e fluxo de trabalho do projeto para facilitar automações e manutenção.

## 🎯 **Projeto e Visão**

Este player serve como guia de estudo para fanfarras e blocos.
1.  **Repertório Amores Líquidos**: Arranjos extraídos do Songbook oficial (Word).
2.  **Repertório Carnaval**: Novos arranjos construídos manualmente em Markdown para expansão do bloco.

**Objetivo**: Oferecer playlists inteligentes (Assinatura, Novas, GIG) e suporte a Medleys com renderização específica na interface.

## 🔄 **Fluxo de Trabalho Principal**

O processo de atualização é automatizado:

### **1. Sincronização Completa**
Sempre que o Word oficial ou os arquivos YAML em `playlists/` forem alterados:
```ps1
.\convert.ps1
```
*Nota: A pasta `arranjos/amores/` é limpa e recriada do zero a cada execução deste script.*

### **2. Adicionar Novo Material**
- **Áudio**: MP3 em `music/` (slug_com_underscore).
- **Arranjos Carnaval**: Criar pasta em `arranjos/carnaval/{slug}/` com arquivos `.md` por instrumento.
- **Playlists/Medleys**: Editar `playlists/amores.yml` ou `playlists/carnaval.yml`.
- **Transposição Automática** (Experimental): Se você tiver apenas um instrumento (ex: Tenor) e quiser os outros:
    ```ps1
    cd scripts
    uv run transpose_melody.py [slug_da_musica]
    ```

## 📁 **Estrutura do Repositório**

```
amores-liquidos/
├── index.html              # Aplicação principal (Player & Partituras)
├── script.js               # Inteligência do Front-end
├── style.css               # Design System
├── repertoire-data.js      # Banco de dados unificado (GERADO AUTOMATICAMENTE)
├── arranjos/               # Biblioteca de Arranjos
│   ├── amores/             # Extraídos do Word (Gerado)
│   └── carnaval/           # Criados manualmente (Fonte)
├── playlists/              # Fonte da Verdade (YAML)
│   ├── amores.yml          # Core Amores
│   └── carnaval.yml        # Novos repertórios
├── scripts/                # Motores de Automação (Python)
│   ├── sync_amores_from_word.py   # Word -> Markdown Amores
│   ├── compile_repertoire_data.py # YAML + MD -> JS Database
│   ├── transpose_melody.py        # Automação de Transposição (Gemini)
│   └── utils.py                   # Lógica compartilhada (Slugs, Nomes)
├── music/                  # Biblioteca MP3
└── raw_songbook/           # Fonte Primária (DOCX)
```

## ⚙️ **Manual de Operação**

```ps1
# Requisitos: Python (uv), Pandoc (para conversão Word)

# Setup de Ambiente
cd scripts
uv sync
cd ..

# Sincronização e Geração de Dados
.\convert.ps1

# Servidor Local
npx http-server .
```

## 🤖 **Diretrizes para IA**
- **Protocolo**: Seguir estritamente `ai-agent.md`.
- **Fonte de Verdade**: Toda configuração de playlists reside em `playlists/*.yml`.
- **Scripts de Build**: 
    - `scripts/sync_amores_from_word.py` processa o songbook fixo.
    - `scripts/compile_repertoire_data.py` consolida tudo para o player.
- **Aparência**: O frontend é premium, responsivo e possui tema dinâmico de Carnaval.


