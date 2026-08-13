// Controle de áudio: play/pause, navegação, shuffle, velocidade, progresso e link compartilhável.

export function playSong(player) {
  player.musicContainer.classList.add('play');
  player.playBtn.querySelector('i.fas').classList.remove('fa-play');
  player.playBtn.querySelector('i.fas').classList.add('fa-pause');
  player.audio.play();
}

export function pauseSong(player) {
  player.musicContainer.classList.remove('play');
  player.playBtn.querySelector('i.fas').classList.add('fa-play');
  player.playBtn.querySelector('i.fas').classList.remove('fa-pause');
  player.audio.pause();
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function cycleSpeed(player) {
  const currentIndex = player.speeds.indexOf(player.playbackRate);
  const nextIndex = (currentIndex + 1) % player.speeds.length;
  player.playbackRate = player.speeds[nextIndex];
  updateSpeedUI(player);
}

export function adjustSpeed(player, direction) {
  const currentIndex = player.speeds.indexOf(player.playbackRate);
  let nextIndex = currentIndex + direction;

  if (nextIndex < 0) nextIndex = player.speeds.length - 1;
  if (nextIndex >= player.speeds.length) nextIndex = 0;

  player.playbackRate = player.speeds[nextIndex];
  updateSpeedUI(player);
}

export function updateSpeedUI(player) {
  player.audio.playbackRate = player.playbackRate;
  player.speedBtn.innerText = `${player.playbackRate}x`;
  player.speedBtn.classList.toggle('active', player.playbackRate !== 1);
}

export function updateProgress(player, e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  player.progress.style.width = `${progressPercent}%`;
}

export function setProgress(player, e) {
  const width = player.progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = player.audio.duration;
  player.audio.currentTime = (clickX / width) * duration;
}

export function generateShareableLink(player) {
  const songId = player.currentSongs[player.songIndex];
  const time = Math.floor(player.audio.currentTime);

  if (!songId) return;

  const newUrl = `${window.location.pathname}?song=${songId}&t=${time}`;
  const fullUrl = `${window.location.origin}${newUrl}`;

  history.replaceState({ path: newUrl }, '', newUrl);

  navigator.clipboard.writeText(fullUrl).then(() => {
    alert(`Link para "${songId.replace(/_/g, ' ')}" aos ${time}s copiado!`);
  }).catch(err => {
    console.error('Erro ao copiar o link: ', err);
    alert('Erro ao copiar o link.');
  });
}
