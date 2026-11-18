// Public DTOs (AD-2). `.strict()` so any private or working field makes parsing fail.
import { z } from 'astro/zod';
import { body } from './blocks.ts';
import { CATEGORIES, EDITORIAL_SERIES } from './enums.ts';

const lang = z.enum(['id', 'en']);
const byLang = z.strictObject({ id: z.string().optional(), en: z.string().optional() });

export const PublicMedia = z.strictObject({
  id: z.uuid(),
  mime: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  variants: z.array(z.number().int()),
  tintLight: z.string().nullable(),
  tintDark: z.string().nullable(),
  isPlaceholder: z.boolean(),
});

const PublicMediaRef = z.strictObject({
  mediaId: z.uuid(),
  role: z.enum(['hero', 'body', 'image']),
  position: z.number().int(),
  alt: byLang,
  caption: byLang,
  credit: byLang,
});

export const PublicArticle = z.strictObject({
  id: z.uuid(),
  series: z.enum(EDITORIAL_SERIES),
  author: z.string(),
  date: z.string(),
  isPlaceholder: z.boolean(),
  refs: z.array(PublicMediaRef),
  translations: z.array(z.strictObject({
    lang, slug: z.string(), title: z.string(), standfirst: z.string(), body, publishedAt: z.string(),
  })),
});

export const PublicArtefact = z.strictObject({
  id: z.uuid(),
  inventoryNumber: z.string(),
  year: z.string().nullable(),
  category: z.enum(CATEGORIES),
  contributorCredit: z.string().nullable(),
  isPlaceholder: z.boolean(),
  refs: z.array(PublicMediaRef),
  translations: z.array(z.strictObject({ lang, title: z.string(), provenance: z.string(), publishedAt: z.string() })),
});

export const Snapshot = z.strictObject({
  content_version: z.number().int(),
  articles: z.array(PublicArticle),
  artefacts: z.array(PublicArtefact),
  media: z.array(PublicMedia),
});
export type Snapshot = z.infer<typeof Snapshot>;
