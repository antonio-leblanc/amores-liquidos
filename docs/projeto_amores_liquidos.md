# Projeto Amores Líquidos - Documentação

## ⚠️ **IMPORTANTE - Sempre Verifique os Arquivos**
**Esta documentação pode estar desatualizada. Sempre verifique os arquivos reais do projeto para confirmar o estado atual. Não confie 100% na documentação - ela serve como guia, mas os arquivos são a fonte da verdade.**

## 📋 Visão Geral
Player de música e visualizador de partituras para o bloco de carnaval "Amores Líquidos".

## 🎯 Objetivo
Criar um player onde:
- Usuário escolhe uma música
- Aparecem as partituras disponíveis para essa música
- Geralmente são 3 instrumentos (Sax Alto, Trombone, Trompete/Sax Tenor)
- Podem variar de 2 a 4 partituras (quando trompete e tenor são separados)

## 📚 Fonte da Verdade
- **Songbook original:** Documento no Google Docs
- **Conteúdo:** ~180 páginas com partituras organizadas por música e instrumento
- **Conversão:** `pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"`
- **Formato final:** Markdown estruturado com títulos e seções

## 📁 Estado Atual do Projeto

### **Arquivos Principais:**
- `raw_songbook/songbook.md` - Songbook convertido do Google Docs
- `music/` - Arquivos MP3 das músicas
- `scripts/` - Scripts Python para processamento
- `index.html` - Site atual (funcional mas com limitações)
- `newsite.html` - Protótipo em desenvolvimento

### **Dados Processados:**
- **~55 músicas** identificadas no songbook
- **Partituras por instrumento** extraídas
- **Sistema de mapeamento** entre músicas e partituras

### **Desafios Identificados:**
- Algumas músicas têm partituras faltando (principalmente trombone)
- Trompete e tenor às vezes são partituras separadas
- Nem todas as músicas do songbook têm arquivo MP3 correspondente

## 🛠️ Ferramentas Disponíveis

### **Scripts Python:**
- Scripts para processar o songbook e extrair partituras
- Comando: `uv run .\scripts\process.markdown.py`
- Comando: `uv run .\scripts\build_song_data.py`

### **Sites Existentes:**
- `index.html` - Site atual com player funcional
- `newsite.html` - Protótipo com visualização de partituras

## 🎨 Estado dos Frontends

### **Site Atual (index.html):**
- ✅ Player de música completo
- ✅ Controles de reprodução
- ✅ Playlists e busca
- ❌ Sistema de partituras limitado

### **Protótipo (newsite.html):**
- ✅ Visualização de partituras
- ✅ Seleção dinâmica de instrumentos
- ❌ Sem player de música
- ❌ Interface básica

## 🎯 Objetivos Pendentes

1. **Unificar funcionalidades** - Combinar player + partituras
2. **Melhorar interface** - Design mais profissional
3. **Resolver inconsistências** - Partituras faltando
4. **Otimizar experiência** - Fluxo intuitivo para músicos

## 🔧 Comandos Úteis

```bash
# Converter songbook do Google Docs para Markdown
pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"

# Processar songbook
uv run .\scripts\process.markdown.py

# Gerar dados finais
uv run .\scripts\build_song_data.py
```

## 🔍 Como Verificar o Estado Real do Projeto

**Para confirmar o estado atual, sempre verifique:**

1. **Arquivos principais:**
   - `index.html` - Interface principal
   - `script.js` - Funcionalidades
   - `song-data-final.js` - Dados de músicas e partituras

2. **Contar arquivos reais:**
   ```bash
   # Contar músicas MP3
   ls music/*.mp3 | wc -l
   
   # Contar partituras markdown
   ls markdown/*.md | wc -l
   ```

3. **Verificar funcionalidades:**
   - Abrir `index.html` no navegador
   - Testar player, playlists, busca
   - Verificar se partituras carregam
   - Testar seleção de instrumentos

4. **Verificar dados:**
   - Abrir `song-data-final.js` e contar músicas
   - Verificar se músicas têm propriedade `melodies`
   - Confirmar nomes dos instrumentos

## 📊 Status Atual

### **✅ FUNCIONANDO COMPLETAMENTE:**
- ✅ **Player de música integrado** com todas as funcionalidades
- ✅ **Sistema de partituras markdown** funcionando perfeitamente
- ✅ **Interface unificada** - player + partituras em uma só tela
- ✅ **Playlists funcionais** (Ordem Alfabética, Novas 2026, GIG)
- ✅ **Busca de músicas** em tempo real
- ✅ **Seleção de instrumentos** dinâmica (2-4 instrumentos por música)
- ✅ **Estado do instrumento salvo** no localStorage
- ✅ **55 músicas processadas** com partituras extraídas
- ✅ **Scripts de processamento** corrigidos e funcionais

### **🎯 FUNCIONALIDADES IMPLEMENTADAS:**
- **Player completo:** Play, pause, next, prev, random, barra de progresso
- **Partituras markdown:** Renderização com biblioteca `marked`
- **Múltiplos instrumentos:** Suporte para 2-4 instrumentos por música
- **Persistência:** Estado do instrumento salvo entre sessões
- **Responsivo:** Layout de duas colunas (player + partituras)

### **🔧 CORREÇÕES REALIZADAS:**
- **Script `process.markdown.py`** corrigido para separar trompete e tenor
- **Sistema de dados unificado** usando `song-data-final.js`
- **Mapeamento correto** entre playlists e partituras
- **4 instrumentos funcionando** para músicas como "Meu Sangue Ferve por Você"

### **📈 ESTATÍSTICAS:**
- **55 músicas** identificadas no songbook
- **164 arquivos markdown** de partituras gerados
- **4 músicas** com 4 instrumentos (trompete e tenor separados)
- **Sistema 100% funcional** e pronto para uso

---

**Última atualização:** 20/10/2025
**Status:** ✅ PROJETO COMPLETO E FUNCIONAL
