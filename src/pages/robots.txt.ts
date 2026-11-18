import type { APIRoute } from 'astro';

// AR48: disallow everything until PUBLIC_LAUNCH=true.
export const GET: APIRoute = () => {
  const launched = import.meta.env.PUBLIC_LAUNCH === 'true';
  const body = launched ? 'User-agent: *\nAllow: /\n' : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
