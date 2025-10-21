document.addEventListener('DOMContentLoaded', () => {
    // --- Nossos Dados (simulando o song-data.js) ---
    const songData = [
        {
            id: 'amor_i_love_you',
            title: 'Amor I Love You',
            // Mapeia o nome do instrumento para o nome do arquivo .md
            files: {
                'Trombone': 'amor_i_love_you_trombone.md',
                'Sax Alto': 'amor_i_love_you_sax_alto.md' // exemplo
            }
        },
        {
            id: 'depois_do_prazer',
            title: 'Depois do Prazer',
            files: {
                'Trombone': 'depois_do_prazer_trombone.md',
                'Sax Alto': 'depois_do_prazer_sax_alto.md'
            }
        }
    ];

    // --- Referências aos Elementos do HTML ---
    const songSelect = document.getElementById('song-select');
    const instrumentSelect = document.getElementById('instrument-select');
    const contentDiv = document.getElementById('markdown-content');

    // --- Função Principal para Atualizar a Tela ---
    function updateDisplay() {
        const selectedSongId = songSelect.value;
        const selectedInstrument = instrumentSelect.value;

        // Encontra o objeto da música selecionada
        const song = songData.find(s => s.id === selectedSongId);

        if (!song || !song.files[selectedInstrument]) {
            contentDiv.innerHTML = '<p>Partitura não disponível para esta seleção.</p>';
            return;
        }

        const markdownFile = song.files[selectedInstrument];
        const filePath = `markdown/${markdownFile}`;

        // Busca, converte e renderiza o arquivo Markdown
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Arquivo não encontrado: ${filePath}`);
                return response.text();
            })
            .then(markdownText => {
                contentDiv.innerHTML = marked.parse(markdownText);
            })
            .catch(error => {
                console.error('Erro:', error);
                contentDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
            });
    }

    // --- Inicialização ---
    // Popula o select de músicas
    songData.forEach(song => {
        const option = document.createElement('option');
        option.value = song.id;
        option.textContent = song.title;
        songSelect.appendChild(option);
    });

    // Adiciona os "escutadores" de eventos
    songSelect.addEventListener('change', updateDisplay);
    instrumentSelect.addEventListener('change', updateDisplay);

    // Carrega a primeira visualização
    updateDisplay();
});