import re
import os
from collections import defaultdict

# --- FUNÇÕES DE NORMALIZAÇÃO (VERSÃO 4 - FINAL) ---

def normalize_song_title_v4(raw_title):
    """
    Versão final e robusta que lida com todas as variações encontradas.
    """
    title = re.sub(r'^#+\s*|\s*{.*}\s*$', '', raw_title).strip()
    title = title.replace('**', '')
    title = title.lower()
    
    instrument_regex = r'(\s*-\s*|\s*\()[\w\s/]*?(sax|alto|trombone|trompete|tenor)[\w\s/]*?\)?\s*$'
    title = re.sub(instrument_regex, '', title, flags=re.IGNORECASE)
    
    # CORREÇÃO CRÍTICA: Remove hífens, espaços E a barra invertida que sobrava.
    return title.strip(' -\\')

def slugify(text):
    """
    Converte um texto em um nome de arquivo seguro.
    """
    text = text.lower()
    text = re.sub(r'[áàâã]', 'a', text)
    text = re.sub(r'[éê]', 'e', text)
    text = re.sub(r'[í]', 'i', text)
    text = re.sub(r'[óôõ]', 'o', text)
    text = re.sub(r'[úü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = text.replace('%', 'pc')
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '_', text).strip('_')
    return text

# --- CONFIGURAÇÃO ---
INPUT_FILE = "raw_songbook/songbook.md"
OUTPUT_DIR = "song_chunks_grouped"
OUTPUT_EXTENSION = ".txt" # MUDANÇA ESTRATÉGICA PARA .TXT

# --- LÓGICA PRINCIPAL ---

if os.path.exists(OUTPUT_DIR):
    for filename in os.listdir(OUTPUT_DIR):
        os.remove(os.path.join(OUTPUT_DIR, filename))
else:
    os.makedirs(OUTPUT_DIR)

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    full_text = f.read()

match = re.search(r'^#\s.*', full_text, re.MULTILINE)
if not match:
    print("Erro: Nenhum título de música encontrado.")
    exit()

music_content = full_text[match.start():]
instrument_parts = re.split(r'\n(?=#\s)', music_content)
songs_grouped = defaultdict(list)

print("--- Iniciando processo de normalização e agrupamento (V4) ---")
for part in instrument_parts:
    part = part.strip()
    if not part:
        continue
    
    first_line = part.split('\n')[0]
    normalized_name = normalize_song_title_v4(first_line)
    
    if not normalized_name:
        print(f"  [AVISO] Título ignorado: '{first_line}'")
        continue
    
    print(f"  '{first_line}'  ==>  Normalizado para: '{normalized_name}'")
    songs_grouped[normalized_name].append(part)

print(f"\n--- Salvando {len(songs_grouped)} arquivos de música únicos ---")
for normalized_name, parts_list in songs_grouped.items():
    filename = slugify(normalized_name) + OUTPUT_EXTENSION
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    full_song_content = "\n\n---\n\n".join(parts_list)
    
    # MECANISMO DE SEGURANÇA: Usa 'a' (append) para evitar sobrescritas acidentais
    with open(output_path, 'a', encoding='utf-8') as f:
        # Se o arquivo já existe (por causa de um bug de normalização),
        # adiciona um separador extra para maior clareza.
        if f.tell() > 0:
            f.write("\n\n==== APPEND DE EMERGÊNCIA ====\n\n")
        f.write(full_song_content)
        
    print(f"  Agrupado '{normalized_name}': {len(parts_list)} partes -> Salvo em {output_path}")

print(f"\nProcesso concluído! {len(songs_grouped)} arquivos de música criados em '{OUTPUT_DIR}'.")