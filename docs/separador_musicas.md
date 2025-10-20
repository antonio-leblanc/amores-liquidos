## Design Rationale: O Script de Divisão do Songbook (`2_prepare_chunks_for_ai_v6.py`)

Este documento resume as decisões de design e as iterações que levaram à versão final do script responsável por dividir o `songbook.md` em arquivos de entrada para a IA.

### 1. O Problema Central

O desafio era converter um único arquivo `songbook.md` em múltiplos arquivos de texto, um por música. A principal complexidade era que as partes de uma mesma música (ex: Sax Alto, Trombone, Trompete) estavam em seções Markdown separadas e precisavam ser agrupadas em um único arquivo de saída.

### 2. A Solução Final (Versão V6)

O script final adota a seguinte abordagem:
- **Lê** o `songbook.md` como fonte.
- **Divide** o documento em blocos de texto, usando os títulos Markdown (`# ...`) como delimitadores.
- **Agrupa** os blocos usando uma função de **normalização de título** (`normalize_song_title`) que atua como uma "chave de agrupamento". Esta função remove inteligentemente a formatação e o nome do instrumento para identificar que `"Alô Paixão (Alto Sax)"` e `"alô paixão (Trombone)"` pertencem ao mesmo grupo.
- **Salva** o conteúdo **Markdown original e completo** de todos os blocos agrupados em um único arquivo `.txt` por música, em uma pasta de saída (`song_chunks_for_ai`).

### 3. Histórico de Iterações e Decisões Chave (O "Porquê")

A solução final foi alcançada após um processo iterativo de depuração:

- **Tentativa 1 (Falha): Normalização Simples (V1-V2)**
  - **O que foi tentado:** Uma função de normalização inicial que não lidava com variações de maiúsculas/minúsculas ou com a formatação Markdown (`**bold**`).
  - **Por que falhou:** O script tratou `"Alô Paixão"` e `"Alô paixão"` como músicas diferentes, resultando em ~171 arquivos de saída em vez dos ~57 esperados. A formatação `**` também quebrava a detecção do nome do instrumento.

- **A Descoberta Chave (Sucesso V4): A Ordem de Limpeza Importa**
  - **O que foi tentado:** Criamos uma função de normalização mais robusta que seguia uma ordem estrita de operações: 1) Remover a formatação Markdown (`**`), 2) Converter para minúsculas, 3) Usar regex para remover o nome do instrumento.
  - **Por que funcionou:** Ao limpar a formatação *antes* de aplicar a lógica, a regex conseguiu identificar e remover os nomes dos instrumentos de forma consistente, resolvendo o problema de agrupamento.

- **Tentativa 2 (Falha): Limpeza Excessiva de Conteúdo (V5)**
  - **O que foi tentado:** Em uma tentativa de "limpar" a entrada para a IA, sugeri um script que removia *todo* o conteúdo Markdown (incluindo os títulos como `# Nome da Música (Instrumento)`) do arquivo final.
  - **Por que falhou:** Você corretamente apontou que isso removeria a informação **vital** do nome do instrumento, tornando o texto inútil para o "Prompt Mestre" da IA, que precisa saber a qual instrumento as notas pertencem.

- **A Decisão Final: Manter o Conteúdo Markdown Original**
  - **Por que foi a escolha certa:** O "Prompt Mestre V2" foi projetado para ser inteligente e extrair informações de um texto formatado. Manter os títulos (`# Nome da Música (Instrumento)`) nos arquivos `.txt` finais garante que a IA receba todo o contexto necessário para gerar um JSON preciso. O "ruído" do Markdown não é um problema para o prompt; na verdade, ele é a fonte dos dados.

### 4. Resumo do Design

- Usamos o **`.md` como fonte** porque sua estrutura com `#` é um delimitador confiável para a divisão.
- Usamos uma **chave de agrupamento normalizada** para lidar com as inconsistências do arquivo de origem.
- O arquivo de saída é **`.txt`**, mas seu conteúdo é **Markdown**, pois isso fornece a entrada de dados completa e contextualizada que a próxima fase da automação exige.