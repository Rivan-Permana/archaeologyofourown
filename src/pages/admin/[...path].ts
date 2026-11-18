import type { APIRoute } from 'astro';

// Backstop for the deny-by-default gate: any on-demand path no later story has claimed.
// The middleware answers first; this exists so the Worker bundle (and middleware) is built.
export const prerender = false;
export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, error: { code: 'not_found' } }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
