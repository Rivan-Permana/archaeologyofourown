import { getCollection } from 'astro:content';
import type { Locale } from '../i18n/routes.ts';
import type { RenderedArticle } from '../shared/rendered.ts';

export type Translation = RenderedArticle['translations'][number];
export interface ArticleEntry { article: RenderedArticle; tr: Translation }

/** Every Article that exists in `lang`, with that translation; the page-language filter lives here (FR-1). */
export async function articlesIn(lang: Locale): Promise<ArticleEntry[]> {
  return (await getCollection('articles')).flatMap(({ data: article }) => {
    const tr = article.translations.find((t) => t.lang === lang);
    return tr ? [{ article, tr }] : [];
  });
}
