// --- Elementos do DOM ---
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const randomBtn = document.getElementById('random');
const playlistSelector = document.getElementById('playlist-selector'); 

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

const searchInput = document.getElementById('search-input');
const playlist = document.getElementById('playlist');


// --- Estado da Aplicação ---
let currentSongs = playlists[defaultPlaylistName];
let songIndex = 0;

// --- FUNÇÕES ---

// Gera a lista de músicas (sumário) no HTML
function generatePlaylist(songs) {
  playlist.innerHTML = ''; // Limpa a lista antes de gerar
  songs.forEach((song) => {
    const li = document.createElement('li');
    // Armazena o nome original no dataset para fácil identificação
    li.dataset.songName = song; 
    // Mostra um nome mais legível na tela
    li.textContent = song.replace(/_/g, ' '); 
    playlist.appendChild(li);
  });
}

// Atualiza o destaque visual na lista
function updatePlaylistHighlight() {
  const allSongs = playlist.querySelectorAll('li');
  allSongs.forEach(li => {
    // Compara o dataset com a música atual para adicionar ou remover a classe 'active'
    if (li.dataset.songName === currentSongs[songIndex]) {
      li.classList.add('active');
      // Garante que a música ativa esteja sempre visível na lista
      li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      li.classList.remove('active');
    }
  });
}

// ATENÇÃO: Substitua sua função loadSong() antiga por esta.

// Guarda os dados da melodia atual para fácil acesso
let currentMelodyData = null; 

async function loadSong(song) {
  title.innerText = song.replace(/_/g, ' ');
  audio.src = `music/${song}.mp3`;
  updatePlaylistHighlight();

  // --- LÓGICA PARA CARREGAR MELODIA ---
  try {
    const res = await fetch(`melodies/${song}.json`);
    if (!res.ok) {
      throw new Error('Melody not found');
    }
    currentMelodyData = await res.json();
    renderMelody(currentMelodyData); // Chama a função para renderizar
  } catch (error) {
    clearMelodyColumn(); // Limpa a coluna se o JSON não for encontrado
    currentMelodyData = null;
  }
}

// Tocar a música
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

// Pausar a música
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

// Tocar música anterior
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = currentSongs.length - 1;
  }
  loadSong(currentSongs[songIndex]);
  playSong();
}

// Tocar próxima música
function nextSong() {
  songIndex++;
  if (songIndex > currentSongs.length - 1) {
    songIndex = 0;
  }
  loadSong(currentSongs[songIndex]);
  playSong();
}

// Tocar música aleatória
function playRandomSong() {
  const randomIndex = Math.floor(Math.random() * currentSongs.length);
  songIndex = randomIndex;
  loadSong(currentSongs[songIndex]);
  playSong();
}

// --- NOVAS FUNÇÕES PARA O DROPDOWN ---

// Popula o dropdown com as chaves do nosso objeto de playlists
function populatePlaylistSelector() {
  // Pega os nomes de todas as playlists (ex: "Ordem Alfabética", "Setlist Novas")
  const playlistNames = Object.keys(playlists);
  
  playlistNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.innerText = name;
    playlistSelector.appendChild(option);
  });
  
  // Garante que o dropdown comece com a playlist padrão selecionada
  playlistSelector.value = defaultPlaylistName;
}

// Lida com a troca de playlists no dropdown
function handlePlaylistChange() {
  const selectedPlaylistName = playlistSelector.value;
  currentSongs = playlists[selectedPlaylistName];
  
  songIndex = 0; // Reseta para a primeira música da nova lista
  generatePlaylist(currentSongs);
  loadSong(currentSongs[songIndex]);
  pauseSong(); // Pausa a música para evitar que continue tocando a antiga
}

// Atualiza a barra de progresso
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Define o progresso ao clicar na barra
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// --- Inicialização da Página ---
populatePlaylistSelector(); // Popula o dropdown primeiro
loadSong(currentSongs[songIndex]);
generatePlaylist(currentSongs);


// --- Event Listeners ---

// Tocar/Pausar
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Troca de música pelos botões
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
randomBtn.addEventListener('click', playRandomSong);
playlistSelector.addEventListener('change', handlePlaylistChange);

// Atualizações do áudio
audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);

// --- NOVOS EVENT LISTENERS ---

// 1. Handle do clique na playlist
playlist.addEventListener('click', (e) => {
  // Garante que o clique foi em um item 'LI'
  if (e.target.tagName === 'LI') {
    const clickedSongName = e.target.dataset.songName;
    // Encontra o índice da música clicada na lista ATUAL
    songIndex = currentSongs.findIndex(song => song === clickedSongName);
    loadSong(currentSongs[songIndex]);
    playSong();
  }
});

// 2. Handle da busca/filtro
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase().replace(/ /g, '_'); // Permite buscar com espaços
  const listItems = playlist.querySelectorAll('li');
  
  listItems.forEach(li => {
    const songName = li.dataset.songName.toLowerCase();
    if (songName.includes(searchTerm)) {
      li.style.display = 'block'; // Mostra o item da lista
    } else {
      li.style.display = 'none'; // Esconde o item
    }
  });
});


// --- NOVAS FUNÇÕES PARA EXIBIR MELODIA ---

const melodyContainer = document.getElementById('melody-display-container');

function clearMelodyColumn() {
  if (melodyContainer) {
    melodyContainer.innerHTML = `
      <div class="placeholder">
          <p>Melodia não disponível para esta música.</p>
      </div>`;
  }
}

function renderMelody(data) {
  if (!melodyContainer) return; // Segurança: não faz nada se o container não existir

  // Constrói o HTML para o dropdown de instrumentos
  const instrumentOptions = data.instruments.map((inst, index) => 
    `<option value="${index}">${inst.name}</option>`
  ).join('');

  // Pega o primeiro instrumento como padrão
  const firstInstrument = data.instruments[0];
  
  // Insere a estrutura principal na coluna da direita
  melodyContainer.innerHTML = `
    
    <h3 class="song-title">
      ${data.songTitle.replace(/_/g, ' ')}
      ${(data.review_needed && data.review_needed.length > 0) ? ' *' : ''}
    </h3>

    <select id="instrument-selector">
      ${instrumentOptions}
    </select>
    <div id="melody-content">
      <!-- O conteúdo da melodia será inserido aqui -->
    </div>
  `;
  
  renderInstrumentMelody(firstInstrument);

  const selector = document.getElementById('instrument-selector');
  if (selector) {
    selector.addEventListener('change', handleInstrumentChange);
  }
}

// Função que renderiza a melodia de um instrumento específico
function renderInstrumentMelody(instrumentData) {
  const melodyContentDiv = document.getElementById('melody-content');
  if (!melodyContentDiv) return;

  const melodyHTML = instrumentData.sections.map(section => `
    <div class="section">
      <h4>${section.name}</h4>
      ${section.lines.map(line => `
        <div class="line">
          <span class="melody">${line.melody}</span>
          ${line.arrangement ? `<span class="arrangement">${line.arrangement}</span>` : ''}
          ${line.comment ? `<span class="arrangement">(${line.comment})</span>` : ''}
        </div>
      `).join('')}
    </div>
  `).join('');
  
  melodyContentDiv.innerHTML = melodyHTML;
}

// Função chamada quando o usuário troca de instrumento no dropdown
function handleInstrumentChange(e) {
  if (!currentMelodyData) return;
  
  const selectedIndex = e.target.value;
  const selectedInstrument = currentMelodyData.instruments[selectedIndex];
  
  if (selectedInstrument) {
    renderInstrumentMelody(selectedInstrument);
  }
}