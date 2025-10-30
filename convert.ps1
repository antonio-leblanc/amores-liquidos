# Este script automatiza todo o processo de conversão e geração de dados.

# Passo 1: Converte o .docx para .md
Write-Host "Iniciando conversão do Word para Markdown..."
pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"

# Passo 2: Entra no diretório de scripts e executa os scripts Python
Write-Host "Executando scripts Python para processar partituras e gerar dados..."
cd scripts
uv run process.markdown.py
uv run build_song_data.py
cd ..

Write-Host "Processo concluído com sucesso!"