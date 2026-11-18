// Artefact of the Day tint (UX-DR21): keep the image's hue and chroma, move lightness until the
// background is light enough (relative luminance >= 0.62) or dark enough (<= 0.038) for the tokens' text.
// Any pair that still fails contrast falls back to the surface colours.
export const THEME = {
  light: { surface: '#EFEFEA', ink: '#161A33', inkMuted: '#50546B', accent: '#2B3A8C' },
  dark: { surface: '#191C36', ink: '#F1F0EA', inkMuted: '#A6A9C0', accent: '#8C9BEA' },
} as const;
export const LIGHT_MIN_LUMINANCE = 0.62;
export const DARK_MAX_LUMINANCE = 0.038;

// Search targets sit a little inside the limits so rounding to 8-bit hex cannot cross them.
const LIGHT_TARGET = LIGHT_MIN_LUMINANCE + 0.01;
const DARK_TARGET = DARK_MAX_LUMINANCE - 0.004;

type Rgb = [number, number, number]; // linear 0..1
const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const parse = (hex: string): Rgb => [1, 3, 5].map((i) => toLin(parseInt(hex.slice(i, i + 2), 16) / 255)) as Rgb;
const hex = ([r, g, b]: Rgb) => '#' + [r, g, b].map((c) => Math.round(Math.min(1, Math.max(0, toSrgb(c))) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const luminance = ([r, g, b]: Rgb) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

function toOklch([r, g, b]: Rgb): [number, number, number] {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(a, bb), Math.atan2(bb, a)];
}
function fromOklch(L: number, C: number, h: number): Rgb {
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const inGamut = (c: Rgb) => c.every((v) => v >= -1e-6 && v <= 1 + 1e-6);

/** Largest chroma <= C that stays inside sRGB at this lightness and hue. */
function fit(L: number, C: number, h: number): Rgb {
  if (inGamut(fromOklch(L, C, h))) return fromOklch(L, C, h);
  let lo = 0, hi = C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(fromOklch(L, mid, h))) lo = mid; else hi = mid;
  }
  return fromOklch(L, lo, h);
}

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(parse(a)), luminance(parse(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

function shift(dominant: string, mode: 'light' | 'dark'): string {
  const [L0, C, h] = toOklch(parse(dominant));
  const y = (L: number) => luminance(fit(L, C, h));
  let L = L0;
  if (mode === 'light' && y(L0) < LIGHT_TARGET) {
    let lo = L0, hi = 1;
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (y(mid) >= LIGHT_TARGET) hi = mid; else lo = mid; }
    L = hi;
  } else if (mode === 'dark' && y(L0) > DARK_TARGET) {
    let lo = 0, hi = L0;
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (y(mid) <= DARK_TARGET) lo = mid; else hi = mid; }
    L = lo;
  }
  return hex(fit(L, C, h));
}

const passes = (tint: string, t: { ink: string; inkMuted: string; accent: string }) =>
  contrast(t.ink, tint) >= 4.5 && contrast(t.inkMuted, tint) >= 4.5 && // text (ink also covers borders, 3:1)
  contrast(t.accent, tint) >= 3; // focus ring

/** Light and dark tints for a dominant colour (`#RRGGBB`); a theme that cannot pass contrast gets its surface. */
export function clampTint(dominant: string): { light: string; dark: string } {
  const light = shift(dominant, 'light');
  const dark = shift(dominant, 'dark');
  return { light: passes(light, THEME.light) ? light : THEME.light.surface, dark: passes(dark, THEME.dark) ? dark : THEME.dark.surface };
}
export const relativeLuminance = (h: string) => luminance(parse(h));
