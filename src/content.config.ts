import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { PublicArtefact, PublicMedia } from './shared/public.ts';
import { RenderedArticle } from './shared/rendered.ts';

// Public pages read only the files written by scripts/snapshot.ts (AD-2); nothing queries D1 at request time.
export const collections = {
  articles: defineCollection({ loader: file('src/content/snapshot/articles.json'), schema: RenderedArticle }),
  artefacts: defineCollection({ loader: file('src/content/snapshot/artefacts.json'), schema: PublicArtefact }),
  media: defineCollection({ loader: file('src/content/snapshot/media.json'), schema: PublicMedia }),
};
