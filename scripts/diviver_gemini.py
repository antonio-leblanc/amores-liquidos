import re
import os
from collections import defaultdict

# --- FUNÇÕES DE NORMALIZAÇÃO E SLUGIFY (Versão Final e Correta) ---

def normalize_song_title(raw_title):
    """
    Versão final que limpa o título para agrupamento, mas preserva a informação
    original para a IA.
    """
    title = re.sub(r'^#+\s*|\s*{.*}\s*$', '', raw_title).strip()
    title = title.replace('**', '')
    title = title.lower()
    
    instrument_regex = r'(\s*-\s*|\s*\()[\w\s/]*?(sax|alto|trombone|trompete|tenor)[\w\s/]*?\)?\s*$'
    title = re.sub(instrument_regex, '', title, flags=re.IGNORECASE)
    
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
OUTPUT_DIR = "song_chunks" 
OUTPUT_EXTENSION = ".txt"

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
    print("Erro: Nenhum título de música encontrado no formato '# Título'.")
    exit()

music_content = full_text[match.start():]
instrument_parts = re.split(r'\n(?=#\s)', music_content)
songs_grouped = defaultdict(list)

print("--- Iniciando processo de agrupamento (V6 - Final) ---")
for part in instrument_parts:
    part = part.strip()
    if not part:
        continue
    
    first_line = part.split('\n')[0]
    normalized_name = normalize_song_title(first_line)
    
    if not normalized_name:
        print(f"  [AVISO] Título ignorado: '{first_line}'")
        continue

    print(f"  Agrupando '{first_line}' sob a chave: '{normalized_name}'")
    # Adiciona o bloco de texto MARKDOWN ORIGINAL à lista.
    songs_grouped[normalized_name].append(part)

print(f"\n--- Salvando {len(songs_grouped)} arquivos de música únicos ---")
for normalized_name, parts_list in songs_grouped.items():
    filename = slugify(normalized_name) + OUTPUT_EXTENSION
    output_path = os.path.join(OUTPUT_DIR, filename)
    
    # Junta todas as partes dos diferentes instrumentos, mantendo o Markdown original.
    full_song_content_md = "\n\n---\n\n".join(parts_list)
    
    # Salva o arquivo de texto com o conteúdo Markdown dentro.
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_song_content_md)
        
    print(f"  Salvo '{normalized_name}': {len(parts_list)} partes -> em {output_path}")

print(f"\nProcesso concluído! {len(songs_grouped)} arquivos de entrada para a IA criados em '{OUTPUT_DIR}'.")