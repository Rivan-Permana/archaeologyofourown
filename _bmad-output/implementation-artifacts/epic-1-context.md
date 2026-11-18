# Epic 1 Context: Read the bilingual publication

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Readers can open the home page, Articles, Editorial Series, Artefact of the Day and the privacy note in Indonesian and English, with Placeholder content, on a neutral workers.dev address. The epic also lays the whole foundation: Astro + Cloudflare Worker scaffold, design tokens, security headers, the build snapshot path with seeded content, and a noindex launch gate.

## Stories

- Story 1.1: Project scaffold and bilingual shell on workers.dev
- Story 1.2: Design tokens, self-hosted fonts and device theme
- Story 1.3: Public chrome (header, mobile menu, language switch, footer)
- Story 1.4: Content schema, media serving and placeholder seed
- Story 1.5: Build snapshot endpoint with public DTOs
- Story 1.6: Article rendering, prebuild snapshot and leak check
- Story 1.7: Home masthead and latest articles
- Story 1.8: Article page
- Story 1.9: Editorial Series section
- Story 1.10: Artefact of the Day
- Story 1.11: Masthead strata motion and section reveal
- Story 1.12: Privacy note page
- Story 1.13: Sharing metadata, cookieless analytics and launch gate

## Requirements & Constraints

- Public pages are bilingual: Indonesian default at `/`, English under `/en/`; `lang` matches page language; `hreflang` only for existing versions; listings show only Articles available in that language.
- Public pages are readable before scripts load, light/dark follows device setting, reduced motion disables all scroll motion.
- Placeholder content is always visibly labelled; the site is noindex until the launch gate.
- WCAG 2.2 AA; contrast 4.5:1 text, 3:1 controls and focus; every control keyboard operable; Lighthouse mobile >= 90, LCP <= 2.5 s.
- No marketplace features, search, accounts, comments, auto-publication or newsletter sending in v1.
- No secrets, personal emails or real names anywhere in the repo; fixtures use `contoh.id` and pseudonyms.
- Runs on Cloudflare Workers Free plan (10 ms CPU, 128 MB per request).

## Technical Decisions

- One Astro 7.4.12 project, `@astrojs/cloudflare` 14.4.8, single Worker with static assets, `imageService: 'passthrough'`, no Astro sessions or SESSION KV; no Cloudflare Pages.
- Public pages are prerendered and never query D1 at request time; the build fetches a Zod `.strict()` DTO snapshot from `/api/build/snapshot` and writes git-ignored JSON for content collections.
- Layers: routes -> services -> data/storage; islands talk only to `/api/**`.
- Strict CSP and security headers from `public/_headers` plus middleware; island data only via static JSON or escaped JSON script tags.
- Styling: `tokens.css` mirrors the UX DESIGN.md tokens 1:1, plain CSS, no Tailwind, no literal colours/radii/fonts in components. Fonts self-hosted (Fraunces, Inter). GSAP only on home.
- i18n: route pairs declared once in `src/i18n/routes.ts`; strings only in `src/i18n/{id,en}.json`.
- Pipeline: `npm ci --ignore-scripts` -> license check -> `astro check` + unit tests -> snapshot -> build -> leak check -> `wrangler deploy`; exact versions in committed lockfile; only `main` builds.
- Launch gate: `PUBLIC_LAUNCH` defaults false (noindex meta, `X-Robots-Tag`, robots.txt disallow); true fails build if any Placeholder remains.

## UX & Interaction Patterns

- Paper-and-ink public look, square corners, Fraunces headings, Inter body, accent only on paper, Phosphor Light icons only.
- Home order: Masthead, Latest Articles, Artefact of the Day, Editorial Series, Contribute invitation, Newsletter, footer.
- Motion: one scrubbed strata animation in the Masthead, fade-up only on Masthead content and Artefact of the Day, instant under reduced motion.

## Cross-Story Dependencies

- 1.1 creates the scaffold, tokens file, headers and i18n routes everything else uses; 1.2 fills token values.
- 1.4 -> 1.5 -> 1.6 form the content path (schema, snapshot endpoint, prebuild); 1.7-1.10 and 1.12 depend on it for content.
- 1.11 motion depends on the masthead from 1.7.
- 1.13 (metadata, launch gate) closes the epic and depends on the pages being built.
