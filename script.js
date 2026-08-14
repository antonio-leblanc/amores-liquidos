import {
  playSong,
  pauseSong,
  shuffleArray,
  cycleSpeed,
  adjustSpeed,
  updateProgress,
  setProgress,
  generateShareableLink,
} from './js/audio-player.js';

import {
  getMelodyData,
  clearMelodyColumn,
  renderMelodyMarkdown,
} from './js/melody-viewer.js';

import {
  generatePlaylist,
  updatePlaylistHighlight,
  populatePlaylistSelector,
} from './js/playlist-ui.js';

const player = {

  musicContainer: document.getElementById('music-container'),
  playBtn: document.getElementById('play'),
  prevBtn: document.getElementById('prev'),
  nextBtn: document.getElementById('next'),
  randomBtn: document.getElementById('random'),
  shareBtn: document.getElementById('share'),
  playlistSelector: document.getElementById('playlist-selector'),
  audio: document.getElementById('audio'),
  progress: document.getElementById('progress'),
  progressContainer: document.getElementById('progress-container'),
  title: document.getElementById('title'),
  searchInput: document.getElementById('search-input'),
  playlist: document.getElementById('playlist'),
  melodyContainer: document.getElementById('melody-display-container'),
  headerTitle: document.querySelector('.header h1'),
  togglePlayerBtn: document.getElementById('toggle-player-btn'),
  speedBtn: document.getElementById('speed-btn'),
  mobileSearchFab: document.getElementById('mobile-search-fab'),

  currentSongs: playlists[defaultPlaylistName],
  songIndex: 0,
  currentMelodyData: null,
  currentInstrument: null,
  isInMedleyMode: false,
  isShuffleMode: false,
  playbackRate: 1,
  speeds: [1, 0.75, 0.5, 1.25, 1.5],
  originalSongs: [],
};

function init() {
  populatePlaylistSelector(player);
  addEventListeners();

  const urlParams = new URLSearchParams(window.location.search);
  const songId = urlParams.get('song');
  const timeParam = urlParams.get('t');

  if (timeParam) {
    const time = parseInt(timeParam);
    if (!isNaN(time)) {
      const onCanPlay = () => {
        const isCorrectSong = songId && player.audio.src.includes(`/${songId}.mp3`);
        const isDefaultSongWithTime = !songId;

        if (isCorrectSong || isDefaultSongWithTime) {
          player.audio.currentTime = time;
          player.audio.removeEventListener('canplay', onCanPlay);
        }
      };
      player.audio.addEventListener('canplay', onCanPlay);
    }
  }

  const allSongsPlaylist = '♾️ Todas as Músicas';
  let songHandledByUrl = false;
  const allSongs = playlists[allSongsPlaylist] || [];

  if (songId && allSongs.includes(songId)) {
    if (player.playlistSelector.value !== allSongsPlaylist) {
      player.playlistSelector.value = allSongsPlaylist;
      handlePlaylistChange();
    } else {
      generatePlaylist(player, player.currentSongs);
    }

    const songIndex = player.currentSongs.findIndex(s => s === songId);
    if (songIndex !== -1) {
      player.songIndex = songIndex;
      loadSong(player.currentSongs[player.songIndex]);
      songHandledByUrl = true;
    }
  }

  if (!songHandledByUrl) {
    generatePlaylist(player, player.currentSongs);
    loadSong(player.currentSongs[player.songIndex]);
  }



  // if (window.innerWidth <= 768) {
  //   player.musicContainer.classList.add('player-recolhido');
  //   document.body.classList.add('player-is-recolhido');
  // }
}

function loadSong(song) {
  player.title.innerText = song.replace(/_/g, ' ');

  // --- MUDANÇA: Pasta única de música 'music/' para todos os arquivos ---
  const folder = 'music';
  player.audio.src = `${folder}/${song}.mp3`;
  player.audio.playbackRate = player.playbackRate;

  updatePlaylistHighlight(player);

  const melodyData = getMelodyData(song);
  if (melodyData && melodyData.melodies) {
    player.currentMelodyData = melodyData;
    renderMelodyMarkdown(player, player.currentMelodyData);
  } else {
    clearMelodyColumn(player);
    player.currentMelodyData = null;
  }
}

function prevSong() {
  player.songIndex--;
  if (player.songIndex < 0) {
    player.songIndex = player.currentSongs.length - 1;
  }
  loadSong(player.currentSongs[player.songIndex]);
  playSong(player);
}

function nextSong() {
  player.songIndex++;
  if (player.songIndex > player.currentSongs.length - 1) {
    player.songIndex = 0;
  }
  loadSong(player.currentSongs[player.songIndex]);
  playSong(player);
}

function toggleShuffle() {
  player.isShuffleMode = !player.isShuffleMode;
  player.randomBtn.classList.toggle('active', player.isShuffleMode);

  if (player.isShuffleMode) {
    if (player.originalSongs.length === 0 || player.originalSongs.length !== player.currentSongs.length) {
      player.originalSongs = [...player.currentSongs];
    }

    shuffleArray(player.currentSongs);
    player.songIndex = 0;

    generatePlaylist(player, player.currentSongs);
    loadSong(player.currentSongs[player.songIndex]);
    playSong(player);
  } else {
    const currentSongName = player.currentSongs[player.songIndex];
    player.currentSongs = [...player.originalSongs];
    player.songIndex = player.currentSongs.findIndex(s => s === currentSongName);

    generatePlaylist(player, player.currentSongs);
    updatePlaylistHighlight(player);
  }
}

