// --- LÓGICA SIMPLIFICADA DO COUNTDOWN (APENAS DIAS) ---

const countdownContainer = document.getElementById('countdown'); // Pegamos o container principal
const timerElement = document.getElementById('timer');

// Data alvo: 17 de Fevereiro de 2026
const carnivalDate = new Date('2026-02-17T00:00:00');
const now = new Date();

// Calcula a diferença total em milissegundos
const diff = carnivalDate - now;

// Verifica se a data do carnaval já passou
if (diff < 0) {
  // Se já passou, podemos simplificar a mensagem
  countdownContainer.innerHTML = '<div id="timer">É CARNAVAL!!! 🎉</div>';
} else {
  // Converte milissegundos para dias e arredonda para CIMA.
  // Usamos Math.ceil para que, se faltarem 10.5 dias, ele mostre "11 dias".
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  // Lógica inteligente para usar "dia" no singular e "dias" no plural
  const dayText = days === 1 ? 'dia' : 'dias';

  // Atualiza o texto do timer
  timerElement.innerHTML = `${days} ${dayText}`;
}