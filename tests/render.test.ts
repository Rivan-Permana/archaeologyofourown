import { test } from 'node:test';
import assert from 'node:assert/strict';
import { body } from '../src/shared/blocks.ts';
import { esc, jsonForScript, readingMinutes, renderArticleHtml, tocOf, type RenderContext } from '../src/shared/render.ts';

const U = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const ctx: RenderContext = {
  lang: 'id',
  media: new Map([[U(1), { id: U(1), mime: 'image/webp', width: 2000, height: 1333, variants: [640, 1280, 2000], tintLight: null, tintDark: null, isPlaceholder: true }]]),
  artefacts: new Map([[U(2), { id: U(2), inventoryNumber: 'INV-1', year: '1998', category: 'proses', contributorCredit: 'Kontributor Contoh', isPlaceholder: true, refs: [], translations: [{ lang: 'id', title: 'Artefak <b>', provenance: 'Asal', publishedAt: '2026-01-01T00:00:00.000Z' }] }]]),
  labels: { inventoryNumber: 'No.', year: 'Tahun', category: 'Kategori', provenance: 'Asal', credit: 'Kredit', categories: { proses: 'Proses' } },
};
const t = (text: string, styles?: object) => ({ type: 'text', text, ...(styles ? { styles } : {}) });

test('renders semantic blocks, inline marks and the catalogue record', () => {
  const doc = body.parse([
    { type: 'heading', props: { level: 2 }, content: [t('Judul')] },
    { type: 'paragraph', content: [t('Halo '), t('world', { lang: 'en', italic: true })] },
    { type: 'quote', content: [t('Kutipan')] },
    { type: 'image', props: { mediaId: U(1), alt: { id: 'Gambar' }, caption: { id: 'Ket' }, credit: 'Kredit' } },
    { type: 'catalogueRecord', props: { artefactId: U(2) } },
  ]);
  assert.equal(renderArticleHtml(doc, ctx), [
    '<h2 id="section-1" tabindex="-1">Judul</h2>',
    '<p>Halo <span lang="en"><em>world</em></span></p>',
    '<blockquote><p>Kutipan</p></blockquote>',
    `<figure><img src="/media/${U(1)}-w2000.webp" srcset="/media/${U(1)}-w640.webp 640w, /media/${U(1)}-w1280.webp 1280w, /media/${U(1)}-w2000.webp 2000w" sizes="(min-width: 768px) 68ch, 100vw" width="2000" height="1333" alt="Gambar" loading="lazy" decoding="async"><figcaption>Ket <span class="credit">Kredit</span></figcaption></figure>`,
    '<dl class="catalogue-record" aria-label="Artefak &lt;b&gt;"><dt>No.</dt><dd>INV-1</dd><dt>Tahun</dt><dd>1998</dd><dt>Kategori</dt><dd><span class="category-tag">Proses</span></dd><dt>Asal</dt><dd>Asal</dd><dt>Kredit</dt><dd>Kontributor Contoh</dd></dl>',
  ].join('\n'));
});

test('hostile content is escaped or rejected by the schema, never rendered', () => {
  const doc = body.parse([{ type: 'paragraph', content: [t('<script>alert(1)</script><img src=x onerror=alert(1)>')] }]);
  const out = renderArticleHtml(doc, ctx);
  assert.ok(!out.includes('<script') && !out.includes('<img'));
  assert.ok(out.includes('&lt;script&gt;'));
  // no link, raw HTML, attribute or external image can get through the schema
  for (const bad of [
    [{ type: 'paragraph', content: [{ type: 'link', href: 'javascript:alert(1)', content: [] }] }],
    [{ type: 'paragraph', content: [t('x', { textColor: 'red' })] }],
    [{ type: 'image', props: { mediaId: 'https://evil.example/x.png', alt: { id: 'a' } } }],
    [{ type: 'html', content: '<script>' }],
  ]) assert.equal(body.safeParse(bad).success, false);
});

test('an image needs known media and alt text in the page language, a hidden record is omitted', () => {
  const noAlt = body.parse([{ type: 'image', props: { mediaId: U(1), alt: { en: 'only english' } } }]);
  assert.throws(() => renderArticleHtml(noAlt, ctx), /alt/);
  const unknown = body.parse([{ type: 'image', props: { mediaId: U(9), alt: { id: 'a' } } }]);
  assert.throws(() => renderArticleHtml(unknown, ctx), /media/);
  const rec = body.parse([{ type: 'catalogueRecord', props: { artefactId: U(2) } }]);
  assert.equal(renderArticleHtml(rec, { ...ctx, lang: 'en' }), '');
});

test('reading time: 200 words a minute, at least 1, text blocks only', () => {
  const words = (n: number) => Array(n).fill('kata').join(' ');
  const mk = (n: number) => body.parse([{ type: 'paragraph', content: [t(words(n))] }, { type: 'catalogueRecord', props: { artefactId: U(2) } }]);
  assert.equal(readingMinutes(mk(0)), 1);
  assert.equal(readingMinutes(mk(200)), 1);
  assert.equal(readingMinutes(mk(201)), 2);
});

test('json for script escapes < and line separators', () => {
  const out = jsonForScript({ a: '</script><!--', b: ' ' });
  assert.ok(!out.includes('<') && !out.includes(' '));
  assert.deepEqual(JSON.parse(out), { a: '</script><!--', b: ' ' });
  assert.equal(esc(`&<>"'`), '&amp;&lt;&gt;&quot;&#39;');
});

test('toc lists h2 headings in order with the ids used in the markup', () => {
  const doc = body.parse([
    { type: 'heading', props: { level: 2 }, content: [t('Satu')] },
    { type: 'heading', props: { level: 3 }, content: [t('Sub')] },
    { type: 'heading', props: { level: 2 }, content: [t('Dua '), t('<b>', { bold: true })] },
  ]);
  assert.deepEqual(tocOf(doc), [{ id: 'section-1', text: 'Satu' }, { id: 'section-2', text: 'Dua <b>' }]);
  const out = renderArticleHtml(doc, ctx);
  assert.ok(out.includes('id="section-2"') && out.includes('<h3>Sub</h3>'));
});
