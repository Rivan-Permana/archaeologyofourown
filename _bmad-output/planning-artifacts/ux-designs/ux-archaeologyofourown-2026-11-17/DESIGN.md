---
name: Archaeology of Our Own
description: Visual system for a bilingual (ID/EN) publication about the artefacts we live with. Two scopes in one file. `public` is the reader-facing site (paper and ink, square corners, light and dark). `admin` is the private Editor Dashboard (direction C "Ruang baca" v2, soft corners, large text, light only in v1).
status: final
created: 2026-11-17
updated: 2026-11-19
sources:
  - ../../prds/prd-archaeologyofourown-2026-11-17/prd.md
  - ../../prds/prd-archaeologyofourown-2026-11-17/addendum.md
  - ../../../../docs/DESIGN.md
  - mockups/dashboard-review.html
  - mockups/public-home.html
  - mockups/public-kirim.html
  - review-antislop.md
  - review-rubric.md
  - review-accessibility.md
colors:
  # public scope: "Indeks" direction, user decision 2026-11-19 (replaces the paper-and-ink palette; see the note under Colors)
  paper: '#FAFAF8'
  paper-dark: '#0F1124'
  surface: '#EFEFEA'
  surface-dark: '#191C36'
  ink: '#161A33'
  ink-dark: '#F1F0EA'
  ink-muted: '#50546B'
  ink-muted-dark: '#A6A9C0'
  line: '#D6D7E0'
  line-dark: '#2E3252'
  accent: '#2B3A8C'
  accent-dark: '#8C9BEA'
  on-accent: '#FFFFFF'
  on-accent-dark: '#0F1124'
  # series colours, the same in both themes; each carries its own text colour
  kunyit: '#E8B21A'
  jambu: '#EFA3B3'
  botol: '#1F6B5C'
  nila: '#2B3A8C'
  series-ink: '#161A33'
  series-paper: '#FAFAF8'
  # tint: runtime value from the Artefact image palette, see Colors
  # admin scope (direction C v2 "Ruang baca"; light only in v1)
  admin-room: '#EDEBE6'
  admin-rail: '#E4E1DA'
  admin-rail-hover: '#EBE8E2'
  admin-sheet: '#FCFCFA'
  admin-sheet-footer: '#F6F5F1'
  admin-button-hover: '#F0EEE9'
  admin-text: '#24221F'
  admin-muted: '#5F5B55'
  admin-control: '#857F76'
  admin-line: '#D9D5CD'
  admin-accent: '#B4462B'
  admin-accent-press: '#9A3B24'
  admin-on-accent: '#FFFFFF'
typography:
  # public: "Indeks" direction, user decision 2026-11-19
  display:
    fontFamily: Bricolage Grotesque
    fontSize: clamp(3.4rem, 22vw, 21rem)
    fontWeight: '800'
    lineHeight: '0.8'
  manifesto:
    fontFamily: Plus Jakarta Sans
    fontSize: clamp(1.3rem, 2.3vw, 2rem)
    fontWeight: '500'
    lineHeight: '1.3'
  h1:
    fontFamily: Bricolage Grotesque
    fontSize: clamp(3rem, 11vw, 7rem)
    fontWeight: '800'
    lineHeight: '0.9'
  h2:
    fontFamily: Bricolage Grotesque
    fontSize: clamp(2.4rem, 6vw, 5.5rem)
    fontWeight: '800'
    lineHeight: '0.9'
  h3:
    fontFamily: Bricolage Grotesque
    fontSize: clamp(1.6rem, 3vw, 2.4rem)
    fontWeight: '800'
    lineHeight: '1'
  standfirst:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '500'
    lineHeight: '1.4'
  body:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.0625rem
    fontWeight: '400'
    lineHeight: '1.65'
  small:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
  meta:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0em
  meta-catalogue:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0em
  # admin
  admin-title:
    fontFamily: Fraunces
    fontSize: 34px
    fontWeight: '400'
    lineHeight: '1.18'
    letterSpacing: '0'
  admin-editor-title:
    fontFamily: Fraunces
    fontSize: 30px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: '0'
  admin-standfirst:
    fontFamily: Fraunces
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.5'
  admin-heading:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.25'
  admin-reading:
    fontFamily: Inter
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.65'
  admin-editor-body:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.65'
  admin-body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  admin-ui:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.3'
  admin-small:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.45'
  admin-meta:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.35'
  admin-strip-value:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  none: '0'
  admin-xs: 6px
  admin-sm: 8px
  admin-md: 10px
  admin-lg: 14px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  '12': 48px
  '16': 64px
  '24': 96px
  '32': 128px
  gutter-desktop: 32px
  margin-mobile: 16px
  max-width: 1440px
  measure: 68ch
  admin-nav-width: 200px
  admin-rail-width: 300px
  admin-room-padding: 32px
  admin-sheet-max: 900px
  admin-sheet-padding-top: 48px
  admin-sheet-padding: 64px
  admin-measure: 60ch
