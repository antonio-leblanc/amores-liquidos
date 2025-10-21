document.addEventListener('DOMContentLoaded', () => {
    // --- Usando dados reais do song-data-final.js ---
    // songData já está disponível globalmente

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

        if (!song || !song.melodies || !song.melodies[selectedInstrument]) {
            contentDiv.innerHTML = '<p>Partitura não disponível para esta seleção.</p>';
            return;
        }

        const markdownFile = song.melodies[selectedInstrument];
        const filePath = markdownFile; // Já inclui o caminho completo

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

    // --- Função para Atualizar Instrumentos Dinamicamente ---
    function updateInstruments() {
        const selectedSongId = songSelect.value;
        const song = songData.find(s => s.id === selectedSongId);
        
        // Limpa o select de instrumentos
        instrumentSelect.innerHTML = '';
        
        if (song && song.melodies) {
            // Adiciona apenas os instrumentos disponíveis para esta música
            Object.keys(song.melodies).forEach(instrument => {
                const option = document.createElement('option');
                option.value = instrument;
                option.textContent = instrument;
                instrumentSelect.appendChild(option);
            });
        } else {
            // Se não há melodias, adiciona opção padrão
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum instrumento disponível';
            instrumentSelect.appendChild(option);
        }
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
    songSelect.addEventListener('change', () => {
        updateInstruments();
        updateDisplay();
    });
    instrumentSelect.addEventListener('change', updateDisplay);

    // Inicializa com a primeira música
    if (songData.length > 0) {
        updateInstruments();
        updateDisplay();
    }
});