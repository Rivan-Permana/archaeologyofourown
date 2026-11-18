# Spine Pair Review — Archaeology of Our Own

Reviewed: `DESIGN.md`, `EXPERIENCE.md` (2026-11-17) against PRD + addendum, `docs/DESIGN.md` (via sources), `.memlog.md`, `mockups/`. Admin light-only is a recorded decision and is not counted as a gap.

## Overall verdict
The pair is a usable contract: all five UJs have full Key Flows, every public colour has a light/dark pair with contrast, the admin scope is tokenised and its states are thorough. The one real hole sits at the public site's signature element: the **Masthead** has no component row in either spine, so the three newest Masthead decisions in the memlog (ID/EN switch inside it, unlabelled strata bands, motion prototype deferred) never landed. The two public mockups are also orphaned.

## 1. Flow coverage — strong
Checked UJ-1 to UJ-5 (PRD §2.3) and FR-1 to FR-34 (FR-16 retired). Every UJ has a named protagonist, numbered steps, a climax beat and a failure/edge path. FRs without a flow (FR-8, FR-22, FR-26, FR-34) are covered in IA, Component Patterns or State Patterns.
### Findings
- **low** UJ-5 step 1 rests on an assumed label "Tulis artikel" (EXPERIENCE › Key Flows › UJ-5). *Fix:* commit the label in Voice and Tone.

## 2. Token completeness — adequate
All `{path.to.token}` references in prose and component objects resolve (incl. `{components.admin-overlay.shadow}`, `{typography.admin-ui.fontSize}`). Every public colour has a hex light/dark pair. `tint` is runtime and documented.
### Findings
- **medium** Component tokens reference light colours only (`header.background: {colors.paper}`, `button-secondary.border: {colors.ink}` etc.); no rule says how they resolve in dark mode (DESIGN frontmatter `components`, Colors › Public). *Fix:* add one line: "every public `{colors.x}` resolves to `x-dark` under dark theme", or add dark component keys.
- **medium** Dark-mode contrast not stated for load-bearing combos on `surface-dark` (ink-dark, ink-muted-dark, accent-dark text) or for the `tint` clamp in dark mode; `on-accent-dark` contrast repeats the accent figure 6.22 (DESIGN › Colors › Public). *Fix:* measure and add those cells; state tint clamp target for `ink-dark`.
- **medium** No token for the signature Masthead strata scrub (band count, gap distance, scroll range) while every lesser motion has one (DESIGN frontmatter `motion-*`; EXPERIENCE › Interaction Primitives "4 to 5 bands"). *Fix:* add `motion-strata` with committed band count, or mark it explicitly deferred to the prototype.
- **low** Public `h1`–`h3`, `standfirst` lack `fontWeight`; `standfirst` lacks `lineHeight`; `admin-catalogue-strip.value` is a raw string ("15px / 20px Inter") rather than a typography token. *Fix:* fill weights; add `admin-strip-value` typography token.

## 3. Component coverage — thin
Extracted every component name across both spines and checked for a DESIGN.Components row plus an EXPERIENCE.Component Patterns row.
### Findings
- **high** **Masthead** has no row in DESIGN › Components › Public nor EXPERIENCE › Component Patterns › Public, though it is the home page's first surface, FR-3, the signature motion and UJ-1 step 1. Anatomy (name, manifesto, two actions, ID/EN switch, strata bands, Placeholder marker) and behaviour (scrub, reduced motion, fit in 375×812 and 1440×900, focus move) are scattered across Typography, Interaction Primitives and Responsive. *Fix:* add a Masthead row to both spines.
- **medium** **Footer** is listed in the Home IA and as the route to Privacy, but has no row in either spine (EXPERIENCE › IA › Public). *Fix:* add a Footer row (contents, links, language).
- **medium** Admin elements named in behaviour with no visual spec: Review Status filter at top of the queue rail, Publication Status label on list rows and editor header, "buka di laptop atau tablet" phone note (EXPERIENCE › Component Patterns › Queue rail, State Patterns › Draft/published, Responsive). *Fix:* add rows or fold into Queue rail and Lists rows in DESIGN.
- **low** Contribution success screen, error summary and Turnstile have behaviour but only a mention inside the Contribution form row in DESIGN. *Fix:* one-line visual notes (heading token, Reference Number style).
- **low** Name drift: DESIGN "Loading state" / "Error state" vs EXPERIENCE "Loading and error states"; DESIGN "Button (primary)/(secondary)", "Link" vs EXPERIENCE "Button / Link". *Fix:* align names.

