// Markup for the Artefact of the Day panel. One function, used by the build (Astro) and by the browser swap,
// so a swapped Artefact is identical to a prerendered one. Text is escaped; the only HTML is what is built here.
import type { PublicArtefactT, PublicMediaT } from './public.ts';
import { catalogueRecordHtml, esc, type RenderLabels } from './render.ts';

type Lang = 'id' | 'en';
export interface Pool { artefacts: PublicArtefactT[]; media: PublicMediaT[] }

/** Artefacts that exist in `lang` (an Artefact may be published in one language only). */
export const poolFor = (pool: Pool, lang: Lang) => pool.artefacts.filter((a) => a.translations.some((t) => t.lang === lang));

const imageRef = (a: PublicArtefactT) => a.refs.filter((r) => r.role === 'image').sort((x, y) => x.position - y.position)[0];

export function tintOf(a: PublicArtefactT, pool: Pool): { light: string; dark: string } | undefined {
  const m = pool.media.find((x) => x.id === imageRef(a)?.mediaId);
  // A Placeholder image has no real palette to borrow; the section stays on the paper surface.
  return m && !m.isPlaceholder && m.tintLight && m.tintDark ? { light: m.tintLight, dark: m.tintDark } : undefined;
}

export function panelHtml(a: PublicArtefactT, pool: Pool, lang: Lang, labels: RenderLabels, placeholderMarker: string): string {
  const tr = a.translations.find((t) => t.lang === lang);
  if (!tr) return '';
  const ref = imageRef(a);
  const m = pool.media.find((x) => x.id === ref?.mediaId);
  const alt = ref?.alt[lang] ?? '';
  const widths = m ? [...m.variants].sort((x, y) => x - y) : [];
  const src = (w: number) => `/media/${m!.id}-w${w}.webp`;
  const big = widths[widths.length - 1];
  // The marker comes from is_placeholder only (AR48); a missing alt just gives an unlabelled slot.
  const marker = a.isPlaceholder || m?.isPlaceholder ? `<span class="mark"><span class="ph">${esc(placeholderMarker)}</span></span>` : '';
  const photo = !m
    ? ''
    : m.isPlaceholder || !alt
      ? `<div class="slot" ${a.isPlaceholder || m.isPlaceholder ? `role="img" aria-label="${esc(alt || placeholderMarker)}"` : 'aria-hidden="true"'}></div>${marker}`
      : `<img src="${src(big)}" srcset="${widths.map((w) => `${src(w)} ${w}w`).join(', ')}" sizes="(min-width: 1100px) 40vw, 100vw" width="${big}" height="${Math.round((big * m.height) / m.width)}" alt="${esc(alt)}" loading="lazy" decoding="async">${marker}`;
  const cap = [ref?.caption[lang] && esc(ref.caption[lang]!), ref?.credit[lang] && `<span class="credit">${esc(ref.credit[lang]!)}</span>`].filter(Boolean).join(' ');
  return `<figure class="aotd-figure"><div class="photo">${photo}</div>${cap ? `<figcaption>${cap}</figcaption>` : ''}</figure>` +
    `<div class="aotd-body"><h3 class="art-title">${esc(tr.title)}</h3>${catalogueRecordHtml(a, tr, labels)}</div>`;
}
