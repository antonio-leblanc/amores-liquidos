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

def slug_to_title(slug):
    """Converte um slug_de_musica para um Título De Música."""
    title = slug.replace('_', ' ').replace('pc', '%').title()
    return title

def get_instrument_from_filename(filename, song_slug):
    """Extrai o nome do instrumento do arquivo."""
    base_name = filename.rsplit('.', 1)[0]
    instrument_slug = base_name.replace(f"{song_slug}_", "", 1)
    
    instrument_name = instrument_slug.replace('___', ' / ').replace('_', ' ').title()
    
    if 'Sax' in instrument_name:
        instrument_name = f"🎷 {instrument_name}"
    elif 'Trombone' in instrument_name:
        instrument_name = f"📯 {instrument_name}"
    elif 'Trompete' in instrument_name:
        instrument_name = f"🎺 {instrument_name}"
        
    return instrument_name

# --- LÓGICA PRINCIPAL ---

print("--- Iniciando build dos dados de músicas (YAML) ---")

# 1. Carregar YAMLs
all_songs_list = []
combined_playlists = {}
combined_medleys = {}
song_source_map = {} # slug -> 'amores' ou 'carnaval'

yaml_files = [f for f in os.listdir(PLAYLISTS_DIR) if f.endswith('.yml') or f.endswith('.yaml')]

for yf in yaml_files:
    path = os.path.join(PLAYLISTS_DIR, yf)
    print(f"Lendo playlist: {yf}")
    with open(path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
        
        # Identificar origem (amores vs carnaval) baseado no nome do arquivo ou Título
        # Assumindo que o nome do arquivo reflete a pasta de arranjos: amores.yml -> arranjos/amores
        source_key = os.path.splitext(yf)[0] 
        
        songs = data.get('Songs', [])
        playlists = data.get('Playlists', {})
        medleys = data.get('Medleys', {})
        
        if songs:
            all_songs_list.extend(songs)
            for s in songs:
                song_source_map[s] = source_key
                
        if playlists:
            print(f"  -> Encontradas {len(playlists)} playlists")
            combined_playlists.update(playlists)
        else:
            print("  -> Nenhuma playlist encontrada/carregada")
            
        if medleys:
            print(f"  -> Encontrados {len(medleys)} medleys")
            combined_medleys.update(medleys)

# Remover duplicatas e ordenar
all_songs_list = sorted(list(set(all_songs_list)))
print(f"Total de músicas encontradas: {len(all_songs_list)}")
print(f"Total de playlists combinadas: {len(combined_playlists)}")
print(f"Total de medleys combinados: {len(combined_medleys)}")

# Remover duplicatas e ordenar
all_songs_list = sorted(list(set(all_songs_list)))
print(f"Total de músicas encontradas: {len(all_songs_list)}")

# 2. Construir songData (com caminhos dos arquivos)
final_song_data = []

for slug in all_songs_list:
    song_object = {
        'id': slug,
        'title': slug_to_title(slug)
    }
    
    melodies_for_this_song = {}
    source = song_source_map.get(slug)
    
    if source and source in ARRANGEMENT_DIRS:
        base_dir = ARRANGEMENT_DIRS[source]
        song_dir = os.path.join(base_dir, slug)
        
        if os.path.exists(song_dir) and os.path.isdir(song_dir):
            for filename in os.listdir(song_dir):
                if filename.endswith('.md'):
                    # Tenta extrair instrumento de forma mais genérica se possível, 
                    # ou usa a lógica antiga se o arquivo for nomeado 'slug_instrumento.md'
                    # Mas no novo padrão parece ser apenas 'instrumento.md' DENTRO da pasta slug?
                    # O script anterior lidava com 'sax_alto.md' dentro de 'acima_do_sol/'.
                    
                    # Vamos assumir que o nome do arquivo É o slug do instrumento
                    instrument_slug = filename.replace('.md', '')
                    instrument_name = instrument_slug.replace('___', ' / ').replace('_', ' ').title()
                    
                    if 'Sax' in instrument_name:
                        instrument_name = f"🎷 {instrument_name}"
                    elif 'Trombone' in instrument_name:
                        instrument_name = f"📯 {instrument_name}"
                    elif 'Trompete' in instrument_name:
                        instrument_name = f"🎺 {instrument_name}"
                        
                    # Caminho relativo para o frontend
                    file_path = os.path.join('arranjos', source, slug, filename).replace('\\', '/')
                    melodies_for_this_song[instrument_name] = file_path
    
    if melodies_for_this_song:
        song_object['melodies'] = melodies_for_this_song
    
    final_song_data.append(song_object)

# 3. Gerar song-data-final.js
# O frontend espera variáveis globais. 
# Precisamos garantir que songsAlphabetical, playlists e medleys existam se o script.js usar.

print(f"Gerando {OUTPUT_FILE}")
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(f"const songData = {json.dumps(final_song_data, indent=2, ensure_ascii=False)};\n\n")
    f.write(f"const playlists = {json.dumps(combined_playlists, indent=2, ensure_ascii=False)};\n\n")
    f.write(f"const medleys = {json.dumps(combined_medleys, indent=2, ensure_ascii=False)};\n\n")

    # Se precisar de songsAlphabetical (usado para popular a playlist default no código original)
    amores_songs = [s for s in all_songs_list if song_source_map.get(s) == 'amores']
    f.write(f"const songsAlphabetical = {json.dumps(amores_songs, indent=2, ensure_ascii=False)};\n\n")
    f.write(f"const songsAmores = songsAlphabetical;\n\n")
    f.write(f'const defaultPlaylistName = "🔤 Ordem Alfabética";\n')

print("Processo concluído!")