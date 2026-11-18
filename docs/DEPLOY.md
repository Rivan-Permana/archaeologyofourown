# Deploy runbook: first deploy to workers.dev

State on 2026-11-18. Epic 1 is built and reviewed on branch `feat/epic-1-read-the-publication`. Nothing has been pushed or created yet.

## Verified without touching anything remote

- `npm run ci` passes (licence, contrast, types, 52 tests, local snapshot, build, leak check).
- `npx wrangler deploy --dry-run` passes: 13 modules, 595 KiB bundle (207 KiB gzip upload, Workers Free limit is 3 MiB), bindings `DB` (D1), `MEDIA` (R2), `ASSETS`.
- Repo scan before publishing: no email other than `contoh.id` fixtures, no token-like strings, only `.dev.vars.example` (names only) tracked, ignored: `.dev.vars*`, `.env*`, `.claude/`, `_bmad/`, generated snapshot files.
- Local `main` branch now points at the baseline commit (`.gitignore` only) so the feature branch can be reviewed as a pull request. No commit was made on `main`.

## Step 0: you do these (an agent cannot)

1. `npx wrangler login` in an interactive terminal (the saved token has expired; `wrangler whoami` says "Not logged in").
2. Cloudflare dashboard, Workers and Pages, set the account `workers.dev` subdomain to a neutral name (`our-own`, so the address reads `archaeology-of.our-own.workers.dev`). It must not contain a personal email or name (NFR25). The site address will then be `https://archaeology-of.<subdomain>.workers.dev`.
3. Cloudflare R2 may ask for a payment method before it can be enabled, even for the free allowance (10 GB). Enabling it is your decision; nothing in v1 should exceed the free tier.

## Step 1: approvals needed (each is outward-facing or creates a resource)

| # | Action | What it creates | Reversible |
|---|---|---|---|
| A | Create the public GitHub repo `Rivan-Permana/archaeologyofourown` and push `main` and the feature branch | Public repo with full history, including the commit author identity | Repo can be deleted; pushed history may already be copied |
| B | Create D1 `archaeologyofourown` and R2 bucket `archaeologyofourown-media`, apply migrations | Two Cloudflare resources, free tier | Yes, delete both |
| C | First deploy of Worker `archaeology-of` | Worker at the workers.dev address, public but `noindex` | `wrangler delete` |

## Step 2: commands after approval (run in order)

```bash
# A. GitHub
gh repo create Rivan-Permana/archaeologyofourown --public --source=. --remote=origin
git push -u origin main feat/epic-1-read-the-publication
gh pr create --base main --head feat/epic-1-read-the-publication --title "Epic 1: read the bilingual publication"

# B. Cloudflare resources (after wrangler login)
npx wrangler d1 create archaeologyofourown          # prints database_id: add it to wrangler.jsonc (ids are not secrets)
npx wrangler r2 bucket create archaeologyofourown-media
npx wrangler d1 migrations apply DB --remote        # maintainer step before merge (PR checkbox)

# C. First deploy, built on this machine with the Placeholder fixtures
export PUBLIC_SITE_URL=https://archaeology-of.<subdomain>.workers.dev
npm run snapshot -- --local && npm run build        # gate keeps the site noindex
npx wrangler deploy
```

Checks after deploy (no secrets involved):

```bash
curl -sI $PUBLIC_SITE_URL/ | grep -iE "^HTTP|x-robots|content-security|strict-transport"   # 200, noindex header, HSTS
curl -s  $PUBLIC_SITE_URL/robots.txt                                                      # Disallow: /
curl -s -o /dev/null -w "%{http_code}\n" $PUBLIC_SITE_URL/api/build/snapshot              # 401 (fails closed, no Access yet)
curl -s -o /dev/null -w "%{http_code}\n" $PUBLIC_SITE_URL/admin/x                         # 401
curl -s -o /dev/null -w "%{http_code}\n" $PUBLIC_SITE_URL/media/nope.webp                 # 404
```

Rollback: `npx wrangler rollback` (previous version) or `npx wrangler delete` (remove the Worker).

## Known limits of this first deploy

- The remote D1 is empty. The pages carry the Placeholder fixtures only because they were built locally. `/media/*` returns 404 for them (the fixtures are flat surface slots, so the home and articles still render), and the default Open Graph image is a static file.
- `scripts/seed.ts` writes local resources only, by design (AD-4). The remote database gets real content from the Editor Dashboard in Epic 4.
- Do not connect Workers Builds to `main` yet. It builds with `npm run build:ci`, which fetches the remote snapshot. With an empty remote database that would replace the fixture site with empty sections. Connect it once the Dashboard and Access exist (Epic 4), with:
  - build command `npm run build:ci`, deploy command `npx wrangler deploy`, branch `main` only, no preview builds;
  - build variables `PUBLIC_SITE_URL`, `PUBLIC_LAUNCH` (leave unset), `SNAPSHOT_URL`, `BUILD_ACCESS_CLIENT_ID`, `BUILD_ACCESS_CLIENT_SECRET`, optional `PUBLIC_CF_BEACON_TOKEN`;
  - Worker secrets (later stories): `ACCESS_AUD`, `ACCESS_TEAM_DOMAIN`, `EDITOR_EMAILS`, `BUILD_SERVICE_TOKEN_ID`, plus those listed in `.dev.vars.example`. Editor emails only go in the Access policy and the `EDITOR_EMAILS` secret.
- Cloudflare Web Analytics needs a site token; until `PUBLIC_CF_BEACON_TOKEN` is set no beacon is rendered.
- No `LICENSE` file is in the repo yet. Decide before the repo goes public (GSAP stays under its own free licence either way).

## Launch gate (not part of this deploy)

`PUBLIC_LAUNCH=true` fails the build while any of these remain: Placeholder articles, artefacts or media (currently 21 records: 7 articles, 3 artefacts and 11 media), copy pending client approval (`privacy`, `masthead.manifesto`), or a `PUBLIC_SITE_URL` that is missing or local. Client items: 4 real Articles in ID and EN, 6 real Artefacts, manifesto, approved privacy and consent wording, a contact channel for deletion requests, logo or favicon, Open Graph image.
