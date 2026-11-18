// The only definition of D1 tables (AD-4). Migrations are additive-only in v1.
import { index, integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { CATEGORIES, EDITORIAL_SERIES, LANGS, PUBLICATION_STATUS } from '../../shared/enums.ts';

const id = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID());
const now = () => text('created_at').notNull().$defaultFn(() => new Date().toISOString());
const flag = (name: string) => integer(name, { mode: 'boolean' }).notNull().default(false);

export const article = sqliteTable('article', {
  id: id(),
  series: text('series', { enum: EDITORIAL_SERIES }).notNull(),
  author: text('author').notNull(),
  // Editor-set; defaults to first publish time (AD-5).
  date: text('date'),
  isPlaceholder: flag('is_placeholder'),
  createdAt: now(),
});

// Publication Status lives here, not on the parent (AD-5). Working and published copies (AD-14).
export const articleTranslation = sqliteTable(
  'article_translation',
  {
    id: id(),
    articleId: text('article_id').notNull().references(() => article.id, { onDelete: 'cascade' }),
    lang: text('lang', { enum: LANGS }).notNull(),
    slug: text('slug').notNull(),
    status: text('status', { enum: PUBLICATION_STATUS }).notNull().default('draft'),
    title: text('title').notNull().default(''),
    standfirst: text('standfirst').notNull().default(''),
    body: text('body').notNull().default('[]'),
    publishedTitle: text('published_title'),
    publishedStandfirst: text('published_standfirst'),
    publishedBody: text('published_body'),
    publishedAt: text('published_at'),
    revision: integer('revision').notNull().default(0),
  },
  (t) => [unique('article_translation_lang_slug').on(t.lang, t.slug), unique('article_translation_article_lang').on(t.articleId, t.lang)],
);

export const artefact = sqliteTable('artefact', {
  id: id(),
  inventoryNumber: text('inventory_number').notNull(),
  year: text('year'),
  category: text('category', { enum: CATEGORIES }).notNull(),
  contributorCredit: text('contributor_credit'),
  // No FK yet: `contribution` arrives in Epic 3 and SQLite cannot add a foreign key later.
  // Epic 3 enforces ON DELETE SET NULL in the service (AD-15).
  sourceContributionId: text('source_contribution_id'),
  isPlaceholder: flag('is_placeholder'),
  createdAt: now(),
});

export const artefactTranslation = sqliteTable(
  'artefact_translation',
  {
    id: id(),
    artefactId: text('artefact_id').notNull().references(() => artefact.id, { onDelete: 'cascade' }),
    lang: text('lang', { enum: LANGS }).notNull(),
    status: text('status', { enum: PUBLICATION_STATUS }).notNull().default('draft'),
    title: text('title').notNull().default(''),
    provenance: text('provenance').notNull().default(''),
    publishedTitle: text('published_title'),
    publishedProvenance: text('published_provenance'),
    publishedAt: text('published_at'),
    revision: integer('revision').notNull().default(0),
  },
  (t) => [unique('artefact_translation_artefact_lang').on(t.artefactId, t.lang)],
);

export const mediaAsset = sqliteTable('media_asset', {
  id: id(),
  mime: text('mime').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  // JSON array of generated WebP widths, e.g. [640,1280,2000].
  variants: text('variants').notNull().default('[]'),
  tintLight: text('tint_light'),
  tintDark: text('tint_dark'),
  status: text('status', { enum: ['uploading', 'ready'] }).notNull().default('uploading'),
  isPlaceholder: flag('is_placeholder'),
  createdAt: now(),
});

export const mediaRef = sqliteTable(
  'media_ref',
  {
    id: id(),
    assetId: text('asset_id').notNull().references(() => mediaAsset.id),
    ownerType: text('owner_type', { enum: ['article', 'artefact'] }).notNull(),
    ownerId: text('owner_id').notNull(),
    role: text('role', { enum: ['hero', 'body', 'image'] }).notNull(),
    position: integer('position').notNull().default(0),
  },
  (t) => [index('media_ref_owner').on(t.ownerType, t.ownerId), index('media_ref_asset').on(t.assetId)],
);

export const mediaRefTranslation = sqliteTable(
  'media_ref_translation',
  {
    id: id(),
    mediaRefId: text('media_ref_id').notNull().references(() => mediaRef.id, { onDelete: 'cascade' }),
    lang: text('lang', { enum: LANGS }).notNull(),
    alt: text('alt').notNull().default(''),
    caption: text('caption'),
    credit: text('credit'),
  },
  (t) => [unique('media_ref_translation_ref_lang').on(t.mediaRefId, t.lang)],
);

export const siteState = sqliteTable('site_state', {
  id: text('id').primaryKey(),
  contentVersion: integer('content_version').notNull().default(0),
});

