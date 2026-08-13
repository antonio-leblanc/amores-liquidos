// Geração e interação da lista de músicas: playlist normal, modo medley e seletor de playlists.

import { getMelodyData } from './melody-viewer.js';

export function generatePlaylist(player, songs) {
  player.playlist.innerHTML = '';

  if (player.isInMedleyMode) {
    let medleyIndex = 0;
    for (const medleyName in medleys) {

      const titleLi = document.createElement('li');
      titleLi.classList.add('medley-title');
      titleLi.textContent = `— ${medleyName} —`;
      player.playlist.appendChild(titleLi);

      const medleySongs = medleys[medleyName];
      medleySongs.forEach(song => {
        const li = document.createElement('li');
        li.dataset.songName = song;
        li.textContent = song.replace(/_/g, ' ');
        li.classList.add(`medley-group-${medleyIndex % 2}`);
        player.playlist.appendChild(li);
      });
      medleyIndex++;
    }
  } else {

    songs.forEach((song) => {
      const li = document.createElement('li');
      li.dataset.songName = song;

      const melodyData = getMelodyData(song);
      let icons = '';
      if (melodyData && melodyData.melodies) {
        // Extract emojis from instrument names
        const emojis = Object.keys(melodyData.melodies)
          .map(name => {
            const match = name.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u);
            return match ? match[0] : '';
          })
          .filter((v, i, a) => v && a.indexOf(v) === i); // Unique emojis

        if (emojis.length > 0) {
          icons = `<span class="song-indicators">${emojis.join('')}</span>`;
        }
      }

      li.innerHTML = `<span>${song.replace(/_/g, ' ')}</span>${icons}`;
      player.playlist.appendChild(li);
    });
  }
}

export function updatePlaylistHighlight(player) {
  const allSongs = player.playlist.querySelectorAll('li');
  allSongs.forEach(li => {
    if (li.dataset.songName === player.currentSongs[player.songIndex]) {
      li.classList.add('active');
      li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      li.classList.remove('active');
    }
  });
}

export function populatePlaylistSelector(player) {
  player.playlistSelector.innerHTML = '';

  const playlistNames = Object.keys(playlists);
  const carnavalName = '🎭 Carnaval';
  const signaturePlaylistName = '⭐ Assinatura';

  const signatureIndex = playlistNames.indexOf(signaturePlaylistName);

  // Add playlists up to and including 'Assinatura'
  for (let i = 0; i <= signatureIndex; i++) {
    const name = playlistNames[i];
    if (name && name !== carnavalName) {
      const option = document.createElement('option');
      option.value = name;
      option.innerText = name;
      player.playlistSelector.appendChild(option);
    }
  }

  // Add Medleys as the third item
  if (typeof medleys !== 'undefined' && Object.keys(medleys).length > 0) {
    const option = document.createElement('option');
    option.value = 'Medleys';
    option.innerText = '🧩 Medleys';
    player.playlistSelector.appendChild(option);
  }

  // Add the rest of the playlists
  for (let i = signatureIndex + 1; i < playlistNames.length; i++) {
    const name = playlistNames[i];
    if (name && name !== carnavalName) {
      const option = document.createElement('option');
      option.value = name;
      option.innerText = name;
      player.playlistSelector.appendChild(option);
    }
  }

  // Add Carnaval at the end
  if (playlistNames.includes(carnavalName)) {
    const option = document.createElement('option');
    option.value = carnavalName;
    option.innerText = carnavalName;
    player.playlistSelector.appendChild(option);
  }

  player.playlistSelector.value = defaultPlaylistName;
}
