// Seleção de instrumento e renderização de markdown da melodia.

export function getMelodyData(songId) {
  const melodyData = songData.find(song => song.id === songId);
  return melodyData && melodyData.melodies ? melodyData : null;
}

export function saveInstrumentState(player, instrument) {
  localStorage.setItem('selectedInstrument', instrument);
  player.currentInstrument = instrument;
}

export function loadInstrumentState() {
  return localStorage.getItem('selectedInstrument');
}

export function clearMelodyColumn(player) {
  if (player.melodyContainer) {
    player.melodyContainer.innerHTML = `
      <div class="placeholder">
          <p>Melodia não disponível para esta música.</p>
      </div>`;
  }
  const instrumentSelectorContainer = document.querySelector('.instrument-selector-container');
  if (instrumentSelectorContainer) {
    instrumentSelectorContainer.style.display = 'none';
  }
}

export function renderMelodyMarkdown(player, data) {
  if (!player.melodyContainer) return;

  const availableInstruments = Object.keys(data.melodies);
  const instrumentOptions = availableInstruments.map(instrument =>
    `<option value="${instrument}">${instrument}</option>`
  ).join('');

  const savedInstrument = loadInstrumentState();
  const selectedInstrument = (savedInstrument && availableInstruments.includes(savedInstrument))
    ? savedInstrument
    : availableInstruments[0];

  player.melodyContainer.innerHTML = `<div id="melody-content"></div>`;

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
      saveInstrumentState(player, newInstrument);
      loadInstrumentMarkdown(newInstrument, data.melodies[newInstrument]);
    });
  }

  loadInstrumentMarkdown(selectedInstrument, data.melodies[selectedInstrument]);
}

export function loadInstrumentMarkdown(instrumentName, markdownFile) {
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