components:
  # public
  button-primary:
    background: '{colors.accent}'
    foreground: '{colors.on-accent}'
    radius: '{rounded.none}'
    minHeight: 48px
  button-secondary:
    background: transparent
    foreground: '{colors.ink}'
    border: '1px solid {colors.ink}'
    radius: '{rounded.none}'
    minHeight: 48px
  link:
    foreground: '{colors.ink}'
    underline: '1px {colors.accent}, offset 3px'
  focus-ring:
    outline: '2px solid {colors.accent}'
    offset: 3px
  masthead:
    background: '{colors.paper}'
    name: '{typography.display}'
    manifesto: '{typography.manifesto}'
    bandCount: 5
    bandRule: '1px solid {colors.ink}'
    bandFills: '{colors.surface}, {colors.line}, {colors.surface}, {colors.line}, {colors.ink-muted}'
    bandHeightsDesktop: 48px, 12px, 88px, 20px, 40px
    bandHeightsMobile: 28px, 8px, 48px, 12px, 28px
    findMark: '12px square, {colors.accent}, in the third band'
  header:
    background: '{colors.paper}'
    border: '1px solid {colors.line}'
    activeIndicator: '{colors.accent}'
  footer:
    background: '{colors.paper}'
    borderTop: '1px solid {colors.ink}'
    text: '{typography.small}'
  article-card:
    imageRatio: '3:2'
    seriesLabel: '{typography.meta}'
    title: '{typography.h3}'
  catalogue-card:
    imageRatio: '4:5'
    inventoryLine: '{typography.meta-catalogue}'
    title: '{typography.h3}'
  catalogue-record-block:
    border: '1px solid {colors.line}'
    label: '{typography.meta-catalogue}'
  category-tag:
    border: '1px solid {colors.ink}'
    text: '{typography.meta}'
  artefact-of-the-day:
    background: tint (runtime, clamped) else '{colors.surface}'
    tintMinLuminanceLight: 0.62
    tintMaxLuminanceDark: 0.038
  reading-progress-bar:
    background: '{colors.accent}'
    height: 2px
  text-field:
    border: '1px solid {colors.ink}'
    radius: '{rounded.none}'
    minHeight: 48px
  file-drop-zone:
    border: '1px dashed {colors.ink}'
    dragOverBorder: '{colors.accent}'
    dragOverBackground: '{colors.surface}'
  placeholder-marker:
    border: '1px solid {colors.accent}'
    text: '{typography.meta}'
  placeholder-image:
    background: '{colors.surface}'
  motion-fade-up:
    duration: 0.6s
    easing: power3.out
    translateY: 24px
  motion-show-another:
    duration: 0.4s
  motion-tint:
    duration: 0.6s
  motion-strata:
    bands: 5
    trigger: scrub
    range: Masthead top at viewport top to Masthead bottom at viewport top
    bandGap: deferred to motion prototype
    reducedMotion: static, bands closed
  # admin
  admin-sheet:
    background: '{colors.admin-sheet}'
    border: '1px solid {colors.admin-line}'
    radius: '{rounded.admin-lg}'
    paddingTop: '{spacing.admin-sheet-padding-top}'
    paddingInline: '{spacing.admin-sheet-padding}'
    maxWidth: '{spacing.admin-sheet-max}'
  admin-overlay:
    background: '{colors.admin-sheet}'
    border: '1px solid {colors.admin-line}'
    shadow: '0 8px 24px rgba(36,34,31,.08)'
  admin-nav-item:
    height: 36px
    radius: '{rounded.admin-sm}'
    hoverBackground: '{colors.admin-rail}'
  admin-nav-item-active:
    background: '{colors.admin-sheet}'
    border: 'inset 0 0 0 1px {colors.admin-line}'
    indicator: '3px bar at the left edge, {colors.admin-text}'
    radius: '{rounded.admin-sm}'
  admin-queue-item:
    padding: '{spacing.3}'
    radius: '{rounded.admin-sm}'
    hoverBackground: '{colors.admin-rail-hover}'
  admin-queue-item-active:
    background: '{colors.admin-sheet}'
    border: 'inset 0 0 0 1px {colors.admin-line}'
    indicator: '3px bar at the left edge, {colors.admin-text}'
    radius: '{rounded.admin-sm}'
  admin-catalogue-strip:
    borderTop: '2px solid {colors.admin-text}'
    borderBottom: '1px solid {colors.admin-line}'
    cellDivider: '1px solid {colors.admin-line}'
    cellPadding: '8px 16px 12px'
    label: '{typography.admin-meta}'
    value: '{typography.admin-strip-value}, tabular figures'
    waitValue: '500 {colors.admin-accent}'
  admin-button-primary:
    background: '{colors.admin-accent}'
    foreground: '{colors.admin-on-accent}'
    hoverBackground: '{colors.admin-accent-press}'
    radius: '{rounded.admin-sm}'
    minHeight: 48px
    paddingInline: '{spacing.5}'
    text: '500 {typography.admin-ui.fontSize}'
  admin-button-secondary:
    background: '{colors.admin-sheet}'
    foreground: '{colors.admin-text}'
    border: '1px solid {colors.admin-control}'
    hoverBackground: '{colors.admin-button-hover}'
    radius: '{rounded.admin-sm}'
    minHeight: 48px
    text: '500 {typography.admin-ui.fontSize}'
  admin-button-quiet:
    background: transparent
    foreground: '{colors.admin-muted}'
    hoverForeground: '{colors.admin-text}'
    underline: offset 4px
  admin-button-press:
    transform: scale(0.98)
    duration: 150ms
    easing: cubic-bezier(.22,1,.36,1)
  admin-focus-ring:
    outline: '2px solid {colors.admin-accent}'
    offset: 3px
  admin-text-field:
    background: '{colors.admin-sheet}'
    border: '1px solid {colors.admin-control}'
    radius: '{rounded.admin-sm}'
    padding: '{spacing.3}'
  admin-decision-bar:
    background: '{colors.admin-sheet-footer}'
    borderTop: '1px solid {colors.admin-line}'
  admin-language-tabs:
    track: '{colors.admin-rail}'
    trackRadius: '{rounded.admin-md}'
    activeTab: '{colors.admin-sheet}'
    activeIndicator: '2px underline {colors.admin-text}'
    tabRadius: '{rounded.admin-xs}'
  admin-series-radio:
    minHeight: 40px
    border: '1px solid {colors.admin-control}'
    selectedBorder: '1px solid {colors.admin-text}'
    dot: '16px circle, 1px {colors.admin-control}; checked 5px {colors.admin-text}'
    radius: '{rounded.admin-sm}'
  admin-photo-slot:
    background: '{colors.admin-rail}'
    border: '1px solid {colors.admin-line}'
    radius: '{rounded.admin-md}'
  rebuild-status-tag:
    background: '{colors.admin-sheet}'
    border: '1px solid {colors.admin-line}'
    foreground: '{colors.admin-muted}'
    radius: '{rounded.admin-xs}'
    text: '{typography.admin-small}'
