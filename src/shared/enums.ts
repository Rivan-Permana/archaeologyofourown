// Fixed enums (AD-5). Labels and descriptions live in src/i18n/{id,en}.json.
export const EDITORIAL_SERIES = ['temuan', 'jejak-proses', 'ingatan-bersama', 'stratigrafi'] as const;
export type EditorialSeries = (typeof EDITORIAL_SERIES)[number];

export const CATEGORIES = ['budaya-visual', 'proses', 'ingatan'] as const;
export type Category = (typeof CATEGORIES)[number];

export const PUBLICATION_STATUS = ['draft', 'published'] as const;
export type PublicationStatus = (typeof PUBLICATION_STATUS)[number];

export const LANGS = ['id', 'en'] as const;
