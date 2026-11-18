// Post-build leak check (AR17): the public output must hold no email, no Reference Number and no admin path.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+/;
const REFERENCE = /AOO-[0-9A-HJKMNP-TV-Z]{6}/; // Crockford base32
const TEXT = /\.(html|js|mjs|css|json|txt|xml|svg|map|webmanifest)$/i;

export function scanDist(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      const rel = relative(dir, p);
      if (/(^|[\\/])admin([\\/.]|$)/i.test(rel)) out.push(`${rel}: admin path`);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (!TEXT.test(name)) continue;
      const text = readFileSync(p, 'utf8');
      if (EMAIL.test(text)) out.push(`${rel}: email address`);
      if (REFERENCE.test(text)) out.push(`${rel}: Reference Number`);
    }
  };
  walk(dir);
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const found = scanDist('dist/client');
  if (found.length) { console.error(found.join('\n')); process.exit(1); }
  console.log('leak check passed');
}