---

# Archaeology of Our Own: Design Spine

Two scopes share one file. **`public`** is the reader-facing site and carries the values of `docs/DESIGN.md`, with the anti-slop corrections from `review-antislop.md`. **`admin`** is the private Editor Dashboard at `/admin`, built on direction C "Ruang baca" v2 (direction history lives in EXPERIENCE.md › Inspiration). Visual references: [`mockups/public-home.html`](mockups/public-home.html) (home at 1440 and 375, Masthead, thin header, Menu panel), [`mockups/public-kirim.html`](mockups/public-kirim.html) (Contribute page: error, submitting and success at 1440 and 375) and [`mockups/dashboard-review.html`](mockups/dashboard-review.html) (Kiriman review sheet, Artikel baru just after Terbitkan, empty queue). The public mockups show the light theme only; dark is specified in tokens only. Token names prefixed `admin-` belong to the admin scope; everything else is public. Spines win on conflict with any mockup.

## Brand & Style

**Public: a publication that reads like an archive.** Articles lead; every Artefact is presented like an archive record with inventory number, date, Category, provenance and contributor credit. The visual metaphor is **strata**: horizontal bands, thin rules, stacked metadata, reading what sits before, around and beyond the act of making. Reading comes first: one 68ch column, generous leading, no motion inside the text. The interface stays paper and ink; colour comes from Artefact images and one oxide-red accent. Motion is calm with one signature moment (the Masthead strata). The posture is a hybrid of archive and museum, informed by Artefak Kita's editorial calm and National Gallery Singapore's bold masthead and artwork-of-the-day idea. Neither is copied.

**Admin: a calm reading room.** Contributions are people's stories, so the Editor Dashboard opens each one on a large sheet and keeps the queue as a thin list at the side. Large text, generous space, soft corners and a guiding tone ("menunggu 12 hari") keep the weekly review to one Contribution at a time, oldest first. The admin scope departs from the public square-corner identity on purpose. It shares the accent hue, the Inter family, and Fraunces for the words that will be published.

**Signature (admin).** Every Contribution opens with a catalogue-record strip: a ruled row of reference number, date received, position and waiting time, drawn like the public Catalogue Record block. The same strip closes the story with its facts. It ties the private review to the archive the Contribution may join.

**Voice (both scopes).** Sentence case, short sentences, verbs for actions, errors that say what to do. No em dashes in interface copy. Public copy exists in Indonesian and English; the Dashboard interface is Indonesian. Microcopy rules and examples live in EXPERIENCE.md › Voice and Tone; implementation copy passes through `better-writing` and `design:ux-copy`.

## Colors


> **Superseded 2026-11-19 by user decision ("Indeks" direction, mockup `docs/mockups/b-indeks.html`).** The public scope no longer uses paper-and-ink with a terracotta accent, Fraunces and Inter: those read as the generic AI-generated look. Public colours are now a clean paper `#FAFAF8`, indigo ink `#161A33` and four series colours taken from everyday Indonesian things (kunyit `#E8B21A`, jambu `#EFA3B3`, kaca botol `#1F6B5C`, nila `#2B3A8C`); type is Bricolage Grotesque (condensed, 800) for display and headings and Plus Jakarta Sans (a Jakarta foundry face) for text. Each editorial series owns one colour; an image slot without a photo is its series colour with the drawn find. The Masthead strata are replaced by the wordmark at full width, and the four series rows are the strata. Values in the front matter are the source; the tables below that still name the old values are kept for history. Admin scope is unchanged.

### Public (light and dark, follows device theme)

| Token (light / dark) | Light | Dark | Use | Contrast |
|---|---|---|---|---|
| `{colors.paper}` / `paper-dark` | `#F4EFE7` | `#161412` | Page background | n/a |
| `{colors.surface}` / `surface-dark` | `#EAE3D7` | `#201D1A` | Cards, bands, drag-over fill, Artefact of the Day fallback, placeholder image slot | n/a |
| `{colors.ink}` / `ink-dark` | `#1E1B18` | `#EDE6DA` | Body text, headings, field and button borders | 14.98 / 14.81 on paper; 13.44 / 13.52 on surface |
| `{colors.ink-muted}` / `ink-muted-dark` | `#5E574F` | `#A79E91` | Metadata, captions, helper text | 6.21 / 6.95 on paper; 5.58 / 6.34 on surface |
| `{colors.line}` / `line-dark` | `#CFC6B8` | `#3A352F` | Rules and decorative borders only | never a control boundary |
| `{colors.accent}` / `accent-dark` | `#B4462B` | `#E07A5C` | Links, CTAs, focus, active section, errors, reading progress | 4.76 / 6.22 on paper. On surface 4.28 (light, non-text only) / 5.68 (dark) |
| `{colors.on-accent}` / `on-accent-dark` | `#FFFFFF` | `#161412` | Text on accent | 5.45 on accent / 6.22 on accent-dark (the same two values as accent-dark on paper-dark, since `on-accent-dark` equals `paper-dark`); 5.31 on accent-dark hovered (`#CE7055`) |
| `tint` | runtime | runtime | Artefact of the Day background derived from the image's dominant colour | clamped per theme so every foreground in the section passes, else surface (see below) |