## 4. State coverage — adequate
Walked Home, Article, Contribute, Privacy, and every Dashboard section. Cold load, no-JS, empty, loading, error, offline (submit-time), rate limit, success, permission (Cloudflare Access) are covered.
### Findings
- **medium** No not-found state: an Article unpublished or deleted after its link was shared (FR-27, UJ-1 starts from a shared link) and unknown slugs have no treatment (EXPERIENCE › State Patterns). *Fix:* add a bilingual 404 row with a route home and to Latest Articles.
- **low** Pelanggan search with no results and Aktivitas empty are only covered by the generic "Dashboard empty lists" assumption. *Fix:* add the no-results line.

## 5. Visual reference coverage — thin
Files: `mockups/dashboard-review.html`, `mockups/public-home.html`, `mockups/public-kirim.html`; `imports/` empty. Spines-win stated (DESIGN intro, EXPERIENCE Foundation and IA).
### Findings
- **high** `public-home.html` and `public-kirim.html` are orphans: not linked from either spine nor listed in `sources` frontmatter, although they are the only public visual references and the memlog required them before finalizing (DESIGN intro, EXPERIENCE › IA › Public). *Fix:* link each inline (Home IA / Masthead row; Contribute IA / Contribution form row), name what each shows, add to `sources`.
- **low** Both public mockups link to `key-screen-home.html` / `key-screen-kirim.html`, which exist only in `.working/`; links are broken in `mockups/`. Neither public mockup shows dark theme. *Fix:* repoint links; note that dark is specified in tokens only.

## 6. Bloat & overspecification — adequate
### Findings
- **low** EXPERIENCE › Implementation Craft is a process/skills checklist, not experience behaviour; it restates memlog. *Fix:* move to a handoff note or keep one line.
- **low** Direction history (A, B, C v1) is repeated in DESIGN intro, EXPERIENCE IA and Inspiration. *Fix:* keep it in Inspiration only.

## 7. Inheritance discipline — adequate
`sources` paths resolve. UJ names verbatim. Glossary terms (Article, Artefact, Catalogue Record, Contribution, Reference Number, Review Status, Publication Status, Rebuild, Placeholder, Masthead) used consistently; Dashboard ID labels are mapped to glossary objects in the IA table. EXPERIENCE token references resolve to DESIGN.
### Findings
- **high** Three newest memlog decisions are not in the spines: ID/EN switch sits in the Masthead while the header is hidden; strata bands carry no text labels; motion prototype deferred to implementation. EXPERIENCE › Header says only "Language switch keeps the equivalent page" and the Masthead is unspecified, so a consumer cannot know where the switch is on the home page's first screen (FR-2 "always reachable"). *Fix:* write all three into the new Masthead rows; add the prototype deferral to Open Questions.
- **low** "Contribute page" is a new surface term not in the PRD glossary (flagged with `[NOTE FOR ARCHITECTURE]`). *Fix:* none needed beyond the note; carry into the PRD glossary at next update.

## 8. Shape fit — strong
DESIGN sections in canonical order. EXPERIENCE has all required defaults; Inspiration and Responsive present as triggered; Open Questions earns its place; Implementation Craft is marginal (see 6).

## Mechanical notes
- Frontmatter complete in both (name, status, created, updated, sources); both still `status: draft`.
- `sources` lists `dashboard-review.html` but not the two public mockups.
- No Mermaid in either file.
- Severity counts: critical 0, high 3, medium 6, low 9.
