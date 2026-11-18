// Launch gate (AD-18, AR48). Runs before every build, after the snapshot.
//  - writes public/_headers from the template: noindex is added until PUBLIC_LAUNCH=true
//  - with PUBLIC_LAUNCH=true, fails the build naming every Placeholder record, every copy string still pending
//    client approval, and a missing site URL
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

interface Flagged { isPlaceholder: boolean; id: string }
export interface GateInput { articles: Flagged[]; artefacts: Flagged[]; media: Flagged[]; pendingCopy: string[]; siteUrl?: string }

export function findLaunchBlockers(i: GateInput): string[] {
  const out: string[] = [];
  for (const [kind, list] of [['article', i.articles], ['artefact', i.artefacts], ['media', i.media]] as const) {
    for (const r of list) if (r.isPlaceholder) out.push(`${kind} ${r.id} is a Placeholder`);
  }
  for (const key of i.pendingCopy) out.push(`copy "${key}" is pending client approval`);
  if (!i.siteUrl || /localhost|127\.0\.0\.1/.test(i.siteUrl)) out.push('PUBLIC_SITE_URL is not set to the public address');
  return out;
}

export function renderHeaders(template: string, launched: boolean): string {
  return launched ? template.split('\n').filter((l) => !/X-Robots-Tag/i.test(l)).join('\n') : template;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const launched = process.env.PUBLIC_LAUNCH === 'true';
  const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
  const snap = (f: string) => (existsSync(`src/content/snapshot/${f}.json`) ? read(`src/content/snapshot/${f}.json`) : null);
  const [articles, artefacts, media] = [snap('articles'), snap('artefacts'), snap('media')];
  if (!articles || !artefacts || !media) {
    console.error('launch gate: run the snapshot step first (npm run snapshot)');
    process.exit(1);
  }
  const pending = new Set<string>();
  for (const lang of ['id', 'en']) for (const k of read(`src/i18n/${lang}.json`)._pendingApproval ?? []) pending.add(k);
  const blockers = findLaunchBlockers({ articles, artefacts, media, pendingCopy: [...pending], siteUrl: process.env.PUBLIC_SITE_URL });
  if (launched && blockers.length) {
    console.error(`launch gate: PUBLIC_LAUNCH=true but ${blockers.length} item(s) block the launch:\n- ${blockers.join('\n- ')}`);
    process.exit(1);
  }
  writeFileSync('public/_headers', renderHeaders(readFileSync('scripts/headers.template', 'utf8'), launched));
  console.log(launched ? 'launch gate passed: site is indexable' : `site stays noindex (${blockers.length} item(s) would block a launch)`);
}
