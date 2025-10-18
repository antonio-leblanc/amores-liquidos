#!/usr/bin/env python3
"""
Script V3 para dividir o songbook usando os números das páginas do índice.
Agora pega o conteúdo REAL das músicas, não apenas os títulos.
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
    """Extrai o índice e mapeia as músicas únicas com números das páginas."""
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
        print(f"  - {song}: {len(instruments)} instrumentos (páginas: {[i['page'] for i in instruments]})")
    if len(songs_map) > 5:
        print(f"  ... e mais {len(songs_map) - 5} músicas")
    
    return songs_map

def find_content_by_page_number(text, page_number):
    """Encontra o conteúdo real de uma música baseado no número da página."""
    lines = text.split('\n')
    
    # Procurar por linhas que contenham o número da página
    # O conteúdo geralmente vem logo após o número da página
    content_start = -1
    
    for i, line in enumerate(lines):
        # Procurar por padrões que indiquem início de conteúdo
        if (str(page_number) in line and 
            ('(' in line or ')' in line or 'Estrutura' in line or 
             any(note in line for note in ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si']))):
            content_start = i
            break
    
    if content_start == -1:
        # Fallback: procurar por qualquer linha com o número da página
        for i, line in enumerate(lines):
            if str(page_number) in line and len(line.strip()) > 0:
                content_start = i
                break
    
    return content_start

def extract_song_content_by_pages(text, song_info):
    """Extrai o conteúdo de uma música baseado nos números das páginas."""
    lines = text.split('\n')
    
    # Pegar a primeira página (menor número) como início
    first_page = min(instrument['page'] for instrument in song_info['instruments'])
    
    # Encontrar onde começa o conteúdo real
    content_start = find_content_by_page_number(text, first_page)
    
    if content_start == -1:
        print(f"  ⚠️ Não encontrou conteúdo para página {first_page}")
        return ""
    
    # Encontrar onde termina (próxima música ou fim do arquivo)
    content_end = len(lines)
    
    # Procurar pela próxima música (linha com nome + instrumento)
    for i in range(content_start + 1, len(lines)):
        line = lines[i].strip()
        # Se encontrar outra música (não da mesma), para aqui
        if line and re.match(r'^[A-Za-z][^\(]*\s*\([^)]+\)', line):
            # Verificar se não é da mesma música
            if not any(instrument['original_name'] in line for instrument in song_info['instruments']):
                content_end = i
                break
    
    # Extrair conteúdo
    song_lines = lines[content_start:content_end]
    return '\n'.join(song_lines)

def divide_songbook_v3(input_file, output_dir):
    """Divide o songbook usando os números das páginas do índice."""
    
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
    
    # Dividir em arquivos individuais
    print("\n📝 Dividindo em arquivos individuais...")
    
    success_count = 0
    error_count = 0
    
    for normalized_name, instruments in songs_map.items():
        # Criar nome do arquivo usando o nome original
        original_name = instruments[0]['original_name']
        filename = clean_song_name(original_name) + '.txt'
        filepath = output_path / filename
        
        print(f"\n🎵 Processando: {original_name}")
        print(f"  📄 Páginas: {[i['page'] for i in instruments]}")
        
        # Extrair conteúdo real da música
        song_info = {
            'original_name': original_name,
            'instruments': instruments
        }
        
        song_content = extract_song_content_by_pages(content, song_info)
        
        if song_content and len(song_content.strip()) > 50:  # Conteúdo mínimo
            # Salvar arquivo
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(song_content)
            
            instruments_count = len(instruments)
            print(f"  ✅ {filename} ({instruments_count} instrumentos, {len(song_content.split())} linhas)")
            success_count += 1
        else:
            print(f"  ❌ Conteúdo insuficiente ou não encontrado")
            error_count += 1
    
    print(f"\n🎉 Divisão concluída!")
    print(f"  ✅ Sucessos: {success_count}")
    print(f"  ❌ Erros: {error_count}")

def main():
    """Função principal."""
    input_file = "raw_songbook/Songbook Amores Líquidos Atualizado 07.11.24.docx.txt"
    output_dir = "divided_songs"
    
    if not os.path.exists(input_file):
        print(f"❌ Arquivo não encontrado: {input_file}")
        return
    
    try:
        divide_songbook_v3(input_file, output_dir)
    except Exception as e:
        print(f"❌ Erro durante a divisão: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
