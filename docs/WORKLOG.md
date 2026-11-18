# Work log — Archaeology of Our Own

Every action taken on this project, the skill/tool behind it, and what it rests on. Updated as work happens. `ASSUMPTION` marks anything not yet confirmed by the user or client. No emails, real names or secrets in this file (public repository).

Basis codes: **U** = user decision in chat · **C** = client answer relayed by the user · **E** = measured/observed evidence · **D** = official documentation or source file · **A** = ASSUMPTION (needs confirmation).

## 2026-11-17

### Research and setup

| # | What | Skill / tool | Why this tool | Basis | Result | Status |
|---|---|---|---|---|---|---|
| 1 | Read the Instagram reference post | Firecrawl scrape | Instagram blocks plain fetches; Firecrawl returned the post text | U: references given in the first request | Post by Artefak Kita: theme "before, around, beyond making"; 16 slides (images not readable) | Done, partial (slides unread) |
| 2 | Read nationalgallery.sg homepage and branding | Firecrawl scrape (markdown + branding) | One call gives content and design tokens | U: reference given | Sections, colours `#E9E3DF`/`#DD052B`, Work Sans + Inter | Done |
| 3 | Read the linked Artefak Kita articles page | Firecrawl scrape | Instagram post points there for the full story | E: link in post caption | Series structure, Eczar + Inter Display, square corners | Done |
| 4 | Install Node 24.22.3 | Herd nvm | REA requires Node ≥ 24.22.1; active was 24.13.1 | E: REA error message | Node 24.22.3 installed beside existing versions | Done |
| 5 | Install REA and register it with Claude Code | `rea setup --client claude_code` (dry run first) | User asked to install REA | U: first request; D: rea.tools, github.com/morluto/rea | MCP + skill `reverse-engineer-anything`; backup of `~/.claude.json` | Done |
| 6 | Reverse-engineer the NGS homepage | `reverse-engineer-anything` skill via `rea inspect-web-page` on isolated headless Chrome | User asked to study references with REA | U; E: Evidence `ev_8860f08b…` | Components, GSAP ScrollTrigger masthead, palette-derived "Artwork of the Day" | Done |
| 7 | Check domain, GitHub and tooling | `whois`, `gh`, shell | Needed before planning deploy | U: domain and repo requested | `.com` available; repo not yet created; git identity checked | Done |

### Rules and planning

| # | What | Skill / tool | Why | Basis | Result | Status |
|---|---|---|---|---|---|---|
| 8 | Add "interview before PRD/design system" rule | Edit global rules | User asked | U | `~/.agents/portable-global-agent-rules.md` | Done |
| 9 | Interview rounds 1–5 | AskUserQuestion | Rule 8: no assumptions | U | Decisions recorded in PRD decision logs | Done |
| 10 | First PRD + design system | Manual writing; WCAG contrast computed in Python | No PRD existed | U, C, E (contrast ratios) | `docs/PRD.md` (superseded), `docs/DESIGN.md` | Done |
| 11 | Revise for client answers (publication, contributions) | AskUserQuestion + edits | Client answers changed scope | C | Same files | Done |

### BMAD

| # | What | Skill / tool | Why | Basis | Result | Status |
|---|---|---|---|---|---|---|
| 12 | Install BMAD 6.12.4 in the project | `npx bmad-method install` (Claude Code, ID chat, EN docs) | User asked to "bmad-kan" the PRD | U | `_bmad/`, `.claude/skills/bmad-*` | Done |
| 13 | BMAD PRD, fast path, public-launch stakes | `bmad-prd` | BMAD order: PRD first | U; C (series names) | `_bmad-output/planning-artifacts/prds/…/prd.md` + addendum + memlog | Done, final |
| 14 | PRD reviewer gate | `bmad-prd` rubric walker (subagent) | Required at finalize | D: BMAD checklist | `review-rubric.md`; 5 high findings resolved | Done |
| 15 | Move Editor Dashboard into v1 | AskUserQuestion | User chose "majukan dashboard" | U | PRD §4.9, FR-26–34 | Done |
| 16 | Record Editors without writing emails | Edit PRD | Repo is public; user asked that their email never appears | U | Emails only go into the Cloudflare Access policy | Done |
| 17 | BMAD UX workspace and decisions | `bmad-ux` (Fast path for public, Coaching for dashboard) | Next BMAD step; user asked for UX in BMAD | U | `_bmad-output/planning-artifacts/ux-designs/…/` + memlog | In progress |
| 18 | 3 dashboard directions | `bmad-ux` design-directions renderer (subagent) | User wanted to see options | U | `.working/direction-*.html`; user chose C | Done |
| 19 | Distil UX spines | `bmad-ux` finalize distiller (subagent) | BMAD finalize step | U + memlog | `DESIGN.md`, `EXPERIENCE.md` (draft) | Done |
| 20 | Fix admin border contrast | Python WCAG check | Distiller reported 1.92:1 (< 3:1) | E: measured 3.04–3.86:1 for `#857F76` | Accepted by user | Done |

