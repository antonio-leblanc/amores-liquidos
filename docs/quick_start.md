# 🚀 Quick Start - Amores Líquidos

## Para Nova IA Continuar o Projeto

### **1. Contexto Rápido:**
- Projeto: Player de música + visualizador de partituras
- Status: Sistema Markdown funcionando, precisa integrar player
- Próximo passo: Adicionar controles de áudio ao `newsite.html`

### **2. Arquivos Principais:**
- `newsite.html` - Protótipo atual (partituras funcionando)
- `prototipo.js` - Lógica do protótipo
- `song-data-final.js` - Dados gerados automaticamente
- `index.html` + `script.js` - Site antigo (copiar player de lá)

### **3. Comandos Essenciais:**
```bash
# Regenerar dados (se necessário)
uv run .\scripts\process.markdown.py
uv run .\scripts\build_song_data.py
```

### **4. Plano de Integração:**
1. **Copiar player** do `index.html` para `newsite.html`
2. **Integrar controles** com `song-data-final.js`
3. **Aplicar estilos** do `style.css`
4. **Testar** funcionalidade completa

### **5. Estrutura de Dados:**
```json
{
  "id": "nome_musica",
  "title": "Nome Musica", 
  "melodies": {
    "Sax Alto": "markdown/musica_sax_alto.md",
    "Trombone": "markdown/musica_trombone.md",
    "Trompete   Sax Tenor": "markdown/musica_trompete___sax_tenor.md"
  }
}
```

### **6. Status Atual:**
- ✅ 55 músicas extraídas
- ✅ 160 arquivos Markdown
- ✅ JSON gerado automaticamente
- ✅ Partituras renderizando
- ❌ Player de música (próximo passo)

### **7. Objetivo:**
Criar sistema unificado com player + partituras em Markdown, substituindo o sistema JSON complexo atual.

---
**Tempo estimado:** 1h30 para integração completa
**Prioridade:** Fase 1 - Adicionar player básico
