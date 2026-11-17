/**
 * Défilement : Lenis + ScrollTrigger, révélations, ligne défilante et barre de progression.
 * Rien n'est initialisé avec prefers-reduced-motion : la page reste statique et lisible.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { DURATION, EASE, prefersReducedMotion } from '../lib/motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

let lenis: Lenis | null = null;
let context: gsap.Context | null = null;
const tick = (time: number) => lenis?.raf(time * 1000);

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
  context?.revert();
  context = null;
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
}

function init() {
  destroy();
  if (prefersReducedMotion()) return;

  lenis = new Lenis({ autoRaf: false, lerp: 0.12 });
  document.addEventListener('click', onAnchorClick, true);
  window.addEventListener('hashchange', onHashChange);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  context = gsap.context(() => {
    const once = (trigger: Element, start = 'top 88%') => ({ trigger, start, once: true });

    gsap.to('[data-progress]', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true },
    });

    // Titres et accroches : ligne par ligne, derrière un masque.
    gsap.utils.toArray<HTMLElement>('[data-reveal-lines]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        aria: 'none',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 120,
            duration: DURATION.slow,
            ease: EASE,
            stagger: 0.09,
            scrollTrigger: once(el),
          }),
      });
    });

    // Blocs : fondu + légère montée, par groupes entrant ensemble dans l'écran.
    gsap.set('[data-reveal]', { y: 28, opacity: 0 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      batchMax: 12,
      onEnter: (batch) => {
        // Après un saut (ancre, retour arrière), ce qui est déjà au-dessus s'affiche sans attendre.
        const above = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
        const visible = batch.filter((el) => !above.includes(el));
        gsap.set(above, { y: 0, opacity: 1 });
        gsap.to(visible, { y: 0, opacity: 1, duration: DURATION.base, ease: EASE, stagger: 0.07 });
      },
    });

    // Visuels : dévoilés par clip-path.
    gsap.utils.toArray<HTMLElement>('[data-clip]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0% 0% 100% 0% round 20px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 20px)',
          duration: DURATION.slow,
          ease: EASE,
          scrollTrigger: once(el, 'top 85%'),
        },
      );
    });
    gsap.utils.toArray<HTMLElement>('[data-clip-circle]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'circle(0% at 50% 50%)' },
        {
          clipPath: 'circle(50% at 50% 50%)',
          duration: DURATION.slow,
          ease: EASE,
          scrollTrigger: once(el, 'top 85%'),
        },
      );
    });

    // Grande ligne de texte entraînée par le défilement.
    gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((el) => {
      gsap.fromTo(
        el.querySelector('[data-marquee-track]'),
        { xPercent: -2 },
        {
          xPercent: -42,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  });

  void document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
    // Arrivée sur une ancre (depuis une étude de cas, un lien partagé) : on s'y place.
    if (location.hash) scrollToHash(location.hash, true);
  });
}

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', destroy);