### Anti-slop

| # | What | Skill / tool | Why | Basis | Result | Status |
|---|---|---|---|---|---|---|
| 21 | Review then install anti-slop and unslop | `gh`, `git clone`, grep scan for network/exec/injection | User asked; preview looked AI-made | U; E: no exfiltration found (anti-slop @57b92d4 MIT, unslop @620163e CC-BY-4.0) | `~/.agents/skills/{antislop*,unslop}` symlinked to `~/.claude/skills` | Done |
| 22 | Add anti-slop rule globally | Edit global rules, Claude adapter, catalog | User asked | U | Rule in "UI and UX work"; adapter route updated | Done |
| 23 | Unslop dashboard direction C | `antislop`, `antislop-ui`, `antislop-copywriting`, `unslop` (subagent) | Rule 22 | U | `.working/direction-ruang-baca-v2.html` (official reference) | Done |
| 24 | Anti-slop audit of UX spines | `antislop` core + `-ui` + `-copywriting` (subagent) | Rule 22 | U | `review-antislop.md`; all findings applied | Done |
| 25 | Public key screens: home, /kirim | `bmad-ux` key-screens + `antislop*` + `unslop` (subagent) | User chose 2 mockups | U | `.working/key-screen-home.html`, `key-screen-kirim.html`; approved by user | Done |
| 26 | Motion prototype | — | — | U: deferred to implementation (GSAP + `emil-design-eng`) | — | Deferred |
| 27 | Add work-log rule and this file | Edit global rules; this file | User asked | U | Rule in "Two-way collaboration"; `docs/WORKLOG.md` | Done |
| 28 | ID/EN switch in the Masthead while header hidden | AskUserQuestion | Renderer proposed it; FR-2 needs the switch reachable | U | memlog | Done |
| 29 | Strata bands without text labels | AskUserQuestion | Avoid clash with series "Stratigrafi" | U | memlog; spines/mockup to update | Done (decision) |
| 30 | Promote chosen mockups | `bmad-ux` finalize (promotion step) | Mockups anchor layout and visual language | D: bmad-ux SKILL.md | `mockups/dashboard-review.html`, `public-home.html`, `public-kirim.html`; spine links repointed | Done |
| 31 | UX reviewer gate | `bmad-ux` rubric walker + accessibility lens (`antislop-human`, `fixing-accessibility`) as parallel subagents | User picked these two lenses | U | `review-rubric.md` (3 high/6 med/9 low), `review-accessibility.md` (6 high/11 med/8 low) | Done |
| 32 | Apply all review fixes to UX spines | subagent with `antislop-copywriting`, `contrast-check.py` | User approved "apply all" | U; E: tint clamp re-measured independently (light muted 4.54, accent ring 3.48; dark muted 4.51, accent 4.04) | 43 findings fixed; 2 moved to Open Questions (motion details, Turnstile fallback contact); no hex changed | Done |

## 2026-11-18

