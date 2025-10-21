# Projeto Amores Líquidos - Documentação Completa

## 📋 Visão Geral
Player de música e visualizador de partituras para o bloco de carnaval "Amores Líquidos". Sistema híbrido que combina player de áudio com renderização de partituras em Markdown.

## 🏗️ Arquitetura Atual

### **Sistema de Dados:**
- **Songbook original:** `raw_songbook/songbook.md` (180 páginas)
- **Scripts Python:** `scripts/` (processamento automatizado)
- **Dados finais:** `song-data-final.js` (JSON com todas as músicas)
- **Partituras:** `markdown/` (arquivos .md por instrumento)

### **Fluxo de Processamento:**
1. `process.markdown.py` → Converte songbook em arquivos Markdown individuais
2. `build_song_data.py` → Gera JSON com mapeamento de melodias
3. Frontend → Carrega JSON e renderiza partituras dinamicamente

## 📁 Estrutura de Arquivos

```
amores-liquidos/
├── index.html              # Site antigo (JSONs complexos)
├── newsite.html            # Protótipo novo (Markdown)
├── prototipo.js            # Lógica do protótipo
├── song-data-final.js      # JSON gerado automaticamente
├── scripts/
│   ├── process.markdown.py # Converte songbook → Markdown
│   └── build_song_data.py  # Gera JSON final
├── markdown/               # Partituras por instrumento
│   ├── musica_instrumento.md
│   └── ...
├── music/                  # Arquivos MP3
├── melodies/               # JSONs antigos (legado)
└── docs/                   # Documentação
```

## 🎵 Dados das Músicas

### **Estatísticas:**
- **55 músicas** extraídas do songbook
- **3 instrumentos:** Sax Alto, Trombone, Trompete/Sax Tenor
- **~160 arquivos** Markdown gerados
- **68 músicas** na lista principal (algumas sem MP3)

### **Estrutura JSON:**
```json
{
  "id": "nome_da_musica",
  "title": "Nome Da Musica",
  "melodies": {
    "Sax Alto": "markdown/musica_sax_alto.md",
    "Trombone": "markdown/musica_trombone.md",
    "Trompete   Sax Tenor": "markdown/musica_trompete___sax_tenor.md"
  }
}
```

## 🛠️ Scripts Python

### **process.markdown.py:**
- **Função:** Converte songbook em arquivos Markdown individuais
- **Comando:** `uv run .\scripts\process.markdown.py`
- **Output:** 160 arquivos em `markdown/`
- **Status:** ✅ Funcionando perfeitamente

### **build_song_data.py:**
- **Função:** Gera JSON com mapeamento de melodias
- **Comando:** `uv run .\scripts\build_song_data.py`
- **Output:** `song-data-final.js`
- **Status:** ✅ Funcionando perfeitamente

## 🎨 Frontend

### **Sistema Atual (newsite.html):**
- **Player:** ❌ Não implementado
- **Partituras:** ✅ Funcionando (Markdown)
- **Interface:** ✅ Básica mas funcional
- **Dados:** ✅ Integrado com JSON gerado

### **Sistema Antigo (index.html):**
- **Player:** ✅ Completo com controles
- **Partituras:** ❌ JSONs complexos (legado)
- **Interface:** ✅ Profissional
- **Dados:** ❌ Sistema rígido

## 🚀 Próximos Passos (Plano de Integração)

### **FASE 1: Adicionar Player (30-45 min)**
- Copiar controles de áudio do `index.html`
- Integrar com `song-data-final.js`
- Manter funcionalidade de partituras

### **FASE 2: Melhorar Interface (20-30 min)**
- Aplicar estilos do `style.css`
- Layout de duas colunas (player + partitura)
- Responsividade

### **FASE 3: Funcionalidades Extras (15-20 min)**
- Playlists (opcional)
- Busca (opcional)
- Controles avançados

## 🔧 Comandos Úteis

```bash
# Processar songbook
uv run .\scripts\process.markdown.py

# Gerar JSON final
uv run .\scripts\build_song_data.py

# Verificar arquivos gerados
Get-ChildItem markdown\*.md | Measure-Object
```

## 📊 Status do Projeto

### **✅ Concluído:**
- Extração de músicas do songbook
- Geração de arquivos Markdown
- Sistema de mapeamento JSON
- Protótipo funcional de partituras

### **🔄 Em Andamento:**
- Integração player + partituras
- Melhoria da interface

### **📋 Pendente:**
- Sistema completo unificado
- Testes finais
- Deploy/produção

## 🎯 Objetivos Finais

1. **Sistema unificado** com player + partituras
2. **Interface moderna** e responsiva
3. **Dados flexíveis** (Markdown)
4. **Fácil manutenção** e expansão

## 💡 Decisões Técnicas

### **Por que Markdown > JSON:**
- ✅ Mais fácil de editar
- ✅ Estrutura flexível
- ✅ Versionamento Git
- ✅ Músicos podem editar diretamente

### **Por que Integrar no Protótipo:**
- ✅ Menos trabalho
- ✅ Sistema mais limpo
- ✅ Arquitetura melhor
- ✅ Futuro-proof

## 🆘 Troubleshooting

### **Problemas Conhecidos:**
- Algumas músicas podem ter instrumentos faltando
- Duplicações foram resolvidas
- Mapeamento de instrumentos corrigido

### **Soluções:**
- Rodar scripts novamente se necessário
- Verificar logs de processamento
- Validar arquivos Markdown gerados

---

**Última atualização:** $(Get-Date)
**Status:** Sistema funcional, integração em andamento