No other hues in UI chrome. Errors use the accent plus an icon and text, never colour alone.

**Dark resolution.** Component tokens name the light value. Under the dark theme every public colour token `x` resolves to `x-dark` (`{colors.paper}` → `paper-dark`, `{colors.on-accent}` → `on-accent-dark`, and so on); `tint` uses its dark clamp. No component has a dark value of its own.

**Accent text sits on paper only.** In light mode accent on `{colors.surface}` is 4.28:1, below 4.5 for normal text. On surface or `tint`, accent may carry non-text marks (focus ring, rules, borders, the strata find mark, the drag-over border) but never text. Accent text that has to appear there sits on a paper chip, as the Placeholder marker does, or switches to ink with an accent icon (e.g. the "HEIC" label on a rejected thumbnail). Dark mode passes (5.68) but follows the same rule for consistency.

**Tint clamp (Artefact of the Day).** The section carries ink text, muted text (date, caption, rotation note, Catalogue Record labels), ink borders (Category tag, secondary button) and the accent focus ring. The binding foreground is muted text. Algorithm, run at build time for the day's Artefact and at runtime for "Tampilkan lainnya":

1. Take the image's dominant colour and convert it to OKLCH; keep its hue and chroma.
2. Light theme: raise OKLCH lightness until the colour's relative luminance is at least `{components.artefact-of-the-day.tintMinLuminanceLight}` (0.62). That keeps muted ≥ 4.5:1 (4.57 at the boundary, e.g. `#CFCFCF`), ink ≥ 4.5:1 (11.00) and the accent ring ≥ 3:1 (3.50).
3. Dark theme: lower lightness until relative luminance is at most `{components.artefact-of-the-day.tintMaxLuminanceDark}` (0.038). That keeps muted-dark ≥ 4.5:1 (4.57 at the boundary, e.g. `#363636`), ink-dark ≥ 4.5:1 (9.74) and the accent-dark ring ≥ 3:1 (4.09).
4. Reduce chroma in steps if the colour leaves the sRGB gamut before reaching the target. If it still cannot reach it, use `{colors.surface}` / `surface-dark`.
5. Check every pair against these thresholds (text 4.5:1, borders and focus ring 3:1) before applying; a failure falls back to surface.

### Admin (direction C v2, light only)

The Dashboard ships light only in v1. Dark values are deferred to a later release and are not specified here.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `{colors.admin-room}` | `#EDEBE6` | Room behind the sheet; nav column | n/a |
| `{colors.admin-rail}` | `#E4E1DA` | Queue rail, language-tab track, photo slots, nav hover | n/a |
| `{colors.admin-rail-hover}` | `#EBE8E2` | Queue item hover | text 12.97 |
| `{colors.admin-sheet}` | `#FCFCFA` | Reading sheet, active nav and queue item, inputs | n/a |
| `{colors.admin-sheet-footer}` | `#F6F5F1` | Decision bar at the foot of the review sheet | n/a |
| `{colors.admin-button-hover}` | `#F0EEE9` | Secondary button hover | text 13.68 |
| `{colors.admin-text}` | `#24221F` | All text | 15.2 on sheet, 12.6 on room, 12.15 on rail, 14.54 on footer |
| `{colors.admin-muted}` | `#5F5B55` | Secondary text, meta, helper. Text only, never a border | 6.56 on sheet, 6.18 on footer, 5.66 on room, 5.16 on rail |
| `{colors.admin-control}` | `#857F76` | Borders of fields, secondary buttons, radio options and dots | 3.86 on sheet, 3.64 on footer, 3.33 on room, 3.04 on rail (all ≥ 3:1, WCAG 1.4.11) |
| `{colors.admin-line}` | `#D9D5CD` | Hairlines and sheet edge, decorative only (1.42 on sheet) | never a control boundary |
| `{colors.admin-accent}` | `#B4462B` | Primary action, focus, waiting time in the catalogue-record strip, error icon | 5.31 on sheet, 4.58 on room. **Text only on sheet or room, never on rail (4.18)** |
| `{colors.admin-accent-press}` | `#9A3B24` | Primary button hover and pressed | white text 6.94 |
| `{colors.admin-on-accent}` | `#FFFFFF` | Text on primary button | 5.45 |

## Typography

**Public.** Fraunces (variable; opsz, wght, SOFT) for display, headlines, Masthead and Artefact titles; Inter (variable) for body, navigation, forms and metadata.

| Role | Token | Notes |
|---|---|---|
| Masthead name | `{typography.display}` | Fraunces 300 to 400, opsz 144 |
| Masthead manifesto | `{typography.manifesto}` | 20px at 375, 28px at 1440 (from `public-home.html`) |
| Article title | `{typography.h1}` | |
| Section and featured card title; pull quote | `{typography.h2}` | Pull quote in Fraunces roman at this size, no italic, no side rule |
| Card title, series name | `{typography.h3}` | |
| Article standfirst | `{typography.standfirst}` | |
| Body | `{typography.body}` | Max `{spacing.measure}` |
| Helper, captions | `{typography.small}` | |
| Metadata (series label, date, reading time, section labels) | `{typography.meta}` | Sentence case, tabular figures |
| Catalogue metadata (Catalogue Record labels, inventory line on catalogue cards) | `{typography.meta-catalogue}` | Uppercase, tracked 0.08em, tabular figures |

