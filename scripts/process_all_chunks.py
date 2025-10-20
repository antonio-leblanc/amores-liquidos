import os
import json
import re
import time
from pathlib import Path
from google import genai
from google.genai import types
from dotenv import load_dotenv

# --- CONFIGURAÇÃO ---
IS_TEST_MODE = True
TEST_MODE_INIT = 10
TEST_MODE_LIMIT = 10

INPUT_DIR = "song_chunks"
OUTPUT_DIR = "melodies"
PROMPT_FILE = "prompts/criador_de_json.md"
API_DELAY_SECONDS = 1

# --- FUNÇÕES AUXILIARES ---

def load_prompt_master(prompt_path):
    if not os.path.exists(prompt_path):
        print(f"❌ Arquivo do prompt mestre não encontrado em: {prompt_path}")
        return None
    with open(prompt_path, 'r', encoding='utf-8') as f:
        return f.read()

def clean_llm_response(text):
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    print("⚠️  Aviso: Regex não encontrou um JSON claro, retornando texto limpo.")
    return text.strip()

# --- FUNÇÃO DE PROCESSAMENTO ÚNICO (Baseada no seu script de teste) ---

def process_single_song_file(client, prompt_master, input_path, output_path):
    """
    Processa um único arquivo de música, chama a API e salva o JSON.
    Retorna True em caso de sucesso, False em caso de falha.
    """
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            song_content = f.read()
        
        full_prompt = f"{prompt_master}\n\n{song_content}"
        
        #
        # >>>>> CORREÇÃO CRÍTICA APLICADA AQUI <<<<<
        # Esta chamada de API agora é uma cópia exata da que funciona no seu script de teste.
        # Usa `config` e o modelo correto.
        #
        response = client.models.generate_content(
            model="gemini-2.5-flash", # Confirmado a partir do seu script de teste
            contents=full_prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,  # Baixa temperatura para consistência
            )
        )
        
        raw_response_text = response.text
        json_text = clean_llm_response(raw_response_text)
        
        json_data = json.loads(json_text)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
            
        return True # Sucesso

    except json.JSONDecodeError as e:
        print(f"❌ ERRO DE JSON: A resposta não foi um JSON válido para '{input_path.name}'.")
        print(f"   Detalhe: {e}")
        return False
    except Exception as e:
        print(f"❌ ERRO DE API ou inesperado ao processar '{input_path.name}': {e}")
        return False

# --- LÓGICA PRINCIPAL DE ORQUESTRAÇÃO ---

def main():
    print("🚀 Iniciando o processo de automação em lote (v3 Refatorada)...")

    load_dotenv()
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ Erro fatal: GEMINI_API_KEY não encontrada.")
        return

    try:
        client = genai.Client(api_key=api_key)
        print("✅ Cliente da API do Gemini inicializado.")
    except Exception as e:
        print(f"❌ Erro fatal ao inicializar o cliente Gemini: {e}")
        return

    prompt_master = load_prompt_master(PROMPT_FILE)
    if not prompt_master:
        return

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    try:
        files_to_process = sorted([f for f in os.listdir(INPUT_DIR) if f.endswith('.txt')])
    except FileNotFoundError:
        print(f"❌ Erro fatal: Diretório de entrada '{INPUT_DIR}' não encontrado.")
        return

    if IS_TEST_MODE:
        print(f"🔬 MODO DE TESTE: Processando apenas as {TEST_MODE_INIT}:{TEST_MODE_INIT+TEST_MODE_LIMIT} músicas.")
        files_to_process = files_to_process[TEST_MODE_INIT:TEST_MODE_INIT+TEST_MODE_LIMIT]

    total_files = len(files_to_process)
    print(f"🎵 Encontradas {total_files} músicas para processar.")
    
    success_count = 0
    fail_count = 0
    
    for index, filename in enumerate(files_to_process):
        start_time = time.time()
        print("\n" + "─" * 60)
        print(f"⏳ Processando [{index + 1}/{total_files}]: {filename}")
        
        input_path = Path(INPUT_DIR) / filename
        output_filename = filename.replace('.txt', '.json')
        output_path = Path(OUTPUT_DIR) / output_filename
        
        if output_path.exists():
            print(f"⏩ Arquivo já existe. Pulando: {output_path.name}")
            continue
        
        # Chama a função refatorada
        if process_single_song_file(client, prompt_master, input_path, output_path):
            duration = time.time() - start_time
            print(f"✅ SUCESSO! JSON salvo em {output_path.name} ({duration:.2f}s)")
            success_count += 1
        else:
            fail_count += 1

        time.sleep(API_DELAY_SECONDS)

    print("\n" + "─" * 60)
    print("🎉 Processo em lote concluído!")
    print(f"   -> Sucessos: {success_count}")
    print(f"   -> Falhas: {fail_count}")

if __name__ == "__main__":
    main()