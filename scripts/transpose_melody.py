import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv
from google import genai

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
PROMPTS_DIR = PROJECT_ROOT / "prompts"
ARRANGEMENT_ROOT = PROJECT_ROOT / "arranjos"
ENV_PATH = SCRIPTS_DIR / ".env"

# Load environment variables
load_dotenv(ENV_PATH)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_ID = "gemini-3-flash-preview"
# The client will pick up GEMINI_API_KEY from environment if not passed, 
# but passing it explicitly is safer.

INSTRUMENTS = {
    "trombone": {"name": "Trombone (Tom Real C)", "files": ["trombone.md"]},
    "sax_alto": {"name": "Sax Alto (em Eb)", "files": ["sax_alto.md"]},
    "sax_tenor": {"name": "Sax Tenor (em Bb)", "files": ["sax_tenor.md"]},
    "trompete": {"name": "Trompete (em Bb)", "files": ["trompete.md", "trompete___tenor.md"]},
}

def get_gemini_client():
    if not GEMINI_API_KEY:
        print("❌ Error: GEMINI_API_KEY not found in scripts/.env")
        sys.exit(1)
    return genai.Client(api_key=GEMINI_API_KEY)

def load_prompt_context():
    prompt_path = PROMPTS_DIR / "especialista_amores.md"
    if not prompt_path.exists():
        print(f"❌ Error: Prompt context not found at {prompt_path}")
        sys.exit(1)
    return prompt_path.read_text(encoding="utf-8")

def find_song_dir(song_slug):
    """Procura a pasta da música em amores ou carnaval."""
    for sub in ["amores", "carnaval"]:
        path = ARRANGEMENT_ROOT / sub / song_slug
        if path.exists():
            return path
    return None

def transpose_song(song_slug):
    song_dir = find_song_dir(song_slug)
    if not song_dir:
        print(f"❌ Error: Song directory not found for '{song_slug}' in 'arranjos/amores/' or 'arranjos/carnaval/'")
        return

    print(f"📂 Processing: {song_dir}")

    # 1. Identify existing files and missing ones
    present_files = {}
    missing_instruments = []

    for key, info in INSTRUMENTS.items():
        found = False
        for filename in info["files"]:
            file_path = song_dir / filename
            if file_path.exists():
                present_files[key] = {
                    "content": file_path.read_text(encoding="utf-8"),
                    "info": info,
                    "active_file": filename
                }
                found = True
                break
        
        if not found:
            missing_instruments.append(key)

    if not present_files:
        print(f"⚠️ No melody files found in {song_dir}")
        return

    if not missing_instruments:
        print(f"✅ All instruments already exist for '{song_slug}'.")
        return

    # 2. Pick a source instrument
    source_key = next(iter(present_files))
    if "sax_tenor" in present_files: source_key = "sax_tenor"
    elif "trompete" in present_files: source_key = "trompete"
    elif "trombone" in present_files: source_key = "trombone"
    
    source_data = present_files[source_key]
    print(f"🎹 Using {source_data['info']['name']} as source for transposition.")

    client = get_gemini_client()
    context = load_prompt_context()

    for target_key in missing_instruments:
        target_info = INSTRUMENTS[target_key]
        # Target filename is always the first in the list (the 'ideal' name)
        target_filename = target_info["files"][0]
        
        print(f"🚀 Transposing to {target_info['name']}...")

        prompt = f"""
{context}

---

**TAREFA:**
Transponha a melodia abaixo de **{source_data['info']['name']}** para **{target_info['name']}**.

**MELODIA ORIGINAL:**
{source_data['content']}

---

**REGRAS ADICIONAIS:**
1. Retorne APENAS o conteúdo final do arquivo Markdown (incluindo o título #).
2. Não adicione explicações fora do bloco de código ou do markdown.
3. Siga rigorosamente o Protocolo de Precisão (declaração de cálculo e notas por extenso).
"""

        try:
            response = client.models.generate_content(
                model=MODEL_ID,
                contents=prompt
            )
            
            output_content = response.text.strip()
            
            # Clean up potential markdown code blocks
            if output_content.startswith("```markdown"):
                output_content = output_content[11:].rstrip("```").strip()
            elif output_content.startswith("```"):
                output_content = output_content[3:].rstrip("```").strip()

            target_path = song_dir / target_filename
            target_path.write_text(output_content, encoding="utf-8")
            print(f"  ✅ Saved: {target_filename}")

        except Exception as e:
            print(f"  ❌ Error transposing {target_key}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transpose melodies using Gemini API.")
    parser.add_argument("song", help="Song slug (folder name in arranjos/amores/)")
    
    args = parser.parse_args()
    transpose_song(args.song)
