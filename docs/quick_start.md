# 🚀 Quick Start - Amores Líquidos

## Para Nova IA Continuar o Projeto

### **1. Contexto:**
- **Objetivo:** Player de música + visualizador de partituras
- **Fonte:** Songbook no Google Docs (~180 páginas)
- **Conversão:** `pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"`
- **Desafio:** Unificar player + partituras em uma interface

### **2. Estado Atual:**
- `index.html` - Site com player funcional
- `newsite.html` - Protótipo com partituras funcionando
- Scripts Python para processar songbook
- ~55 músicas identificadas

### **3. Comandos:**
```bash
# Converter songbook
pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"

# Processar dados
uv run .\scripts\process.markdown.py
uv run .\scripts\build_song_data.py
```

### **4. Desafios:**
- Algumas músicas têm partituras faltando
- Trompete/tenor às vezes são separados
- Nem todas as músicas têm MP3

### **5. Objetivo:**
Criar interface onde usuário escolhe música e vê partituras disponíveis (2-4 instrumentos por música).

---
**Status:** Protótipos funcionais, integração pendente
