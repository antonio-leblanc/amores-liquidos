- escrever musicas

- script que printa musicas sem partitura e partituras sem musica?

- scrpit que add no yml do carnaval as musicas na ordem alfabetica que tao na pasta music e NAO sao do repertorio amores

- mudar domínio do site pra CARNAVAL. Já existe um repositório separado pra isso — avaliar se migra o código pra lá ou só troca o domínio mantendo o repo atual.

- montar a lista/playlist "Crack Líquido": selecionar as músicas do repertório Carnaval que vão pro bate-lata.

- achar um nome melhor pro site (o atual é meio sem graça hahah)

- revisar `music/verificar_tom/`: tem um mp3 avulso (`Mulú, Duda Beat, Lux & Tróia - Meu Jeito de Amar.mp3`) fora do padrão `slug.mp3`, parece arquivo de trabalho pra conferir tom de música candidata, não conteúdo do site

- acessibilidade: botões de ícone em `index.html` (`play`, `prev`, `next`, `random`) sem `aria-label`/`title` (só `share` e `speed-btn` têm)

- CDNs (`marked.js`, Font Awesome) sem atributo `integrity` (SRI)
