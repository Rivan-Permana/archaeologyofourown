import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { article, articleTranslation, artefact, artefactTranslation, mediaAsset, mediaRef, mediaRefTranslation, siteState } from '../db/schema.ts';
import { body as bodySchema, type Body } from '../../shared/blocks.ts';
import { PublicArticle, PublicArtefact, PublicMedia, Snapshot } from '../../shared/public.ts';

type Lang = 'id' | 'en';

// shortcut: reads whole tables and joins in memory, fine for a few hundred rows; page the queries if content grows past that.
export async function buildSnapshot(db: Db): Promise<Snapshot> {
  const [state] = await db.select().from(siteState).where(eq(siteState.id, 'site'));
  const [articles, aTr, artefacts, fTr, assets, refs, refTr] = await Promise.all([
    db.select().from(article), db.select().from(articleTranslation),
    db.select().from(artefact), db.select().from(artefactTranslation),
    db.select().from(mediaAsset), db.select().from(mediaRef), db.select().from(mediaRefTranslation),
  ]);

  const publishedArtefacts = new Set(fTr.filter((t) => t.status === 'published').map((t) => t.artefactId));
  const readyAssets = new Map(assets.filter((a) => a.status === 'ready').map((a) => [a.id, a]));
  const usedMedia = new Set<string>();

  // Only languages the owner has published reach the output; draft captions and notes stay out (AD-14).
  const refsFor = (type: 'article' | 'artefact', ownerId: string, langs: Set<string>) =>
    refs.filter((r) => r.ownerType === type && r.ownerId === ownerId && readyAssets.has(r.assetId)).map((r) => {
      usedMedia.add(r.assetId);
      const text = (k: 'alt' | 'caption' | 'credit') =>
        Object.fromEntries(refTr.filter((x) => x.mediaRefId === r.id && langs.has(x.lang) && x[k]).map((x) => [x.lang, x[k]!]));
      return { mediaId: r.assetId, role: r.role, position: r.position, alt: text('alt'), caption: text('caption'), credit: text('credit') };
    });

  // A catalogueRecord pointing at an unpublished Artefact is dropped (AD-6); body images feed the media list.
  const cleanBody = (raw: string): Body => {
    const doc = bodySchema.parse(JSON.parse(raw));
    const kept = doc.filter((b) => b.type !== 'catalogueRecord' || publishedArtefacts.has(b.props.artefactId));
    for (const b of kept) if (b.type === 'image' && readyAssets.has(b.props.mediaId)) usedMedia.add(b.props.mediaId);
    return kept;
  };

  const outArticles = articles.flatMap((a) => {
    const translations = aTr
      .filter((t) => t.articleId === a.id && t.status === 'published' && t.publishedAt)
      .map((t) => ({
        lang: t.lang as Lang, slug: t.slug, title: t.publishedTitle ?? '', standfirst: t.publishedStandfirst ?? '',
        body: cleanBody(t.publishedBody ?? '[]'), publishedAt: t.publishedAt!,
      }));
    if (!translations.length) return [];
    const date = a.date ?? translations.map((t) => t.publishedAt).sort()[0];
    return [PublicArticle.parse({ id: a.id, series: a.series, author: a.author, date, isPlaceholder: a.isPlaceholder, refs: refsFor('article', a.id, new Set(translations.map((t) => t.lang))), translations })];
  });

  const outArtefacts = artefacts.flatMap((f) => {
    const translations = fTr
      .filter((t) => t.artefactId === f.id && t.status === 'published' && t.publishedAt)
      .map((t) => ({ lang: t.lang as Lang, title: t.publishedTitle ?? '', provenance: t.publishedProvenance ?? '', publishedAt: t.publishedAt! }));
    if (!translations.length) return [];
    return [PublicArtefact.parse({
      id: f.id, inventoryNumber: f.inventoryNumber, year: f.year, category: f.category, contributorCredit: f.contributorCredit,
      isPlaceholder: f.isPlaceholder, refs: refsFor('artefact', f.id, new Set(translations.map((t) => t.lang))), translations,
    })];
  });

  const media = [...usedMedia].map((id) => {
    const m = readyAssets.get(id)!;
    return PublicMedia.parse({ id: m.id, mime: m.mime, width: m.width, height: m.height, variants: JSON.parse(m.variants), tintLight: m.tintLight, tintDark: m.tintDark, isPlaceholder: m.isPlaceholder });
  });

  return Snapshot.parse({ content_version: state?.contentVersion ?? 0, articles: outArticles, artefacts: outArtefacts, media });
}
