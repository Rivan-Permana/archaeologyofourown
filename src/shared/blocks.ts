// Article body document (BlockNote JSON subset). Anything outside this schema is rejected (AR22).
import { z } from 'astro/zod';

const lang = z.enum(['id', 'en']);

const text = z.object({
  type: z.literal('text'),
  text: z.string(),
  // `lang` is the inline language mark; rendered as `lang` on a span (UX-DR78).
  styles: z.object({ bold: z.boolean().optional(), italic: z.boolean().optional(), lang: lang.optional() }).strict().optional(),
}).strict();
const content = z.array(text);

const byLang = z.object({ id: z.string().optional(), en: z.string().optional() }).strict();

const heading = z.object({ type: z.literal('heading'), props: z.object({ level: z.union([z.literal(2), z.literal(3)]) }).strict(), content }).strict();
const paragraph = z.object({ type: z.literal('paragraph'), content }).strict();
const quote = z.object({ type: z.literal('quote'), content }).strict();
const image = z.object({
  type: z.literal('image'),
  props: z.object({ mediaId: z.uuid(), alt: byLang, caption: byLang.optional(), credit: z.string().optional() }).strict(),
}).strict();
// Stores only the Artefact id; resolved at snapshot time and omitted when unpublished (AD-6).
const catalogueRecord = z.object({ type: z.literal('catalogueRecord'), props: z.object({ artefactId: z.uuid() }).strict() }).strict();

export const block = z.discriminatedUnion('type', [heading, paragraph, quote, image, catalogueRecord]);
export const body = z.array(block);
export type Block = z.infer<typeof block>;
export type Body = z.infer<typeof body>;
