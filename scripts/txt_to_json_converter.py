#!/usr/bin/env python3
"""
Script para converter arquivos TXT individuais em JSONs usando Gemini API.
Usa o prompt mestre para garantir consistência no formato.
"""

import os
import json
import time
from pathlib import Path
from google import genai
from google.genai import types

def load_prompt_master():
    """Carrega o prompt mestre do arquivo."""
    prompt_file = "prompts/criador_de_json.md"
    
    if not os.path.exists(prompt_file):
        print(f"❌ Arquivo do prompt não encontrado: {prompt_file}")
        return None
    
    with open(prompt_file, 'r', encoding='utf-8') as f:
        return f.read()

def clean_song_name_for_json(song_name):
    """Converte nome do arquivo para formato usado no JSON."""
    # Remove extensão .txt e converte para formato usado no song-data.js
    name = song_name.replace('.txt', '')
    # Remove caracteres especiais e substitui por underscore
    cleaned = name.replace(' ', '_').replace('-', '_').replace('_', '_')
    return cleaned

def convert_txt_to_json(txt_file_path, prompt_master, client):
    """Converte um arquivo TXT em JSON usando Gemini."""
    
    # Ler conteúdo do arquivo TXT
    with open(txt_file_path, 'r', encoding='utf-8') as f:
        song_content = f.read()
    
    # Combinar prompt mestre + conteúdo da música
    full_prompt = f"{prompt_master}\n\n{song_content}"
    
    try:
        # Fazer requisição para Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,  # Baixa temperatura para consistência
                system_instruction="Você é um especialista em estruturação de dados musicais. Siga rigorosamente o prompt fornecido."
            )
        )
        
        # Extrair JSON da resposta
        json_text = response.text.strip()
        
        # Tentar fazer parse do JSON para validar
        try:
            json_data = json.loads(json_text)
            return json_data, None
        except json.JSONDecodeError as e:
            return None, f"JSON inválido: {e}"
            
    except Exception as e:
        return None, f"Erro na API: {e}"

def process_all_songs(input_dir, output_dir, prompt_master, client):
    """Processa todos os arquivos TXT da pasta de entrada."""
    
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Listar todos os arquivos TXT
    txt_files = list(input_path.glob("*.txt"))
    
    if not txt_files:
        print(f"❌ Nenhum arquivo TXT encontrado em {input_dir}")
        return
    
    print(f"🎵 Encontrados {len(txt_files)} arquivos para processar")
    
    success_count = 0
    error_count = 0
    
    for i, txt_file in enumerate(txt_files, 1):
        print(f"\n[{i}/{len(txt_files)}] Processando: {txt_file.name}")
        
        # Converter TXT para JSON
        json_data, error = convert_txt_to_json(txt_file, prompt_master, client)
        
        if json_data:
            # Criar nome do arquivo JSON
            json_filename = clean_song_name_for_json(txt_file.name) + '.json'
            json_filepath = output_path / json_filename
            
            # Salvar JSON
            with open(json_filepath, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, ensure_ascii=False, indent=2)
            
            print(f"  ✅ {json_filename}")
            success_count += 1
            
            # Pequena pausa para não sobrecarregar a API
            time.sleep(1)
            
        else:
            print(f"  ❌ Erro: {error}")
            error_count += 1
    
    print(f"\n🎉 Processamento concluído!")
    print(f"  ✅ Sucessos: {success_count}")
    print(f"  ❌ Erros: {error_count}")

def main():
    """Função principal."""
    
    # Verificar se a API key está configurada
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ Variável de ambiente GEMINI_API_KEY não encontrada!")
        print("Configure sua API key com: set GEMINI_API_KEY=sua_chave_aqui")
        return
    
    # Carregar prompt mestre
    print("📖 Carregando prompt mestre...")
    prompt_master = load_prompt_master()
    if not prompt_master:
        return
    
    # Inicializar cliente Gemini
    print("🔗 Conectando com Gemini API...")
    try:
        client = genai.Client()
        print("✅ Conectado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao conectar com Gemini: {e}")
        return
    
    # Configurações
    input_dir = "divided_songs"
    output_dir = "melodies_generated"
    
    # Verificar se pasta de entrada existe
    if not os.path.exists(input_dir):
        print(f"❌ Pasta de entrada não encontrada: {input_dir}")
        print("Execute primeiro o script songbook_divider_v2.py")
        return
    
    # Processar todas as músicas
    print(f"\n🚀 Iniciando conversão de {input_dir} → {output_dir}")
    process_all_songs(input_dir, output_dir, prompt_master, client)

if __name__ == "__main__":
    main()
