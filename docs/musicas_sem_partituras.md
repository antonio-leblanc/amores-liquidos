# Músicas Sem Partituras

> **Status:** 11 músicas sem partituras disponíveis (17% do total)

## 📊 Resumo
- **Total de músicas:** 66
- **Com partituras:** 55 (83%)
- **Sem partituras:** 11 (17%)

## ❌ Músicas Sem Partituras

### 🔍 **Encontradas no Songbook (com nomes diferentes):**

| Música | Status | Problema | Solução |
|--------|--------|----------|---------|
| **Amor De Chocolate** | ❌ | Capitalização | Corrigir "de" → "De" no songbook |
| **Baile Da Gaiola** | ❌ | Capitalização | Corrigir "da" → "Da" no songbook |
| **Festa** | ❓ | Verificar | Deve funcionar - investigar |
| **Tu Ta Na Gaiola** | ❌ | Acentuação | Corrigir "tá" → "Ta" no songbook |
| **Vai Novinha** | ❓ | Verificar | Deve funcionar - investigar |

### 🚫 **Não Encontradas no Songbook:**

| Música | Status | Ação Necessária |
|--------|--------|-----------------|
| **Bailão** | ❌ | Adicionar ao songbook ou remover da lista |
| **I Miss Her** | ❌ | Adicionar ao songbook ou remover da lista |
| **Maria Maria** | ❌ | Adicionar ao songbook ou remover da lista |
| **Sinais De Fogo** | ❌ | Adicionar ao songbook ou remover da lista |
| **Tieta** | ❌ | Adicionar ao songbook ou remover da lista |
| **Você Me Vira A Cabeça** | ❌ | Adicionar ao songbook ou remover da lista |

## 🛠️ Ações Recomendadas

### **Prioridade Alta:**
1. **Corrigir incompatibilidades** de capitalização e acentuação
2. **Investigar** por que "Festa" e "Vai Novinha" não funcionam
3. **Regenerar dados** após correções

### **Prioridade Média:**
4. **Decidir** sobre as 6 músicas não encontradas:
   - Adicionar partituras ao songbook
   - Ou remover da lista de músicas

## 🔄 Processo de Correção

```bash
# 1. Corrigir songbook.docx
# 2. Converter para markdown
pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"

# 3. Processar partituras
uv run .\scripts\process.markdown.py

# 4. Gerar dados finais
uv run .\scripts\build_song_data.py
```

## 📝 Notas

- **Última atualização:** $(date)
- **Scripts utilizados:** `process.markdown.py` + `build_song_data.py`
- **Fonte:** `raw_songbook/songbook.docx`
- **Dados:** `song-data-final.js`

---

*Este documento é gerado automaticamente baseado na análise do songbook e dados finais.*
