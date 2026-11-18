/**
 * Défilement : Lenis pour l'inertie, Motion pour les animations — révélations à l'entrée
 * dans l'écran, ligne défilante et barre de progression liées au défilement.
 * Rien n'est initialisé avec prefers-reduced-motion : la page reste statique et lisible.
 */
import { animate, inView, scroll, stagger } from 'motion';
import Lenis from 'lenis';
import { DURATION, EASE, prefersReducedMotion } from '../lib/motion';
import { splitText } from '../lib/splitText';

let lenis: Lenis | null = null;
/** Tout ce qu'il faut arrêter en quittant la page (observateurs, animations liées au défilement). */
let cleanups: (() => void)[] = [];

/** Fait défiler vers une ancre (#id) avec Lenis. Renvoie false si la cible n'existe pas. */
function scrollToHash(hash: string, immediate = false) {
  if (!lenis || hash.length < 2) return false;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;
  // Lenis tient déjà compte du scroll-padding-top (hauteur de l'en-tête).
  lenis.scrollTo(target, { immediate });
  return true;
}

/**
 * Liens vers une ancre de la page courante (« #contact », « /#experience ») : on les prend
 * en charge ici, sinon le routeur change l'adresse et Lenis garde l'ancienne position.
 */
function onAnchorClick(event: MouseEvent) {
  if (!lenis || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href*="#"]');
  if (!link || link.target === '_blank') return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
  if (!scrollToHash(url.hash)) return;
  event.preventDefault();
  event.stopPropagation();
  if (url.hash !== location.hash) history.pushState(history.state, '', url.hash);
}

const onHashChange = () => void scrollToHash(location.hash);

function destroy() {
  document.removeEventListener('click', onAnchorClick, true);
  window.removeEventListener('hashchange', onHashChange);
  cleanups.forEach((stop) => stop());
  cleanups = [];
  lenis?.destroy();
  lenis = null;
}

/** Déclenche `enter` une seule fois, quand l'élément entre dans l'écran (marge basse en %). */
function once(el: Element, bottomMargin: number, enter: () => void) {
  const stop = inView(
    el,
    () => {
      stop();
      enter();
    },
    { margin: `0px 0px ${-bottomMargin}% 0px` },
  );
  cleanups.push(stop);
}

function init() {
  destroy();
  if (prefersReducedMotion()) return;

  lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
  document.addEventListener('click', onAnchorClick, true);
  window.addEventListener('hashchange', onHashChange);

  // Barre de progression de lecture.
  const progress = document.querySelector<HTMLElement>('[data-progress]');
  if (progress) {
    cleanups.push(scroll(animate(progress, { scaleX: [0, 1] }, { ease: 'linear' })));
  }

  // Titres et accroches : ligne par ligne, derrière un masque.
  document.querySelectorAll<HTMLElement>('[data-reveal-lines]').forEach((el) => {
    el.style.opacity = '0';
    once(el, 12, () => {
      // Découpage au dernier moment : les lignes correspondent à la largeur réelle.
      const split = splitText(el, 'words');
      el.style.opacity = '';
      const controls = split.lines.map((line, i) =>
        animate(
          line,
          { y: ['120%', '0%'] },
          { duration: DURATION.slow, ease: EASE, delay: i * 0.09 },
        ),
      );
      void Promise.all(controls.map((control) => control.finished)).then(split.revert);
    });
  });

  // Blocs : fondu + légère montée, par groupes entrant ensemble dans l'écran.
  let queue: HTMLElement[] = [];
  let flushing = 0;
  const flush = () => {
    flushing = 0;
    const batch = queue;
    queue = [];
    // Après un saut (ancre, retour arrière), ce qui est déjà au-dessus s'affiche sans attendre.
    const above = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
    const visible = batch.filter((el) => !above.includes(el));
    above.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
    if (visible.length) {
      animate(
        visible,
        { y: [28, 0], opacity: [0, 1] },
        { duration: DURATION.base, ease: EASE, delay: stagger(0.07) },
      );
    }
  };
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    once(el, 10, () => {
      queue.push(el);
      flushing ||= requestAnimationFrame(flush);
    });
  });
  cleanups.push(() => cancelAnimationFrame(flushing));

  // Visuels : dévoilés par clip-path.
  const clips: [string, string, string][] = [
    ['[data-clip]', 'inset(0% 0% 100% 0% round 20px)', 'inset(0% 0% 0% 0% round 20px)'],
    ['[data-clip-circle]', 'circle(0% at 50% 50%)', 'circle(50% at 50% 50%)'],
  ];
  for (const [selector, from, to] of clips) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      // Élément non affiché (photo de l'autre thème) : il n'entrerait jamais dans l'écran
      // et resterait masqué après un changement de thème.
      if (!el.getClientRects().length) return;
      el.style.clipPath = from;
      once(el, 15, () => {
        animate(el, { clipPath: [from, to] }, { duration: DURATION.slow, ease: EASE });
      });
    });
  }

  // Grande ligne de texte entraînée par le défilement.
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) => {
    const track = el.querySelector<HTMLElement>('[data-marquee-track]');
    if (!track) return;
    cleanups.push(
      scroll(animate(track, { x: ['-2%', '-42%'] }, { ease: 'linear' }), {
        target: el,
        offset: ['start end', 'end start'],
      }),
    );
  });

  void document.fonts.ready.then(() => {
    // Arrivée sur une ancre (depuis une étude de cas, un lien partagé) : on s'y place.
    if (location.hash) scrollToHash(location.hash, true);
  });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', destroy);
