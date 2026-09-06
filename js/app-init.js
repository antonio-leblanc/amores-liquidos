// Escolhe, uma única vez no carregamento, qual experiência montar:
// desktop (duas colunas, script.js de sempre) ou mobile (Home -> Lista -> Partitura,
// mobile-home.js). Cada template só existe como DocumentFragment inerte até ser
// clonado aqui — por isso os dois podem reusar os mesmos ids (#audio, #playlist, ...)
// sem colidir: só um dos dois é inserido no documento de fato.

const MOBILE_BREAKPOINT = 768;
const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;

const templateId = isMobile ? 'mobile-template' : 'desktop-template';
const template = document.getElementById(templateId);
const mount = document.getElementById('app-mount');
mount.appendChild(template.content.cloneNode(true));

if (isMobile) {
  document.body.classList.add('mobile-home-body');
  import('./mobile-home.js');
} else {
  import('../script.js');
}
