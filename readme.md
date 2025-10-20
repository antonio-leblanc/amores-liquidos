# Amores Líquidos Music Player

Player de música e visualizador de partituras para o bloco de carnaval "Amores Líquidos". Possui um repertório completo com exibição interativa de melodias para diferentes instrumentos.

## Funcionalidades

### Player de Música
* **Múltiplas Playlists:** Ordem alfabética, "Novas 2026" e setlist "GIG"
* **Controles de Reprodução:** Play, pause, próxima, anterior e seleção aleatória
* **Busca:** Pesquisa em tempo real na lista de músicas
* **Barra de Progresso:** Clique para pular para qualquer ponto da música

### Exibição de Partituras
* **Suporte Multi-Instrumento:** Visualize melodias para Sax Alto, Trombone e Trompete/Sax Tenor
* **Exibição Interativa:** Alterne entre instrumentos com seletor dropdown
* **Sistema de Revisão:** Músicas com notas de revisão são marcadas com asterisco (*)

## Estrutura do Projeto

```
amores-liquidos/
├── index.html          # Aplicação principal
├── script.js           # Funcionalidade principal
├── style.css           # Estilos
├── song-data.js        # Definições de playlists
├── countdown.js        # Contagem regressiva para o carnaval
├── music/              # Arquivos de áudio MP3 (72 músicas)
├── melodies/           # Arquivos JSON de partituras
│   ├── amor_i_love_you.json
│   ├── depois_do_prazer.json
│   ├── to_nem_ai.json
│   ├── varias_queixas.json
│   └── vem_meu_amor.json
└── prompts/            # Documentação e ferramentas de automação
    ├── criador_de_json.md
    ├── especialista_amores.md
    └── plano_todas_as_musicas_em_json.md
```

## Como Usar

1. **Abrir a Aplicação:** Abra `index.html` em um navegador web
2. **Selecionar Playlist:** Use o dropdown para escolher entre as playlists
3. **Tocar Música:** Clique no botão play ou selecione uma música da lista
4. **Ver Partitura:** Quando uma música com dados de melodia é selecionada, o painel direito mostra a partitura
5. **Trocar Instrumentos:** Use o dropdown de instrumentos para ver diferentes partes

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
- **Dados:** Arquivos JSON para partituras
- **Estilização:** CSS customizado com fundo gradiente
- **Responsivo:** Layout de duas colunas (player + partitura)

## Requisitos

- Navegador web moderno com suporte a HTML5 Audio
- Servidor web local (para acesso a arquivos) ou servir via HTTP
- Nenhuma dependência externa necessária