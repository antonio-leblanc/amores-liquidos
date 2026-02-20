import shutil
import re
import os
from collections import defaultdict
from utils import slugify, normalize_song_title

def extract_instrument_name(raw_title):
    """
    Extrai o nome do instrumento do título bruto.
    """
    # Padroniza o título para facilitar a busca
    clean_title = raw_title.replace('**', '').lower()
    
    # Tentativa de padronizar os nomes para a saída
    if 'alto' in clean_title:
        return 'Sax Alto'
    if 'trombone' in clean_title:
        return 'Trombone'
    
    # Se tem trompete E tenor no mesmo título (ex: "Trompete/Tenor"), agrupa
    if 'trompete' in clean_title and 'tenor' in clean_title:
        return 'Trompete / Tenor'
    
    # Se tem só trompete, separa
    if 'trompete' in clean_title:
        return 'Trompete'
    
    # Se tem só tenor, separa
    if 'tenor' in clean_title:
        return 'Sax Tenor'
        
    return "geral"

# Obtém o diretório do projeto (um nível acima do diretório do script)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- CONFIGURAÇÃO ---
INPUT_FILE = os.path.join(PROJECT_ROOT, "raw_songbook/songbook.md")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "arranjos/amores")

# --- LÓGICA PRINCIPAL ---

# 1. Preparar diretório de saída
if os.path.exists(OUTPUT_DIR):
    shutil.rmtree(OUTPUT_DIR) # Recursively remove the directory and its contents
os.makedirs(OUTPUT_DIR) # Create the directory (now it's guaranteed to be empty or new)

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    full_text = f.read()

# 2. Dividir o songbook em partes por instrumento (Lógica original)
match = re.search(r'^#\s.*', full_text, re.MULTILINE)
if not match:
    print("Erro: Nenhum título de música encontrado no formato '# Título'.")
    exit()

music_content = full_text[match.start():]
instrument_parts = re.split(r'\n(?=#\s)', music_content)
songs_grouped = defaultdict(list)

# 3. Loop de Agrupamento
print("--- Iniciando processo de agrupamento ---")
for part in instrument_parts:
    part = part.strip()
    if not part or part == '#':
        continue
    
    first_line = part.split('\n')[0]
    normalized_name = normalize_song_title(first_line)
    
    if not normalized_name:
        print(f"  [AVISO] Título ignorado: '{first_line}'")
        continue

    songs_grouped[normalized_name].append(part)

# --- (NOVO) ETAPA DE LOG: VERIFICAÇÃO DO AGRUPAMENTO ---
print(f"\n--- Verificação do Agrupamento ({len(songs_grouped)} músicas encontradas) ---")
for normalized_name, parts_list in sorted(songs_grouped.items()): # sorted() para ordem alfabética
    print(f"  - Música: '{normalized_name}' -> Encontrado(s) {len(parts_list)} instrumento(s).")
# --- FIM DA NOVA ETAPA ---

# 4. Loop de Salvamento
print(f"\n--- Salvando arquivos de música por instrumento ---")
file_count = 0
for normalized_name, parts_list in songs_grouped.items():
    song_slug = slugify(normalized_name)
    
    for part_content in parts_list:
        first_line = part_content.split('\n')[0]
        instrument = extract_instrument_name(first_line)
        
        if instrument == "geral":
            print(f"  [AVISO] Não foi possível identificar o instrumento para '{first_line}'. Pulando.")
            continue
            
        instrument_slug = slugify(instrument)
        
        # --- MUDANÇA: Criar pasta da música ---
        song_dir = os.path.join(OUTPUT_DIR, song_slug)
        if not os.path.exists(song_dir):
            os.makedirs(song_dir)
            
        # Nome do arquivo agora é apenas o instrumento (ex: sax_alto.md) dentro da pasta da música
        filename = f"{instrument_slug}.md"
        output_path = os.path.join(song_dir, filename)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(part_content)
            
        print(f"  Salvo -> {output_path}")
        file_count += 1

print(f"\nProcesso concluído! {file_count} arquivos criados em '{OUTPUT_DIR}'.")