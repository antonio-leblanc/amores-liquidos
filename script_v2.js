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

    currentSongs: playlists[defaultPlaylistName],
    songIndex: 0,
    currentMelodyData: null,
    currentInstrument: null,
    isInMedleyMode: false,
    isShuffleMode: false,
    originalSongs: [],

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
    },

    generateShareableLink: function () {
        const songId = this.currentSongs[this.songIndex];
        const time = Math.floor(this.audio.currentTime);
        if (!songId) return;

        const newUrl = `${window.location.pathname}?song=${songId}&t=${time}`;
        const fullUrl = `${window.location.origin}${newUrl}`;

        history.replaceState({ path: newUrl }, '', newUrl);

        navigator.clipboard.writeText(fullUrl).then(() => {
            // Custom toast or modern alert would be better here in the future
            const songName = songId.replace(/_/g, ' ');
            alert(`Link para "${songName}" copiado!`);
        }).catch(err => {
            console.error('Erro ao copiar o link: ', err);
        });
    },

    addEventListeners: function () {
        this.headerTitle.addEventListener('click', () => {
            const carnivalDate = new Date('2026-02-14T00:00:00');
            const now = new Date();
            const diff = carnivalDate - now;

            if (diff < 0) {
                alert('É CARNAVAL!!! 🎉');
            } else {
                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                const dayText = days === 1 ? 'dia' : 'dias';
                alert(`Faltam ${days} ${dayText} para o Carnaval 2026! 🎭✨`);
            }
        });

        this.playBtn.addEventListener('click', () => {
            if (this.audio.paused) {
                this.playSong();
            } else {
                this.pauseSong();
            }
        });

        this.prevBtn.addEventListener('click', this.prevSong.bind(this));
        this.nextBtn.addEventListener('click', this.nextSong.bind(this));
        this.randomBtn.addEventListener('click', this.toggleShuffle.bind(this));
        this.shareBtn.addEventListener('click', this.generateShareableLink.bind(this));
        this.playlistSelector.addEventListener('change', this.handlePlaylistChange.bind(this));

        this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
        this.progressContainer.addEventListener('click', this.setProgress.bind(this));
        this.audio.addEventListener('ended', this.nextSong.bind(this));

        if (this.togglePlayerBtn) {
            this.togglePlayerBtn.addEventListener('click', () => {
                this.musicContainer.classList.toggle('player-recolhido');
                document.body.classList.toggle('player-is-recolhido');
            });
        }

        this.playlist.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li && li.dataset.songName) {
                const clickedSongName = li.dataset.songName;
                this.songIndex = this.currentSongs.findIndex(song => song === clickedSongName);
                this.loadSong(this.currentSongs[this.songIndex]);
                this.playSong();
            }
        });

        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().replace(/ /g, '_');
            const listItems = this.playlist.querySelectorAll('li:not(.medley-title)');
            listItems.forEach(li => {
                const songName = li.dataset.songName.toLowerCase();
                li.style.display = songName.includes(searchTerm) ? 'block' : 'none';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') {
                if (e.code === 'Escape') {
                    this.searchInput.blur();
                    e.preventDefault();
                }
                if (!(e.ctrlKey && e.code === 'KeyF')) return;
            }

            if (e.ctrlKey && e.code === 'KeyF') {
                e.preventDefault();
                this.searchInput.focus();
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
                case 'Digit0':
                    e.preventDefault();
                    break;
            }

            switch (e.code) {
                case 'Space':
                    this.audio.paused ? this.playSong() : this.pauseSong();
                    break;
                case 'ArrowDown':
                    this.nextSong();
                    break;
                case 'ArrowUp':
                    this.prevSong();
                    break;
                case 'ArrowRight':
                    this.audio.currentTime += 5;
                    break;
                case 'ArrowLeft':
                    this.audio.currentTime -= 5;
                    break;
                case 'KeyA':
                    this.toggleShuffle();
                    break;
                case 'KeyS':
                    this.generateShareableLink();
                    break;
                case 'Digit0':
                    this.audio.currentTime = 0;
                    if (!this.audio.paused) this.playSong();
                    break;
            }
        });
    },

    toggleShuffle: function () {
        this.isShuffleMode = !this.isShuffleMode;
        this.randomBtn.classList.toggle('active', this.isShuffleMode);
        const currentSongName = this.currentSongs[this.songIndex];

        if (this.isShuffleMode) {
            if (this.originalSongs.length === 0 || this.originalSongs.length !== this.currentSongs.length) {
                this.originalSongs = [...this.currentSongs];
            }
            this.shuffleArray(this.currentSongs);
        } else {
            this.currentSongs = [...this.originalSongs];
        }

        this.songIndex = this.currentSongs.findIndex(s => s === currentSongName);
        this.generatePlaylist(this.currentSongs);
        this.updatePlaylistHighlight();
    },

    shuffleArray: function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    generatePlaylist: function (songs) {
        this.playlist.innerHTML = '';

        if (this.isInMedleyMode) {
            let medleyIndex = 0;
            for (const medleyName in medleys) {
                const titleLi = document.createElement('li');
                titleLi.classList.add('medley-title');
                titleLi.textContent = medleyName;
                this.playlist.appendChild(titleLi);

                medleys[medleyName].forEach(song => {
                    const li = document.createElement('li');
                    li.dataset.songName = song;
                    li.textContent = song.replace(/_/g, ' ');
                    this.playlist.appendChild(li);
                });
                medleyIndex++;
            }
        } else {
            songs.forEach((song) => {
                const li = document.createElement('li');
                li.dataset.songName = song;
                li.textContent = song.replace(/_/g, ' ');
                this.playlist.appendChild(li);
            });
        }
    },

    updatePlaylistHighlight: function () {
        const allSongs = this.playlist.querySelectorAll('li[data-song-name]');
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
        const folder = currentPlaylist === '🎭 Outras Carnaval' ? 'music_carnaval' : 'music';
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
        const icon = this.playBtn.querySelector('i');
        icon.classList.replace('fa-play', 'fa-pause');
        this.audio.play();
    },

    pauseSong: function () {
        this.musicContainer.classList.remove('play');
        const icon = this.playBtn.querySelector('i');
        icon.classList.replace('fa-pause', 'fa-play');
        this.audio.pause();
    },

    prevSong: function () {
        this.songIndex = (this.songIndex - 1 + this.currentSongs.length) % this.currentSongs.length;
        this.loadSong(this.currentSongs[this.songIndex]);
        this.playSong();
    },

    nextSong: function () {
        this.songIndex = (this.songIndex + 1) % this.currentSongs.length;
        this.loadSong(this.currentSongs[this.songIndex]);
        this.playSong();
    },

    populatePlaylistSelector: function () {
        this.playlistSelector.innerHTML = '';
        const playlistNames = Object.keys(playlists);
        const signaturePlaylistName = '⭐ Assinatura';
        const carnavalName = '🎭 Outras Carnaval';

        const renderOption = (name) => {
            const option = document.createElement('option');
            option.value = name;
            option.innerText = name;
            return option;
        };

        const signatureIndex = playlistNames.indexOf(signaturePlaylistName);
        for (let i = 0; i <= signatureIndex; i++) {
            if (playlistNames[i] !== carnavalName) {
                this.playlistSelector.appendChild(renderOption(playlistNames[i]));
            }
        }

        if (typeof medleys !== 'undefined' && Object.keys(medleys).length > 0) {
            this.playlistSelector.appendChild(renderOption('Medleys'));
        }

        for (let i = signatureIndex + 1; i < playlistNames.length; i++) {
            if (playlistNames[i] !== carnavalName) {
                this.playlistSelector.appendChild(renderOption(playlistNames[i]));
            }
        }

        if (playlistNames.includes(carnavalName)) {
            this.playlistSelector.appendChild(renderOption(carnavalName));
        }

        this.playlistSelector.value = defaultPlaylistName;
    },

    handlePlaylistChange: function () {
        const selectedPlaylistName = this.playlistSelector.value;
        this.isInMedleyMode = (selectedPlaylistName === 'Medleys');

        if (this.isInMedleyMode && typeof medleys !== 'undefined') {
            this.currentSongs = Object.values(medleys).flat();
        } else {
            this.currentSongs = playlists[selectedPlaylistName];
        }

        this.originalSongs = [...this.currentSongs];
        if (this.isShuffleMode) this.shuffleArray(this.currentSongs);

        this.songIndex = 0;
        this.generatePlaylist(this.currentSongs);
        this.loadSong(this.currentSongs[this.songIndex]);
        this.pauseSong();

        if (selectedPlaylistName === '🎭 Outras Carnaval') {
            document.body.classList.add('carnaval-theme');
            this.headerTitle.innerText = '🎭 Outras Carnaval 🎊';
        } else {
            document.body.classList.remove('carnaval-theme');
            this.headerTitle.innerText = 'Amores Liquidos';
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
            <i class="fas fa-drum"></i>
            <p>Melodia não disponível para esta música.</p>
        </div>`;
        }
        const instrumentSelectorContainer = document.querySelector('.instrument-selector-container');
        if (instrumentSelectorContainer) instrumentSelectorContainer.style.display = 'none';
    },

    renderMelodyMarkdown: function (data) {
        if (!this.melodyContainer) return;

        const availableInstruments = Object.keys(data.melodies);
        const savedInstrument = this.loadInstrumentState();
        const selectedInstrument = (savedInstrument && availableInstruments.includes(savedInstrument))
            ? savedInstrument
            : availableInstruments[0];

        this.melodyContainer.innerHTML = `<div id="melody-content"></div>`;

        const instrumentSelectorContainer = document.querySelector('.instrument-selector-container');
        const instrumentSelector = document.createElement('select');
        instrumentSelector.id = 'instrument-selector';
        instrumentSelector.innerHTML = availableInstruments.map(i => `<option value="${i}">${i}</option>`).join('');
        instrumentSelectorContainer.innerHTML = '';
        instrumentSelectorContainer.appendChild(instrumentSelector);
        instrumentSelectorContainer.style.display = 'block';

        instrumentSelector.value = selectedInstrument;
        instrumentSelector.addEventListener('change', (e) => {
            this.saveInstrumentState(e.target.value);
            this.loadInstrumentMarkdown(e.target.value, data.melodies[e.target.value]);
        });

        this.loadInstrumentMarkdown(selectedInstrument, data.melodies[selectedInstrument]);
    },

    loadInstrumentMarkdown: function (instrumentName, markdownFile) {
        const melodyContentDiv = document.getElementById('melody-content');
        if (!melodyContentDiv) return;

        fetch(markdownFile)
            .then(response => response.text())
            .then(markdownText => {
                if (typeof marked !== 'undefined') {
                    melodyContentDiv.innerHTML = marked.parse(markdownText);
                } else {
                    melodyContentDiv.innerHTML = `<pre>${markdownText}</pre>`;
                }
            })
            .catch(error => {
                melodyContentDiv.innerHTML = `<p style="color: #ff4d4d;">Erro ao carregar partitura.</p>`;
            });
    }
};

player.init();
