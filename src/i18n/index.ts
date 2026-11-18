import id from './id.json';
import en from './en.json';
import type { Locale } from './routes.ts';

export type Messages = typeof id;
const messages: Record<Locale, Messages> = { id, en };

export function t(locale: Locale): Messages {
  return messages[locale];
}
