/**
 * Fil conducteur du site : de grands rubans de fils qui ondulent, se vrillent et se
 * croisent — le « tissage » en mouvement. Écrit en TSL : WebGPU si disponible, sinon
 * WebGL 2. Si aucun des deux ne s'initialise, `createWeaveScene` renvoie `null` et le
 * tracé SVG statique placé derrière le contenu reste seul.
 *
 * Le canvas est fixe, plein écran, posé AU-DESSUS du contenu avec un mode de fusion
 * (multiply en clair, screen en sombre) : les rubans teintent la typographie comme du
 * verre coloré, sans jamais la masquer. Le fond du shader est donc l'élément neutre de
 * la fusion. Il survit aux changements de page (transition:persist) et suit le
 * défilement : pleine présence en haut du hero, discret partout ailleurs.
 */
import { Color, MeshBasicNodeMaterial, QuadMesh, Vector2, WebGPURenderer } from 'three/webgpu';
import type { Node } from 'three/webgpu';
import {
  Fn,
  abs,
  cos,
  exp,
  float,
  length,
  mix,
  sin,
  smoothstep,
  sqrt,
  uniform,
  uv,
  vec2,
  vec3,
} from 'three/tsl';

export interface WeaveScene {
  dispose: () => void;
}

const MAX_PIXEL_RATIO = 2;
const REVEAL_SECONDS = 2.4;

interface Ribbon {
  angle: number; // direction du ruban (radians)
  offset: number; // décalage perpendiculaire
  amp: number; // amplitude de l'ondulation
  freq: number;
  speed: number;
  phase: number;
  width: number; // demi-largeur maximale
  twist: number; // fréquence de vrille
  threads: number; // nombre de fils
}

// Deux familles de directions qui se croisent : chaîne et trame.
const RIBBONS: Ribbon[] = [
  {
    angle: -0.42,
    offset: 0.02,
    amp: 0.13,
    freq: 1.5,
    speed: 0.16,
    phase: 0.0,
    width: 0.13,
    twist: 1.25,
    threads: 15,
  },
  {
    angle: 0.62,
    offset: -0.06,
    amp: 0.1,
    freq: 1.9,
    speed: -0.13,
    phase: 2.1,
    width: 0.085,
    twist: 1.7,
    threads: 11,
  },
  {
    angle: -1.02,
    offset: 0.3,
    amp: 0.07,
    freq: 2.3,
    speed: 0.19,
    phase: 4.2,
    width: 0.055,
    twist: 2.2,
    threads: 7,
  },
  {
    angle: 0.2,
    offset: -0.3,
    amp: 0.06,
    freq: 2.7,
    speed: 0.15,
    phase: 1.3,
    width: 0.04,
    twist: 2.7,
    threads: 5,
  },
  {
    angle: 1.15,
    offset: 0.52,
    amp: 0.05,
    freq: 2.1,
    speed: -0.17,
    phase: 5.5,
    width: 0.03,
    twist: 3.1,
    threads: 5,
  },
];

