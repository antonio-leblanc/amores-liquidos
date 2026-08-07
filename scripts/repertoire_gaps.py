import os
import sys
import argparse
import yaml

if sys.platform.startswith("win"):
    sys.stdout.reconfigure(encoding='utf-8')

# Obtém o diretório do projeto
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PLAYLISTS_DIR = os.path.join(PROJECT_ROOT, 'playlists')
MUSIC_DIR = os.path.join(PROJECT_ROOT, 'music')
REPORT_FILE = os.path.join(PROJECT_ROOT, 'docs', 'gap-report.md')
ARRANGEMENT_DIRS = {
    'amores': os.path.join(PROJECT_ROOT, 'arranjos', 'amores'),
    'carnaval': os.path.join(PROJECT_ROOT, 'arranjos', 'carnaval'),
}
CARNAVAL_YML = os.path.join(PLAYLISTS_DIR, 'carnaval.yml')


def load_songs(source):
    """Lê a lista 'Songs' de playlists/<source>.yml."""
    path = os.path.join(PLAYLISTS_DIR, f'{source}.yml')
    with open(path, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)
    return sorted(data.get('Songs', []) or [])


def load_arrangement_slugs(source):
    """Lista as pastas de música existentes em arranjos/<source>/."""
    base_dir = ARRANGEMENT_DIRS[source]
    if not os.path.isdir(base_dir):
        return []
    return sorted(d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d)))


def load_mp3_slugs():
    """Lista os slugs de mp3 no topo de music/ (ignora subpastas como 'verificar_tom')."""
    return sorted(
        os.path.splitext(f)[0]
        for f in os.listdir(MUSIC_DIR)
        if f.lower().endswith('.mp3') and os.path.isfile(os.path.join(MUSIC_DIR, f))
    )


def build_report():
    lines = []
    lines.append('# Gap Report — Repertório')
    lines.append('')
    lines.append('> **Auto-gerado por `scripts/repertoire_gaps.py`. Não edite manualmente — rode o script para atualizar.**')
    lines.append('')

    songs_by_source = {}
    orphan_mp3s = None

    for source in ('amores', 'carnaval'):
        songs = load_songs(source)
        arrangements = load_arrangement_slugs(source)
        songs_by_source[source] = songs

        missing_arrangement = sorted(set(songs) - set(arrangements))
        orphan_arrangement = sorted(set(arrangements) - set(songs))

        print(f"\n--- 🎼 {source.upper()} ---")
        print(f"  Músicas na playlist: {len(songs)} | Pastas de arranjo: {len(arrangements)}")

        lines.append(f'## {source.capitalize()}')
        lines.append('')
        lines.append(f'- Músicas na playlist: **{len(songs)}**')
        lines.append(f'- Pastas de arranjo: **{len(arrangements)}**')
        lines.append('')

        lines.append(f'### ❌ Sem partitura ({len(missing_arrangement)})')
        lines.append('')
        if missing_arrangement:
            print(f"  ❌ Sem partitura ({len(missing_arrangement)}):")
            for slug in missing_arrangement:
                print(f"    - {slug}")
                lines.append(f'- `{slug}`')
        else:
            print("  ✅ Todas as músicas têm partitura.")
            lines.append('_Nenhuma — todas as músicas têm partitura._')
        lines.append('')

        lines.append(f'### 🎻 Partitura sem música na playlist ({len(orphan_arrangement)})')
        lines.append('')
        if orphan_arrangement:
            print(f"  🎻 Partitura sem música na playlist ({len(orphan_arrangement)}):")
            for slug in orphan_arrangement:
                print(f"    - {slug}")
                lines.append(f'- `{slug}`')
        else:
            print("  ✅ Nenhuma partitura órfã.")
            lines.append('_Nenhuma._')
        lines.append('')

    all_listed = set(songs_by_source['amores']) | set(songs_by_source['carnaval'])
    mp3_slugs = load_mp3_slugs()
    orphan_mp3s = sorted(set(mp3_slugs) - all_listed)

    print(f"\n--- 🎧 MP3s órfãos (fora de qualquer playlist) ---")
    lines.append('## 🎧 MP3s órfãos (fora de qualquer playlist)')
    lines.append('')
    if orphan_mp3s:
        print(f"  ❌ {len(orphan_mp3s)} encontrado(s):")
        for slug in orphan_mp3s:
            print(f"    - {slug}")
            lines.append(f'- `{slug}`')
    else:
        print("  ✅ Nenhum mp3 órfão.")
        lines.append('_Nenhum._')
    lines.append('')

    with open(REPORT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    print(f"\n💾 Relatório salvo em '{os.path.relpath(REPORT_FILE, PROJECT_ROOT)}'.")

    return orphan_mp3s


def fix_orphans(orphan_mp3s):
    """Adiciona os mp3s órfãos ao 'Songs:' de carnaval.yml, mantendo ordem alfabética."""
    if not orphan_mp3s:
        print("\n✅ Nenhum mp3 órfão para adicionar. 'carnaval.yml' não foi alterado.")
        return

    with open(CARNAVAL_YML, 'rb') as f:
        raw = f.read()

    newline = b'\r\n' if b'\r\n' in raw else b'\n'
    text = raw.decode('utf-8')
    raw_lines = text.splitlines()

    songs_idx = next(i for i, line in enumerate(raw_lines) if line.strip() == 'Songs:')

    end_idx = songs_idx + 1
    existing_songs = []
    while end_idx < len(raw_lines) and raw_lines[end_idx].startswith('  - '):
        existing_songs.append(raw_lines[end_idx][4:].strip())
        end_idx += 1

    merged = sorted(set(existing_songs) | set(orphan_mp3s))
    new_song_lines = [f'  - {slug}' for slug in merged]

    updated_lines = raw_lines[:songs_idx + 1] + new_song_lines + raw_lines[end_idx:]
    updated_text = newline.decode('utf-8').join(updated_lines)
    if text.endswith(('\n', '\r\n')):
        updated_text += newline.decode('utf-8')

    with open(CARNAVAL_YML, 'w', encoding='utf-8', newline='') as f:
        f.write(updated_text)

    added = sorted(set(orphan_mp3s) - set(existing_songs))
    print(f"\n✅ {len(added)} música(s) adicionada(s) a 'carnaval.yml': {', '.join(added)}")


def main():
    parser = argparse.ArgumentParser(description="Relatório de gaps do repertório (partituras x playlists x mp3s).")
    parser.add_argument('--fix-orphans', action='store_true', help="Adiciona mp3s órfãos ao Songs: de carnaval.yml, em ordem alfabética.")
    args = parser.parse_args()

    orphan_mp3s = build_report()

    if args.fix_orphans:
        fix_orphans(orphan_mp3s)
        print("\n🔄 Regerando relatório após a correção...")
        build_report()


if __name__ == '__main__':
    main()