function handlePlaylistChange() {
  const selectedPlaylistName = player.playlistSelector.value;

  player.isInMedleyMode = false;
  player.currentMedleyName = null;

  if (selectedPlaylistName === 'Medleys' && typeof medleys !== 'undefined') {
    player.isInMedleyMode = true;
    player.currentSongs = Object.values(medleys).flat();
  } else {
    player.currentSongs = playlists[selectedPlaylistName];
  }

  player.originalSongs = [...player.currentSongs];

  if (player.isShuffleMode) {
    shuffleArray(player.currentSongs);
  }

  player.songIndex = 0;
  generatePlaylist(player, player.currentSongs);
  loadSong(player.currentSongs[player.songIndex]);
  pauseSong(player);

  if (selectedPlaylistName === '🎭 Carnaval' || selectedPlaylistName === '♾️ Todas as Músicas') {
    document.body.classList.add('carnaval-theme');
    player.headerTitle.innerText = selectedPlaylistName.includes('Carnaval') ? 'Carnaval' : 'Todas as Músicas';
  } else {
    document.body.classList.remove('carnaval-theme');
    player.headerTitle.innerText = 'Amores Liquidos';
  }
}

function addEventListeners() {
  player.headerTitle.addEventListener('click', () => {
    const carnivalDate = new Date('2027-02-06T00:00:00');
    const now = new Date();
    const diff = carnivalDate - now;

    if (diff < 0) {
      alert('É CARNAVAL!!! 🎉');
    } else {
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const dayText = days === 1 ? 'dia' : 'dias';
      alert(`Faltam ${days} ${dayText} para o Carnaval 2027! 🎭✨`);
    }
  });

  player.playBtn.addEventListener('click', () => {
    if (player.audio.paused) {
      playSong(player);
    } else {
      pauseSong(player);
    }
  });

  player.prevBtn.addEventListener('click', prevSong);
  player.nextBtn.addEventListener('click', nextSong);
  player.randomBtn.addEventListener('click', toggleShuffle);
  player.shareBtn.addEventListener('click', () => generateShareableLink(player));
  player.speedBtn.addEventListener('click', () => cycleSpeed(player));
  player.playlistSelector.addEventListener('change', handlePlaylistChange);

  player.audio.addEventListener('timeupdate', (e) => updateProgress(player, e));
  player.progressContainer.addEventListener('click', (e) => setProgress(player, e));
  player.audio.addEventListener('ended', nextSong);

  player.togglePlayerBtn.addEventListener('click', () => {
    player.musicContainer.classList.toggle('player-recolhido');
    document.body.classList.toggle('player-is-recolhido');
  });

  player.mobileSearchFab.addEventListener('click', () => {
    player.searchInput.scrollIntoView({ behavior: 'smooth', block: 'start' });
    player.searchInput.focus();
  });

  player.playlist.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
      const clickedSongName = e.target.dataset.songName;
      player.songIndex = player.currentSongs.findIndex(song => song === clickedSongName);
      loadSong(player.currentSongs[player.songIndex]);
      playSong(player);
    }
  });

  player.searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().replace(/ /g, '_');
    const listItems = player.playlist.querySelectorAll('li');
    listItems.forEach(li => {
      const songName = li.dataset.songName.toLowerCase();
      li.style.display = songName.includes(searchTerm) ? 'block' : 'none';
    });
  });

  document.addEventListener('keydown', (e) => {

    if (e.target.tagName === 'INPUT') {
      if (e.code === 'Escape') {
        player.searchInput.blur();
        e.preventDefault();
        return;
      }
      // Allow normal input behavior (including browser Ctrl+F) unless explicitly overridden
      if (!(e.ctrlKey && e.code === 'KeyF')) {
        return;
      }
    }

    if (e.ctrlKey && e.code === 'KeyF') {
      e.preventDefault();
      player.searchInput.focus();
      return;
    }

    switch (e.code) {
      case 'Space':
      case 'ArrowDown':
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ArrowLeft':
      case 'KeyA':
      case 'KeyS':
      case 'BracketLeft':
      case 'BracketRight':
      case 'Digit0':
        e.preventDefault();
        break;
    }

    switch (e.code) {
      case 'Space':
        player.audio.paused ? playSong(player) : pauseSong(player);
        break;
      case 'ArrowDown':
        nextSong();
        break;
      case 'ArrowUp':
        prevSong();
        break;
      case 'ArrowRight':
        player.audio.currentTime += 5;
        break;
      case 'ArrowLeft':
        player.audio.currentTime -= 5;
        break;
      case 'KeyA':
        toggleShuffle();
        break;
      case 'KeyS':
        generateShareableLink(player);
        break;
      case 'BracketLeft':
        adjustSpeed(player, -1);
        break;
      case 'BracketRight':
        adjustSpeed(player, 1);
        break;
      case 'Digit0':
        player.audio.currentTime = 0;
        if (!player.audio.paused) {
          playSong(player);
        }
        break;
    }
  });
}

init();
