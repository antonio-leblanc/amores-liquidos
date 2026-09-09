// Mockup visual "estilo Spotify" — spotibloco.html. Reaproveita songData/playlists
// de repertoire-data.js (script clássico, mesmo escopo léxico global) e a lógica
// real de renderização de partitura de melody-viewer.js — o songbook é a essência.

import { getMelodyData, renderMelodyMarkdown, clearMelodyColumn } from './melody-viewer.js';

const HOME_PLAYLIST_KEYS = [
  '💕 Repertorio Amores',
  '⭐ Assinatura',
  '✨ Novas',
  '🥂 GIG',
  '🎭 Carnaval',
  '✨ Novas Carnaval',
  '♾️ Todas as Músicas',
];

const ART_GRADIENTS = [
  'linear-gradient(135deg, #7000ff, #ff2fc0)',
  'linear-gradient(135deg, #0072ff, #7000ff)',
  'linear-gradient(135deg, #ff2fc0, #ff9900)',
  'linear-gradient(135deg, #00c6ff, #0072ff)',
  'linear-gradient(135deg, #ff2fc0, #7000ff)',
];

const SPEEDS = [1, 1.25, 1.5, 0.75];

const songsById = Object.fromEntries(songData.map(song => [song.id, song]));

const els = {
  home: document.getElementById('view-home'),
  cardsRow: document.getElementById('playlist-cards'),
  recentList: document.getElementById('recent-list'),

  list: document.getElementById('view-list'),
  listBackBtn: document.getElementById('list-back-btn'),
  listTitle: document.getElementById('list-title'),
  searchInput: document.getElementById('search-input'),
  trackList: document.getElementById('track-list'),

  miniPlayer: document.getElementById('mini-player'),
  miniProgress: document.getElementById('mini-progress'),
  miniTitle: document.getElementById('mini-title'),
  miniPlayBtn: document.getElementById('mini-play-btn'),

  nowPlaying: document.getElementById('view-nowplaying'),
  npCloseBtn: document.getElementById('np-close-btn'),
  npShareBtn: document.getElementById('np-share-btn'),
  npTitle: document.getElementById('np-title'),
  npProgressContainer: document.getElementById('np-progress-container'),
  npProgress: document.getElementById('np-progress'),
  npTimeCurrent: document.getElementById('np-time-current'),
  npTimeTotal: document.getElementById('np-time-total'),
  npRandomBtn: document.getElementById('np-random-btn'),
  npPrevBtn: document.getElementById('np-prev-btn'),
  npPlayBtn: document.getElementById('np-play-btn'),
  npNextBtn: document.getElementById('np-next-btn'),
  npSpeedBtn: document.getElementById('np-speed-btn'),
  npMelody: document.getElementById('np-melody'),

  audio: document.getElementById('audio'),
};

const state = {
  currentSongs: [],
  songIndex: 0,
  playbackRate: 1,
};

// melody-viewer.js espera um objeto "player" com melodyContainer.
const melodyPlayer = {
  melodyContainer: els.npMelody,
  currentInstrument: null,
};

function artGradientFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return ART_GRADIENTS[hash % ART_GRADIENTS.length];
}

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function titleOf(id) {
  return songsById[id] ? songsById[id].title : id.replace(/_/g, ' ');
}

function showView(view) {
  [els.home, els.list, els.nowPlaying].forEach(v => v.hidden = (v !== view));
}

// --- Home ---
function renderHome() {
  HOME_PLAYLIST_KEYS.forEach(key => {
    if (!playlists[key]) return;
    const card = document.createElement('button');
    card.className = 'playlist-card';
    card.innerHTML = `
      <div class="playlist-card-art" style="background:${artGradientFor(key)}">
        <i class="fas fa-music"></i>
      </div>
      <span class="playlist-card-label">${key}</span>
    `;
    card.addEventListener('click', () => openList(key));
    els.cardsRow.appendChild(card);
  });

  const recentIds = (playlists['💕 Repertorio Amores'] || []).slice(0, 6);
  renderTrackRows(els.recentList, recentIds);
}

function renderTrackRows(container, ids) {
  container.innerHTML = '';
  ids.forEach(id => {
    const li = document.createElement('li');
    const row = document.createElement('button');
    row.className = 'track-row';
    row.dataset.songId = id;
    row.innerHTML = `
      <div class="track-art" style="background:${artGradientFor(id)}"><i class="fas fa-music"></i></div>
      <div class="track-text">
        <span class="track-title">${titleOf(id)}</span>
        <span class="track-subtitle">Amores Líquidos</span>
      </div>
    `;
    row.addEventListener('click', () => playFromList(ids, ids.indexOf(id)));
    li.appendChild(row);
    container.appendChild(li);
  });
  updatePlayingHighlight();
}

