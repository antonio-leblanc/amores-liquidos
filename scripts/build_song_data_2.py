import os
import re
import json
import yaml

# Obtém o diretório do projeto
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- CONFIGURAÇÃO ---
PLAYLISTS_DIR = os.path.join(PROJECT_ROOT, 'arranjos', 'playlists')
OUTPUT_FILE = os.path.join(PROJECT_ROOT, 'song-data-final.js')
ARRANGEMENT_DIRS = {
    'amores': os.path.join(PROJECT_ROOT, 'arranjos', 'amores'),
    'carnaval': os.path.join(PROJECT_ROOT, 'arranjos', 'carnaval')
}

# Mapping specific filenames to instrument names if standard conversion fails or needs override
INSTRUMENT_MAPPING = {
    'sax_alto': '🎷 Sax Alto',
    'sax_tenor': '🎷 Sax Tenor',
    'trombone': '📯 Trombone',
    'trompete': '🎺 Trompete',
    'trompete___tenor': '🎺 Trompete / Tenor',
    'base': '🎹 Base',
    'bateria': '🥁 Bateria',
}

def slug_to_title(slug):
    """Converte um slug_de_musica para um Título De Música."""
    title = slug.replace('_', ' ').replace('pc', '%').title()
    return title

def format_instrument_name(filename_slug):
    """Formata o nome do instrumento a partir do slug do arquivo."""
    # Check explicit mapping first
    if filename_slug in INSTRUMENT_MAPPING:
        return INSTRUMENT_MAPPING[filename_slug]

    # Generic formatting fallback
    name = filename_slug.replace('___', ' / ').replace('_', ' ').title()
    
    if 'Sax' in name:
        return f"🎷 {name}"
    elif 'Trombone' in name:
        return f"📯 {name}"
    elif 'Trompete' in name:
        return f"🎺 {name}"
    elif 'Bateria' in name or 'Drums' in name:
        return f"🥁 {name}"
    
    return name

# --- LÓGICA PRINCIPAL ---

print("--- Iniciando build dos dados de músicas (YAML) ---")

# 1. Carregar dados
all_songs_data = {} # slug -> { source: 'amores'|'carnaval', ... }
playlists_definitions = {}
medleys_definitions = {}

songs_by_source = {
    'amores': [],
    'carnaval': []
}

yaml_files = [f for f in os.listdir(PLAYLISTS_DIR) if f.endswith('.yml') or f.endswith('.yaml')]

for yf in yaml_files:
    path = os.path.join(PLAYLISTS_DIR, yf)
    print(f"Lendo playlist: {yf}")
    with open(path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
        
        # Identificar origem (amores vs carnaval) baseado no nome do arquivo
        source_key = os.path.splitext(yf)[0].lower()
        
        # Load Songs
        songs = data.get('Songs', [])
        if songs:
            for s in songs:
                # Ensure we track the source for finding files later
                if s not in all_songs_data:
                    all_songs_data[s] = {'source': source_key}
                    songs_by_source[source_key].append(s)
                else:
                    # If song exists in both (unlikely but possible), prefer existing or merge?
                    # For now, first come first served for source location unless overriden
                    pass
                
        # Load Playlists
        pl = data.get('Playlists', {})
        if pl:
            playlists_definitions.update(pl)
            
        # Load Medleys
        md = data.get('Medleys', {})
        if md:
            medleys_definitions.update(md)

# Sort source lists
for k in songs_by_source:
    songs_by_source[k] = sorted(list(set(songs_by_source[k])))

# 2. Construir objetos de música com caminhos de arquivo
print("Construindo objetos de música...")
final_song_objects = []

all_slugs = sorted(list(all_songs_data.keys()))

for slug in all_slugs:
    song_info = all_songs_data[slug]
    source = song_info['source']
    
    song_obj = {
        'id': slug,
        'title': slug_to_title(slug)
    }
    
    melodies = {}
    
    if source in ARRANGEMENT_DIRS:
        base_dir = ARRANGEMENT_DIRS[source]
        song_dir = os.path.join(base_dir, slug)
        
        if os.path.exists(song_dir) and os.path.isdir(song_dir):
            for filename in os.listdir(song_dir):
                if filename.endswith('.md'):
                    # Padrão esperado: instrumento.md ou slug_instrumento.md?
                    # O script anterior assumia que o nome do arquivo ERA o instrumento
                    # Ex: sax_alto.md -> instrumento "Sax Alto"
                    
                    file_slug = filename.replace('.md', '')
                    # Se o arquivo começar com o nome da música, remove (redundância)
                    if file_slug.startswith(f"{slug}_"):
                        file_slug = file_slug.replace(f"{slug}_", "")
                        
                    instrument_name = format_instrument_name(file_slug)
                    
                    # Caminho relativo para o frontend (sempre usar / web-style)
                    rel_path = os.path.join('arranjos', source, slug, filename).replace('\\', '/')
                    melodies[instrument_name] = rel_path
                    
    if melodies:
        song_obj['melodies'] = melodies
        
    final_song_objects.append(song_obj)

# 3. Construir Playlists Finais
print("Organizando playlists...")

final_playlists = {}

# a) Playlists Padrão (Manuais do YAML)
final_playlists.update(playlists_definitions)

# b) Playlists Automáticas "System"
# Todas as músicas (Combinadas)
final_playlists["♾️ Todas as Músicas"] = all_slugs

# Carnaval (Todas do Carnaval)
if songs_by_source['carnaval']:
    final_playlists["🎭 Carnaval"] = songs_by_source['carnaval']

# Amores (Ordem Alfabética)
if songs_by_source['amores']:
    final_playlists["� Repertorio Amores"] = songs_by_source['amores']

# 4. Gerar JS output
print(f"Gerando {OUTPUT_FILE}")

js_content = ""
js_content += f"const songData = {json.dumps(final_song_objects, indent=2, ensure_ascii=False)};\n\n"
js_content += f"const playlists = {json.dumps(final_playlists, indent=2, ensure_ascii=False)};\n\n"
js_content += f"const medleys = {json.dumps(medleys_definitions, indent=2, ensure_ascii=False)};\n\n"

# Variáveis legadas/auxiliares para garantir compatibilidade com script.js atual
js_content += f"// Variáveis auxiliares para compatibilidade\n"
js_content += f"const songsAlphabetical = playlists['� Repertorio Amores'] || [];\n"
js_content += f"const songsAmores = songsAlphabetical;\n"

# Definir qual playlist abre por padrão
# Se quisermos que "Ordem Alfabética" seja a padrão:
js_content += f"const defaultPlaylistName = \"� Repertorio Amores\";\n"

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Sucesso! {len(final_song_objects)} músicas processadas.")
print(f"Playlists geradas: {list(final_playlists.keys())}")