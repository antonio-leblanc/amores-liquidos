# Projeto Amores Líquidos - Documentação

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

## 📊 Status Atual

### **✅ Funcionando:**
- Extração de músicas do songbook
- Visualização de partituras
- Player de música básico

### **🔄 Em Desenvolvimento:**
- Integração completa
- Interface unificada

### **❓ Questões em Aberto:**
- Melhor abordagem para unificar player + partituras
- Como lidar com partituras faltando
- Interface ideal para músicos

---

**Última atualização:** $(Get-Date)
**Status:** Protótipos funcionais, integração pendente