// --- Lista de playlist ---
function openList(key) {
  els.listTitle.textContent = key;
  els.list.dataset.songs = JSON.stringify(playlists[key]);
  els.searchInput.value = '';
  renderTrackRows(els.trackList, playlists[key]);
  showView(els.list);
}

els.listBackBtn.addEventListener('click', () => showView(els.home));

els.searchInput.addEventListener('input', () => {
  const term = els.searchInput.value.trim().toLowerCase();
  const allIds = JSON.parse(els.list.dataset.songs || '[]');
  const filtered = term
    ? allIds.filter(id => titleOf(id).toLowerCase().includes(term))
    : allIds;
  renderTrackRows(els.trackList, filtered);
});

// --- Player ---
function playFromList(ids, index) {
  state.currentSongs = ids;
  state.songIndex = index;
  loadSong();
  play();
  showView(els.nowPlaying);
}

function loadSong() {
  const id = state.currentSongs[state.songIndex];
  els.audio.src = `music/${id}.mp3`;
  els.miniTitle.textContent = titleOf(id);
  els.npTitle.textContent = titleOf(id);
  const gradient = artGradientFor(id);
  document.querySelectorAll('.np-art-sm, .mini-player-art').forEach(el => el.style.background = gradient);
  els.miniPlayer.hidden = false;
  updatePlayingHighlight();

  const melodyData = getMelodyData(id);
  if (melodyData) {
    renderMelodyMarkdown(melodyPlayer, melodyData);
  } else {
    clearMelodyColumn(melodyPlayer);
  }
}

function play() {
  els.audio.playbackRate = state.playbackRate;
  els.audio.play();
  document.querySelectorAll('.mini-player-play i, .np-play-btn i').forEach(i => {
    i.classList.remove('fa-play');
    i.classList.add('fa-pause');
  });
}

function pause() {
  els.audio.pause();
  document.querySelectorAll('.mini-player-play i, .np-play-btn i').forEach(i => {
    i.classList.remove('fa-pause');
    i.classList.add('fa-play');
  });
}

function togglePlay() {
  if (els.audio.paused) play(); else pause();
}

function skip(direction) {
  const total = state.currentSongs.length;
  state.songIndex = (state.songIndex + direction + total) % total;
  loadSong();
  play();
}

function shuffleCurrent() {
  const current = state.currentSongs[state.songIndex];
  const rest = state.currentSongs.filter((_, i) => i !== state.songIndex);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  state.currentSongs = [current, ...rest];
  state.songIndex = 0;
}

function cycleSpeed() {
  const i = SPEEDS.indexOf(state.playbackRate);
  state.playbackRate = SPEEDS[(i + 1) % SPEEDS.length];
  els.audio.playbackRate = state.playbackRate;
  els.npSpeedBtn.textContent = `${state.playbackRate}x`;
  els.npSpeedBtn.classList.toggle('active', state.playbackRate !== 1);
}

function updatePlayingHighlight() {
  const currentId = state.currentSongs[state.songIndex];
  document.querySelectorAll('.track-row').forEach(row => {
    row.classList.toggle('is-playing', row.dataset.songId === currentId);
  });
}

els.audio.addEventListener('timeupdate', () => {
  const { duration, currentTime } = els.audio;
  const pct = duration ? (currentTime / duration) * 100 : 0;
  els.miniProgress.style.width = `${pct}%`;
  els.npProgress.style.width = `${pct}%`;
  els.npTimeCurrent.textContent = formatTime(currentTime);
  els.npTimeTotal.textContent = formatTime(duration);
});

els.audio.addEventListener('ended', () => skip(1));

els.npProgressContainer.addEventListener('click', e => {
  const width = els.npProgressContainer.clientWidth;
  els.audio.currentTime = (e.offsetX / width) * els.audio.duration;
});

els.miniPlayer.addEventListener('click', () => showView(els.nowPlaying));
els.miniPlayBtn.addEventListener('click', e => { e.stopPropagation(); togglePlay(); });

els.npCloseBtn.addEventListener('click', () => showView(els.list.hidden ? els.home : els.list));
els.npShareBtn.addEventListener('click', () => {
  const id = state.currentSongs[state.songIndex];
  navigator.clipboard.writeText(`${location.origin}${location.pathname}?song=${id}`);
});
els.npPlayBtn.addEventListener('click', togglePlay);
els.npPrevBtn.addEventListener('click', () => skip(-1));
els.npNextBtn.addEventListener('click', () => skip(1));
els.npRandomBtn.addEventListener('click', shuffleCurrent);
els.npSpeedBtn.addEventListener('click', cycleSpeed);

renderHome();
