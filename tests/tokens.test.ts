import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseDesign } from '../scripts/design-tokens.ts';

const css = readFileSync('src/styles/tokens.css', 'utf8');
const [lightCss, darkCss] = css.split('@media (prefers-color-scheme: dark)');
const decls = (src: string) =>
  Object.fromEntries([...src.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim().toLowerCase()]));
const light = decls(lightCss);
const dark = decls(darkCss);
const design = parseDesign();
const norm = (v: string) => (/^[\d.]+$/.test(v) ? String(Number(v)) : v.toLowerCase());
const PUBLIC_TYPE = ['display', 'manifesto', 'h1', 'h2', 'h3', 'standfirst', 'body', 'small', 'meta', 'meta-catalogue'];
const FIELD = { fontSize: 'size', fontWeight: 'weight', lineHeight: 'leading', letterSpacing: 'tracking' } as const;
const PUBLIC_COLORS = ['paper', 'surface', 'ink', 'ink-muted', 'line', 'accent', 'on-accent'];

test('public colours match, light and dark', () => {
  for (const c of PUBLIC_COLORS) {
    assert.equal(light[`--color-${c}`], norm(design.colors[c]), c);
    assert.equal(dark[`--color-${c}`], norm(design.colors[`${c}-dark`]), `${c}-dark`);
  }
});

test('public typography matches', () => {
  for (const t of PUBLIC_TYPE) {
    for (const [k, suffix] of Object.entries(FIELD)) {
      const want = design.typography[`${t}.${k}`];
      if (want === undefined) continue;
      assert.equal(light[`--type-${t}-${suffix}`], norm(want), `${t}.${k}`);
    }
  }
  assert.ok(light['--font-display'].includes('fraunces') && light['--font-body'].includes('inter'));
});

test('spacing and radius match', () => {
  for (const [k, v] of Object.entries(design.spacing)) {
    const name = /^\d+$/.test(k) ? `--space-${k}` : `--${k}`;
    if (k.startsWith('admin')) continue;
    assert.equal(light[name], norm(v), k);
  }
  assert.equal(light['--radius-none'], '0');
});

test('no public token is missing a dark value', () => {
  for (const c of PUBLIC_COLORS) assert.ok(dark[`--color-${c}`], `${c} dark`);
});
