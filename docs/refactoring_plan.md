# Plano de Refatoração e Modernização

Analisei o projeto e identifiquei oportunidades para melhorar a manutenção, reduzir a redundância e preparar o código para expansões futuras.

## Resumo da Análise

### 1. Redundância em Python
Os scripts `sync_amores_from_word.py` e `compile_repertoire_data.py` compartilham a mesma lógica para "slugify" títulos e manipulação de caminhos. Isso pode gerar inconsistências se uma regra precisar mudar.

### 2. JavaScript "Monolítico"
O `script.js` é um único objeto de ~600 linhas. Embora esteja organizado, ele mistura lógica de UI, controle de áudio e manipulação de dados, o que dificulta a escalabilidade.

### 3. Manutenção de CSS
O estilo usa gradientes e cores diretamente. Usar Variáveis CSS tornará o sistema de temas (como a troca para o Carnaval) muito mais robusto e fácil de alterar.

---

## Propostas de Mudanças

### Backend (Python Scripts)

- **Novo [repertoire_utils.py](file:///c:/gitrepos/amores-liquidos/scripts/repertoire_utils.py)**: Mover funções compartilhadas como `slugify`, `normalize_song_title` e constantes de caminhos para este módulo.
- **Ajustar Scripts Existentes**: Fazer o `sync_amores_from_word.py` e `compile_repertoire_data.py` importarem essas funções, removendo as duplicatas locais.

---

### Frontend (JS/CSS)

- **Variáveis CSS no [style.css](file:///c:/gitrepos/amores-liquidos/style.css)**:
    - Introduzir um bloco `:root` com tokens de cor (ex: `--primary-color`, `--bg-carnaval-gradient`).
    - Substituir as cores fixas pelas variáveis.
- **Organização no [script.js](file:///c:/gitrepos/amores-liquidos/script.js)**:
    - Agrupar funções por responsabilidade (UI vs Áudio vs Dados).
    - Extrair seletores hardcoded para um objeto de configuração centralizado.

---

## Plano de Verificação

### Testes Automatizados
- Executar `convert.ps1` para garantir que a refatoração Python não quebrou a geração de dados.
- Verificar o console do navegador para erros de JS.

### Testes Manuais
- Validar se a troca de tema (Carnaval) continua funcionando perfeitamente.
- Garantir que a navegação na playlist e o player de áudio não sofreram regressões.
