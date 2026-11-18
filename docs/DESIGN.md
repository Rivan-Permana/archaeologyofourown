# Design system — Archaeology of Our Own

Status: draft for approval · 2026-11-17 · Companion to `docs/PRD.md`

## Principles

1. **A publication that reads like an archive.** Articles lead; every artefact is presented like an archive record: inventory number, date, category, provenance, contributor credit.
2. **Strata.** Layers (before, around, beyond making) are the visual metaphor: horizontal bands, thin rules, stacked metadata.
3. **Reading first.** Article pages favour long-form legibility: one 68ch column, generous leading, no motion inside the text.
4. **The artefact brings the colour.** The interface stays paper and ink; colour comes from artefact images and one oxide-red accent.
5. **Calm motion with one signature moment.** Motion explains layering; it never blocks reading.

## Color tokens

Contrast measured with the WCAG formula on 2026-11-17.

| Token | Light | Dark | Use | Contrast |
|---|---|---|---|---|
| `--paper` | `#F4EFE7` | `#161412` | Page background | — |
| `--surface` | `#EAE3D7` | `#201D1A` | Cards, bands | — |
| `--ink` | `#1E1B18` | `#EDE6DA` | Body text, headings | 14.98 / 14.81 on paper |
| `--ink-muted` | `#5E574F` | `#A79E91` | Metadata, captions | 6.21 / 6.95 on paper; 5.58 on light surface |
| `--line` | `#CFC6B8` | `#3A352F` | Rules, borders (decorative) | — |
| `--accent` | `#B4462B` | `#E07A5C` | Links, CTAs, focus, active | 4.76 / 6.22 on paper |
| `--on-accent` | `#FFFFFF` | `#161412` | Text on accent | 5.45 / 6.22 |
| `--tint` | runtime | runtime | Artefact-of-the-day background from image palette | clamped so `--ink` stays ≥ 4.5:1 |

Theme follows `prefers-color-scheme`. No other hues in UI chrome.

## Typography

- **Display:** Fraunces (variable; opsz, wght, SOFT). Headlines, masthead, artefact titles.
- **Text/UI:** Inter (variable). Body, navigation, forms, metadata.
- **Metadata style:** Inter, uppercase, letter-spacing 0.08em, tabular numbers (`font-variant-numeric: tabular-nums`) for inventory numbers and years.

| Step | Size (fluid) | Line height | Font |
|---|---|---|---|
| `display` | `clamp(3.5rem, 12vw, 11rem)` | 0.9 | Fraunces 300–400, opsz 144 |
| `h1` | `clamp(2.5rem, 6vw, 4.5rem)` | 1.0 | Fraunces |
| `h2` | `clamp(1.75rem, 3.5vw, 2.75rem)` | 1.1 | Fraunces |
| `h3` | `1.375rem` | 1.2 | Fraunces |
| `body` | `1.0625rem` | 1.6 | Inter 400 |
| `small` | `0.875rem` | 1.5 | Inter 400 |
| `meta` | `0.75rem` | 1.4 | Inter 500, uppercase |

Measure: body text max 68ch.

## Space, grid, shape

- Spacing scale (4px base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Grid: 12 columns desktop (max 1440px, 32px gutters), 6 tablet, 4 mobile (16px side gutter).
- Corners: `border-radius: 0` everywhere.
- Rules: 1px `--line`; section separators are full-width rules with a meta label (e.g. `02 — SOROTAN ARSIP`).
- No drop shadows; depth comes from surface tone and rules.

## Components

| Component | Anatomy | States |
|---|---|---|
| Header | Wordmark, anchor nav, ID/EN switch, skip link | Sticky after masthead; current-section underline in accent |
| Button (primary) | Accent fill, `--on-accent` text, square, 48px min height | hover darken 8%, focus 2px accent outline offset 3px, disabled 40% opacity |
| Button (secondary) | Ink text, 1px ink border | hover surface fill |
| Link | Ink with accent underline 1px, offset 3px | hover underline 2px |
| Article card | Image (3:2), series label (meta, accent), title (h3), excerpt (2 lines), date · reading time (meta) | hover title underline + image scale 1.02 (none under reduced motion); whole card is one link with focus outline |
| Featured article card | Same anatomy, spans 2 columns, title at `h2` | as above |
| Series block | Series name (h3), one-line description, latest article link, count (meta) | hover rule turns accent |
| Catalogue card | Image (4:5), inventory no. + year (meta), title (h3), category tag, provenance (small) | hover image scale 1.02, focus outline on whole card |
| Catalogue record block | Bordered key/value list (inventory no., year, category, provenance, contributor credit) used inside cards and articles | — |
| Category tag | Meta text in 1px border box | — |
| Artefact of the day | Large image + catalogue record + "Show another" button; section background `--tint` | loading (fade), no-JS (first artefact) |
| Article page | Series label, title (`h1`), standfirst (Fraunces 1.375rem), byline + date + reading time (meta), hero image with caption/credit, 68ch body column, pull quote (Fraunces italic, accent rule left), inline image with caption, catalogue record block, related articles row | — |
| Text field / textarea | Label above, 1px ink border, 48px min height, helper text (small, muted), character count for story | focus 2px accent outline, error: accent border + message with icon, disabled |
| File drop zone | Dashed 1px border area with icon, "drag or choose photos", limits line (JPG/PNG/WebP · max 10 MB · up to 5); thumbnails grid with filename, size, remove button, per-file progress | drag-over (accent border, surface fill), per-file error, uploading, done |
| Checkbox (consent) | 20px square box, label with link to privacy note | checked (accent fill), focus outline, error |
| Contribution form | Fields in one column (max 640px), grouped: About you · About the artefact · Photos · Consent; Turnstile; submit | idle, submitting (progress), success screen with reference number, error summary at top linking to fields |
| Newsletter form | Label, email input, consent text, Turnstile, submit | idle, submitting, success, error (inline, `aria-live="polite"`) |
| Placeholder marker | Meta label "PLACEHOLDER" in accent border | always visible on placeholder content |

## Motion

- Library: GSAP + ScrollTrigger.
- **Signature moment:** masthead strata — 4–5 horizontal bands under the title separate vertically as the user scrolls the masthead (scrub), revealing the manifesto.
- Section reveal: opacity 0→1, y 24px→0, 0.6s, `power3.out`, once.
- "Show another": crossfade 0.4s; tint transitions 0.6s.
- `prefers-reduced-motion: reduce`: no scrub, no reveal translation, instant swaps.

## Iconography and imagery

- Icons: Phosphor, Light weight only (arrows, caret, globe for language, upload, image, x, check, warning).
- Imagery: artefact photos on neutral backgrounds; placeholders are abstract textures marked "Placeholder".

## Voice

- Indonesian and English, sentence case, short sentences.
- CTAs as verbs: "Baca artikel / Read articles", "Kirim artefak / Contribute an artefact", "Ikuti kabar / Get updates", "Tampilkan lainnya / Show another".
- Form errors say what to do: "Foto harus JPG, PNG, atau WebP, maksimal 10 MB / Photos must be JPG, PNG or WebP, up to 10 MB."
