/**
 * Scène du hero : motif tissé plein écran écrit en TSL.
 * WebGPURenderer utilise WebGPU si disponible, sinon WebGL 2.
 * Si aucun des deux ne s'initialise, `createWeaveScene` renvoie `null`
 * et le motif CSS (.weave) placé derrière le canvas reste visible.
 */
import { MeshBasicNodeMaterial, QuadMesh, Vector2, WebGPURenderer } from 'three/webgpu';
import {
  Fn,
  abs,
  color,
  cos,
  exp,
  float,
  floor,
  fract,
  mix,
  sin,
  smoothstep,
  uniform,
  uv,
  vec2,
} from 'three/tsl';

export interface WeaveScene {
  dispose: () => void;
}

const MAX_PIXEL_RATIO = 2;
const CELL_CSS_PX = 34; // largeur d'un brin, en pixels CSS
const GLOW_RADIUS_CSS_PX = 240;

export async function createWeaveScene(canvas: HTMLCanvasElement): Promise<WeaveScene | null> {
  let renderer: WebGPURenderer;
  try {
    renderer = new WebGPURenderer({ canvas, antialias: false, alpha: false });
    await renderer.init();
  } catch {
    return null;
  }

  const uResolution = uniform(new Vector2(1, 1));
  const uMouse = uniform(new Vector2(0, 0));
  const uTime = uniform(0);
  const uCell = uniform(CELL_CSS_PX);
  const uRadius = uniform(GLOW_RADIUS_CSS_PX);
  const uGlow = uniform(0);

  const weave = Fn(() => {
    const px = uv().mul(uResolution);

    // Grille tournée de 45° : le tissage se lit en diagonale, comme une tresse.
    const grid = vec2(px.x.add(px.y), px.x.sub(px.y)).mul(0.7071).div(uCell);

    // Ondulation lente de la trame.
    const wave = vec2(
      sin(grid.y.mul(0.31).add(uTime.mul(0.32))),
      cos(grid.x.mul(0.27).add(uTime.mul(0.26))),
    ).mul(0.22);
    const p = grid.add(wave);

    const cell = floor(p);
    const f = fract(p);

    // Armure toile : un brin sur deux passe dessus.
    const parity = cell.x.add(cell.y).mod(2);
    const along = mix(f.x, f.y, parity); // dans le sens du brin du dessus
    const across = mix(f.y, f.x, parity); // en travers

    const half = float(0.41);
    const soft = float(0.05);
    const dAcross = abs(across.sub(0.5));
    const dAlong = abs(along.sub(0.5));

    const topMask = smoothstep(half, half.sub(soft), dAcross);
    // Le brin s'arrondit : clair au centre, sombre là où il plonge sous le voisin.
    const topShade = sin(along.mul(Math.PI)).mul(0.55).add(0.45);
    // Fibres du raphia, dans le sens du brin.
    const fibres = sin(across.mul(Math.PI * 8).add(cell.x.mul(1.7)))
      .mul(0.07)
      .add(0.93);
    // Bords légèrement assombris pour donner du volume.
    const bevel = smoothstep(half, half.sub(0.16), dAcross).mul(0.45).add(0.55);

    const underMask = smoothstep(half, half.sub(soft), dAlong).mul(topMask.oneMinus());

    // Lente vague de lumière qui traverse le tissage.
    const swell = sin(cell.x.mul(0.21).add(cell.y.mul(0.13)).add(uTime.mul(0.45)))
      .mul(0.2)
      .add(0.8);

    // La trame s'efface côté texte : la typographie garde la vedette.
    const calm = smoothstep(0.1, 0.9, uv().x).mul(0.5).add(0.5);

    const lum = topMask
      .mul(topShade)
      .mul(fibres)
      .mul(bevel)
      .add(underMask.mul(0.22))
      .mul(swell)
      .mul(calm);

    // Halo d'accent autour du curseur.
    const d = px.sub(uMouse).length().div(uRadius);
    const glow = exp(d.mul(d).negate()).mul(uGlow);

    const bg = color('#0B0B0D');
    const strand = color('#26262B');
    const accent = color('#FF5A36');

    const base = mix(bg, strand, lum);
    return mix(base, accent, glow.mul(lum).mul(0.55));
  });

  const material = new MeshBasicNodeMaterial();
  material.colorNode = weave();
  const quad = new QuadMesh(material);

  // --- Dimensions -------------------------------------------------------
  let pixelRatio = 1;
  let width = 1;
  let height = 1;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    uResolution.value.set(width * pixelRatio, height * pixelRatio);
    uCell.value = CELL_CSS_PX * pixelRatio;
    uRadius.value = Math.min(GLOW_RADIUS_CSS_PX, Math.min(width, height) * 0.42) * pixelRatio;
  };

  // --- Pointeur ---------------------------------------------------------
  const target = new Vector2(0.5, 0.5); // coordonnées normalisées, origine en haut à gauche
  const current = new Vector2(0.5, 0.5);
  let pointerActive = false;

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    target.set((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
    pointerActive = true;
  };
  const onPointerLeave = () => {
    pointerActive = false;
  };

  // --- Boucle de rendu, en pause hors écran et onglet inactif ------------
  let frame = 0;
  let last = 0;
  let inView = true;
  let disposed = false;

  const render = (now: number) => {
    frame = 0;
    if (disposed) return;
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    uTime.value += dt;

    if (!pointerActive) {
      // Sans curseur (tactile, souris absente), le halo dérive lentement.
      const t = uTime.value;
      target.set(0.5 + 0.32 * Math.sin(t * 0.21), 0.45 + 0.25 * Math.cos(t * 0.17));
    }
    const ease = 1 - Math.exp(-dt * 6);
    current.lerp(target, ease);
    // Halo plus discret quand il dérive seul que lorsqu'il suit le curseur.
    const glowTarget = pointerActive ? 1 : 0.4;
    uGlow.value += (glowTarget - uGlow.value) * (1 - Math.exp(-dt * 1.5));

    // Le repère UV du QuadMesh a son origine en haut à gauche, comme le pointeur.
    uMouse.value.set(current.x * width * pixelRatio, current.y * height * pixelRatio);

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

  resize();
  intersection.observe(canvas);
  resizeObserver.observe(canvas);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
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
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      material.dispose();
      renderer.dispose();
    },
  };
}
