// Fluxo mobile do index.html (viewport <= 768px, ver js/app-init.js): navegação em 3 níveis via History API —
// Home (escolha de playlist) -> Lista (músicas) -> Partitura (tela cheia).
// Fechar a partitura ou voltar do celular chama history.back(), sem handler duplicado.

import {
  playSong,
  pauseSong,
  shuffleArray,
  cycleSpeed,
  updateProgress,
  setProgress,
  generateShareableLink,
} from './audio-player.js';

import {
  getMelodyData,
  clearMelodyColumn,
  renderMelodyMarkdown,
} from './melody-viewer.js';

import {
  generatePlaylist,
  updatePlaylistHighlight,
  PLAYLIST_GROUPS,
} from './playlist-ui.js';

// Grupos exibidos na Home mobile e na página "Amores" — próprios do mobile,
// desacoplados de PLAYLIST_GROUPS (que também alimenta o <select> do desktop,
// esse sim "não mexer"). As chaves de playlist são as mesmas de PLAYLIST_GROUPS.
const MOBILE_HOME_GROUPS = [
  {
    label: 'Playlists',
    entries: [
      '🎭 Carnaval',
      { key: '✨ Novas Carnaval', label: '🥤 Crack Líquido' },
      '♾️ Todas as Músicas',
      { type: 'link', view: 'amoresHub', label: '💕 Amores' },
    ],
  },
];

const AMORES_HUB_GROUP = {
  label: 'Amores',
  entries: ['💕 Repertorio Amores', '⭐ Assinatura', 'Medleys', '🥂 GIG', '✨ Novas'],
};

const player = {
  musicContainer: document.getElementById('music-container'),
  playBtn: document.getElementById('play'),
  prevBtn: document.getElementById('prev'),
  nextBtn: document.getElementById('next'),
  randomBtn: document.getElementById('random'),
  shareBtn: document.getElementById('share'),
  audio: document.getElementById('audio'),
  progress: document.getElementById('progress'),
  progressContainer: document.getElementById('progress-container'),
  title: document.getElementById('title'),
  searchInput: document.getElementById('search-input'),
  playlist: document.getElementById('playlist'),
  melodyContainer: document.getElementById('melody-display-container'),
  speedBtn: document.getElementById('speed-btn'),

  currentSongs: [],
  songIndex: 0,
  currentMelodyData: null,
  currentInstrument: null,
  isInMedleyMode: false,
  isShuffleMode: false,
  playbackRate: 1,
  speeds: [1, 0.75, 0.5, 1.25, 1.5],
  originalSongs: [],
};

const views = {
  home: document.getElementById('view-home'),
  amoresHub: document.getElementById('view-amores-hub'),
  list: document.getElementById('view-list'),
  score: document.getElementById('view-score'),
};

const playlistGroupsContainer = document.getElementById('playlist-groups');
const amoresHubGroupsContainer = document.getElementById('amores-hub-groups');
const listTitle = document.getElementById('list-title');
const listBackBtn = document.getElementById('list-back-btn');
const amoresHubBackBtn = document.getElementById('amores-hub-back-btn');
const scoreCloseBtn = document.getElementById('score-close-btn');

let currentPlaylistKey = null;

// --- Navegação (History API) ---

function showView(viewName) {
  Object.entries(views).forEach(([name, el]) => {
    el.hidden = name !== viewName;
  });
}

function buildUrl(state) {
  const params = new URLSearchParams();
  if (state.playlistKey) params.set('playlist', state.playlistKey);
  if (state.view === 'score' && state.songId) params.set('song', state.songId);
  const query = params.toString();
  return query ? `${window.location.pathname}?${query}` : window.location.pathname;
}

function applyState(state) {
  showView(state.view);

  if (state.view === 'list') {
    ensurePlaylist(state.playlistKey);
  } else if (state.view === 'score') {
    ensurePlaylist(state.playlistKey);
    const songIndex = player.currentSongs.findIndex(s => s === state.songId);
    player.songIndex = songIndex !== -1 ? songIndex : 0;
    loadSong(player.currentSongs[player.songIndex]);
  }
}

function navigate(state) {
  history.pushState(state, '', buildUrl(state));
  applyState(state);
}

function syncSongUrl() {
  const state = { view: 'score', playlistKey: currentPlaylistKey, songId: player.currentSongs[player.songIndex] };
  history.replaceState(state, '', buildUrl(state));
}

window.addEventListener('popstate', (e) => {
  applyState(e.state || { view: 'home' });
});

function openPlaylist(playlistKey) {
  navigate({ view: 'list', playlistKey });
}

function openSong(songId) {
  navigate({ view: 'score', playlistKey: currentPlaylistKey, songId });
  playSong(player);
}

// --- Home / Amores (hub) ---

function resolveGroupCards(group, hasMedleys) {
  return group.entries
    .map(entry => {
      if (entry === 'Medleys') {
        return hasMedleys ? { key: 'Medleys', label: '🧩 Medleys' } : null;
      }
      if (typeof entry === 'object' && entry.type === 'link') {
        return entry;
      }
      const key = typeof entry === 'string' ? entry : entry.key;
      const label = typeof entry === 'string' ? entry : entry.label;
      return playlists[key] ? { key, label } : null;
    })
    .filter(Boolean);
}

