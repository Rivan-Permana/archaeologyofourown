// Which drawn find fills an image slot that has no photo. Deterministic per key, so a page renders the same
// drawing on every build and in the browser swap (the names match the .slot[data-find] rules in global.css).
export const FINDS = ['cap', 'coin', 'sherd', 'bottle', 'glass', 'key'] as const;

export const findFor = (key: string): (typeof FINDS)[number] =>
  FINDS[[...key].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % FINDS.length];