| # | What | Skill / tool | Why | Basis | Result | Status |
|---|---|---|---|---|---|---|
| 33 | Pause before marking UX final | — | User near usage limit | U | — | Done |
| 34 | Mark UX spines final | `bmad-ux` finalize (close step) | User said "gas lanjut" to the recommended finalize | U | `DESIGN.md`, `EXPERIENCE.md` status final; 32 build-level `ASSUMPTION` tags to resolve during build | Done |
| 35 | Architecture workspace + version check | `bmad-architecture`; `npm view`; Firecrawl (Cloudflare docs); Context7 (Astro docs); WebSearch | BMAD requires verifying named tech before binding it | U: BMAD rollout; D: Cloudflare migrate-from-pages (2026-11-12), Astro Cloudflare guide | Versions pinned in memlog; Pages lacks Cron and Rate Limiting | Done |
| 36 | Hosting: Workers + static assets (replaces Pages) | AskUserQuestion | Pages cannot run the 90-day deletion cron or rate limits the PRD needs | U; D: Cloudflare compatibility matrix | AD-1; neutral `workers.dev` subdomain required | Done |
| 37 | Publishing: prerender + rebuild via Deploy Hook | AskUserQuestion | Keeps public site static; matches the "1–2 minutes" decision | U | AD-2, AD-3 | Done |
| 38 | Editor BlockNote, dashboard Astro + React islands, Drizzle, two R2 buckets + `/media/*` | AskUserQuestion | Load-bearing calls shown with alternatives | U; D: npm licences (BlockNote MPL-2.0; `xl-*` GPL avoided) | AD-5, AD-6, AD-8 | Done |
| 39 | Remove unneeded dependencies (ULID lib, separate Zod) | ponytail rule: platform first | `crypto.randomUUID()` and `astro/zod` already exist | E: `npm view astro@7.4.12` exports `./zod` | Spine updated; jose 6.2.17 pinned | Done |
| 40 | Spine draft + lint | `bmad-architecture` `lint_spine.py` | Mechanical check before reviewers | D | `ARCHITECTURE-SPINE.md`, 12 ADs, lint 0 findings | Done |
| 41 | Architecture reviewer gate | 4 parallel subagents: rubric + reconcile, verified-tech, adversary, `agent-skills:security-auditor` | BMAD floor reviewers + security lens for auth, uploads, personal data | D: reviewer-gate.md; global rules tier 3 | `reviews/review-*.md`: 6 critical, 25 high in total (overlapping) | Done |
| 42 | Plan: Workers Free with presigned direct-to-R2 uploads | AskUserQuestion | Free plan CPU 10 ms / 128 MB cannot buffer 5×10 MB | U (recommendation was Paid; user chose Free); D: Workers limits | Upload protocol start → PUT → finish | Done |
| 43 | Hourly rate limit via Durable Object with 1 h keyed IP hash | AskUserQuestion | Rate Limiting binding only supports 10/60 s periods | U; D: rate-limit binding docs; DO available on Free (changelog 2025-04-07) | Privacy-note wording must change upstream | Done |
| 44 | Artefact of the Day picked in the browser by WIB date | AskUserQuestion | Static page cannot change at midnight otherwise | U | Shared `pickDaily()`; no daily rebuild | Done |
| 45 | Build reads a public snapshot endpoint, no D1 token | AskUserQuestion | Build dependencies must not read personal data | U; security review S-4 | `/api/build/snapshot` + Access service token | Done |
| 46 | Apply all remaining review fixes to the spine | subagent following `bmad-architecture` Finalize | Clear fixes are applied at Finalize, not asked | D: bmad-architecture SKILL.md | AD-1–AD-12 amended, AD-13–AD-18 added; lint 0 | Done |
| 47 | Resolve 13 open questions | AskUserQuestion (one batch with recommendations) | Needed before epics | U: "acc" to all 13 | Folded into AD-4/5/6/8/9/10/12/17; Mantine 9.8.1 (MIT) added | Done |
| 48 | Update PRD, addendum, UX to match | subagent | Upstream must not contradict the spine | U: approved together with item 47 | PRD §9, FR-15/19/21/22/32; addendum hosting; EXPERIENCE autosave/Perbarui/upload copy | Done; new copy needs client approval |
| 49 | Non-technical architecture companion (Indonesian) | `bmad-architecture` Finalize step 5 (renderings); `antislop-copywriting` style | User asked for a non-technical spine that matches | U | `ARCHITECTURE-OVERVIEW.md`; AD references cross-checked against spine titles | Done |
| 50 | Mark architecture final | `bmad-architecture` close step | All findings resolved | E: lint 0, privacy scan clean | `status: final`; memlog "spine finalized" | Done |
| 51 | Extract requirements for epics | `bmad-create-epics-and-stories` step 1 (subagent) | BMAD order: architecture then epics | U: "Continue to epics" | `epics.md`: 33 FR, 39 NFR, 53 AR, 80 UX-DR | Done |
| 52 | Classification notes (launch checklist, /kirim, merged dashboard NFRs, BlockNote wording) | AskUserQuestion | Ambiguities found during extraction | U: "C: continue" | EXPERIENCE.md editor wording aligned to BlockNote (AD-6) | Done |
| 53 | Epic list (6 epics) + FR coverage map | `bmad-create-epics-and-stories` step 2 | User value first, no backward dependencies | U: "C: setujui" | `epics.md` Epic List + coverage map | Done |
| 54 | Stories for all epics | `bmad-create-epics-and-stories` step 3 (subagent, sequential epics) | One writer keeps table ownership and story order consistent | U: "Setujui, lanjut" | 37 stories; coverage verified by own script | Done |
| 55 | Final validation | `bmad-create-epics-and-stories` step 4 (independent validator subagent) | Catch forward dependencies and AD violations | D: step-04 | `epics-validation.md`: 4 of 5 checks failed, 11 fixes | Done |
| 57 | Mark epics final | `bmad-create-epics-and-stories` complete | User chose "C: complete + sprint" | U | `epics.md` status final | Done |
| 58 | Align UX Catalogue Record block with AD-6 | Edit EXPERIENCE.md + UX memlog | Last cross-document conflict before readiness gate | U: Q4 decision; E: epics Story 4.4 | Block is an Artefact ID picker | Done |
| 59 | Readiness gate + sprint tracking | `bmad-sprint-planning` (`sprint_plan.py generate`) | BMAD final planning step | D: readiness-gate.md | Gate PASS; `_bmad-output/implementation-artifacts/sprint-status.yaml`: 6 epics, 39 stories backlog; 2 harmless heading warnings (document title, Epic List) | Done |
| 60 | Session handoff | Global handoff rule; `docs/HANDOFF.md` | User moves implementation to a new session on a cheaper model | U | Handoff doc + paste-ready prompt; not committed (no git repo yet, created in Story 1.1) | Done |
| 56 | Fix validation failures and re-validate | subagent + own coverage script | Fixes were prescriptive and kept scope | E: re-validation 5/5 pass; own script: 206 ids, only FR-16 (retired) and NFR31–35 (launch checklist) uncovered; 0 placeholders, 0 emails | 39 stories (E1 13, E2 3, E3 6, E4 10, E5 4, E6 3); UX-DR61 inline Artefact form replaced by an ID picker per AD-6 | Done |
| 61 | Model split and parallel lanes in handoff | Edit `docs/HANDOFF.md`; dependency order read from `epics.md` | User asked whether Haiku and parallel subagents work for implementation | U: "bole, sekalian update prompt"; E: epic list and story order in `epics.md` | HANDOFF: model table (Sonnet default, Haiku light work, Opus security stories + epic review) and parallel-lane plan (E1 → 2.1 → lanes A/B → E5 → E6) | Done |
| 62 | Install `motion-design` skill and add motion rule globally | git clone + manual review, copy to `~/.agents/skills`, symlink to `~/.claude/skills`; edit global rules, CLAUDE.md route, catalog, HANDOFF | User asked to add it for motion work | U: "tambahin ini dah sekalian masukin rules global"; E: repo @2e1f3c0, MIT, Markdown only, no scripts | Skill installed; precedence set: project motion tokens and antislop win over its generic rules (e.g. always add ambient motion); Creator MCP not installed (only for video/Lottie exports) | Done |
| 63 | Keep current stack (CSS + tokens, Mantine in dashboard only, Cloudflare D1/Access/Workers); Convex and Vercel rejected | Decision; Convex and Vercel docs read 2026-11-18 | User asked whether to add a UI framework, switch to Convex free plan, or host frontend on Vercel | U: "Tetap stack sekarang"; D: convex.dev/pricing (free: 1M calls, 0.5 GB DB, 1 GB files, 1 GB egress), vercel.com/docs/plans/hobby | No change to architecture or epics. Revisit Convex only if realtime co-editing is ever needed | Done |
| 64 | Model effort: medium for every story | Decision | User chose one effort level for simplicity | U: "gue ratain medium semua aje" | No effort table in HANDOFF; security stories still get Opus or an Opus review plus `security-review` | Done |
| 65 | Automatic Opus review via subagent | Edit `docs/HANDOFF.md` | User may not notice when to switch models by hand | U: "takutnya ga ngeh kalo harus manual"; D: Agent tool `model` parameter | Session stays Sonnet; security stories and epic reviews spawn an Opus review subagent before commit; stop if it cannot run | Done |
| 66 | Drop Haiku from the model plan | Edit `docs/HANDOFF.md` | One Sonnet session does all building; a Haiku subagent for light work would re-read the context and save little | U: "brarti haiku uda ga kepake ni?" | Model plan: Sonnet session + Opus review subagent only | Done |
| 67 | Story 1.1 built: Astro 7.4.12 + Cloudflare adapter scaffold, bilingual shell, tokens.css, headers/CSP, deny-by-default middleware, licence check, 10 node:test tests | bmad-build (inline, no subagents); wrangler dev + curl; npm run ci | User asked to start implementation at Story 1.1 | U: handoff prompt; E: epics.md Story 1.1, AD-1/AD-7/AD-11/AD-12/AD-17/AD-18; verified `npm run ci` passes, wrangler dev headers and 404/503 gates | Commit on feat/epic-1-read-the-publication; session opt-out and Astro 7 CSP hashing confirmed (see spec Implementation Notes); `/admin|/api|/media` catch-all 404 routes added so the Worker bundle exists; X-Robots-Tag still static (1.13 to toggle) | Done |
| 68 | Planning docs, `.claude/`, `_bmad/` and `_bmad-output/` kept untracked and git-ignored (docs/ untracked, not ignored) | git | Planning docs name the maintainer's first name; global rule says no real names in a public repo | ASSUMPTION: first name counts as a real name; user accepted only their git email and the GitHub handle (HANDOFF) | Baseline commit is `.gitignore` only; decision pending on scrubbing the name before publishing docs | Open |
| 69 | Review subagents skipped for 1.1 | bmad-build step 4 | User wants one cheap lane; 1.1 is not in the Opus-review list | U: handoff prompt | Self-review only; Opus code review runs at end of Epic 1 | Done |

