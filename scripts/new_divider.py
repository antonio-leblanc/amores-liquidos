import re
import os
from collections import defaultdict

# --- FUNÇÕES DE NORMALIZAÇÃO E EXTRAÇÃO (Versão Refatorada) ---

def normalize_song_title(raw_title):
    """
    Limpa o título para criar uma "chave de agrupamento" (o nome da música sem o instrumento).
    (Esta função sua já estava perfeita, mantida como está).
    """
    title = re.sub(r'^#+\s*|\s*{.*}\s*$', '', raw_title).strip()
    title = title.replace('**', '')
    title = title.lower()
    
    instrument_regex = r'(\s*-\s*|\s*\()[\w\s/]*?(sax|alto|trombone|trompete|tenor)[\w\s/]*?\)?\s*$'
    title = re.sub(instrument_regex, '', title, flags=re.IGNORECASE)
    
    return title.strip(' -\\')

def extract_instrument_name(raw_title):
    """
    NOVA FUNÇÃO: Extrai o nome do instrumento do título bruto.
    """
    # Regex aprimorado para capturar o conteúdo dentro dos parênteses ou após o hífen
    match = re.search(r'(\s*-\s*|\s*\()([\w\s/]+(sax|alto|trombone|trompete|tenor)[\w\s/]*)', raw_title, flags=re.IGNORECASE)
    if match:
        # Pega o segundo grupo capturado, que é o nome completo do instrumento
        instrument = match.group(2).strip()
        return instrument
    return "geral" # Fallback caso não encontre um instrumento específico

def slugify(text):
    """
    Converte um texto em um nome de arquivo seguro.
    (Sua função original, perfeita).
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
OUTPUT_DIR = "markdown"  # MODIFICADO: Diretório de saída para o protótipo
OUTPUT_EXTENSION = ".md" # MODIFICADO: Extensão final desejada

# --- LÓGICA PRINCIPAL (Com Loop de Salvamento Ajustado) ---

if os.path.exists(OUTPUT_DIR):
    for filename in os.listdir(OUTPUT_DIR):
        os.remove(os.path.join(OUTPUT_DIR, filename))
else:
    os.makedirs(OUTPUT_DIR)

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    full_text = f.read()

# A sua lógica de splitting e agrupamento está excelente, mantida 100%
match = re.search(r'^#\s.*', full_text, re.MULTILINE)
if not match:
    print("Erro: Nenhum título de música encontrado no formato '# Título'.")
    exit()

music_content = full_text[match.start():]
instrument_parts = re.split(r'\n(?=#\s)', music_content)
songs_grouped = defaultdict(list)

print("--- Iniciando processo de agrupamento ---")
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
    songs_grouped[normalized_name].append(part)

# --- LOOP DE SALVAMENTO MODIFICADO ---
print(f"\n--- Salvando arquivos de música por instrumento ---")
file_count = 0
for normalized_name, parts_list in songs_grouped.items():
    song_slug = slugify(normalized_name)
    
    # Itera em cada parte de instrumento (Trombone, Sax Alto, etc.)
    for part_content in parts_list:
        first_line = part_content.split('\n')[0]
        instrument = extract_instrument_name(first_line)
        instrument_slug = slugify(instrument)
        
        # Cria o nome de arquivo final e específico
        filename = f"{song_slug}_{instrument_slug}{OUTPUT_EXTENSION}"
        output_path = os.path.join(OUTPUT_DIR, filename)
        
        # Salva o conteúdo markdown daquele instrumento específico
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(part_content)
            
        print(f"  Salvo -> {output_path}")
        file_count += 1

print(f"\nProcesso concluído! {file_count} arquivos de instrumento criados em '{OUTPUT_DIR}'.")