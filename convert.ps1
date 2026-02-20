# Este script automatiza todo o processo de conversao e geraçao de dados.

# Passo 1: Encontrar o arquivo .docx mais recente e converte com pandoc para markdown
$docxFile = Get-ChildItem "raw_songbook/*.docx" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

if ($docxFile) {
    Write-Host "Arquivo mais recente encontrado: $($docxFile.Name)"
    Write-Host "Iniciando conversao do Word para Markdown..."
    pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/$($docxFile.Name)"
} else {
    Write-Error "Nenhum arquivo .docx encontrado em raw_songbook/"
    exit 1
}

# Passo 2: Entra no diretório de scripts e executa os scripts Python
Write-Host "Executando scripts Python para processar partituras e gerar dados..."
cd scripts
uv run process.markdown.py
uv run build_song_data_2.py
cd ..

Write-Host "Processo concluído com sucesso!"