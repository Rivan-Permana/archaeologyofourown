import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createDb } from '../../../server/db/client.ts';
import { handle, json } from '../../../server/http.ts';
import { buildSnapshot } from '../../../server/services/snapshot.ts';

export const prerender = false;

// Reached only after the middleware verified a service-token JWT (AD-2, AD-7).
export const GET: APIRoute = () =>
  handle('build_snapshot', async () => {
    const res = json({ ok: true, data: await buildSnapshot(createDb(env.DB)) });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  });
