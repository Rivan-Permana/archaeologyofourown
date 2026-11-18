import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { classify } from './server/auth/gate.ts';
import { verifyAccess, type AccessEnv } from './server/auth/access.ts';
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
  const { pathname } = new URL(context.request.url);
  const decision = classify(pathname);
  let response: Response;
  if (decision === 'deny') {
    response = deny(404, 'not_found');
  } else if (decision === 'protected') {
    const scope = pathname.startsWith('/api/build/') ? 'service' : 'editor';
    const result = await verifyAccess(context.request, env as AccessEnv, scope);
    if (result.ok) {
      context.locals.identity = result.identity;
      response = await next();
    } else {
      response = deny(401, result.code);
    }
  } else {
    response = await next();
  }
  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(securityHeaders(launched))) {
    if (!out.headers.has(k)) out.headers.set(k, v);
  }
  return out;
});
