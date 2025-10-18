#!/usr/bin/env python3
"""
Script V2 para dividir o songbook usando o índice como referência.
Cada arquivo conterá todas as partituras (instrumentos) daquela música.
"""

import re
import os
from pathlib import Path
from collections import defaultdict

def clean_song_name(song_name):
    """Converte nome da música para formato de arquivo válido."""
    # Remove caracteres especiais e substitui espaços por underscore
    cleaned = re.sub(r'[^\w\s-]', '', song_name)
    cleaned = re.sub(r'\s+', '_', cleaned.strip())
    return cleaned.lower()

def parse_index(text):
    """Extrai o índice e mapeia as músicas únicas."""
    lines = text.split('\n')
    
    # Encontrar onde começa o sumário
    index_start = -1
    for i, line in enumerate(lines):
        if 'Sumário' in line or 'Índice' in line:
            index_start = i
            break
    
    if index_start == -1:
        print("❌ Sumário não encontrado!")
        return {}
    
    # Extrair linhas do índice (até encontrar uma linha vazia ou fim)
    index_lines = []
    for i in range(index_start + 1, len(lines)):
        line = lines[i].strip()
        if not line or line.startswith('Songbook') or line.startswith('Amores'):
            break
        if line and any(char.isdigit() for char in line):  # Linha com número de página
            index_lines.append(line)
    
    print(f"📋 Encontradas {len(index_lines)} entradas no índice")
    
    # Parsear cada linha do índice
    songs_map = defaultdict(list)
    
    for line in index_lines:
        # Padrão: "Nome da Música (Instrumento)        Número"
        # Exemplo: "100 % Você (Alto Sax)        5"
        match = re.match(r'^(.+?)\s*\(([^)]+)\)\s+(\d+)$', line)
        if match:
            song_name = match.group(1).strip()
            instrument = match.group(2).strip()
            page_num = int(match.group(3))
            
            # Normalizar nome da música (remover acentos, case-insensitive)
            normalized_name = re.sub(r'[^\w\s]', '', song_name.lower())
            normalized_name = re.sub(r'\s+', ' ', normalized_name).strip()
            
            songs_map[normalized_name].append({
                'original_name': song_name,
                'instrument': instrument,
                'page': page_num
            })
    
    print(f"🎵 Encontradas {len(songs_map)} músicas únicas:")
    for song, instruments in list(songs_map.items())[:5]:
        print(f"  - {song}: {len(instruments)} instrumentos")
    if len(songs_map) > 5:
        print(f"  ... e mais {len(songs_map) - 5} músicas")
    
    return songs_map

def find_song_content_bounds(text, songs_map):
    """Encontra os limites de conteúdo para cada música."""
    lines = text.split('\n')
    song_bounds = {}
    
    # Para cada música única, encontrar onde começa e termina
    for normalized_name, instruments in songs_map.items():
        # Usar o primeiro instrumento como referência para encontrar o início
        first_instrument = instruments[0]
        original_name = first_instrument['original_name']
        
        # Procurar por linhas que começam com o nome da música + instrumento
        start_line = -1
        for i, line in enumerate(lines):
            # Padrão mais flexível para encontrar início da música
            if re.match(rf'^{re.escape(original_name)}\s*\([^)]+\)', line.strip()):
                start_line = i
                break
        
        if start_line != -1:
            # Encontrar onde termina (próxima música ou fim do arquivo)
            end_line = len(lines)
            for i in range(start_line + 1, len(lines)):
                line = lines[i].strip()
                # Se encontrar outra música (não da mesma), para aqui
                if line and re.match(r'^[A-Za-z][^\(]*\s*\([^)]+\)', line):
                    # Verificar se não é da mesma música
                    if not re.match(rf'^{re.escape(original_name)}\s*\([^)]+\)', line):
                        end_line = i
                        break
            
            song_bounds[normalized_name] = {
                'start': start_line,
                'end': end_line,
                'original_name': original_name,
                'instruments': instruments
            }
    
    return song_bounds

def extract_song_content(text, start_line, end_line):
    """Extrai o conteúdo de uma música específica."""
    lines = text.split('\n')
    song_lines = lines[start_line:end_line] if end_line else lines[start_line:]
    return '\n'.join(song_lines)

def divide_songbook_v2(input_file, output_dir):
    """Divide o songbook usando o índice como referência."""
    
    # Criar diretório de saída
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Ler arquivo de entrada
    print(f"📖 Lendo arquivo: {input_file}")
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Parsear índice
    print("🔍 Parseando índice...")
    songs_map = parse_index(content)
    
    if not songs_map:
        print("❌ Não foi possível parsear o índice!")
        return
    
    # Encontrar limites de conteúdo
    print("📍 Encontrando limites de conteúdo...")
    song_bounds = find_song_content_bounds(content, songs_map)
    
    print(f"✅ Encontrados limites para {len(song_bounds)} músicas")
    
    # Dividir em arquivos individuais
    print("\n📝 Dividindo em arquivos individuais...")
    
    for normalized_name, bounds in song_bounds.items():
        # Extrair conteúdo da música
        song_content = extract_song_content(content, bounds['start'], bounds['end'])
        
        # Criar nome do arquivo usando o nome original
        filename = clean_song_name(bounds['original_name']) + '.txt'
        filepath = output_path / filename
        
        # Salvar arquivo
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(song_content)
        
        instruments_count = len(bounds['instruments'])
        print(f"  ✓ {filename} ({instruments_count} instrumentos, {len(song_content.split())} linhas)")
    
    print(f"\n🎉 Divisão concluída! {len(song_bounds)} arquivos criados em '{output_dir}'")

def main():
    """Função principal."""
    input_file = "raw_songbook/Songbook Amores Líquidos Atualizado 07.11.24.docx.txt"
    output_dir = "divided_songs"
    
    if not os.path.exists(input_file):
        print(f"❌ Arquivo não encontrado: {input_file}")
        return
    
    try:
        divide_songbook_v2(input_file, output_dir)
    except Exception as e:
        print(f"❌ Erro durante a divisão: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
