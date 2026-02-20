import re

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

def slugify(text):
    """
    Converte um texto em um nome de arquivo seguro.
    """
    text = text.lower()
    text = re.sub(r'[áàâã]', 'a', text)
    text = re.sub(r'[éê]', 'e', text)
    text = re.sub(r'[í]', 'i', text)
    text = re.sub(r'[óôõ]', 'o', text)
    text = re.sub(r'[úü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = text.replace('%', 'porcento')
    text = re.sub(r'[^a-z0-9\s/|-]', '', text)
    text = re.sub(r'[\s-]+', '_', text).strip('_')
    text = text.replace('/', '_')
    return text

def normalize_song_title(raw_title):
    """
    Limpa o título para criar uma "chave de agrupamento" (o nome da música sem o instrumento).
    """
    title = re.sub(r'^#+\s*|\s*{.*}\s*$', '', raw_title).strip()
    title = title.replace('**', '')
    title = title.lower()
    
    # Regex robusto para remover a parte do instrumento
    instrument_regex = r'(\s*-\s*|\s*\()[\w\s/]*?(sax|alto|trombone|trompete|tenor)[\w\s/]*?\)?\s*$'
    title = re.sub(instrument_regex, '', title, flags=re.IGNORECASE)
    
    return title.strip(' -\\')

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
