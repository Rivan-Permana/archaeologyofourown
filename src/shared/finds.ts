// Which drawn find fills an image slot that has no photo. Deterministic per key, so a page renders the same
// drawing on every build and in the browser swap (the names match the .slot[data-find] rules in global.css).
export const FINDS = ['cap', 'coin', 'sherd', 'bottle', 'glass', 'key'] as const;

export const findFor = (key: string): (typeof FINDS)[number] =>
  FINDS[[...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % FINDS.length];

// Drawings shown together on one page: each key starts at its own find and steps to the next one not yet used,
// so no two plates on a screen repeat until all six are out.
export function findsFor(keys: string[], taken: string[] = []): (typeof FINDS)[number][] {
  const used = new Set<string>(taken);
  return keys.map((k) => {
    if (used.size >= FINDS.length) used.clear();
    let i = FINDS.indexOf(findFor(k));
    while (used.has(FINDS[i])) i = (i + 1) % FINDS.length;
    used.add(FINDS[i]);
    return FINDS[i];
  });
}
