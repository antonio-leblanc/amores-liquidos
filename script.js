const player = {
  // Elementos da DOM
  musicContainer: document.getElementById('music-container'),
  playBtn: document.getElementById('play'),
  prevBtn: document.getElementById('prev'),
  nextBtn: document.getElementById('next'),
  randomBtn: document.getElementById('random'),
  playlistSelector: document.getElementById('playlist-selector'),
  audio: document.getElementById('audio'),
  progress: document.getElementById('progress'),
  progressContainer: document.getElementById('progress-container'),
  title: document.getElementById('title'),
  searchInput: document.getElementById('search-input'),
  playlist: document.getElementById('playlist'),
  melodyContainer: document.getElementById('melody-display-container'),
  headerTitle: document.querySelector('.header h1'), // Adicionado para referenciar o h1
  togglePlayerBtn: document.getElementById('toggle-player-btn'), // Botão para recolher

  // Estado do Player
  currentSongs: playlists[defaultPlaylistName],
  songIndex: 0,
  currentMelodyData: null,
  currentInstrument: null,

  init: function () {
    this.populatePlaylistSelector();
    this.addEventListeners();

    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('song');
    const timeParam = urlParams.get('t');

    if (timeParam) {
      const time = parseInt(timeParam);
      if (!isNaN(time)) {
        const onCanPlay = () => {
          const isCorrectSong = songId && this.audio.src.includes(`/${songId}.mp3`);
          const isDefaultSongWithTime = !songId;

          if (isCorrectSong || isDefaultSongWithTime) {
            this.audio.currentTime = time;
            this.audio.removeEventListener('canplay', onCanPlay);
          }
        };
        this.audio.addEventListener('canplay', onCanPlay);
      }
    }

    let songHandledByUrl = false;
    if (songId && songsAlphabetical.includes(songId)) {
      if (this.playlistSelector.value !== defaultPlaylistName) {
        this.playlistSelector.value = defaultPlaylistName;
        this.handlePlaylistChange();
      } else {
        this.generatePlaylist(this.currentSongs);
      }

      const songIndex = this.currentSongs.findIndex(s => s === songId);
      if (songIndex !== -1) {
        this.songIndex = songIndex;
        this.loadSong(this.currentSongs[this.songIndex]);
        songHandledByUrl = true;
      }
    }

    if (!songHandledByUrl) {
      this.generatePlaylist(this.currentSongs);
      this.loadSong(this.currentSongs[this.songIndex]);
    }
    // Chamar handlePlaylistChange no init para aplicar o tema correto se a playlist inicial for Carnaval
    this.handlePlaylistChange();

    // Recolher o player por padrão em mobile
    if (window.innerWidth <= 768) {
      this.musicContainer.classList.add('player-recolhido');
      document.body.classList.add('player-is-recolhido');
    }
  },

  generateShareableLink: function () {
    const songId = this.currentSongs[this.songIndex];
    const time = Math.floor(this.audio.currentTime);

    if (!songId) return; // Não faz nada se nenhuma música estiver carregada

    const newUrl = `${window.location.pathname}?song=${songId}&t=${time}`;
    const fullUrl = `${window.location.origin}${newUrl}`;

    // Atualiza a URL na barra de endereço sem recarregar a página
    history.replaceState({ path: newUrl }, '', newUrl);

    // Copia a URL completa para a área de transferência
    navigator.clipboard.writeText(fullUrl).then(() => {
      // Exibe uma mensagem de confirmação
      alert(`Link para "${songId.replace(/_/g, ' ')}" aos ${time}s copiado!`);
    }).catch(err => {
      console.error('Erro ao copiar o link: ', err);
      alert('Erro ao copiar o link.');
    });
  },

  addEventListeners: function () {
    this.playBtn.addEventListener('click', () => {
      if (this.audio.paused) {
        this.playSong();
      } else {
        this.pauseSong();
      }
    });

    this.prevBtn.addEventListener('click', this.prevSong.bind(this));
    this.nextBtn.addEventListener('click', this.nextSong.bind(this));
    this.randomBtn.addEventListener('click', this.playRandomSong.bind(this));
    this.playlistSelector.addEventListener('change', this.handlePlaylistChange.bind(this));

    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.progressContainer.addEventListener('click', this.setProgress.bind(this));
    this.audio.addEventListener('ended', this.nextSong.bind(this));

    this.togglePlayerBtn.addEventListener('click', () => {
      this.musicContainer.classList.toggle('player-recolhido');
      document.body.classList.toggle('player-is-recolhido');
    });

    this.playlist.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        const clickedSongName = e.target.dataset.songName;
        this.songIndex = this.currentSongs.findIndex(song => song === clickedSongName);
        this.loadSong(this.currentSongs[this.songIndex]);
        this.playSong();
      }
    });

    this.searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().replace(/ /g, '_');
      const listItems = this.playlist.querySelectorAll('li');
      listItems.forEach(li => {
        const songName = li.dataset.songName.toLowerCase();
        li.style.display = songName.includes(searchTerm) ? 'block' : 'none';
      });
    });

    document.addEventListener('keydown', (e) => {
      // If an input is focused, only handle specific keys if we want to override default behavior
      // For now, let normal input behavior (including browser Ctrl+F) work inside inputs
      if (e.target.tagName === 'INPUT' && !(e.ctrlKey && e.code === 'KeyF')) {
        return; // Don't process other shortcuts if in an input field, unless it's Ctrl+F
      }

      // Handle Ctrl+F for search input focus
      if (e.ctrlKey && e.code === 'KeyF') {
        e.preventDefault(); // Prevent browser's find dialog
        this.searchInput.focus();
        return; // Stop further processing after focusing
      }

      // Only prevent default for keys we explicitly handle outside of inputs
      switch (e.code) {
        case 'Space':
        case 'ArrowDown':
        case 'ArrowUp':
        case 'ArrowRight':
        case 'ArrowLeft':
        case 'KeyA':
        case 'KeyS':
        case 'Digit0':
          e.preventDefault(); // Prevent default browser action for these keys
          break;
      }

      // Process the shortcuts
      switch (e.code) {
        case 'Space':
          this.audio.paused ? this.playSong() : this.pauseSong();
          break;
        case 'ArrowDown': // Next song
          this.nextSong();
          break;
        case 'ArrowUp': // Previous song
          this.prevSong();
          break;
        case 'ArrowRight': // Fast forward 5 seconds
          this.audio.currentTime += 5;
          break;
        case 'ArrowLeft': // Rewind 5 seconds
          this.audio.currentTime -= 5;
          break;
        case 'KeyA':
          this.playRandomSong();
          break;
        case 'KeyS':
          this.generateShareableLink();
          break;
        case 'Digit0': // Key '0'
          this.audio.currentTime = 0;
          if (!this.audio.paused) { // If song was playing, keep it playing
            this.playSong();
          }
          break;
      }
    });
  },

  generatePlaylist: function (songs) {
    this.playlist.innerHTML = '';
    songs.forEach((song) => {
      const li = document.createElement('li');
      li.dataset.songName = song;
      li.textContent = song.replace(/_/g, ' ');
      this.playlist.appendChild(li);
    });
  },

  updatePlaylistHighlight: function () {
    const allSongs = this.playlist.querySelectorAll('li');
    allSongs.forEach(li => {
      if (li.dataset.songName === this.currentSongs[this.songIndex]) {
        li.classList.add('active');
        li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        li.classList.remove('active');
      }
    });
  },

  getMelodyData: function (songId) {
    const melodyData = songData.find(song => song.id === songId);
    return melodyData && melodyData.melodies ? melodyData : null;
  },

  saveInstrumentState: function (instrument) {
    localStorage.setItem('selectedInstrument', instrument);
    this.currentInstrument = instrument;
  },

  loadInstrumentState: function () {
    return localStorage.getItem('selectedInstrument');
  },

  loadSong: async function (song) {
    this.title.innerText = song.replace(/_/g, ' ');

    const currentPlaylist = this.playlistSelector.value;
    const folder = currentPlaylist === '🎭 Carnaval' ? 'music_carnaval' : 'music';
    this.audio.src = `${folder}/${song}.mp3`;

    this.updatePlaylistHighlight();

    const melodyData = this.getMelodyData(song);
    if (melodyData && melodyData.melodies) {
      this.currentMelodyData = melodyData;
      this.renderMelodyMarkdown(this.currentMelodyData);
    } else {
      this.clearMelodyColumn();
      this.currentMelodyData = null;
    }
  },

  playSong: function () {
    this.musicContainer.classList.add('play');
    this.playBtn.querySelector('i.fas').classList.remove('fa-play');
    this.playBtn.querySelector('i.fas').classList.add('fa-pause');
    this.audio.play();
  },

  pauseSong: function () {
    this.musicContainer.classList.remove('play');
    this.playBtn.querySelector('i.fas').classList.add('fa-play');
    this.playBtn.querySelector('i.fas').classList.remove('fa-pause');
    this.audio.pause();
  },

  prevSong: function () {
    this.songIndex--;
    if (this.songIndex < 0) {
      this.songIndex = this.currentSongs.length - 1;
    }
    this.loadSong(this.currentSongs[this.songIndex]);
    this.playSong();
  },

  nextSong: function () {
    this.songIndex++;
    if (this.songIndex > this.currentSongs.length - 1) {
      this.songIndex = 0;
    }
    this.loadSong(this.currentSongs[this.songIndex]);
    this.playSong();
  },

  playRandomSong: function () {
    const randomIndex = Math.floor(Math.random() * this.currentSongs.length);
    this.songIndex = randomIndex;
    this.loadSong(this.currentSongs[this.songIndex]);
    this.playSong();
  },

  populatePlaylistSelector: function () {
    const playlistNames = Object.keys(playlists);
    playlistNames.forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.innerText = name;
      this.playlistSelector.appendChild(option);
    });
    this.playlistSelector.value = defaultPlaylistName;
  },

  handlePlaylistChange: function () {
    const selectedPlaylistName = this.playlistSelector.value;
    this.currentSongs = playlists[selectedPlaylistName];
    this.songIndex = 0;
    this.generatePlaylist(this.currentSongs);
    this.loadSong(this.currentSongs[this.songIndex]);
    this.pauseSong();

    // Lógica para mudar o tema e o título
    if (selectedPlaylistName === '🎭 Carnaval') {
      document.body.classList.add('carnaval-theme');
      this.headerTitle.innerText = '🎭 Carnaval 🎊';
    } else {
      document.body.classList.remove('carnaval-theme');
      this.headerTitle.innerText = '💕Amores Liquidos💦';
    }
  },

  updateProgress: function (e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    this.progress.style.width = `${progressPercent}%`;
  },

  setProgress: function (e) {
    const width = this.progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audio.duration;
    this.audio.currentTime = (clickX / width) * duration;
  },

  clearMelodyColumn: function () {
    if (this.melodyContainer) {
      this.melodyContainer.innerHTML = `
        <div class="placeholder">
            <p>Melodia não disponível para esta música.</p>
        </div>`;
    }
    const instrumentSelectorContainer = document.querySelector('.instrument-selector-container');
    if (instrumentSelectorContainer) {
      instrumentSelectorContainer.style.display = 'none';
    }
  },

  renderMelodyMarkdown: function (data) {
    if (!this.melodyContainer) return;

    const availableInstruments = Object.keys(data.melodies);
    const instrumentOptions = availableInstruments.map(instrument =>
      `<option value="${instrument}">${instrument}</option>`
    ).join('');

    const savedInstrument = this.loadInstrumentState();
    const selectedInstrument = (savedInstrument && availableInstruments.includes(savedInstrument))
      ? savedInstrument
      : availableInstruments[0];

    this.melodyContainer.innerHTML = `<div id="melody-content"></div>`;

    const instrumentSelectorContainer = document.querySelector('.instrument-selector-container');
    const instrumentSelector = document.createElement('select');
    instrumentSelector.id = 'instrument-selector';
    instrumentSelector.innerHTML = instrumentOptions;
    instrumentSelectorContainer.innerHTML = '';
    instrumentSelectorContainer.appendChild(instrumentSelector);
    instrumentSelectorContainer.style.display = 'block';

    const selector = document.getElementById('instrument-selector');
    if (selector) {
      selector.value = selectedInstrument;
      selector.addEventListener('change', (e) => {
        const newInstrument = e.target.value;
        this.saveInstrumentState(newInstrument);
        this.loadInstrumentMarkdown(newInstrument, data.melodies[newInstrument]);
      });
    }

    this.loadInstrumentMarkdown(selectedInstrument, data.melodies[selectedInstrument]);
  },

  loadInstrumentMarkdown: function (instrumentName, markdownFile) {
    const melodyContentDiv = document.getElementById('melody-content');
    if (!melodyContentDiv) return;

    fetch(markdownFile)
      .then(response => {
        if (!response.ok) throw new Error(`Arquivo não encontrado: ${markdownFile}`);
        return response.text();
      })
      .then(markdownText => {
        if (typeof marked !== 'undefined') {
          melodyContentDiv.innerHTML = marked.parse(markdownText);
        } else {
          melodyContentDiv.innerHTML = `<pre>${markdownText}</pre>`;
        }
      })
      .catch(error => {
        console.error('Erro ao carregar partitura:', error);
        melodyContentDiv.innerHTML = `<p style="color: red;">Erro ao carregar partitura: ${error.message}</p>`;
      });
  }
};

// Inicializa o player
player.init();

