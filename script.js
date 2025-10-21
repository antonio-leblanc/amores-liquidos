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
const searchInput = document.getElementById('search-input');
const playlist = document.getElementById('playlist');

let currentSongs = playlists[defaultPlaylistName];
let songIndex = 0;

function generatePlaylist(songs) {
  playlist.innerHTML = '';
  songs.forEach((song) => {
    const li = document.createElement('li');
    li.dataset.songName = song;
    li.textContent = song.replace(/_/g, ' ');
    playlist.appendChild(li);
  });
}

function updatePlaylistHighlight() {
  const allSongs = playlist.querySelectorAll('li');
  allSongs.forEach(li => {
    if (li.dataset.songName === currentSongs[songIndex]) {
      li.classList.add('active');
      li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      li.classList.remove('active');
    }
  });
}

let currentMelodyData = null;

// Função para buscar dados de partituras no song-data-final.js
function getMelodyData(songId) {
  const melodyData = songData.find(song => song.id === songId);
  return melodyData && melodyData.melodies ? melodyData : null;
}

async function loadSong(song) {
  title.innerText = song.replace(/_/g, ' ');
  audio.src = `music/${song}.mp3`;
  updatePlaylistHighlight();

  // Busca dados de partituras no song-data-final.js
  const melodyData = getMelodyData(song);
  
  if (melodyData && melodyData.melodies) {
    currentMelodyData = melodyData;
    renderMelodyMarkdown(currentMelodyData);
  } else {
    clearMelodyColumn();
    currentMelodyData = null;
  }
}

function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');
  audio.pause();
}

function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = currentSongs.length - 1;
  }
  loadSong(currentSongs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;
  if (songIndex > currentSongs.length - 1) {
    songIndex = 0;
  }
  loadSong(currentSongs[songIndex]);
  playSong();
}

function playRandomSong() {
  const randomIndex = Math.floor(Math.random() * currentSongs.length);
  songIndex = randomIndex;
  loadSong(currentSongs[songIndex]);
  playSong();
}

function populatePlaylistSelector() {
  const playlistNames = Object.keys(playlists);
  
  playlistNames.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.innerText = name;
    playlistSelector.appendChild(option);
  });
  
  playlistSelector.value = defaultPlaylistName;
}

function handlePlaylistChange() {
  const selectedPlaylistName = playlistSelector.value;
  currentSongs = playlists[selectedPlaylistName];
  
  songIndex = 0;
  generatePlaylist(currentSongs);
  loadSong(currentSongs[songIndex]);
  pauseSong();
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

populatePlaylistSelector();
loadSong(currentSongs[songIndex]);
generatePlaylist(currentSongs);

playBtn.addEventListener('click', () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
randomBtn.addEventListener('click', playRandomSong);
playlistSelector.addEventListener('change', handlePlaylistChange);

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
audio.addEventListener('ended', nextSong);

playlist.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    const clickedSongName = e.target.dataset.songName;
    songIndex = currentSongs.findIndex(song => song === clickedSongName);
    loadSong(currentSongs[songIndex]);
    playSong();
  }
});

searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase().replace(/ /g, '_');
  const listItems = playlist.querySelectorAll('li');
  
  listItems.forEach(li => {
    const songName = li.dataset.songName.toLowerCase();
    if (songName.includes(searchTerm)) {
      li.style.display = 'block';
    } else {
      li.style.display = 'none';
    }
  });
});


const melodyContainer = document.getElementById('melody-display-container');

function clearMelodyColumn() {
  if (melodyContainer) {
    melodyContainer.innerHTML = `
      <div class="placeholder">
          <p>Melodia não disponível para esta música.</p>
      </div>`;
  }
}

function renderMelodyMarkdown(data) {
  if (!melodyContainer) return;

  const instrumentOptions = Object.keys(data.melodies).map(instrument => 
    `<option value="${instrument}">${instrument}</option>`
  ).join('');

  const firstInstrument = Object.keys(data.melodies)[0];
  
  melodyContainer.innerHTML = `
    <h3 class="song-title">
      ${data.title}
    </h3>

    <select id="instrument-selector">
      ${instrumentOptions}
    </select>
    <div id="melody-content">
    </div>
  `;
  
  loadInstrumentMarkdown(firstInstrument, data.melodies[firstInstrument]);

  const selector = document.getElementById('instrument-selector');
  if (selector) {
    selector.addEventListener('change', (e) => {
      const selectedInstrument = e.target.value;
      loadInstrumentMarkdown(selectedInstrument, data.melodies[selectedInstrument]);
    });
  }
}

function loadInstrumentMarkdown(instrumentName, markdownFile) {
  const melodyContentDiv = document.getElementById('melody-content');
  if (!melodyContentDiv) return;

  // Carrega e renderiza o arquivo markdown
  fetch(markdownFile)
    .then(response => {
      if (!response.ok) throw new Error(`Arquivo não encontrado: ${markdownFile}`);
      return response.text();
    })
    .then(markdownText => {
      // Usa a biblioteca marked para converter markdown em HTML
      if (typeof marked !== 'undefined') {
        melodyContentDiv.innerHTML = marked.parse(markdownText);
      } else {
        // Fallback: exibe o markdown como texto simples
        melodyContentDiv.innerHTML = `<pre>${markdownText}</pre>`;
      }
    })
    .catch(error => {
      console.error('Erro ao carregar partitura:', error);
      melodyContentDiv.innerHTML = `<p style="color: red;">Erro ao carregar partitura: ${error.message}</p>`;
    });
}
