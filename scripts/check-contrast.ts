// NFR2: contrast of public token pairs in light and dark. Exits 1 on any miss.
import { parseDesign } from './design-tokens.ts';

function lum(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function ratio(a: string, b: string): number {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio, use]. Accent text only on paper (UX-DR7).
const PAIRS: [string, string, number, string][] = [
  ['ink', 'paper', 4.5, 'body text'],
  ['ink', 'surface', 4.5, 'text on surface'],
  ['ink-muted', 'paper', 4.5, 'muted text'],
  ['ink-muted', 'surface', 4.5, 'muted text on surface'],
  ['accent', 'paper', 4.5, 'accent text'],
  ['on-accent', 'accent', 4.5, 'primary button label'],
  ['ink', 'paper', 3, 'control border'],
  ['accent', 'paper', 3, 'focus ring'],
];

export function check(colors: Record<string, string>): string[] {
  const fails: string[] = [];
  for (const theme of ['', '-dark']) {
    for (const [fg, bg, min, use] of PAIRS) {
      const r = ratio(colors[fg + theme], colors[bg + theme]);
      if (r < min) fails.push(`${theme || '-light'} ${fg} on ${bg} (${use}): ${r.toFixed(2)} < ${min}`);
    }
  }
  return fails;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const fails = check(parseDesign().colors);
  if (fails.length) { console.error(fails.join('\n')); process.exit(1); }
  console.log('contrast check passed');
}
