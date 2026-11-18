import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { authConfigured, classify, type AuthEnv } from './server/auth/gate.ts';
import { securityHeaders } from './shared/headers.ts';

const launched = import.meta.env.PUBLIC_LAUNCH === 'true';

function deny(status: number, code: string): Response {
  return new Response(JSON.stringify({ ok: false, error: { code } }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Prerendered pages are built once and served as static assets; the gate is for on-demand paths.
  if (context.isPrerendered) return next();
  const decision = classify(new URL(context.request.url).pathname);
  let response: Response;
  if (decision === 'deny') {
    response = deny(404, 'not_found');
  } else if (decision === 'protected') {
    // Fail closed: Access JWT verification lands in Story 4.1.
    response = deny(authConfigured(env as AuthEnv) ? 401 : 503, 'unauthorized');
  } else {
    response = await next();
  }
  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(securityHeaders(launched))) {
    if (!out.headers.has(k)) out.headers.set(k, v);
  }
  return out;
});
