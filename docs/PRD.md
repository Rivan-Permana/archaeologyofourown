# PRD — Archaeology of Our Own (v1)

Status: **superseded** by the BMAD PRD at `_bmad-output/planning-artifacts/prds/prd-archaeologyofourown-2026-11-17/prd.md` (final, 2026-11-17), which adds the Editor Dashboard to v1 and the reviewer-gate fixes. Kept for history. · Owner: Rivan-Permana

## 1. Summary

Archaeology of Our Own is a **bilingual (ID/EN) publication/media** about artefacts of three kinds: Indonesian visual culture (posters, type, packaging, ephemera), traces of creative process (sketches, drafts, abandoned work), and collective/personal memory (everyday objects, family photos, community stories). It can grow into other forms later.

v1 delivers:

1. A landing page that leads visitors to read the latest articles.
2. One article page template (content is placeholder).
3. A public **artefact contribution** form whose submissions are stored privately for editorial review.
4. A newsletter sign-up.

## 2. Goals and success criteria

| Goal | Measure for v1 |
|---|---|
| Visitors understand the publication within one screen | Masthead states name and a one-line manifesto in both languages |
| Visitors read | Primary CTA "Baca artikel / Read articles" leads to the latest articles; every article card opens a working article page |
| Visitors contribute artefacts | Contribution form stores valid submissions (text + up to 5 photos) privately, with status `pending`; nothing is published automatically |
| Build an early audience | Newsletter form stores valid, de-duplicated emails |
| Fast and accessible | Lighthouse ≥ 90 on mobile for Performance, Accessibility, Best Practices and SEO; WCAG 2.2 AA contrast; full keyboard use; `prefers-reduced-motion` respected |

Non-goals for v1: admin dashboard/CMS (planned for v2), automatic publishing of contributions, article index page with filters, user accounts, audio/video/PDF uploads, analytics beyond Cloudflare's built-in.

## 3. Audience

General public and the creative community in Indonesia and the region who are interested in visual culture, design history, creative process and shared memory. Some of them own artefacts and stories worth contributing.

## 4. Reference study and mapping

Sources: Instagram post by Artefak Kita (16 slides, 2026-11-16, ADGI Design Week 2026 with Museum DGI) and its linked articles page; the nationalgallery.sg homepage, inspected with REA (`inspect-web-page`, Evidence `ev_8860f08b…`, 5,491 DOM nodes, 1,570 accessibility nodes) together with its component scripts.

### 4.1 What the references are

- **Artefak Kita (Instagram + artefakkita.com):** an editorial publication on Indonesian visual culture. The post's theme: design is more than its finished output; it includes the decisions, processes, people and possibilities before, around and beyond making. Visual language: Eczar serif + Inter Display, black on white paper, square corners, calm, little motion. Articles are grouped in named series.
- **National Gallery Singapore:** a museum homepage. Warm neutral `#E9E3DF`, one red accent `#DD052B`, Work Sans display headings (h1 about 220px) + Inter, 5px radius. Components observed (AEM client libraries): `HomepageMasthead`, `HomepageMastheadChangeBg`, `ArtworkOfTheDay`, `MustSeeMustDo` (highlights carousel), `SliderDuoTab` (ongoing / coming soon), `Instagram`, `OurBuildingSection`, `PopUpSideHomepage`, `Banner`, and an articles block ("Art for everyone").

### 4.2 Behaviour recovered with REA (observed vs inferred)

| NGS feature | Observed evidence | Inference |
|---|---|---|
| Masthead | The script queries `.homepage-masthead`, `h1`, `.masthead-building`, `.ornament`, `header.main-navigation`; uses GSAP ScrollTrigger with `scrub` and eases `power4`, `expo`, `bounce.out` | The giant headline and building sketch animate with scroll; the header reacts to the masthead position |
| Masthead background slideshow | `.banner-legend-thumbnail-item`, `.banner-play-pause`, `.thumbnail-overlay`; tween `duration .5`, `power2.out` | The background image/video cycles, with thumbnails and a pause button |
| Artwork of the day | `.artwork-otd-item`, `.cta-show-another`; colour-quantization code (`getPalette`/`getColor`); ScrollTrigger `scrub` | One artwork at a time; "Show another artwork" swaps it; the section colour comes from the image's dominant palette |
| Highlights | Accessibility tree: "Previous slide", "Next slide", category labels | A horizontal card carousel |

Not established: exact timing per breakpoint, the full set of pinned sections, and mobile behaviour. These details are not needed because v1 reinterprets the concepts rather than copying them.

### 4.3 Mapping to Archaeology of Our Own (concept kept, form changed)