Uppercase is kept for catalogue metadata only. Reason: those lines imitate the typed labels of a museum catalogue card, which is the archive identity the public site is built on. Everywhere else meta is sentence case, so uppercase stays a signal of "this is a catalogue record" and does not turn into a generic eyebrow.

**Admin.** Inter for everything that belongs to the tool. Fraunces (Georgia fallback), weight 400, tracking 0, only for the words that will be published: the Contribution title on the review sheet, the Article title and the Article standfirst in the editor. The Editor then sees those words as readers will. Text is large: 15 to 19px for reading and controls. Emphasis is weight 500; hierarchy comes from size and colour.

| Role | Token |
|---|---|
| Contribution title on review sheet | `{typography.admin-title}` (Fraunces) |
| Article title in editor | `{typography.admin-editor-title}` (Fraunces) |
| Article standfirst in editor (muted) | `{typography.admin-standfirst}` (Fraunces) |
| Screen heading, empty-state heading | `{typography.admin-heading}` |
| Contribution story | `{typography.admin-reading}` (max `{spacing.admin-measure}`) |
| Article body in editor | `{typography.admin-editor-body}` |
| Default text, text fields | `{typography.admin-body}` |
| Nav items, queue titles, buttons (500) | `{typography.admin-ui}` |
| Helper text, byline, radio labels, status tags | `{typography.admin-small}` |
| Queue item meta, catalogue-strip labels, captions | `{typography.admin-meta}` |

Admin metadata stays in sentence case; the catalogue-record strip uses small muted labels over 15px values, not uppercase.

## Layout & Spacing

4px base scale shared by both scopes: `{spacing.1}` 4 · `{spacing.2}` 8 · `{spacing.3}` 12 · `{spacing.4}` 16 · `{spacing.5}` 20 · `{spacing.6}` 24 · `{spacing.8}` 32 · `{spacing.12}` 48 · `{spacing.16}` 64 · `{spacing.24}` 96 · `{spacing.32}` 128. No fractional values.

**Public grid.** 12 columns on desktop (max `{spacing.max-width}`, `{spacing.gutter-desktop}` gutters), 6 on tablet, 4 on mobile with `{spacing.margin-mobile}` side gutter. Article body is one column of at most `{spacing.measure}`. The Contribution form is one column, max 640px. Sections are separated by full-width rules carrying a sentence-case meta label (e.g. "Sorotan arsip"); no section numbers.

**Admin layout.** Three columns on laptop: nav (`{spacing.admin-nav-width}`), queue rail (`{spacing.admin-rail-width}`), room (padding `{spacing.admin-room-padding}`) holding the sheet (max `{spacing.admin-sheet-max}`, padding `{spacing.admin-sheet-padding-top}` top and `{spacing.admin-sheet-padding}` sides). Editor screens drop the rail and centre the sheet. Below 1100px the columns stack: nav becomes a wrapped row, room padding drops to 16px, sheet padding to 24px top and 20px sides.

## Elevation & Depth

**Public:** no drop shadows. Depth comes from surface tone (`{colors.paper}` against `{colors.surface}`) and 1px rules.

**Admin:** no shadow on the sheet. Layers come from the tonal stack (room, rail, sheet, darkest at the back) plus hairlines: the sheet carries a 1px `{colors.admin-line}` edge, active nav and queue items an inset 1px hairline. Tone and hairline never carry a selected state alone (1.1 to 1.3:1); the 3px `{colors.admin-text}` bar does. One shadow token, `{components.admin-overlay.shadow}`, exists for elements that really float over other content: the Slash menu, the Confirm dialog and the crop tool. Nothing else casts a shadow.

## Shapes

**Public:** `{rounded.none}` everywhere: buttons, fields, cards, images, tags. The square corner is the archive identity.

**Admin:** soft. `{rounded.admin-lg}` (14px) for sheets and dialogs; `{rounded.admin-md}` (10px) for photo slots and the language-tab track; `{rounded.admin-sm}` (8px) for buttons, fields, nav items, queue items and series radio options; `{rounded.admin-xs}` (6px) for the active language tab and the rebuild status tag. No pill shapes.

## Components

### Public

