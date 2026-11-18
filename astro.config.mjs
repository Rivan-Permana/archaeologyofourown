import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

// Production origin; replaced when the neutral workers.dev subdomain is set (Story 1.1 deploy step).
const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  adapter: cloudflare({ imageService: 'passthrough' }),
  integrations: [react()],
  // AD-1: no Astro sessions, so no SESSION KV namespace is provisioned.
  session: false,
  markdown: { syntaxHighlight: false },
  i18n: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    routing: { prefixDefaultLocale: false },
  },
  security: {
    // AD-17: Astro hashes its own inline scripts and emits the policy.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "connect-src 'self' https://cloudflareinsights.com",
        'frame-src https://challenges.cloudflare.com',
        "img-src 'self' data:",
        "object-src 'none'",
        "base-uri 'none'",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          'https://challenges.cloudflare.com',
          'https://static.cloudflareinsights.com',
        ],
      },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
});
