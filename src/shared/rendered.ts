// Shape of the files written by scripts/snapshot.ts and read by the Astro content collections.
import { z } from 'astro/zod';
import { PublicArticle } from './public.ts';

export const RenderedArticle = PublicArticle.omit({ translations: true }).extend({
  translations: z.array(z.strictObject({
    lang: z.enum(['id', 'en']), slug: z.string(), title: z.string(), standfirst: z.string(),
    html: z.string(), toc: z.array(z.strictObject({ id: z.string(), text: z.string() })), readingMinutes: z.number().int(), publishedAt: z.string(),
  })),
});
export type RenderedArticle = z.infer<typeof RenderedArticle>;
