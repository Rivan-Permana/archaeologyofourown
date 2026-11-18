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