## Open items

| Item | Basis | Status |
|---|---|---|
| Remaining `[ASSUMPTION]` tags in UX spines (routes, autosave delay ~2 s, motion timings, breakpoints, tablet rail) | A | Listed in EXPERIENCE.md Open Questions |
| Final copy, real content, privacy and consent wording | C needed | Gates public launch (PRD §6.3) |

## Planned skills per phase (implementation)

| Phase | Skills / tools | Basis |
|---|---|---|
| Architecture | `bmad-architecture`; Context7 for Astro, Cloudflare Pages/D1/R2/Access docs | U: BMAD rollout |
| Epics and stories | `bmad-create-epics-and-stories`, `bmad-sprint-planning` | U: BMAD rollout |
| Build | `bmad-build`, `frontend-design`, `antislop` core + parts, `unslop` per screen | U |
| Motion | GSAP, `emil-design-eng` | U |
| Layout, type, colour, UI detail | `better-layout`, `better-typography`, `better-colors`, `better-ui` | U |
| Copy ID/EN | `better-writing`, `design:ux-copy`, `antislop-copywriting` | U |
| Accessibility | `better-accessibility`, `fixing-accessibility`, `antislop-human` | U; PRD WCAG 2.2 AA |
| Metadata/SEO | `fixing-metadata` | PRD FR-8 |
| Review | `bmad-code-review` / `code-review`, `security-review` before commit (auth, uploads, personal data) | Global rules tier 3 |
| Deploy | Wrangler CLI, `gh` | U: GitHub + Cloudflare Pages |
