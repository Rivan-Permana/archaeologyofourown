// Reads the public tokens from UX DESIGN.md front matter. Flat two-level YAML only, so no parser dependency.
import { readFileSync } from 'node:fs';

export const DESIGN_PATH =
  '_bmad-output/planning-artifacts/ux-designs/ux-archaeologyofourown-2026-11-17/DESIGN.md';

export function parseDesign(path = DESIGN_PATH): Record<string, Record<string, string>> {
  const front = readFileSync(path, 'utf8').split('---')[1] ?? '';
  const out: Record<string, Record<string, string>> = {};
  let section = '';
  let item = '';
  for (const raw of front.split('\n')) {
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.length - line.trimStart().length;
    const m = line.trim().match(/^'?([^':]+)'?:\s*(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    const val = rawVal.replace(/^'(.*)'$/, '$1');
    if (indent === 0) { section = key; item = ''; out[section] = {}; }
    else if (section === 'colors' || section === 'rounded' || section === 'spacing') out[section][key] = val;
    else if (section === 'typography') {
      if (indent === 2) item = key;
      else out[section][`${item}.${key}`] = val;
    }
  }
  return out;
}
