import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jakartaDate, pickDaily } from '../src/shared/daily.ts';
import { clampTint, contrast, relativeLuminance, THEME, DARK_MAX_LUMINANCE, LIGHT_MIN_LUMINANCE } from '../src/shared/tint.ts';
import { parseDesign } from '../scripts/design-tokens.ts';

test('jakartaDate flips at 00:00 WIB (17:00 UTC)', () => {
  assert.equal(jakartaDate(new Date('2026-11-18T16:59:59Z')), '2026-11-18'); // 23:59:59 WIB
  assert.equal(jakartaDate(new Date('2026-11-18T17:00:00Z')), '2026-11-19'); // 00:00 WIB
  assert.equal(jakartaDate(new Date('2026-12-31T17:00:00Z')), '2027-01-01');
});

test('pickDaily is stable, order independent and varies by date', () => {
  const ids = ['c', 'a', 'b', 'd', 'e'];
  const day = pickDaily(ids, '2026-11-18');
  assert.equal(pickDaily(ids, '2026-11-18'), day);
  assert.equal(pickDaily([...ids].reverse(), '2026-11-18'), day);
  assert.ok(ids.includes(day!));
  const seen = new Set(Array.from({ length: 40 }, (_, i) => pickDaily(ids, `2026-12-${String(i % 28 + 1).padStart(2, '0')}`)));
  assert.ok(seen.size > 1, 'different dates pick different artefacts');
});

test('pickDaily with a pool of one or none', () => {
  assert.equal(pickDaily(['only'], '2026-11-18'), 'only');
  assert.equal(pickDaily([], '2026-11-18'), undefined);
});

const hueOf = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * 180 / Math.PI;
};
const ok = (t: { light: string; dark: string }) => {
  for (const c of [t.light, t.dark]) assert.match(c, /^#[0-9A-F]{6}$/);
  assert.ok(t.light === THEME.light.surface || relativeLuminance(t.light) >= LIGHT_MIN_LUMINANCE, `light ${t.light}`);
  assert.ok(t.dark === THEME.dark.surface || relativeLuminance(t.dark) <= DARK_MAX_LUMINANCE, `dark ${t.dark}`);
  assert.ok(contrast(THEME.light.ink, t.light) >= 4.5 && contrast(THEME.dark.ink, t.dark) >= 4.5);
};

test('clampTint: saturated red, near-black, near-white, out-of-gamut blue', () => {
  for (const c of ['#FF0000', '#050505', '#FDFDFD', '#0000FF', '#00FF00', '#B4462B', '#5E8C86']) ok(clampTint(c));
  const red = clampTint('#FF0000');
  assert.ok(red.light !== THEME.light.surface, 'red keeps its hue in light');
  assert.ok(Math.abs(hueOf(red.light) - 0) < 25 || Math.abs(hueOf(red.light) - 360) < 25);
  assert.equal(clampTint('#FDFDFD').light, '#FDFDFD'); // already light enough, unchanged
  assert.ok(relativeLuminance(clampTint('#050505').light) >= LIGHT_MIN_LUMINANCE); // raised
});

test('tint constants match the DESIGN.md public colours', () => {
  const c = parseDesign().colors;
  assert.deepEqual([THEME.light.surface, THEME.light.ink, THEME.light.inkMuted, THEME.light.accent].map((v) => v.toLowerCase()), [c.surface, c.ink, c['ink-muted'], c.accent].map((v) => v.toLowerCase()));
  assert.deepEqual([THEME.dark.surface, THEME.dark.ink, THEME.dark.inkMuted, THEME.dark.accent].map((v) => v.toLowerCase()), [c['surface-dark'], c['ink-dark'], c['ink-muted-dark'], c['accent-dark']].map((v) => v.toLowerCase()));
});