| Reference concept | v1 interpretation |
|---|---|
| NGS giant masthead with scroll motion | **Masthead:** name set large in Fraunces over a "strata" motif (layered horizontal bands like soil layers) that separates on scroll; the one signature motion moment |
| NGS / Artefak Kita article blocks | **Latest articles:** a grid of article cards with series label, title, excerpt, date and reading time |
| NGS artwork of the day + palette background | **Artefact of the day:** one artefact in catalogue style (inventory number, year, category, provenance); "Show another" swaps it; the section tint comes from the image's dominant colour, clamped so text stays AA |
| Artefak Kita named article series | **Editorial series:** recurring columns under the publication's **own** names (see open question 1) |
| Artefak Kita "before, around, beyond making" | Kept as the idea behind the strata motif and the contribution invitation ("every object has layers") rather than as its own section |
| One accent colour | One oxide-red accent |

Deliberately not taken: NGS logo, building sketch, red `#DD052B`, Work Sans, pop-ups, Instagram feed, ticketing; Artefak Kita's Eczar, logo, series names and article copy.

## 5. Structure

### 5.1 Landing page (`/` ID, `/en/` EN)

1. **Header**: wordmark, anchor links (Artikel, Artefak, Kontribusi, Kabar), ID/EN switch, skip link.
2. **Masthead**: name, one-line manifesto, primary CTA "Baca artikel", secondary CTA "Kirim artefak". Strata motif.
3. **Latest articles**: 6 placeholder article cards, the first one featured larger.
4. **Artefact of the day**: catalogue card with image, "Show another", palette-derived tint.
5. **Editorial series**: 3–4 series, each with a name, a one-line description and its latest article.
6. **Contribute an artefact**: a short invitation plus the contribution form (section 7).
7. **Newsletter**: email field, consent line, Turnstile, success and error states.
8. **Footer**: name, privacy note link, language switch, social placeholders, year.

### 5.2 Article page (`/artikel/[slug]`, `/en/articles/[slug]`)

A single template: series label, title, standfirst, author, date, reading time, hero image with caption and credit, body (headings, paragraphs, pull quote, image with caption, catalogue record block), related articles (same series), newsletter CTA. All content is placeholder.

### 5.3 Privacy note (`/privasi`, `/en/privacy`)

A short page explaining what is stored (newsletter: email and language; contributions: name or pseudonym, email, story and photos), why, for how long, and how to ask for deletion. The final text needs client approval (open question 4).

## 6. Content

- All copy and images are placeholders, visibly marked "Placeholder", and never presented as real artefacts or real articles.
- Articles and artefacts are local content collections (Astro content collections, one entry per language). Article fields: slug, series, title, standfirst, author, date, hero image, body. Artefact fields: id, inventory number, title, year, category, provenance, image, alt text, description.
- In v1 new articles are added by editing files in the repo. A CMS/admin comes in v2.

## 7. Functional requirements

| ID | Requirement |
|---|---|
| F1 | ID/EN language switch; per-page `lang`; `hreflang` alternates; the switch keeps the matching page |
| F2 | "Show another" picks a different random artefact without a reload; without JS the first artefact is shown |
| F3 | The artefact-of-the-day tint comes from the image's dominant colour, clamped so `--ink` stays ≥ 4.5:1; falls back to `--surface` |
| F4 | Article cards and series link to working article pages; related articles come from the same series |
| F5 | **Newsletter** `POST /api/subscribe` (Pages Function): server-side email validation, Turnstile verification, stored in D1 `subscribers {email UNIQUE, lang, created_at}`; the same success message for new and existing emails (no enumeration); rate-limited per IP |
| F6 | **Contribution form** fields: name or pseudonym (required), email (required), artefact title (required), story (required, max 5,000 characters), year or estimated year (optional), origin/provenance (optional), category (visual culture / process / memory), photos (1–5 files, JPG/PNG/WebP, max 10 MB each), a consent checkbox (the contributor owns or has rights to the material and allows the publication to publish it with credit after review), Turnstile |
| F7 | **Contribution handling** `POST /api/contribute` (Pages Function): validates every field server-side; checks file type by magic bytes, not by extension; enforces count and size limits; verifies Turnstile; rate-limited per IP; stores photos in a **private** R2 bucket under a random key and the record in D1 `submissions {id, name, email, title, story, year, provenance, category, photo_keys, lang, consent_at, status='pending', created_at}`; returns a reference number; nothing becomes public |
| F8 | **Review in v1**: the editor reviews submissions in the Cloudflare dashboard (D1 console, R2 browser) and changes `status` to `approved` or `rejected`. A documented SQL snippet lists pending submissions. Approved items are turned into articles or artefacts by hand |
| F9 | Contribution UX: drag-and-drop or picker with previews, per-file error messages, upload progress, a success screen with the reference number; works on mobile |
| F10 | Motion: GSAP ScrollTrigger for the masthead strata and section reveals; reduced or off under `prefers-reduced-motion` |
| F11 | Light/dark theme follows the device |
| F12 | SEO/meta per page and language: title, description, Open Graph image, canonical, favicon; article pages get `Article` JSON-LD |

## 8. Non-functional requirements

