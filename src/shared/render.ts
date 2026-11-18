// The one function that turns a validated article body into HTML (AD-6). Pure string building, so the
// build (Node) and the admin preview (browser) produce identical output with no DOM needed.
// Safety comes from the schema (no link, no raw HTML, no arbitrary attributes) plus escaping every text value.
// This file and ArticleBody.astro are the only places allowed to inject HTML (see tests/no-raw-html.test.ts).
import type { Block, Body } from './blocks.ts';
import type { PublicArtefactT as PublicArtefact, PublicMediaT as PublicMedia } from './public.ts';

type Lang = 'id' | 'en';

export interface RenderLabels {
  inventoryNumber: string; year: string; category: string; provenance: string; credit: string;
  categories: Record<string, string>;
}
export interface RenderContext {
  lang: Lang;
  media: Map<string, PublicMedia>;
  artefacts: Map<string, PublicArtefact>;
  labels: RenderLabels;
}

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);

/** JSON for a `<script type="application/json">` block: `<` and line separators escaped (AR47). */
export const jsonForScript = (data: unknown) =>
  JSON.stringify(data).replace(/[<\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

type Inline = Extract<Block, { type: 'paragraph' }>['content'][number];
const inline = (nodes: Inline[]) =>
  nodes.map((n) => {
    let h = esc(n.text);
    if (n.styles?.bold) h = `<strong>${h}</strong>`;
    if (n.styles?.italic) h = `<em>${h}</em>`;
    if (n.styles?.lang) h = `<span lang="${n.styles.lang}">${h}</span>`;
    return h;
  }).join('');

function image(b: Extract<Block, { type: 'image' }>, ctx: RenderContext): string {
  const m = ctx.media.get(b.props.mediaId);
  const alt = b.props.alt[ctx.lang];
  if (!m) throw new Error('render: image block references unknown media');
  if (!alt) throw new Error('render: image block has no alt text in the page language'); // every image needs alt (FR-6)
  const widths = [...m.variants].sort((a, c) => a - c);
  const src = (w: number) => `/media/${m.id}-w${w}.webp`;
  const big = widths[widths.length - 1];
  const caption = b.props.caption?.[ctx.lang];
  const caps = [caption && esc(caption), b.props.credit && `<span class="credit">${esc(b.props.credit)}</span>`].filter(Boolean).join(' ');
  return `<figure><img src="${src(big)}" srcset="${widths.map((w) => `${src(w)} ${w}w`).join(', ')}" sizes="(min-width: 768px) 68ch, 100vw" width="${big}" height="${Math.round((big * m.height) / m.width)}" alt="${esc(alt)}" loading="lazy" decoding="async">${caps ? `<figcaption>${caps}</figcaption>` : ''}</figure>`;
}

function record(b: Extract<Block, { type: 'catalogueRecord' }>, ctx: RenderContext): string {
  const a = ctx.artefacts.get(b.props.artefactId);
  const tr = a?.translations.find((t) => t.lang === ctx.lang);
  if (!a || !tr) return ''; // not published in this language: omitted
  const L = ctx.labels;
  const rows: [string, string | null][] = [
    [L.inventoryNumber, a.inventoryNumber], [L.year, a.year], [L.category, L.categories[a.category] ?? a.category],
    [L.provenance, tr.provenance || null], [L.credit, a.contributorCredit],
  ];
  const items = rows.filter((r): r is [string, string] => Boolean(r[1])).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('');
  return `<dl class="catalogue-record" aria-label="${esc(tr.title)}">${items}</dl>`;
}

const html = (b: Block, ctx: RenderContext): string => {
  switch (b.type) {
    case 'heading': return `<h${b.props.level}>${inline(b.content)}</h${b.props.level}>`;
    case 'paragraph': return `<p>${inline(b.content)}</p>`;
    case 'quote': return `<blockquote><p>${inline(b.content)}</p></blockquote>`;
    case 'image': return image(b, ctx);
    case 'catalogueRecord': return record(b, ctx);
  }
};

export function renderArticleHtml(doc: Body, ctx: RenderContext): string {
  return doc.map((b) => html(b, ctx)).join('\n');
}

/** Whole minutes at 200 words per minute, at least 1, from the text blocks of the published body. */
export function readingMinutes(doc: Body): number {
  const words = doc.reduce((n, b) => (b.type === 'image' || b.type === 'catalogueRecord' ? n : n + b.content.map((t) => t.text).join(' ').split(/\s+/).filter(Boolean).length), 0);
  return Math.max(1, Math.ceil(words / 200));
}
