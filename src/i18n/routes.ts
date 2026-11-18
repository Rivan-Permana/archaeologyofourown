// Single registry of route pairs (AD-11). Later stories register their pairs here;
// components link only to registered routes.
export const locales = ['id', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'id';

export const routes = {
  home: { id: '/', en: '/en/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function routeFor(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'id' ? 'en' : 'id';
}

// Header nav and mobile menu list only sections registered here by the story that builds them (FR-1).
// The footer shows privacy and contribute links only once those route pairs exist in `routes`.
export const homeSections: { id: string; label: 'articles' | 'artefactOfTheDay' | 'contribute' | 'newsletter' }[] = [
  { id: 'latest-articles', label: 'articles' },
  { id: 'artefact-of-the-day', label: 'artefactOfTheDay' },
];

// Article pages are built in Story 1.8: /artikel/<slug> and /en/articles/<slug>.
export const articleBase: Record<Locale, string> = { id: '/artikel/', en: '/en/articles/' };

export function optionalRoute(key: 'privacy' | 'contribute', locale: Locale): string | undefined {
  return (routes as Record<string, Record<Locale, string>>)[key]?.[locale];
}
