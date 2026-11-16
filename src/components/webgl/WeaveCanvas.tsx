import { useEffect, useRef } from 'react';

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/** Décide si l'appareil mérite le shader ; sinon le motif CSS reste seul. */
function canRunShader(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const hints = navigator as Navigator & NavigatorHints;
  if (hints.connection?.saveData) return false;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = hints.deviceMemory ?? 8;
  if (coarse && (cores <= 4 || memory <= 2)) return false;

  return true;
}

export default function WeaveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !canRunShader()) return;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    // Three.js n'est téléchargé que si le shader va réellement tourner.
    import('./weaveScene')
      .then(({ createWeaveScene }) => createWeaveScene(canvas))
      .then((scene) => {
        if (!scene) return;
        if (cancelled) {
          scene.dispose();
          return;
        }
        dispose = scene.dispose;
        canvas.dataset.ready = 'true';
      })
      .catch(() => {
        /* repli CSS */
      });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return <canvas ref={ref} className="weave-canvas" aria-hidden="true" />;
}
