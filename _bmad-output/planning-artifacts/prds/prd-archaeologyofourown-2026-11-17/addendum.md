# Addendum — Archaeology of Our Own PRD

Technical choices, reference study and rejected alternatives that inform downstream UX and architecture work.

## A. Technology decisions (confirmed by the user)

- **Site:** Astro, static output, built-in i18n routing. Because Articles and Artefacts are now edited in the Editor Dashboard, their source of truth moves from repo files to the database; the static build reads published content at build time from a build snapshot endpoint (`GET /api/build/snapshot`, public fields only, authenticated with an Access service token; the build has no database rights).
- **Editor Dashboard:** under `/admin`, protected by Cloudflare Access (email one-time code, allowlist of 1–3 Editors); server endpoints must also verify the Access identity (JWT), not rely on the edge rule alone.
- **Rebuild:** Publish calls a Workers Builds deploy hook; the Dashboard polls deployment status. Target: live within 2 minutes.
- **Images:** published images in an R2 media bucket served by the Worker at `/media/*`; Contribution photos in a separate private bucket. Photos are downscaled and stripped of metadata in the browser, uploaded directly to R2 through short-lived presigned URLs one file at a time, and verified on the server.
- **Motion:** GSAP + ScrollTrigger, loaded only where motion exists.
- **Hosting:** one Cloudflare Worker with static assets on the Workers Free plan, `archaeologyofourown.<neutral-subdomain>.workers.dev` (account subdomain is a neutral project name). Supersedes the earlier Cloudflare Pages choice, which lacks Cron Triggers and rate limiting.
- **Server endpoints:** in the same Worker: `POST /api/subscribe`, `POST /api/contribute/start`, `POST /api/contribute/finish`, `GET /media/*`, and the Dashboard API under `/api/admin/*`.
- **Data:** Cloudflare D1 tables `subscribers` (email unique, lang, created_at) and `submissions` (id, reference, name, email, title, story, year, provenance, category, photo_keys, lang, consent_at, status, reviewed_by, reviewed_at, created_at).
- **Files:** Cloudflare R2 private bucket, random object keys.
- **Abuse protection:** Cloudflare Turnstile; hourly per-network limits in a Durable Object keyed by a keyed hash of the address (held up to 1 hour, raw address never stored); site-wide caps of 100 Contributions per day and 5 GB of Contribution photos.
- **Retention job:** scheduled deletion of rejected submissions after 90 days (Cron Trigger).
- **Repo:** public GitHub `Rivan-Permana/archaeologyofourown`; commits use the user's existing git identity (user accepted that this email is visible in public history).
- **Domain:** archaeologyofourown.com was available on 2026-11-17 (WHOIS); purchase later by the user with WHOIS redaction.
- **Request size:** photos never pass through the Worker; each goes straight to R2 by presigned PUT, so request body and Free-plan CPU limits do not apply to them.

## B. Editor Dashboard history

The client first placed an integrated dashboard/CMS in v2. During the reviewer gate (2026-11-17) the user moved it into v1 rather than a manual developer path or a Git-based CMS (Sveltia/Decap), wanting full interactive CRUD for Articles, Artefacts, Contributions and Subscribers.

## C. Reference study

Summarised from `docs/PRD.md` §4. National Gallery Singapore was inspected with REA (Evidence `ev_8860f08b…`): masthead and background slideshow driven by GSAP ScrollTrigger; "Artwork of the Day" swaps artworks via "Show another artwork" and derives the section colour from the image palette; highlights carousel with category labels. Artefak Kita: editorial publication with named series, Eczar + Inter Display, black on paper, square corners, theme of "before, around and beyond making".

## D. Rejected alternatives

| Option | Why rejected |
|---|---|
| Archive/exhibition framing | Replaced by the client's "publication/media" answer |
| Single landing page only | A publication needs readable Article pages |
| Highlights carousel, "three layers" section | Not selected; the layers idea lives on in the strata motif and the *Stratigrafi* series |
| Third-party newsletter service | User chose Cloudflare D1 to keep data in one platform |
| Contributions auto-published | Copyright, personal data and spam risk |
| Series name "Lapisan" | Client renamed it *Stratigrafi* |
| Next.js / plain HTML | Astro chosen for static speed and built-in i18n |
