const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const randomBtn = document.getElementById('random');
const switchModeBtn = document.getElementById('switch-mode');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');

// Song titles
const songsAlphabetical = [
	'100_voce',
	'acima_do_sol',
	'alo_paixao',
	'amor_de_chocolate',
	'amor_i_love_you',
	'amor_perfeito',
	'andanca',
	'assim_caminha_a_humanidade_malhacao',
	'baianidade_nago',
	'bailao',
	'baile_da_gaiola',
	'beleza_rara',
	'bola_de_sabao',
	'cilada',
	'coracao_radiante',
	'de_ladinho',
	'depois_do_prazer',
	'deus_me_livre',
	'deusa_do_amor',
	'diga_que_valeu',
	'do_seu_lado',
	'dont_stop',
	'eva',
	'exagerado',
	'festa',
	'fico_assim_sem_voce',
	'final_feliz',
	'flor_do_reggae',
	'gatas_extraordinarias',
	'hey_jude',
	'i_love_you_baby_cant_take_my_eyes_off_you',
	'ja_sei_namorar',
	'lua_de_cristal',
	'lucro',
	'mal_acostumado',
	'mania_de_voce',
	'maria_maria',
	'me_abraca_me_beija',
	'me_deixa',
	'meia_lua',
	'meu_sangue_ferve_por_voce',
	'milla',
	'nao_precisa_mudar',
	'nao_quero_dinheiro',
	'pintura_intima',
	'princesa',
	'sina',
	'so_love',
	'sombra_da_maldade',
	'sorte_grande',
	'swing_da_cor',
	'tambem_quero_beijar_flor_do_maracuja',
	'temporal',
	'tempos_modernos',
	'tieta',
	'toda_forma_de_amor',
	'tremendo_vacilao',
	'tu_ta_na_gaiola',
	'uma_noite_e_meia',
	'vai_novinha',
	'vai_sacudir_vai_abalar',
	'varias_queixas',
	'vem_meu_amor',
	'voa_voa',
	'voce_me_vira_a_cabeca',
	'voce_nao_entende_nada'
];


// Initialize songs to alphabetical mode
let currentSongs = [...songsAlphabetical];
let isAlphabetical = true;
let songIndex = 0;

// Initially load song details into DOM
loadSong(currentSongs[songIndex]);


function switchMode() {
  if (isAlphabetical) {
    currentSongs = [...eventSetlist];
    isAlphabetical = false;
    alert('Tocando as músicas na ordem das GIG');
  } else {
    currentSongs = [...songsAlphabetical];
    isAlphabetical = true;
    alert('Tocando as músicas em ordem alfabética');
  }
  songIndex = 0; // Reset to first song
  loadSong(currentSongs[songIndex]);
}

// Update song details
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  // cover.src = `images/${song}.jpg`;
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.remove('fa-play');
  playBtn.querySelector('i.fas').classList.add('fa-pause');

  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play');
  playBtn.querySelector('i.fas').classList.remove('fa-pause');

  audio.pause();
}

// Previous song
function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = currentSongs.length - 1;
  }

  loadSong(currentSongs[songIndex]);

  playSong();
}

// Next song
function nextSong() {
  songIndex++;

  if (songIndex > currentSongs.length - 1) {
    songIndex = 0;
  }

  loadSong(currentSongs[songIndex]);

  playSong();
}

// Play a random song
function playRandomSong() {
  // Generate a random index within the range of the songs array
  const randomIndex = Math.floor(Math.random() * currentSongs.length);
  
  // Update the song index to the random index
  songIndex = randomIndex;
  
  // Load the random song and play it
  loadSong(currentSongs[songIndex]);
  playSong();
}


// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}



// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
randomBtn.addEventListener('click', playRandomSong);
switchModeBtn.addEventListener('click', switchMode);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);