export async function createWeaveScene(canvas: HTMLCanvasElement): Promise<WeaveScene | null> {
  let renderer: WebGPURenderer;
  try {
    renderer = new WebGPURenderer({ canvas, antialias: false, alpha: false });
    await renderer.init();
  } catch {
    return null;
  }

  const uAspect = uniform(1);
  const uPixel = uniform(0.001); // taille d'un pixel dans le repère de la scène
  const uCenter = uniform(new Vector2(0.6, 0.42)); // foyer de la composition (UV)
  const uMouse = uniform(new Vector2(0, 0)); // repère de la scène
  const uTime = uniform(0);
  const uGlow = uniform(0);
  const uReveal = uniform(0);
  const uCalm = uniform(new Vector2(-2, -1)); // zone de texte courant : rubans atténués
  const uScroll = uniform(0); // défilement lissé, en hauteurs d'écran

  // Zone du portrait (x0, y0, x1, y1 en UV) : les rubans s'y font discrets.
  const uBoxMin = uniform(new Vector2(2, 2));
  const uBoxMax = uniform(new Vector2(3, 3));
  const uRest = uniform(0.62); // part d'atténuation en zone calme (selon le thème)
  const uQuiet = uniform(0); // 1 : rubans coupés autour du portrait (photo non détourée)

  // Couleurs lues dans les variables CSS : elles suivent le thème clair / sombre.
  const uBase = uniform(new Color());
  const uFront = uniform(new Color());
  const uBack = uniform(new Color());
  const uShine = uniform(new Color());
  const readTheme = () => {
    const style = getComputedStyle(document.documentElement);
    const read = (name: string, fallback: string) =>
      style.getPropertyValue(name).trim() || fallback;
    uBase.value.set(read('--ribbon-base', '#ffffff'));
    uFront.value.set(read('--ribbon-front', '#8fbcff'));
    uBack.value.set(read('--ribbon-back', '#1463e0'));
    uShine.value.set(read('--ribbon-shine', '#dcebff'));
    uQuiet.value = Number(read('--ribbon-quiet', '0')) || 0;
    uRest.value = Number(read('--ribbon-rest', '0.62')) || 0.62;
  };
  readTheme();

  const scene = Fn(() => {
    // Repère centré sur le foyer, hauteur = 1, sans déformation.
    const p0 = uv().sub(uCenter).mul(vec2(uAspect, 1));

    // Lentille autour du curseur : les fils s'écartent comme sous une loupe.
    const delta = p0.sub(uMouse);
    const lens = exp(delta.dot(delta).div(0.045).negate()).mul(uGlow);
    const p = p0.sub(delta.mul(lens).mul(0.32));

    let colour: Node<'vec3'> = vec3(0, 0, 0);
    let alpha: Node<'float'> = float(0);

    // Zone calme : sous le titre du hero, donc sur tout le reste du site.
    const calmZone = smoothstep(uCalm.x, uCalm.y, uv().y);

    RIBBONS.forEach((r, i) => {
      // Défilement : chaque ruban glisse le long de lui-même et dérive en travers,
      // dans un sens puis dans l'autre. À zéro, la composition du hero est intacte.
      const along = uScroll.mul(Math.sign(r.speed) * 0.25);
      const drift = sin(uScroll.mul(0.3 + i * 0.08).add(r.phase))
        .sub(Math.sin(r.phase))
        .mul(i % 2 ? -0.07 : 0.07);

      const ca = Math.cos(r.angle);
      const sa = Math.sin(r.angle);
      const s = p.x.mul(ca).add(p.y.mul(sa)); // le long du ruban
      const n = p.y.mul(ca).sub(p.x.mul(sa)); // en travers

      // Ligne médiane : deux ondes superposées, et sa pente pour une vraie distance.
      const ph1 = s.mul(r.freq).add(uTime.mul(r.speed)).add(along).add(r.phase);
      const ph2 = s
        .mul(r.freq * 0.47)
        .add(uTime.mul(r.speed * 0.6))
        .add(along.mul(0.5))
        .add(r.phase * 1.7);
      const centre = sin(ph1)
        .mul(r.amp)
        .add(sin(ph2).mul(r.amp * 0.5))
        .add(r.offset)
        .add(drift);
      const slope = cos(ph1)
        .mul(r.amp * r.freq)
        .add(cos(ph2).mul(r.amp * 0.5 * r.freq * 0.47));
      const d = n.sub(centre).div(sqrt(slope.mul(slope).add(1)));

      // Vrille : le ruban tourne sur lui-même, s'affine puis montre son envers.
      const turn = cos(s.mul(r.twist).add(uTime.mul(0.11)).add(uScroll.mul(0.15)).add(r.phase));
      const open = abs(turn);
      const halfWidth = open.mul(0.84).add(0.16).mul(r.width).mul(lens.mul(0.45).add(1));

      const v = d.div(halfWidth);
      const av = abs(v);
      const edge = uPixel.div(halfWidth).mul(1.5);
      const mask = smoothstep(float(1), float(1).sub(edge), av);

      // Les fils : fines lignes parallèles, estompées là où le ruban se resserre.
      const lines = smoothstep(
        0.3,
        0.92,
        cos(v.mul(Math.PI * r.threads))
          .mul(0.5)
          .add(0.5),
      );
      const detail = smoothstep(0.22, 0.6, open);
      const body = mix(float(0.42), mix(float(0.1), float(0.8), lines), detail);
      const rim = smoothstep(0.82, 1, av).mul(0.35);

      // Apparition : les rubans se tissent d'un bord à l'autre.
      const front = uReveal
        .mul(4.4)
        .sub(2.2)
        .add(r.phase * 0.08);
      const reveal = smoothstep(front, front.sub(0.5), s);

      // En zone calme, seuls les deux grands rubans restent : le fond se simplifie.
      const keep = i < 2 ? float(1) : calmZone.oneMinus();
      const a = mask.mul(body.add(rim).min(1)).mul(reveal).mul(keep);

      // Endroit / envers, et un reflet soyeux qui glisse le long du ruban.
      const face = smoothstep(-0.25, 0.25, turn);
      const sheenAt = sin(s.mul(2.6).add(uTime.mul(0.35)).add(r.phase)).mul(0.45);
      const sheen = exp(v.sub(sheenAt).mul(v.sub(sheenAt)).mul(-9));
      const tint = mix(
        mix(uBack, uFront, face),
        uShine,
        sheen.mul(0.55).add(lens.mul(0.35)).min(1),
      );

      colour = mix(colour, tint, a);
      alpha = alpha.add(a.mul(alpha.oneMinus()));
    });

    // Sous le titre du hero — donc sur tout le reste du site — les rubans s'effacent
    // pour laisser lire le texte courant.
    const calm = calmZone.mul(uRest).oneMinus();
    const u = uv();
    // Photo non détourée (thème sombre) : zone calme en ellipse serrée sur la silhouette.
    const centre = uBoxMin.add(uBoxMax).mul(0.5);
    const half = uBoxMax.sub(uBoxMin).mul(vec2(0.3, 0.5));
    const inBox = smoothstep(0.8, 1.35, length(u.sub(centre).div(half))).oneMinus();
    const quiet = inBox.mul(uQuiet).oneMinus();
    return mix(uBase, colour, alpha.mul(calm).mul(quiet));
  });

  const material = new MeshBasicNodeMaterial();
  material.colorNode = scene();
  const quad = new QuadMesh(material);

  // --- Dimensions -------------------------------------------------------
  let rect = canvas.getBoundingClientRect();
  let viewW = 1;
  let viewH = 1;

  // Zones calmes du hero, mesurées dans le repère du document puis recalées à chaque
  // image sur le défilement. Sans hero (étude de cas), tout l'écran est calme.
  let infoTop: number | null = null;
  let figureBox: { left: number; top: number; right: number; bottom: number } | null = null;

  const measureZones = () => {
    const y = window.scrollY;
    const info = document.querySelector<HTMLElement>('[data-hero-info]');
    infoTop = info ? info.getBoundingClientRect().top + y : null;
    const figure = document.querySelector<HTMLElement>('[data-hero-figure]');
    if (figure) {
      const box = figure.getBoundingClientRect();
      figureBox = { left: box.left, top: box.top + y, right: box.right, bottom: box.bottom + y };
    } else {
      figureBox = null;
    }
  };

  const applyZones = () => {
    const y = window.scrollY;
    if (infoTop === null) {
      uCalm.value.set(-2, -1);
    } else {
      const top = (infoTop - y - rect.top) / viewH;
      uCalm.value.set(top - 0.16, top + 0.06);
    }
    if (figureBox) {
      uBoxMin.value.set(
        (figureBox.left - rect.left) / viewW,
        (figureBox.top - y - rect.top) / viewH,
      );
      uBoxMax.value.set(
        (figureBox.right - rect.left) / viewW,
        (figureBox.bottom - y - rect.top) / viewH,
      );
    } else {
      uBoxMin.value.set(2, 2);
      uBoxMax.value.set(3, 3);
    }
  };

  const resize = () => {
    rect = canvas.getBoundingClientRect();
    viewW = Math.max(1, Math.round(rect.width));
    viewH = Math.max(1, Math.round(rect.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(viewW, viewH, false);

    const aspect = viewW / viewH;
    uAspect.value = aspect;
    uPixel.value = 1 / (viewH * pixelRatio);
    // En paysage la composition penche à droite du titre ; en portrait elle le traverse.
    uCenter.value.set(0.5, aspect > 1 ? 0.4 : 0.3);

    measureZones();
    applyZones();
  };

  // --- Pointeur ---------------------------------------------------------
  const target = new Vector2(0, 0);
  const current = new Vector2(0, 0);
  let pointerActive = false;

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    target.set((x - uCenter.value.x) * uAspect.value, y - uCenter.value.y);
    pointerActive = y >= 0 && y <= 1;
  };
  const onPointerLeave = () => {
    pointerActive = false;
  };
  // --- Boucle de rendu, en pause hors écran et onglet inactif ------------
  let frame = 0;
  let last = 0;
  let revealStart = 0;
  let inView = true;
  let disposed = false;

  const render = (now: number) => {
    frame = 0;
    if (disposed) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    uTime.value += dt;

    // Apparition en expo.out, comme le reste du site.
    // Calée sur l'horloge réelle : même si l'appareil peine, l'apparition ne traîne pas.
    if (!revealStart) revealStart = now;
    const k = Math.min((now - revealStart) / 1000 / REVEAL_SECONDS, 1);
    uReveal.value = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

    current.lerp(target, 1 - Math.exp(-dt * 6));
    uMouse.value.copy(current);
    uGlow.value += ((pointerActive ? 1 : 0) - uGlow.value) * (1 - Math.exp(-dt * 3));

    // Le défilement entraîne les rubans avec un peu d'inertie ; les zones calmes, elles,
    // restent collées à la mise en page.
    uScroll.value += (window.scrollY / viewH - uScroll.value) * (1 - Math.exp(-dt * 5));
    applyZones();

    quad.render(renderer);
    schedule();
  };

  const schedule = () => {
    if (frame || disposed || !inView || document.hidden) return;
    last = performance.now();
    frame = requestAnimationFrame(render);
  };

  const onVisibility = () => schedule();
  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry?.isIntersecting ?? true;
    schedule();
  });
  const resizeObserver = new ResizeObserver(() => {
    resize();
    if (!frame && !disposed) quad.render(renderer);
  });
  // Les zones calmes dépendent de la mise en page du hero : on les remesure quand elle
  // bouge (polices chargées, image du portrait, point de rupture) et à chaque page.
  const zoneObserver = new ResizeObserver(() => {
    measureZones();
    applyZones();
  });
  const watchZones = () => {
    zoneObserver.disconnect();
    document
      .querySelectorAll<HTMLElement>('[data-hero-figure], [data-hero-info]')
      .forEach((element) => zoneObserver.observe(element));
    measureZones();
    // Nouvelle page : on repart du haut sans faire filer les rubans.
    uScroll.value = window.scrollY / viewH;
    applyZones();
    schedule();
  };
  const themeObserver = new MutationObserver(() => {
    readTheme();
    if (!frame && !disposed) quad.render(renderer);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  resize();
  intersection.observe(canvas);
  resizeObserver.observe(canvas);
  watchZones();
  void document.fonts.ready.then(() => {
    if (!disposed) resize();
  });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('astro:page-load', watchZones);
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);

  // Première image rendue avant d'afficher le canvas.
  quad.render(renderer);
  schedule();

  return {
    dispose() {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      zoneObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('astro:page-load', watchZones);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      material.dispose();
      renderer.dispose();
    },
  };
}