function renderGroups(container, groups, onCardClick) {
  container.innerHTML = '';
  const hasMedleys = typeof medleys !== 'undefined' && Object.keys(medleys).length > 0;

  groups.forEach(group => {
    const cards = resolveGroupCards(group, hasMedleys);
    if (cards.length === 0) return;

    const section = document.createElement('section');
    section.className = 'playlist-group';

    const heading = document.createElement('h3');
    heading.className = 'playlist-group-label';
    heading.textContent = group.label;
    section.appendChild(heading);

    const cardsWrap = document.createElement('div');
    cardsWrap.className = 'playlist-cards';

    cards.forEach(card => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'playlist-card';
      button.textContent = card.label;
      button.addEventListener('click', () => onCardClick(card));
      cardsWrap.appendChild(button);
    });

    section.appendChild(cardsWrap);
    container.appendChild(section);
  });
}

function renderHome() {
  renderGroups(playlistGroupsContainer, MOBILE_HOME_GROUPS, (card) => {
    if (card.type === 'link') {
      navigate({ view: card.view });
    } else {
      openPlaylist(card.key);
    }
  });
}

function renderAmoresHub() {
  renderGroups(amoresHubGroupsContainer, [AMORES_HUB_GROUP], (card) => openPlaylist(card.key));
}

function playlistLabel(key) {
  if (key === 'Medleys') return '🧩 Medleys';
  for (const group of PLAYLIST_GROUPS) {
    for (const entry of group.entries) {
      if (entry === 'Medleys') continue;
      const entryKey = typeof entry === 'string' ? entry : entry.key;
      if (entryKey === key) return typeof entry === 'string' ? entry : entry.label;
    }
  }
  return key || '';
}

// --- Lista ---

function ensurePlaylist(playlistKey) {
  if (currentPlaylistKey === playlistKey && player.currentSongs.length > 0) return;
  currentPlaylistKey = playlistKey;

  player.isInMedleyMode = false;

  if (playlistKey === 'Medleys' && typeof medleys !== 'undefined') {
    player.isInMedleyMode = true;
    player.currentSongs = Object.values(medleys).flat();
  } else {
    player.currentSongs = [...(playlists[playlistKey] || [])];
  }

  player.originalSongs = [...player.currentSongs];

  if (player.isShuffleMode) {
    shuffleArray(player.currentSongs);
  }

  generatePlaylist(player, player.currentSongs);
  listTitle.innerText = playlistLabel(playlistKey);
}

function findPlaylistForSong(songId) {
  const allSongsKey = '♾️ Todas as Músicas';
  if (playlists[allSongsKey] && playlists[allSongsKey].includes(songId)) return allSongsKey;
  return Object.keys(playlists).find(key => playlists[key].includes(songId)) || null;
}

// --- Partitura / player ---

function loadSong(song) {
  player.title.innerText = song.replace(/_/g, ' ');
  player.audio.src = `music/${song}.mp3`;
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
  if (player.songIndex < 0) player.songIndex = player.currentSongs.length - 1;
  loadSong(player.currentSongs[player.songIndex]);
  playSong(player);
  syncSongUrl();
}

function nextSong() {
  player.songIndex++;
  if (player.songIndex > player.currentSongs.length - 1) player.songIndex = 0;
  loadSong(player.currentSongs[player.songIndex]);
  playSong(player);
  syncSongUrl();
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
    syncSongUrl();
  } else {
    const currentSongName = player.currentSongs[player.songIndex];
    player.currentSongs = [...player.originalSongs];
    player.songIndex = player.currentSongs.findIndex(s => s === currentSongName);

    generatePlaylist(player, player.currentSongs);
    updatePlaylistHighlight(player);
  }
}

// --- Eventos ---

function addEventListeners() {
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

  player.audio.addEventListener('timeupdate', (e) => updateProgress(player, e));
  player.progressContainer.addEventListener('click', (e) => setProgress(player, e));
  player.audio.addEventListener('ended', nextSong);

  player.playlist.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li || !li.dataset.songName) return;
    openSong(li.dataset.songName);
  });

  player.searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().replace(/ /g, '_');
    const listItems = player.playlist.querySelectorAll('li');
    listItems.forEach(li => {
      if (!li.dataset.songName) return;
      li.style.display = li.dataset.songName.toLowerCase().includes(searchTerm) ? 'block' : 'none';
    });
  });

  listBackBtn.addEventListener('click', () => history.back());
  amoresHubBackBtn.addEventListener('click', () => history.back());
  scoreCloseBtn.addEventListener('click', () => history.back());
}

// --- Init ---

function init() {
  addEventListeners();
  renderHome();
  renderAmoresHub();

  const params = new URLSearchParams(window.location.search);
  const songId = params.get('song');
  const playlistParam = params.get('playlist');

  const deepLinkPlaylistKey = songId
    ? (playlistParam && playlists[playlistParam] && playlists[playlistParam].includes(songId)
      ? playlistParam
      : findPlaylistForSong(songId))
    : null;

  history.replaceState({ view: 'home' }, '', window.location.pathname);

  if (songId && deepLinkPlaylistKey) {
    const listState = { view: 'list', playlistKey: deepLinkPlaylistKey };
    history.pushState(listState, '', buildUrl(listState));

    const scoreState = { view: 'score', playlistKey: deepLinkPlaylistKey, songId };
    history.pushState(scoreState, '', buildUrl(scoreState));

    applyState(scoreState);
    return;
  }

  applyState({ view: 'home' });
}

init();
