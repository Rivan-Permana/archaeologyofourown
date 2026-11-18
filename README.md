# Archaeology of Our Own

Bilingual (ID/EN) publication about the artefacts we live with. Astro 7 on one Cloudflare Worker (static assets), Workers Free plan.

```bash
nvm use            # Node 24.22.3
npm ci --ignore-scripts
npm run dev        # local dev
npm run ci         # license check, types, tests, build
```

Secrets are never committed. Copy `.dev.vars.example` to `.dev.vars` for local values.

`PUBLIC_LAUNCH` and `PUBLIC_SITE_URL` must come from the process environment (Workers Builds variables), not from a local `.env` file: the launch gate reads only the process environment.
