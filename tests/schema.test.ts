import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { testEnv } from './helpers/db.ts';
import { article, articleTranslation, siteState } from '../src/server/db/schema.ts';
import { EDITORIAL_SERIES, CATEGORIES } from '../src/shared/enums.ts';
import { body } from '../src/shared/blocks.ts';

let env: Awaited<ReturnType<typeof testEnv>>;
before(async () => { env = await testEnv(); });
after(() => env.dispose());

test('migration creates exactly the eight tables and starts content_version at 0', async () => {
  const { results } = await env.d1.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'sqlite_%' ORDER BY name").all<{ name: string }>();
  assert.deepEqual(results.map((r) => r.name), ['artefact', 'artefact_translation', 'article', 'article_translation', 'media_asset', 'media_ref', 'media_ref_translation', 'site_state']);
  const [row] = await env.db.select().from(siteState);
  assert.equal(row.contentVersion, 0);
});

test('(lang, slug) is unique on article_translation', async () => {
  const [a] = await env.db.insert(article).values({ series: 'temuan', author: 'Penulis Contoh' }).returning();
  const [b] = await env.db.insert(article).values({ series: 'temuan', author: 'Penulis Contoh' }).returning();
  await env.db.insert(articleTranslation).values({ articleId: a.id, lang: 'id', slug: 'sama' });
  await assert.rejects(env.db.insert(articleTranslation).values({ articleId: b.id, lang: 'id', slug: 'sama' }));
  await env.db.insert(articleTranslation).values({ articleId: b.id, lang: 'en', slug: 'sama' });
});

test('enums are the fixed lists', () => {
  assert.deepEqual([...EDITORIAL_SERIES], ['temuan', 'jejak-proses', 'ingatan-bersama', 'stratigrafi']);
  assert.deepEqual([...CATEGORIES], ['budaya-visual', 'proses', 'ingatan']);
});

const uuid = '3b241101-e2bb-4255-8caf-4136c566a962';
test('body schema accepts the allowed blocks and rejects others', () => {
  const ok = [
    { type: 'heading', props: { level: 2 }, content: [{ type: 'text', text: 'Judul' }] },
    { type: 'paragraph', content: [{ type: 'text', text: 'Kata', styles: { lang: 'en' } }] },
    { type: 'quote', content: [] },
    { type: 'image', props: { mediaId: uuid, alt: { id: 'Contoh' } } },
    { type: 'catalogueRecord', props: { artefactId: uuid } },
  ];
  assert.equal(body.safeParse(ok).success, true);
  assert.equal(body.safeParse([{ type: 'table' }]).success, false);
  assert.equal(body.safeParse([{ type: 'heading', props: { level: 1 }, content: [] }]).success, false);
  assert.equal(body.safeParse([{ type: 'paragraph', content: [{ type: 'text', text: 'x', styles: { color: 'red' } }] }]).success, false);
  assert.equal(body.safeParse([{ type: 'catalogueRecord', props: { artefactId: uuid, title: 'extra' } }]).success, false);
});
