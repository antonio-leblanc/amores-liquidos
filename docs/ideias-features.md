# Ideias de features/ferramentas

Ideias pro site em si (não conteúdo de música). Ainda sem plano, só anotado.

## Ferramenta de transcrição de melodia

**Problema**: pra escrever uma partitura nova (carnaval), hoje precisa pegar o sax e ficar tentando achar a nota por tentativa e erro até bater com o que tá ouvindo no áudio.

**Ideia A — Piano de comparação**: teclado virtual na tela do player. Toca o trecho em loop (já dá pra desacelerar com o `speed-btn` que já existe), clica nas teclas até achar a que bate com o áudio, sem precisar do instrumento físico. Simples, sem IA.

**Ideia B — Cantarolar → nota**: em vez de clicar no piano, cantarolar/assobiar o trecho no microfone e o site detecta a frequência e devolve o nome da nota (considerando o tom da música). Mais direto que a A porque não precisa nem do instrumento. Detectar afinação de uma voz sozinha é bem mais fácil que separar melodia de uma faixa mixada — dá pra fazer 100% no navegador, sem servidor.

Tendência: B é mais forte, mas vale validar A primeiro por ser mais simples de construir.

(Descartada por enquanto: suporte offline/PWA — não é uma dor real no uso atual.)
