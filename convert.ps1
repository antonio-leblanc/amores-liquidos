pandoc -f docx -t gfm -o "raw_songbook/songbook.md" "raw_songbook/songbook.docx"
uv run .\scripts\process.markdown.py
uv run .\scripts\build_song_data.py