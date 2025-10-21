# Amores Líquidos Music Player

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

### Arquivos de Áudio
1. Adicione arquivo MP3 na pasta `music/` com nomenclatura com underscore (ex: `nova_musica.mp3`)
2. Adicione o nome da música no array `songsAlphabetical` em `song-data.js`
3. Adicione à playlist desejada no objeto `playlists`

### Partituras
1. Crie arquivo JSON na pasta `melodies/` com o mesmo nome do arquivo de áudio
2. Siga a estrutura definida nos arquivos JSON existentes:

```json
{
  "songTitle": "Nome da Música",
  "review_needed": ["Notas de revisão opcionais"],
  "structure": ["Seção1", "Seção2", "Refrão"],
  "instruments": [
    {
      "name": "Sax Alto",
      "sections": [
        {
          "name": "Seção1",
          "lines": [
            {"melody": "Do Re Mi Fa Sol"},
            {"melody": "La Si Do Re Mi"}
          ]
        }
      ]
    }
  ]
}
```

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