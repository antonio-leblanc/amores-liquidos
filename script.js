// --- Elementos do DOM ---
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const randomBtn = document.getElementById('random');
const modeToggle = document.getElementById('mode-toggle');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

const searchInput = document.getElementById('search-input');
const playlist = document.getElementById('playlist');


// --- Estado da Aplicação ---
let currentSongs = [...songsAlphabetical];
let isAlphabetical = true;
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

// Carrega os detalhes da música e atualiza o destaque na playlist
function loadSong(song) {
  title.innerText = song.replace(/_/g, ' '); // Deixa o título do player mais legível também
  audio.src = `music/${song}.mp3`;
  updatePlaylistHighlight(); // Atualiza o item ativo na lista
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

// Troca entre o modo alfabético e o setlist, e recarrega a playlist
function switchMode() {
  if (modeToggle.checked) {
    currentSongs = [...eventSetlist];
    isAlphabetical = false;
  } else {
    currentSongs = [...songsAlphabetical];
    isAlphabetical = true;
  }
  
  songIndex = 0; // Reseta para a primeira música
  loadSong(currentSongs[songIndex]);
  generatePlaylist(currentSongs); // Recarrega a lista com a nova ordem
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
loadSong(currentSongs[songIndex]);
generatePlaylist(currentSongs); // Gera a playlist inicial

// --- Event Listeners ---

// Tocar/Pausar
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Troca de música pelos botões
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
randomBtn.addEventListener('click', playRandomSong);
modeToggle.addEventListener('change', switchMode);

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