# Este script automatiza todo o processo de conversao e geracao de dados.

Write-Host "`n>> Iniciando processo de automacao..."

# Passo 1: Encontrar o arquivo .docx mais recente e converte com pandoc para markdown
$docxFile = Get-ChildItem "raw_songbook/*.docx" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($docxFile) {
    Write-Host "  - Arquivo mais recente encontrado: $($docxFile.Name)"
    Write-Host "  - Iniciando conversao do Word para Markdown..."
    pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/$($docxFile.Name)"
} else {
    Write-Error "  [ERROR] Nenhum arquivo .docx encontrado em raw_songbook/"
    exit 1
}

# Passo 2: Entra no diretorio de scripts e executa os scripts Python
Write-Host "`n>> Executando scripts Python (processamento e dados)..."
cd scripts
uv run sync_amores_from_word.py
uv run compile_repertoire_data.py
cd ..

Write-Host "`n** Processo concluido com sucesso! **`n"