| Component | Anatomy and visual states |
|---|---|
| Masthead | First screen of the home page, shown in [`mockups/public-home.html`](mockups/public-home.html) (shots 1 and 3). `{components.masthead}` on `{colors.paper}`, no header above it. Top row: ID/EN language switch at the right (Phosphor globe, current language underlined 2px accent). Then the name at `{typography.display}` (Fraunces 300, opsz 144), the manifesto at `{typography.manifesto}` (max 52ch), the Placeholder marker while the manifesto awaits client text, and two actions: "Baca artikel" (primary) and "Kirim artefak" (secondary); stacked full width at 375. Below, five strata bands across the full width: 1px ink rule on top of each, fills and heights from `{components.masthead}`, one 12px accent find mark in the third band. **Superseded 2026-11-18 by user decision:** the bands are a textured section drawing (uneven dug boundaries, soil grain, pebbles, hatched natural ground, context numbers (101) to (105), three small finds SF 01 to SF 03, still `aria-hidden`); flat fills and the no-label rule below no longer apply, and Placeholder image slots are hatched instead of plain. Original text: Bands carry **no text labels** (the mockup's "Lapisan" labels are superseded) and are decorative (`aria-hidden`). Name, manifesto and both actions fit above the fold at 375×812 and 1440×900. |
| Header | Wordmark, anchor nav (Articles, Artefact of the Day, Contribute, Newsletter), language switch (ID/EN, Phosphor globe), skip link, Menu button on mobile. Thin bar on `{colors.paper}` with a bottom rule; current section underlined in `{colors.accent}`. On home it is absent while the Masthead is in view (`public-home.html` shots 2 and 4 show it after). |
| Mobile menu panel | Full-screen panel on `{colors.paper}`: Articles, Artefact of the Day, Contribute, Newsletter, ID/EN switch; items at `{typography.h3}` separated by rules; close (Phosphor x) top right. [ASSUMPTION: visual treatment derived from tokens; not mocked.] |
| Button / Link | Primary `{components.button-primary}`: hover darkens 8%, focus `{components.focus-ring}`, busy or disabled 40% opacity (focus ring still drawn). Secondary `{components.button-secondary}`: hover `{colors.surface}` fill. Link `{components.link}`: hover underline 2px. Quiet text buttons and ToC links keep a hit area of at least 24×24px. |
| Article card | Image 3:2, series label (meta, accent, on paper), title (h3), excerpt (2 lines), date · reading time (meta). Hover: title underline only; the image does not move. The title is the link; its hit area stretches over the whole card, and the focus outline is drawn around the card. |
| Featured article card | Article card spanning 2 columns, title at `{typography.h2}`. |
| Series block | Series name (h3), one-line description, latest Article link, count (meta); "Segera hadir / Coming soon" when empty. Hover: rule turns accent. |
| Catalogue card | Image 4:5, inventory no. and year (`{typography.meta-catalogue}`), title (h3), Category tag, provenance (small). Hover: title underline only. |
| Catalogue Record block | `{components.catalogue-record-block}`: bordered key/value list of inventory number, year, Category, provenance, contributor credit; labels in `{typography.meta-catalogue}`. Used in cards, Articles and Artefact of the Day. |
| Category tag | `{components.category-tag}`. |
| Artefact of the Day | Large image, Catalogue Record block, "Tampilkan lainnya / Show another" button; section background `tint`, fallback `{colors.surface}`. |
| Article page | Series label, title (h1), standfirst, byline with date and reading time (meta), hero image with caption and credit, 68ch body, pull quote (Fraunces roman at h2 size, no italic, no rule; size alone sets it apart), inline captioned images, Catalogue Record block, Related Articles row. |
| Reading progress bar | `{components.reading-progress-bar}`: 2px accent line pinned under the sticky header. [ASSUMPTION: height and position derived; not in sources.] |
| Table of contents | Shown only when the Article has three or more h2 headings. List of h2 headings in `{typography.small}`; current heading marked with an accent rule at left. Sidebar column on desktop, collapsed disclosure above the body on mobile. [ASSUMPTION: placement derived.] |
| Share control | Secondary-style text buttons "Salin tautan / Copy link" and native share where available; Phosphor Light icons. [ASSUMPTION: visual treatment derived.] |
| Contribute invitation | Home section: short invitation copy and primary button "Kirim artefak / Contribute an artefact" linking to the Contribute page. |
| Text field / textarea | Label above, `{components.text-field}`, helper (small, muted), character count on story. Focus ring; error = accent border plus message with Phosphor warning icon; disabled. |
| File drop zone (contribution uploader) | `{components.file-drop-zone}` with Phosphor upload icon, "drag or choose photos", a visible "Pilih foto" secondary button, limits line (JPG/PNG/WebP · max 10 MB · up to 5); thumbnail grid with filename, size, remove button, per-file progress. The focus ring is drawn on the visible "Pilih foto" button, never on a hidden file input. States: drag-over (accent border, surface fill, text stays ink), per-file error (file-type label in ink with the accent warning icon), uploading, done. |
| Checkbox (consent) | 20px square, label with link to privacy note; checked = accent fill; focus = `{components.focus-ring}`. Error = 2px ink border plus the message and warning icon; never an outline, so focus and error stay distinct. |
| Contribution form | Shown in [`mockups/public-kirim.html`](mockups/public-kirim.html) (error, submitting and success). One column max 640px; groups About you · About the artefact · Photos · Consent; Turnstile; submit. Error summary at top: 1px accent border on paper, heading at `{typography.h3}`, one link per failed field. Turnstile widget sits above submit at its own size, theme following the page; its failure message uses the field-error style. Submitting: button at 40% opacity with its label, focus ring kept. Success screen: heading at `{typography.h1}`, Reference Number on its own line at `{typography.h2}` with tabular figures, summary in a Catalogue Record block. |
| Newsletter form | Label, email input, consent text, Turnstile, submit; status as visible `{typography.small}` text below the button (ink; error with accent icon). |
| Placeholder marker | `{components.placeholder-marker}`: sentence-case label "Contoh / Placeholder" in an accent border, always visible on Placeholder content. |
| Placeholder image | `{components.placeholder-image}`: plain slot at the real aspect ratio, with the Placeholder marker and alt text that says it is a placeholder. No textures or gradients. |
| Footer | `{components.footer}`: name and one-line description, links "Catatan privasi / Privacy note" and "Kirim artefak / Contribute an artefact", ID/EN switch, copyright line. Links 44px tall; text muted, links ink with accent underline. |
| Not-found page | Same chrome as Article pages: heading at `{typography.h1}`, one sentence in ID and one in EN (each with its `lang`), two links "Ke beranda / Go home" and "Artikel terbaru / Latest articles". No illustration. |

Icons: Phosphor, Light weight only. Imagery: Artefact photos on neutral backgrounds.

### Admin

Every interactive admin element uses `{components.admin-focus-ring}` on `:focus-visible`. Background-colour transitions run 150ms with `cubic-bezier(.22,1,.36,1)`; buttons scale to 0.98 while pressed (`{components.admin-button-press}`). Under `prefers-reduced-motion: reduce` all transitions are off.

| Component | Anatomy and visual states |
|---|---|
| Dashboard nav | Publication name (500) over "Ruang editor" (meta, muted); items Artikel, Artefak, Kiriman, Pelanggan, Aktivitas at `{typography.admin-ui}`, with right-aligned counts in muted meta. `{components.admin-nav-item}`: hover fills `{colors.admin-rail}`. Active: `{components.admin-nav-item-active}`, weight 500, with the 3px `{colors.admin-text}` bar at the left (the bar carries the state; tone alone is 1.16 to 1.27:1). |
| Queue rail | On `{colors.admin-rail}`. Review Status filter at the top: three links "Menunggu", "Disetujui", "Ditolak" in `{typography.admin-ui}`, the active one marked by the same 2px `{colors.admin-text}` underline as the language tabs [ASSUMPTION: not mocked]. Heading "Menunggu dibaca" (500, 15px), sub-line "7 kiriman, yang terlama di atas" (muted meta). Ordered list of `{components.admin-queue-item}`: title (`{typography.admin-ui}`) with waiting age right-aligned (muted meta), meta line below (Reference Number · Contributor · Category · photo count). Hover `{colors.admin-rail-hover}`; active `{components.admin-queue-item-active}` with the 3px `{colors.admin-text}` bar at the left. |
| Catalogue-record strip (signature) | `{components.admin-catalogue-strip}`: a definition list laid out as one ruled row, 2px `{colors.admin-text}` rule on top, hairline below, hairline dividers between cells. Each cell: muted label over a 15px tabular value. Opening strip on the review sheet: No. referensi, Diterima, Urutan ("1 dari 7"), and, pushed right, Kiriman tertua with the waiting time in accent 500 ("menunggu 12 hari"; on sheet only, never on rail). Closing strip after the story: Tahun, Kategori, Izin muat, Lokasi foto ("sudah dihapus"). Below 1100px cells wrap and the waiting cell aligns left. Review sheet only. |
| Review sheet | `{components.admin-sheet}`. Opening catalogue-record strip; title (`{typography.admin-title}`, Fraunces, max 24ch); byline in muted 15px: Contributor name, masked email with a quiet "Tampilkan" button, city; hero photo slot (`{components.admin-photo-slot}`) with caption "Foto 1 dari 4 · …" in muted meta below; strip of three photo slots with captions; story at `{typography.admin-reading}`; closing catalogue-record strip; decision bar. |
| Masked email | Masked form shows the first character, bullets and the domain (bullets hidden from assistive technology; accessible label "email disamarkan, domain {domain}"). "Tampilkan" is an `{components.admin-button-quiet}` after it; once pressed the full address replaces the masked one and the button disappears. |
| Photo lightbox | Full-size Contribution photo over a dimmed room, caption "Foto n dari N", previous, next and close buttons in admin secondary style. [ASSUMPTION: derived; not mocked.] |
| Decision bar | `{components.admin-decision-bar}`, full sheet width at the foot, bottom corners follow the sheet. Note label "Catatan untuk editor lain" (500), textarea (`{components.admin-text-field}`, min 72px), helper in muted 14px ("Kontributor tidak melihat catatan ini. Catatan disimpan bersama keputusan pada kiriman ini, tidak di Aktivitas."); buttons Jadikan artefak (primary), Setujui (secondary), Tolak (quiet); right-aligned "Berikutnya: {judul}" in muted 14px with the title as a text-colour link. When Tolak is pressed with an empty note, the field shows the error state. |
| Admin buttons | Primary `{components.admin-button-primary}` (hover and press `{colors.admin-accent-press}`), secondary `{components.admin-button-secondary}` (hover `{colors.admin-button-hover}`), quiet `{components.admin-button-quiet}` (hover text colour). All 48px high except quiet, which keeps a 24×24px minimum hit area. Busy or disabled: 40% opacity, no hover, focus ring still drawn. |
| Admin text field | `{components.admin-text-field}`; focus ring as buttons; error = accent border, Phosphor warning icon in accent and message in `{colors.admin-text}` below. |
| Rebuild status tag | `{components.rebuild-status-tag}`, right of the editor heading, on published content only. Text states: "Situs sedang dibangun ulang, sekitar 2 menit" (with a small animated indicator that runs for at most 5 seconds after the build starts, then the text stands alone; static under reduced motion), "Sudah tayang", "Gagal dibangun. Situs lama tetap tayang." with a secondary "Coba lagi" button beside the tag. |
| Autosave status | Muted `{typography.admin-small}` text at the left of the editor footer: "Menyimpan…", then "Tersimpan · 14.32". Failure: accent warning icon and "Belum tersimpan" with a quiet "Coba lagi". Replaces the "Simpan draf" button that the v2 mockup still shows. |
| Publication Status label | Tag with `{components.rebuild-status-tag}` anatomy reading "Draf" or "Terbit", on list rows (right of the title) and in the editor header (left of the rebuild status tag). Text carries the state, not colour. [ASSUMPTION: not mocked.] |
| Language tabs (ID \| EN) | `{components.admin-language-tabs}`: segmented control "Indonesia" / "English"; active tab on sheet tone, weight 500, with a 2px `{colors.admin-text}` underline (the underline carries the state); the tab label carries translation status (e.g. "English · kosong"). |
| Editorial Series picker | `fieldset` with visible legend "Seri editorial" (muted 14px) and four radio options as `{components.admin-series-radio}`: bordered row with a 16px round dot and label. Selected: dot filled by a 5px `{colors.admin-text}` ring, option border `{colors.admin-text}`, label weight 500. |
| Block editor | Article sheet: language tabs, Editorial Series picker, title (`{typography.admin-editor-title}`), standfirst (`{typography.admin-standfirst}`, muted), body blocks at `{typography.admin-editor-body}` within `{spacing.admin-measure}`; footer above a hairline: autosave status left, Pratinjau (secondary) and Terbitkan (primary; "Perbarui" on published content) right. Each block has a quiet "Opsi blok" handle button at its left (Phosphor dots-six-vertical, 24×24px hit area, visible on hover and focus) that opens a small `{components.admin-overlay}` menu: Pindah ke atas, Pindah ke bawah, Hapus blok. A quiet "Tambah blok" button (Phosphor plus) sits below the last block and beside an empty paragraph; it opens the Slash menu. |
| Slash menu | Floating list in `{components.admin-overlay}`, `{rounded.admin-md}`; items: heading, quote, image, Catalogue Record. [ASSUMPTION: visual derived; not mocked.] |
| Catalogue Record block (editor) | Bordered key/value form inside the body, same fields as the public block, in admin tokens. [ASSUMPTION: derived.] |
| Image crop tool | Opens in `{components.admin-overlay}` at dialog size over a dimmed room, from "Jadikan artefak" and from Artefact image upload. Image on `{colors.admin-rail}`, crop frame with four corner handles (`{colors.admin-sheet}` fill, `{colors.admin-text}` 1px edge, 24×24px hit area), area outside the frame dimmed. Controls below in two rows. Row 1: aspect presets as radios (Bebas, 1:1, 4:5, 3:2), Perkecil and Perbesar (secondary), and four nudge buttons Geser kiri, kanan, atas, bawah (secondary, Phosphor arrow icons) with the crop size "1200 × 1500 px" in muted meta. Row 2: Putar kiri, Putar kanan (secondary), Atur ulang (quiet). Footer Batal (secondary) and Terapkan (primary). [ASSUMPTION: visual derived; not mocked.] |
| Confirm dialog | `{components.admin-overlay}` at small width, `{rounded.admin-lg}`, over a dimmed room; title, one-sentence consequence, Batal (secondary) and the destructive action (primary). Used for delete and unpublish. [ASSUMPTION: derived.] |
| Unsaved-changes guard | Same anatomy as Confirm dialog. |
| Empty state | Centred on the sheet: heading (`{typography.admin-heading}`), muted sentence max 36ch, one secondary button. No illustration. |
| Loading and error states | Loading: lists and the queue rail show rows at their real height in `{colors.admin-rail-hover}` with no text, plus one muted line ("Memuat kiriman…"). Sheet: catalogue-strip and photo slots at real size, story lines as flat bars. No shimmer. Buttons that save show their label in the busy state until the request returns. Error: inline, at the place that failed: Phosphor warning icon in accent, message in `{colors.admin-text}` (never accent text on rail), and one secondary action ("Muat ulang", "Coba lagi", "Simpan lagi"). Session expired: the same anatomy as a full-width notice at the top of the sheet, with a primary "Masuk lagi". |
| Lists (Artikel, Artefak, Pelanggan, Aktivitas) | [ASSUMPTION: plain rows on the sheet with hairline separators, title and muted meta, reusing queue-item type; not mocked.] Artikel and Artefak rows carry the Publication Status label. Pelanggan has a search field (`{components.admin-text-field}`) above the rows; no results shows one muted sentence in the list area. |
| Phone note | On phone, Artikel and Artefak editing screens show one `{typography.admin-body}` sentence centred on the sheet ("Buka di laptop atau tablet untuk menyunting.") and no action. |

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep public chrome paper and ink; let Artefact images bring colour | Add hues to public UI chrome beyond `{colors.accent}` and `tint` |
| Square corners on every public element | Round anything on the public site |
| Soft corners (`{rounded.admin-sm}` to `{rounded.admin-lg}`) in the Dashboard | Pill shapes anywhere; Dashboard radii or shadows on the public site |
| Depth from tone and hairlines in both scopes | Shadows on sheets or cards; shadow only on Slash menu, dialogs and crop tool |
| Uppercase tracked labels only for catalogue metadata | Uppercase eyebrows, numbered section labels, uppercase meta elsewhere |
| Fraunces in the Dashboard only for publishable titles and standfirst | Fraunces for Dashboard chrome; negative tracking on titles |
| Radios for a required single choice | Pills or chips for a required single choice |
| Accent text in the Dashboard only on sheet or room | Accent text on `{colors.admin-rail}` (4.18:1) |
| Control borders in ink (public) or `{colors.admin-control}` (admin) | `{colors.line}`, `{colors.admin-line}` or `{colors.admin-muted}` as a control boundary |
| Clamp the Artefact of the Day tint per theme so muted and ink text stay ≥ 4.5:1 and the focus ring and borders ≥ 3:1 | Ship a tint checked against ink alone |
| Public accent text on paper only; on surface or tint use a paper chip or ink | Accent text on `{colors.surface}` (4.28:1) or on a tint |
| Mark selected admin items with a 3px bar or 2px underline in `{colors.admin-text}` | Tone or a hairline as the only selected-state cue |
| Label every Placeholder visibly; plain slot at real ratio | Abstract textures or gradients as placeholder images |
| Phosphor Light icons only | Mix icon families or weights; decorative illustrations or arrows |
| One signature motion (Masthead strata, five unlabelled bands); fade-up only on Masthead and Artefact of the Day | Fade-up on every section; image scale on hover; motion inside Article text |
| Commas, periods, colons or parentheses in interface copy | Em dashes in any interface copy |
