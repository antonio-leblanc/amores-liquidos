#!/usr/bin/env python3
"""
Script de teste para converter apenas 1 música TXT em JSON.
"""

import os
import json
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv
import re

# Carregar variáveis do .env
load_dotenv()

def load_prompt_master():
    """Carrega o prompt mestre do arquivo."""
    prompt_file = "prompts/criador_de_json.md"
    
    if not os.path.exists(prompt_file):
        print(f"❌ Arquivo do prompt não encontrado: {prompt_file}")
        return None
    
    with open(prompt_file, 'r', encoding='utf-8') as f:
        return f.read()
    
def clean_llm_response(text):
    """
    Limpa a resposta do LLM, removendo os blocos de código Markdown (```json ... ```)
    para garantir que o texto seja um JSON puro.
    """
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text.strip()

def test_single_song():
    """Testa a conversão de uma única música."""
    
    # Verificar API key
    print("🔍 Verificando variáveis de ambiente...")
    print(f"  - GEMINI_API_KEY existe: {'GEMINI_API_KEY' in os.environ}")
    print(f"  - Arquivo .env existe: {os.path.exists('.env')}")
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY não encontrada no .env")
        print("🔍 Tentando carregar .env manualmente...")
        load_dotenv(override=True)
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("❌ Ainda não encontrada após reload")
            return
    
    print(f"✅ API Key encontrada: {api_key[:10]}...")
    
    # Carregar prompt mestre
    print("📖 Carregando prompt mestre...")
    prompt_master = load_prompt_master()
    if not prompt_master:
        return
    
    # Inicializar cliente Gemini
    print("🔗 Conectando com Gemini API...")
    try:
        client = genai.Client(api_key=api_key)
        print("✅ Conectado com sucesso!")
    except Exception as e:
        print(f"❌ Erro ao conectar com Gemini: {e}")
        return
    
    # Escolher uma música para testar
    test_song = "amor_i_love_you.txt"  # Música que já temos JSON de referência
    
    txt_file = Path("song_chunks") / test_song
    if not txt_file.exists():
        print(f"❌ Arquivo de teste não encontrado: {txt_file}")
        return
    
    print(f"🎵 Testando com: {test_song}")
    
    # Ler conteúdo do arquivo TXT
    with open(txt_file, 'r', encoding='utf-8') as f:
        song_content = f.read()
    
    print(f"📄 Conteúdo do arquivo ({len(song_content)} caracteres):")
    print("─" * 50)
    print(song_content[:500] + "..." if len(song_content) > 500 else song_content)
    print("─" * 50)
    
    # Combinar prompt mestre + conteúdo da música
    full_prompt = f"{prompt_master}\n\n{song_content}"
    
    print(f"\n🚀 Enviando para Gemini...")
    print(f"📊 Tamanho total do prompt: {len(full_prompt)} caracteres")
    
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
        raw_response_text = response.text

        json_text = clean_llm_response(raw_response_text)
        
        print(f"\n📥 Resposta recebida ({len(json_text)} caracteres):")
        print("─" * 50)
        print(json_text)
        print("─" * 50)
        
        # Tentar fazer parse do JSON para validar
        try:
            json_data = json.loads(json_text)
            print("✅ JSON válido!")
            
            # Salvar JSON de teste
            output_file = Path("melodies_generated") / "test_amor_i_love_you.json"
            output_file.parent.mkdir(exist_ok=True)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, ensure_ascii=False, indent=2)
            
            print(f"💾 JSON salvo em: {output_file}")
            
            # Mostrar resumo
            print(f"\n📊 Resumo do JSON gerado:")
            print(f"  - Título: {json_data.get('songTitle', 'N/A')}")
            print(f"  - Instrumentos: {len(json_data.get('instruments', []))}")
            print(f"  - Estrutura: {json_data.get('structure', [])}")
            if 'review_needed' in json_data:
                print(f"  - Alertas: {len(json_data['review_needed'])}")
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON inválido: {e}")
            print("📄 Resposta bruta:")
            print(json_text)
            
    except Exception as e:
        print(f"❌ Erro na API: {e}")

if __name__ == "__main__":
    test_single_song()
