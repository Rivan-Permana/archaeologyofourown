import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createDb } from '../../server/db/client.ts';
import { getPublicMedia } from '../../server/services/media.ts';

export const prerender = false;

const notFound = () =>
  new Response(JSON.stringify({ ok: false, error: { code: 'not_found' } }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });

export const GET: APIRoute = async ({ params }) => {
  const file = await getPublicMedia(createDb(env.DB), env.MEDIA, params.key ?? '');
  if (!file) return notFound();
  return new Response(file.body, {
    headers: {
      'Content-Type': file.contentType,
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; img-src 'self'; sandbox",
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

// Any other method: same 404 as an unknown key.
export const ALL: APIRoute = notFound;
