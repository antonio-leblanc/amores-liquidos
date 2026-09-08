// App agora é sempre o fluxo mobile (Home -> Lista -> Partitura, mobile-home.js),
// em qualquer tamanho de tela — em telas largas o CSS (css/mobile-home.css) exibe
// esse fluxo como um "celular" centralizado.

const template = document.getElementById('mobile-template');
const mount = document.getElementById('app-mount');
mount.appendChild(template.content.cloneNode(true));

document.body.classList.add('mobile-home-body');
import('./mobile-home.js');
