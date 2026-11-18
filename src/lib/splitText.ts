/**
 * Découpe le texte d'un élément en mots ou en lettres, chacun derrière un masque,
 * pour les faire monter à l'entrée. Les balises imbriquées (contour, etc.) sont conservées.
 * `revert()` remet le HTML d'origine une fois l'animation terminée, pour que le texte
 * retrouve son retour à la ligne naturel au redimensionnement.
 */
export interface Split {
  /** Les éléments à animer (un par mot ou par lettre), dans l'ordre de lecture. */
  units: HTMLElement[];
  /** Les mêmes éléments regroupés par ligne visuelle. */
  lines: HTMLElement[][];
  revert: () => void;
}

export function splitText(root: HTMLElement, mode: 'words' | 'chars'): Split {
  const original = root.innerHTML;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) texts.push(walker.currentNode as Text);

  const masks: HTMLElement[] = [];
  const units: HTMLElement[] = [];

  for (const node of texts) {
    const value = node.nodeValue ?? '';
    if (!value.trim()) continue;
    const tokens = mode === 'chars' ? Array.from(value) : value.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    for (const token of tokens) {
      if (!token) continue;
      if (!token.trim()) {
        fragment.append(token);
        continue;
      }
      const mask = document.createElement('span');
      mask.className = 'split-mask';
      const unit = document.createElement('span');
      unit.className = 'split-unit';
      unit.textContent = token;
      mask.append(unit);
      fragment.append(mask);
      masks.push(mask);
      units.push(unit);
    }
    node.replaceWith(fragment);
  }

  // Regroupement par ligne : même position verticale, à l'arrondi près.
  const lines: HTMLElement[][] = [];
  let lastTop: number | null = null;
  masks.forEach((mask, i) => {
    const top = Math.round(mask.getBoundingClientRect().top);
    if (lastTop === null || Math.abs(top - lastTop) > 4) {
      lines.push([]);
      lastTop = top;
    }
    lines[lines.length - 1]!.push(units[i]!);
  });

  return {
    units,
    lines,
    revert: () => {
      root.innerHTML = original;
    },
  };
}
