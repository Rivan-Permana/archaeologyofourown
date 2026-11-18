// Local fixture tool. Writes the LOCAL D1 and R2 directly (wrangler getPlatformProxy, never remote).
// Accepted exception to "services own every write" (AD-4). Placeholder fixtures only (AR52); idempotent.
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { getPlatformProxy } from 'wrangler';
import { sql } from 'drizzle-orm';
import { createDb } from '../src/server/db/client.ts';
import { article, articleTranslation, artefact, artefactTranslation, mediaAsset, mediaRef, mediaRefTranslation } from '../src/server/db/schema.ts';
import { clampTint } from '../src/shared/tint.ts';
import type { Body } from '../src/shared/blocks.ts';
import type { EditorialSeries } from '../src/shared/enums.ts';

// Stable ids so a second run yields the same rows.
const uid = (name: string) => {
  const h = createHash('sha1').update(`aoo-seed:${name}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
const SURFACE = '#EAE3D7';
const WIDTHS = [640, 1280, 2000];

const { env, dispose } = await getPlatformProxy<{ DB: D1Database; MEDIA: R2Bucket }>();
const db = createDb(env.DB);

// Fixture dominant colours stand in for the crop tool's canvas read (Epic 4); the tints come from clampTint().
const DOMINANT: Record<string, string> = { 'artefact:1': '#5E8C86', 'artefact:2': '#C09A4B', 'artefact:3': '#B06A74', 'artefact:4': '#6F7FA8' };

async function asset(name: string, ratio: number) {
  const tint = clampTint(DOMINANT[name] ?? SURFACE);
  const id = uid(`asset:${name}`);
  for (const w of WIDTHS) {
    const buf = await sharp({ create: { width: w, height: Math.round(w / ratio), channels: 3, background: SURFACE } }).webp().toBuffer();
    await env.MEDIA.put(`${id}-w${w}.webp`, buf, { httpMetadata: { contentType: 'image/webp' } });
  }
  await db.insert(mediaAsset).values({
    id, mime: 'image/webp', width: 2000, height: Math.round(2000 / ratio), variants: JSON.stringify(WIDTHS),
    tintLight: tint.light, tintDark: tint.dark, status: 'ready', isPlaceholder: true,
  }).onConflictDoUpdate({ target: mediaAsset.id, set: { tintLight: tint.light, tintDark: tint.dark } });
  return id;
}

async function ref(ownerType: 'article' | 'artefact', ownerId: string, role: 'hero' | 'body' | 'image', assetId: string, name: string, position = 0) {
  const id = uid(`ref:${name}`);
  await db.insert(mediaRef).values({ id, assetId, ownerType, ownerId, role, position }).onConflictDoNothing();
  for (const lang of ['id', 'en'] as const) {
    await db.insert(mediaRefTranslation).values({
      id: uid(`ref:${name}:${lang}`), mediaRefId: id, lang,
      alt: lang === 'id' ? 'Gambar contoh' : 'Placeholder image',
      caption: lang === 'id' ? 'Keterangan contoh' : 'Placeholder caption', credit: 'Kredit contoh',
    }).onConflictDoNothing();
  }
}

const t = (text: string) => [{ type: 'text' as const, text }];
const h2 = (text: string) => ({ type: 'heading' as const, props: { level: 2 as const }, content: t(text) });
const p = (text: string) => ({ type: 'paragraph' as const, content: t(text) });

// series, languages, extras
const ARTICLES: { n: number; series: EditorialSeries; langs: ('id' | 'en')[]; rich?: boolean }[] = [
  { n: 1, series: 'temuan', langs: ['id', 'en'], rich: true },
  { n: 2, series: 'temuan', langs: ['id'] },
  { n: 3, series: 'temuan', langs: ['id', 'en'] },
  { n: 4, series: 'jejak-proses', langs: ['id', 'en'] },
  { n: 5, series: 'jejak-proses', langs: ['id', 'en'] },
  { n: 6, series: 'stratigrafi', langs: ['id', 'en'] },
  { n: 7, series: 'stratigrafi', langs: ['id', 'en'] },
];

const ARTEFACTS = [
  { n: 1, category: 'budaya-visual' as const, year: '1998', published: true },
  { n: 2, category: 'proses' as const, year: 'sekitar 1975', published: true },
  { n: 3, category: 'ingatan' as const, year: '2004', published: true },
  { n: 4, category: 'ingatan' as const, year: '1991', published: false },
];

for (const a of ARTEFACTS) {
  const id = uid(`artefact:${a.n}`);
  const when = `2026-0${a.n}-10T03:00:00.000Z`;
  await db.insert(artefact).values({
    id, inventoryNumber: `INV-000${a.n}`, year: a.year, category: a.category,
    contributorCredit: 'Kontributor Contoh', isPlaceholder: true,
  }).onConflictDoNothing();
  for (const lang of ['id', 'en'] as const) {
    const title = lang === 'id' ? `Artefak contoh ${a.n}` : `Placeholder artefact ${a.n}`;
    const provenance = lang === 'id' ? 'Asal contoh' : 'Placeholder provenance';
    await db.insert(artefactTranslation).values({
      id: uid(`artefact:${a.n}:${lang}`), artefactId: id, lang, title, provenance,
      status: a.published ? 'published' : 'draft',
      publishedTitle: a.published ? title : null, publishedProvenance: a.published ? provenance : null,
      publishedAt: a.published ? when : null,
    }).onConflictDoNothing();
  }
  await ref('artefact', id, 'image', await asset(`artefact:${a.n}`, 4 / 5), `artefact:${a.n}`);
}

for (const a of ARTICLES) {
  const id = uid(`article:${a.n}`);
  const when = `2026-10-${String(a.n).padStart(2, '0')}T03:00:00.000Z`;
  await db.insert(article).values({ id, series: a.series, author: 'Penulis Contoh', date: when, isPlaceholder: true }).onConflictDoNothing();
  const bodyAsset = a.rich ? await asset('article:1:body', 3 / 2) : null;
  for (const lang of a.langs) {
    const title = lang === 'id' ? `Artikel contoh ${a.n}` : `Placeholder article ${a.n}`;
    const standfirst = lang === 'id' ? 'Pengantar contoh untuk artikel ini.' : 'A placeholder standfirst for this article.';
    const filler = lang === 'id' ? 'Teks contoh. Isi ini akan diganti.' : 'Placeholder text. This will be replaced.';
    const doc: Body = [p(filler)];
    if (a.rich) {
      doc.push(h2(lang === 'id' ? 'Bagian satu' : 'Part one'), p(filler), h2(lang === 'id' ? 'Bagian dua' : 'Part two'), p(filler),
        { type: 'image', props: { mediaId: bodyAsset!, alt: { id: 'Gambar contoh', en: 'Placeholder image' } } },
        h2(lang === 'id' ? 'Bagian tiga' : 'Part three'), p(filler),
        { type: 'catalogueRecord', props: { artefactId: uid('artefact:1') } });
    }
    const json = JSON.stringify(doc);
    await db.insert(articleTranslation).values({
      id: uid(`article:${a.n}:${lang}`), articleId: id, lang,
      slug: lang === 'id' ? `artikel-contoh-${a.n}` : `placeholder-article-${a.n}`,
      status: 'published', title, standfirst, body: json,
      publishedTitle: title, publishedStandfirst: standfirst, publishedBody: json, publishedAt: when,
    }).onConflictDoNothing();
  }
  await ref('article', id, 'hero', await asset(`article:${a.n}:hero`, 3 / 2), `article:${a.n}:hero`);
  if (bodyAsset) await ref('article', id, 'body', bodyAsset, 'article:1:body', 1);
}

// Published content exists now: bump once (a rerun leaves it as is).
await db.run(sql`UPDATE site_state SET content_version = 1 WHERE content_version = 0`);
console.log('seeded local D1 and R2 with Placeholder fixtures');
await dispose();
