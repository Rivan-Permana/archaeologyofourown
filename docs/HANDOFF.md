# Handoff — Archaeology of Our Own

State on 2026-11-18. Planning is complete; implementation has not started.

## What is true now

- **Planning (all final):**
  - PRD: `_bmad-output/planning-artifacts/prds/prd-archaeologyofourown-2026-11-17/prd.md` (+ `addendum.md`)
  - UX: `_bmad-output/planning-artifacts/ux-designs/ux-archaeologyofourown-2026-11-17/DESIGN.md`, `EXPERIENCE.md`, `mockups/`
  - Architecture: `_bmad-output/planning-artifacts/architecture/architecture-archaeologyofourown-2026-11-18/ARCHITECTURE-SPINE.md` (18 ADs) + `ARCHITECTURE-OVERVIEW.md` (non-technical, for the client)
  - Epics and stories: `_bmad-output/planning-artifacts/epics.md` (6 epics, 39 stories, final)
  - Sprint tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml` (all stories `backlog`)
- **Work log:** `docs/WORKLOG.md` (items 1–60). Every action, skill used and its basis.
- **Superseded, do not use:** `docs/PRD.md`, `docs/DESIGN.md`.
- **Tooling installed:** BMAD 6.12.4 (`_bmad/`, `.claude/skills/bmad-*`), REA, `antislop*` + `unslop` skills (global), Node 24.22.3 as nvm default (Herd nvm).
- **Not yet done:** no git repo, no GitHub repo, no Cloudflare resources, no code.

## Where to start

Story **1.1 Project scaffold and bilingual shell on workers.dev** in `epics.md`, via `bmad-build`. Then follow `sprint-status.yaml` in order.

Before 1.1 can deploy, the user must:
1. Run `npx wrangler login` (browser login; the agent cannot do it).
2. Set the account `workers.dev` subdomain to a neutral name (e.g. `archaeologyofourown`) in the Cloudflare dashboard.

## Binding rules for implementation

- **Architecture ADs win.** Read the AD ids cited in each story's "Covers:" line before coding.
- **Workers Free plan.** No Pages. Photos upload directly to R2 via presigned URLs (AD-13). Hourly limits in a Durable Object (AD-9).
- **No AI slop.** Load `antislop` (+ `-ui`, `-copywriting`, `-layoutmobile`, `-human`) for any UI or copy, and run `unslop` on every rendered screen before showing it. Motion: GSAP, decided with `motion-design` + `emil-design-eng` (UX motion tokens and antislop win over the skill's generic tables; reduced-motion fallback always). Layout, type, colour: `better-*`. Copy (ID/EN): `better-writing`, `design:ux-copy`. Accessibility: `fixing-accessibility`. Tokens only from UX `DESIGN.md` (AD-12).
- **Log every action** in `docs/WORKLOG.md` (what, skill/tool, why, basis, result, status). Inferences are marked `ASSUMPTION`.
- **Privacy.** The repo will be public. No personal emails, real names or secrets anywhere (code, fixtures, docs, logs). Fixtures use `contoh.id` and pseudonyms. Editor emails live only in the Cloudflare Access policy and the `EDITOR_EMAILS` secret.
- **Git.** Public repo `Rivan-Permana/archaeologyofourown`; work on a feature branch, never commit to `main` directly. The user accepted that their configured git email appears in commit history. No AI attribution lines in commits or PRs.
- **Ask before:** creating the GitHub repo, any Cloudflare resource that costs money, buying the domain, deleting data.

## Model guidance (user wants to save cost)

| Work | Model | Why |
|---|---|---|
| Most stories: scaffold, public pages, forms, dashboard CRUD | Sonnet | Stories carry exact ACs, AD references and file ownership; the stack (Astro 7, Cloudflare bindings, BlockNote 0.57) is too new for a small model to guess right |
| Security-sensitive stories **1.5** (snapshot auth, deny-by-default), **2.2** (rate limiter), **3.2 / 3.3** (presigned uploads, content checks), **4.1** (Access JWT, CSRF), **4.5** (media pipeline, GPS check), **6.3** (deletion on request) | Sonnet builds; an Opus subagent reviews before commit (automatic, see below) | Mistakes leak personal data |
| End-of-epic review | Opus subagent with `bmad-code-review` or `code-review` | Final check the user asked to keep on the stronger model |

**Automatic model switch (no manual toggle needed).** The session stays on Sonnet. For a security-sensitive story, and at the end of each epic, the session itself spawns a review subagent with the Agent tool's `model: "opus"` (agent type `agent-skills:security-auditor` for the security stories, `agent-skills:code-reviewer` for epic reviews), passing the story id, its AD ids and the diff. Findings are fixed and re-reviewed before commit. If the subagent cannot run, stop and tell the user before committing; never commit those stories unreviewed. Effort stays medium (WORKLOG 64).

## Parallel work

Parallel lanes save wall-clock time, not tokens: every subagent or session re-reads the PRD, architecture and story from zero. When cost matters, run one lane in order.

If the user wants speed, the dependency order allows this (from `epics.md`):

```
E1 (1.1 → 1.13, in order) → 2.1 ─┬─ Lane A: 2.2 → 2.3 → E3 (3.1 → 3.6)
                                 └─ Lane B: E4 (4.1 → 4.10)
                     merge both → E5 (5.1 → 5.4) → E6 (6.1 → 6.3)
```

- **E1 stays serial.** It creates the scaffold, D1 schema, tokens, `wrangler.jsonc` and the snapshot path that everything else uses.
- **2.1 runs before the split.** It creates `activity_log` and the public write guard chain, which both lanes use.
- **One lane per git worktree and branch** (`using-git-worktrees`), merged into the feature branch after each lane finishes. At most 2 lanes.
- **Shared files have one owner at a time:** `migrations/` (take the next migration number when merging, renumber if both lanes added one), `wrangler.jsonc` (2.2 adds the Durable Object, 4.1 adds Access settings), env types, `tokens.css`. Resolve conflicts at merge, never by two agents editing the same file at once.
- **E5 needs both lanes** (Contributions from E3, dashboard and media pipeline from E4). **E6 needs E2–E5.**
- **Always safe in parallel:** read-only reviews as subagents (code review, `security-review`, accessibility check) after a story is built.

## Open items for the client (not blocking the build)

1. Approve privacy note and consent wording (1 h keyed IP hash, 7-day backups, caps).
2. Real content for the launch gate: 4 Articles (one per series, ID + EN), 6 Artefacts, manifesto line.
3. Contact channel offered when Turnstile fails.
4. Social accounts for the footer.
5. When to buy `archaeologyofourown.com`.
