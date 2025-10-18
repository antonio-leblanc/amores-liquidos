# Amores Líquidos Music Player

Music player and sheet music viewer for the carnival bloco "Amores Líquidos". Features a complete repertoire with interactive melody display for different instruments.

## Features

### Music Player
* **Multiple Playlists:** Alphabetical order, "Novas 2026", and "GIG" setlist
* **Playback Controls:** Play, pause, next, previous, and random song selection
* **Search:** Real-time search through the song list
* **Progress Bar:** Click to jump to any point in the song

### Sheet Music Display
* **Multi-Instrument Support:** View melodies for Sax Alto, Trombone, and Trumpet/Sax Tenor
* **Section Navigation:** Browse through different song sections (Intro, Verse, Chorus, etc.)
* **Interactive Display:** Switch between instruments with dropdown selector
* **Review System:** Songs with review notes are marked with asterisk (*)

## Project Structure

```
amores-liquidos/
├── index.html          # Main application
├── script.js           # Core functionality
├── style.css           # Styling
├── song-data.js        # Playlist definitions
├── countdown.js        # Carnival countdown
├── music/              # MP3 audio files (72 songs)
├── melodies/           # JSON sheet music files
│   ├── amor_i_love_you.json
│   ├── depois_do_prazer.json
│   ├── to_nem_ai.json
│   ├── varias_queixas.json
│   └── vem_meu_amor.json
└── prompts/            # Documentation and automation tools
    ├── criador_de_json.md
    ├── especialista_amores.md
    └── plano_todas_as_musicas_em_json.md
```

## How to Use

1. **Open the Application:** Open `index.html` in a web browser
2. **Select Playlist:** Use the dropdown to choose between playlists
3. **Play Music:** Click play button or select a song from the list
4. **View Sheet Music:** When a song with melody data is selected, the right panel shows the sheet music
5. **Switch Instruments:** Use the instrument dropdown to view different parts

## Adding New Songs

### Audio Files
1. Add MP3 file to `music/` folder with underscore naming (e.g., `nova_musica.mp3`)
2. Add song name to `songsAlphabetical` array in `song-data.js`
3. Add to desired playlist in `playlists` object

### Sheet Music
1. Create JSON file in `melodies/` folder with same name as audio file
2. Follow the structure defined in existing JSON files:

```json
{
  "songTitle": "Song Name",
  "review_needed": ["Optional review notes"],
  "structure": ["Section1", "Section2", "Chorus"],
  "instruments": [
    {
      "name": "Sax Alto",
      "sections": [
        {
          "name": "Section1",
          "lines": [
            {"melody": "Do Re Mi Fa Sol"},
            {"melody": "La Si Do Re Mi"}
          ]
        }
      ]
    }
  ]
}
```

## Automation Project

This repository includes tools for automating the conversion of sheet music from PDF/Word documents to structured JSON files. See `prompts/` folder for:
- **JSON Creator Prompt:** AI prompt for converting text to structured JSON
- **Music Expert Prompt:** Specialized prompt for transposition and arrangement
- **Automation Plan:** Strategy for bulk conversion of songbook

## Technical Details

- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Audio:** HTML5 Audio API
- **Data:** JSON files for sheet music
- **Styling:** Custom CSS with gradient background
- **Responsive:** Two-column layout (player + sheet music)

## Requirements

- Modern web browser with HTML5 Audio support
- Local web server (for file access) or serve via HTTP
- No external dependencies required