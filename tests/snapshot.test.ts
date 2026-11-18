import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './helpers/db.ts';
import { mediaRefTranslation, article, articleTranslation, artefact, artefactTranslation, mediaAsset, mediaRef, siteState } from '../src/server/db/schema.ts';
import { buildSnapshot } from '../src/server/services/snapshot.ts';
import { PublicArticle, PublicArtefact, PublicMedia } from '../src/shared/public.ts';
import { eq } from 'drizzle-orm';

let env: Awaited<ReturnType<typeof testEnv>>;
const U = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const pubAf = U(1), draftAf = U(2), asset = U(3), art = U(4), draftArt = U(5);
const doc = (afId: string) => JSON.stringify([{ type: 'paragraph', content: [{ type: 'text', text: 'terbit' }] }, { type: 'catalogueRecord', props: { artefactId: afId } }]);

before(async () => {
  env = await testEnv();
  const { db } = env;
  await db.insert(mediaAsset).values({ id: asset, mime: 'image/webp', width: 2000, height: 1333, variants: '[640]', status: 'ready' });
  await db.insert(artefact).values([
    { id: pubAf, inventoryNumber: 'INV-1', category: 'proses', sourceContributionId: 'secret-contribution' },
    { id: draftAf, inventoryNumber: 'INV-2', category: 'proses' },
  ]);
  await db.insert(artefactTranslation).values([
    { artefactId: pubAf, lang: 'id', status: 'published', title: 'kerja', publishedTitle: 'terbit', publishedProvenance: 'asal', publishedAt: '2026-01-01T00:00:00.000Z' },
    { artefactId: draftAf, lang: 'id', status: 'draft', title: 'draf' },
  ]);
  await db.insert(article).values([{ id: art, series: 'temuan', author: 'Penulis' }, { id: draftArt, series: 'temuan', author: 'Penulis' }]);
  await db.insert(articleTranslation).values([
    { articleId: art, lang: 'id', slug: 'a', status: 'published', title: 'KERJA RAHASIA', body: '[]', publishedTitle: 'Terbit', publishedStandfirst: 's', publishedBody: doc(draftAf), publishedAt: '2026-01-02T00:00:00.000Z' },
    { articleId: art, lang: 'en', slug: 'a-en', status: 'draft', title: 'English draft' },
    { articleId: draftArt, lang: 'id', slug: 'b', status: 'draft', title: 'only draft' },
  ]);
  const ref = U(9);
  await db.insert(mediaRef).values({ id: ref, assetId: asset, ownerType: 'article', ownerId: art, role: 'hero' });
  await db.insert(mediaRefTranslation).values([
    { mediaRefId: ref, lang: 'id', alt: 'alt id', caption: 'keterangan id' },
    { mediaRefId: ref, lang: 'en', alt: 'alt en', caption: 'ask donor before publishing' },
  ]);
  await db.update(siteState).set({ contentVersion: 7 }).where(eq(siteState.id, 'site'));
});
after(() => env.dispose());

test('snapshot has only published copies of published translations', async () => {
  const s = await buildSnapshot(env.db);
  assert.equal(s.content_version, 7);
  assert.equal(s.articles.length, 1);
  assert.deepEqual(s.articles[0].translations.map((t) => [t.lang, t.title]), [['id', 'Terbit']]);
  assert.equal(s.artefacts.length, 1);
  assert.equal(s.artefacts[0].translations[0].title, 'terbit');
  assert.deepEqual(s.media.map((m) => m.id), [asset]);
  const text = JSON.stringify(s);
  for (const leak of ['KERJA RAHASIA', 'English draft', 'only draft', 'draf', 'secret-contribution', 'sourceContributionId']) assert.ok(!text.includes(leak), leak);
});

test('alt and caption of an unpublished language stay out', async () => {
  const [a] = (await buildSnapshot(env.db)).articles;
  assert.deepEqual(a.refs[0].alt, { id: 'alt id' });
  assert.deepEqual(a.refs[0].caption, { id: 'keterangan id' });
  assert.ok(!JSON.stringify(a).includes('ask donor'));
});

test('catalogueRecord to an unpublished Artefact is omitted', async () => {
  const [a] = (await buildSnapshot(env.db)).articles;
  assert.deepEqual(a.translations[0].body.map((b) => b.type), ['paragraph']);
});

test('DTOs are strict: private or unknown fields fail parsing', async () => {
  const s = await buildSnapshot(env.db);
  assert.throws(() => PublicArticle.parse({ ...s.articles[0], working: 'x' }));
  assert.throws(() => PublicArtefact.parse({ ...s.artefacts[0], sourceContributionId: 'x' }));
  assert.throws(() => PublicMedia.parse({ ...s.media[0], status: 'ready' }));
  assert.throws(() => PublicArticle.parse({ ...s.articles[0], translations: [{ ...s.articles[0].translations[0], title_working: 'x' }] }));
});