- **Performance:** static HTML; Fraunces + Inter self-hosted and subset with `font-display: swap`; AVIF/WebP images with explicit sizes; GSAP loaded only where there is motion.
- **Accessibility:** WCAG 2.2 AA; semantic landmarks; alt text on every image; labelled form fields with errors tied through `aria-describedby`; live regions for upload and submit status.
- **Privacy:** store only the listed fields; the R2 bucket stays private; contributor emails are never shown publicly; a privacy note is linked from both forms; deletion on request; no third-party trackers. Photos can contain location metadata (EXIF): stripping it is required before anything is published (v2, at publish time).
- **Security:** validate at the function boundary; magic-byte file checks; size and count limits before writing to R2; Turnstile on both forms; per-IP rate limits; Turnstile secret stored as a Cloudflare secret; no secrets in the repo.

## 9. Technical approach

- **Stack:** Astro (static output, built-in i18n routing, content collections) + GSAP + Cloudflare Pages + Pages Functions + D1 (newsletter and submissions) + R2 (private photo storage) + Turnstile.
- **Repo:** public GitHub repo `Rivan-Permana/archaeologyofourown` (same name as the folder). Commits use the existing git identity (user's decision; that email is visible in public commit history).
- **Hosting:** Cloudflare Pages project `archaeologyofourown` → `archaeologyofourown.pages.dev`. No email-derived names in project names, bucket names or URLs. The custom domain `archaeologyofourown.com` (available on 2026-11-17 per WHOIS) is bought later by the user and then attached, with WHOIS redaction.
- **Deploy:** Wrangler CLI. The user logs in to Cloudflare once with `wrangler login`. D1 database, R2 bucket and Turnstile site are created in that account.

## 10. Roadmap

- **v1 (this PRD):** landing, article template, privacy note, contribution with private storage and manual review, newsletter.
- **v2:** admin dashboard / CMS behind Cloudflare Access: write and publish articles, review contributions (approve/reject, notes), strip EXIF and publish approved artefacts, export newsletter subscribers.
- **Next process step:** after this PRD is approved, run it through the BMAD method to break it into epics and stories.

## 11. Decisions log (2026-11-17)

| Topic | Decision | Source |
|---|---|---|
| Project type | Publication/media, open to other forms later (replaces the earlier "archive/exhibition") | Client |
| Language | Bilingual ID/EN | Client + user |
| Archive content | Mix of visual culture, creative process, collective/personal memory | Client + user |
| Primary action | Read articles + newsletter | User |
| Storage | Public artefact contributions stored privately | Client ("pengen isoh ono penyimpanan"), confirmed by user |
| Contribution content | Photos (JPG/PNG/WebP, ≤ 10 MB, ≤ 5) + text story | User |
| Moderation | Manual review; nothing auto-published; admin/CMS in v2 | User |
| Contributor data | Name or pseudonym, email, consent | User |
| Reference use | Similar concepts allowed, no one-to-one copy | User |
| Assets | None yet; clearly marked placeholders | User |
| Visual direction | Hybrid archive–museum | User |
| Scope | Landing + article template (+ privacy note) | User |
| Landing sections | Latest articles, Artefact of the day, Editorial series (+ masthead, contribution, newsletter, footer) | User |
| Motion | Medium: scroll reveals + one masthead moment | User |
| Newsletter storage | Pages Function + D1 | User |
| GitHub | Existing account, public repo, existing git identity | User |
| Hosting/domain | Cloudflare Pages on pages.dev for now | User |
| Stack | Astro + GSAP + Pages/D1 (+ R2, Turnstile for contributions) | User |
| Design system | See `docs/DESIGN.md` | User |
| Editorial series | Temuan, Jejak Proses, Ingatan Bersama, Stratigrafi | Client |
| Next steps | BMAD rollout: PRD → UX → architecture → epics & stories; superseding PRD lives in `_bmad-output/planning-artifacts/prds/` | User |

## 12. Open questions

1. ~~Names of the editorial series~~ Decided by the client: *Temuan*, *Jejak Proses*, *Ingatan Bersama*, *Stratigrafi*.
2. Final manifesto and section copy (placeholders until provided).
3. Real articles, artefacts and image rights.
4. Privacy-note text and retention period for contributions and subscribers (proposal: keep until deletion is requested; delete rejected submissions after 90 days).
5. Who reviews contributions, and should the editor get an email notification on new submissions (v1 or v2)?
6. Social accounts to link in the footer.
7. When to buy the custom domain.

## 13. Milestones

1. Approve this PRD and `docs/DESIGN.md`.
2. BMAD breakdown into epics and stories.
3. Scaffold Astro, tokens, layout, i18n, content collections.
4. Landing sections + article template with placeholders and motion.
5. Newsletter + contribution functions with D1, R2, Turnstile.
6. Verify (Lighthouse, keyboard, reduced motion, both themes, mobile/desktop, form edge cases: oversize file, wrong type, duplicate email, missing consent).
7. Create the GitHub repo, push, deploy to Cloudflare Pages.
