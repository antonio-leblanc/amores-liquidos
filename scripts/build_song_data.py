import os
import re
import json

# Obtém o diretório do projeto (um nível acima do diretório do script)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- CONFIGURAÇÃO ---
SONG_DATA_INPUT_FILE = os.path.join(PROJECT_ROOT, 'song-data.js')
MARKDOWN_DIR = os.path.join(PROJECT_ROOT, 'markdown')
SONG_DATA_OUTPUT_FILE = os.path.join(PROJECT_ROOT, 'song-data-final.js')

def slug_to_title(slug):
    """Converte um slug_de_musica para um Título De Música."""
    # Adicionado tratamento para 'pc' -> '%'
    title = slug.replace('_', ' ').replace('pc', '%').title()
    return title

def get_instrument_from_filename(filename, song_slug):
    """
    (MODIFICADO) Extrai o nome do instrumento do arquivo, sabendo qual é o slug da música.
    """
    # Remove a extensão .md
    base_name = filename.rsplit('.', 1)[0]
    # Remove o slug da música e o underscore inicial. Ex: "acima_do_sol_sax_alto" -> "sax_alto"
    instrument_slug = base_name.replace(f"{song_slug}_", "", 1)
    
    # Converte o slug do instrumento para um nome legível
    # Ex: "sax_alto" -> "Sax Alto"
    instrument_name = instrument_slug.replace('_', ' ').replace('___', ' / ').title()
    return instrument_name

# --- PASSO 1: LER O ARQUIVO JS ORIGINAL E EXTRAIR A LISTA DE SLUGS ---
print(f"Lendo o arquivo de base: {SONG_DATA_INPUT_FILE}")
try:
    with open(SONG_DATA_INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
except FileNotFoundError:
    print(f"ERRO: Arquivo de entrada '{SONG_DATA_INPUT_FILE}' não encontrado.")
    exit()

match = re.search(r'const\s+songsAlphabetical\s*=\s*\[([^\]]+)\]', content, re.DOTALL)
if not match:
    print(f"ERRO: Array 'songsAlphabetical' não encontrado em '{SONG_DATA_INPUT_FILE}'")
    exit()

song_slugs_text = match.group(1)
song_slugs = sorted([slug.strip().strip("'\"") for slug in song_slugs_text.split(',') if slug.strip()])
print(f"Encontradas {len(song_slugs)} músicas na lista principal.")

# --- PASSO 2: ESCANEAR OS MARKDOWNS UMA VEZ ---
print(f"Escaneando diretório de melodias: {MARKDOWN_DIR}")
markdown_files = []
if os.path.exists(MARKDOWN_DIR):
    markdown_files = [f for f in os.listdir(MARKDOWN_DIR) if f.endswith('.md')]

# --- PASSO 3: (LÓGICA CORRIGIDA) CONSTRUIR A ESTRUTURA DE DADOS ---
print("Construindo a estrutura de dados final...")
final_song_data = []

for slug in song_slugs:
    song_object = {
        'id': slug,
        'title': slug_to_title(slug)
    }
    
    melodies_for_this_song = {}
    
    # Itera sobre os arquivos encontrados e verifica se eles pertencem a este slug
    for filename in markdown_files:
        if filename.startswith(f"{slug}_"):
            instrument_name = get_instrument_from_filename(filename, slug)
            # O caminho no JS final deve ser relativo à raiz do projeto
            file_path = os.path.join('markdown', filename).replace('\\', '/')
            melodies_for_this_song[instrument_name] = file_path
            
    # Se encontrou alguma melodia, adiciona o objeto ao song_object
    if melodies_for_this_song:
        song_object['melodies'] = melodies_for_this_song
    
    final_song_data.append(song_object)

# --- PASSO 4: GERAR O NOVO ARQUIVO JS ---
print(f"Gerando o novo arquivo de dados: {SONG_DATA_OUTPUT_FILE}")
json_string = json.dumps(final_song_data, indent=2, ensure_ascii=False)
output_content = f"const songData = {json_string};\n"

with open(SONG_DATA_OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(output_content)

print("\nProcesso concluído com sucesso!")