// AR6: fail on any @blocknote/xl-* package or any GPL/AGPL licence in the lockfile.
import { readFileSync } from 'node:fs';

interface LockPackage { license?: string | { type?: string } }

const FORBIDDEN_NAME = /(^|\/)node_modules\/@blocknote\/xl-/;
const FORBIDDEN_LICENSE = /\b(A?GPL)\b/i;

export function findViolations(packages: Record<string, LockPackage>): string[] {
  const out: string[] = [];
  for (const [path, pkg] of Object.entries(packages)) {
    if (!path) continue;
    const license = typeof pkg.license === 'string' ? pkg.license : pkg.license?.type ?? '';
    if (FORBIDDEN_NAME.test(path)) out.push(`${path}: @blocknote/xl-* is not allowed`);
    else if (FORBIDDEN_LICENSE.test(license)) out.push(`${path}: licence ${license} is not allowed`);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8')) as { packages?: Record<string, LockPackage> };
  const violations = findViolations(lock.packages ?? {});
  if (violations.length) {
    console.error(violations.join('\n'));
    process.exit(1);
  }
  console.log('licence check passed');
}
