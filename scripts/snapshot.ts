// Prebuild step (AD-2). Fetches the public snapshot, renders article bodies, writes src/content/snapshot/*.json
// and public/version.json. Any failure exits 1 so the build fails and the live site stays as it was.
//   remote: SNAPSHOT_URL (site origin) + BUILD_ACCESS_CLIENT_ID + BUILD_ACCESS_CLIENT_SECRET (Access service token)
//   local:  --local reads the local D1 through wrangler (dev and CI fixtures only, never remote)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { renderArticleHtml, readingMinutes, tocOf, type RenderContext } from '../src/shared/render.ts';
import { Snapshot } from '../src/shared/public.ts';
import type { RenderedArticle } from '../src/shared/rendered.ts';

const OUT = 'src/content/snapshot';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

async function load(): Promise<unknown> {
  if (process.argv.includes('--local')) {
    const { getPlatformProxy } = await import('wrangler');
    const { createDb } = await import('../src/server/db/client.ts');
    const { buildSnapshot } = await import('../src/server/services/snapshot.ts');
    const proxy = await getPlatformProxy<{ DB: D1Database }>();
    try { return await buildSnapshot(createDb(proxy.env.DB)); } finally { await proxy.dispose(); }
  }
  const { SNAPSHOT_URL, BUILD_ACCESS_CLIENT_ID, BUILD_ACCESS_CLIENT_SECRET } = process.env;
  if (!SNAPSHOT_URL || !BUILD_ACCESS_CLIENT_ID || !BUILD_ACCESS_CLIENT_SECRET) {
    throw new Error('SNAPSHOT_URL, BUILD_ACCESS_CLIENT_ID and BUILD_ACCESS_CLIENT_SECRET are required (or pass --local)');
  }
  const res = await fetch(new URL('/api/build/snapshot', SNAPSHOT_URL), {
    headers: { 'CF-Access-Client-Id': BUILD_ACCESS_CLIENT_ID, 'CF-Access-Client-Secret': BUILD_ACCESS_CLIENT_SECRET },
  });
  if (!res.ok) throw new Error(`snapshot fetch failed: HTTP ${res.status}`);
  const json = (await res.json()) as { ok?: boolean; data?: unknown };
  if (!json.ok) throw new Error('snapshot fetch failed: response not ok');
  return json.data;
}

const snapshot = Snapshot.parse(await load());
const media = new Map(snapshot.media.map((m) => [m.id, m]));
const artefacts = new Map(snapshot.artefacts.map((a) => [a.id, a]));
const labelsFor = (lang: 'id' | 'en') => {
  const m = readJson(`src/i18n/${lang}.json`);
  return { ...m.record, categories: m.category };
};

const articles: RenderedArticle[] = snapshot.articles.map((a) => ({
  ...a,
  translations: a.translations.map((t) => {
    const ctx: RenderContext = { lang: t.lang, media, artefacts, labels: labelsFor(t.lang) };
    const { body, ...rest } = t;
    return { ...rest, html: renderArticleHtml(body, ctx), toc: tocOf(body), readingMinutes: readingMinutes(body) };
  }),
}));

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/articles.json`, JSON.stringify(articles));
writeFileSync(`${OUT}/artefacts.json`, JSON.stringify(snapshot.artefacts));
writeFileSync(`${OUT}/media.json`, JSON.stringify(snapshot.media));
// Copied into dist by the build; rebuilds.refresh() compares it to the target version (AD-3).
writeFileSync('public/version.json', JSON.stringify({ content_version: snapshot.content_version }));
console.log(`snapshot v${snapshot.content_version}: ${articles.length} articles, ${snapshot.artefacts.length} artefacts, ${snapshot.media.length} media`);
