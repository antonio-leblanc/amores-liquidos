import os
import re
import json

# --- CONFIGURAÇÃO ---
SONG_DATA_INPUT_FILE = 'song-data.js'
MARKDOWN_DIR = 'markdown'
SONG_DATA_OUTPUT_FILE = 'song-data-final.js' # O novo arquivo que o index.html vai usar

def slug_to_title(slug):
    """Converte um slug_de_musica para um Título De Música."""
    return slug.replace('_', ' ').title()

def get_instrument_from_filename(filename):
    """Extrai o nome do instrumento do nome do arquivo."""
    # Ex: 'depois_do_prazer_sax_alto.md' -> 'sax_alto' -> 'Sax Alto'
    base_name = filename.rsplit('.', 1)[0]
    instrument_slug = base_name.rsplit('_', 1)[-1]
    return instrument_slug.replace('_', ' ').replace('/', ' / ').title()

# --- PASSO 1 & 2: LER O ARQUIVO JS ORIGINAL E EXTRAIR A LISTA ---
print(f"Lendo o arquivo de base: {SONG_DATA_INPUT_FILE}")
with open(SONG_DATA_INPUT_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Regex para encontrar o array 'songsAlphabetical' e capturar seu conteúdo
match = re.search(r'const\s+songsAlphabetical\s*=\s*\[([^\]]+)\]', content, re.DOTALL)

if not match:
    print("ERRO: Array 'songsAlphabetical' não encontrado em song-data.js")
    exit()

# Limpa e cria a lista de slugs
song_slugs_text = match.group(1)
song_slugs = [slug.strip().strip("'\"") for slug in song_slugs_text.split(',') if slug.strip()]
print(f"Encontradas {len(song_slugs)} músicas na lista principal.")


# --- PASSO 3: ESCANEAR OS MARKDOWNS E MONTAR O MAPA DE MELODIAS ---
print(f"Escaneando diretório de melodias: {MARKDOWN_DIR}")
melodies_map = {}
if os.path.exists(MARKDOWN_DIR):
    for filename in os.listdir(MARKDOWN_DIR):
        if filename.endswith('.md'):
            song_slug = filename.rsplit('_', 1)[0]
            instrument_name = get_instrument_from_filename(filename)
            
            if song_slug not in melodies_map:
                melodies_map[song_slug] = {}
            
            melodies_map[song_slug][instrument_name] = os.path.join(MARKDOWN_DIR, filename).replace('\\', '/')

# --- PASSO 4: CONSTRUIR A ESTRUTURA DE DADOS FINAL ---
print("Construindo a estrutura de dados final...")
final_song_data = []
for slug in sorted(song_slugs): # Ordena para garantir consistência
    song_object = {
        'id': slug,
        'title': slug_to_title(slug)
    }
    
    # Se encontrarmos melodias para este slug, adicionamos
    if slug in melodies_map:
        song_object['melodies'] = melodies_map[slug]
    
    final_song_data.append(song_object)

# --- PASSO 5: GERAR O NOVO ARQUIVO JS ---
print(f"Gerando o novo arquivo de dados: {SONG_DATA_OUTPUT_FILE}")
# Converte a lista python para uma string JSON bem formatada
json_string = json.dumps(final_song_data, indent=2, ensure_ascii=False)

# Adiciona o prefixo para ser um arquivo JS válido
output_content = f"const songData = {json_string};\n"

with open(SONG_DATA_OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(output_content)

print("\nProcesso concluído com sucesso!")