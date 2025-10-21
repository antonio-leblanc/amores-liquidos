# Amores Líquidos Music Player

> ⚠️ **IMPORTANTE:** Esta documentação pode estar desatualizada. Sempre verifique os arquivos reais do projeto para confirmar o estado atual. Os arquivos são a fonte da verdade.

Player de música e visualizador de partituras para o bloco de carnaval "Amores Líquidos". Possui um repertório completo com exibição interativa de melodias para diferentes instrumentos.

## Funcionalidades

### Player de Música
* **Múltiplas Playlists:** Ordem alfabética, "Novas 2026" e setlist "GIG"
* **Controles de Reprodução:** Play, pause, próxima, anterior e seleção aleatória
* **Busca:** Pesquisa em tempo real na lista de músicas
* **Barra de Progresso:** Clique para pular para qualquer ponto da música

### Exibição de Partituras
* **Suporte Multi-Instrumento:** Visualize melodias para Sax Alto, Trombone, Trompete e Sax Tenor
* **Exibição Interativa:** Alterne entre instrumentos com seletor dropdown
* **Partituras Markdown:** Renderização nativa com formatação rica
* **Persistência:** Estado do instrumento salvo entre sessões
* **Suporte Completo:** 2-4 instrumentos por música (trompete e tenor separados quando necessário)

## Estrutura do Projeto

```
amores-liquidos/
├── index.html              # Aplicação principal (player + partituras)
├── script.js               # Funcionalidade principal integrada
├── style.css               # Estilos
├── song-data.js            # Definições de playlists
├── song-data-final.js      # Dados unificados de músicas e partituras
├── countdown.js            # Contagem regressiva para o carnaval
├── music/                  # Arquivos de áudio MP3 (72 músicas)
├── markdown/               # Arquivos markdown de partituras (164 arquivos)
│   ├── meu_sangue_ferve_por_voce_sax_alto.md
│   ├── meu_sangue_ferve_por_voce_trombone.md
│   ├── meu_sangue_ferve_por_voce_trompete.md
│   ├── meu_sangue_ferve_por_voce_sax_tenor.md
│   └── ... (160 outros arquivos)
├── scripts/                # Scripts de processamento
│   ├── process.markdown.py # Processa songbook e gera markdown
│   └── build_song_data.py  # Gera dados finais unificados
└── prompts/                # Documentação e ferramentas de automação
    ├── criador_de_json.md
    ├── especialista_amores.md
    └── ai-agent.md
```

## Como Usar

1. **Abrir a Aplicação:** Abra `index.html` em um navegador web
2. **Selecionar Playlist:** Use o dropdown para escolher entre as playlists (Ordem Alfabética, Novas 2026, GIG)
3. **Tocar Música:** Clique no botão play ou selecione uma música da lista
4. **Ver Partitura:** Quando uma música com partitura está selecionada, o painel direito mostra a partitura em markdown
5. **Trocar Instrumentos:** Use o dropdown de instrumentos para ver diferentes partes (2-4 instrumentos disponíveis)
6. **Buscar Música:** Digite na caixa de busca para filtrar músicas em tempo real
7. **Controles:** Use os botões para navegar (anterior/próxima), reproduzir aleatoriamente ou pular na música

## Adicionando Novas Músicas

### Processo Completo para Atualizar o Songbook

**1. Atualizar o Songbook Original:**
- Edite o documento Word/Google Docs com as novas músicas e partituras

**2. Converter para Markdown:**
```bash
pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"
```

**3. Processar as Partituras:**
```bash
uv run .\scripts\process.markdown.py
```

**4. Gerar Dados Finais:**
```bash
uv run .\scripts\build_song_data.py
```

**5. Adicionar Arquivos de Áudio:**
- Adicione arquivo MP3 na pasta `music/` com nomenclatura com underscore (ex: `nova_musica.mp3`)
- Adicione o nome da música no array `songsAlphabetical` em `song-data.js`
- Adicione à playlist desejada no objeto `playlists`

### Estrutura das Partituras no Songbook

As partituras devem estar organizadas no songbook com títulos como:
- `# **Nome da Música (Sax Alto)**`
- `# **Nome da Música (Trombone)**`
- `# **Nome da Música (Trompete)**` ou `# **Nome da Música (Tenor)**`
- `# **Nome da Música (Trompete/Tenor)**` (quando for a mesma partitura)

O script automaticamente:
- Detecta se trompete e tenor são separados ou agrupados
- Gera arquivos markdown individuais
- Mapeia para o sistema de dados final

## Projeto de Automação

Este repositório inclui ferramentas para automatizar a conversão de partituras de documentos PDF/Word para arquivos JSON estruturados. Veja a pasta `prompts/` para:
- **Prompt Criador de JSON:** Prompt de IA para converter texto em JSON estruturado
- **Prompt Especialista Musical:** Prompt especializado para transposição e arranjo
- **Plano de Automação:** Estratégia para conversão em massa do songbook

## Detalhes Técnicos

- **Frontend:** HTML/CSS/JavaScript vanilla
- **Áudio:** HTML5 Audio API
- **Partituras:** Arquivos Markdown renderizados com biblioteca `marked`
- **Dados:** Sistema unificado com `song-data.js` (playlists) + `song-data-final.js` (partituras)
- **Persistência:** localStorage para estado do instrumento
- **Estilização:** CSS customizado com fundo gradiente
- **Responsivo:** Layout de duas colunas (player + partitura)
- **Processamento:** Scripts Python para extrair e processar partituras do songbook

## Requisitos

- Navegador web moderno com suporte a HTML5 Audio
- Servidor web local (para acesso a arquivos) ou servir via HTTP
- Nenhuma dependência externa necessária