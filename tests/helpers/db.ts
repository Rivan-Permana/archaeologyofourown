import { readdirSync, readFileSync } from 'node:fs';
import { getPlatformProxy } from 'wrangler';
import { createDb } from '../../src/server/db/client.ts';

const DIR = 'src/server/db/migrations';

/** In-memory D1 and R2 with the real migrations applied. Call dispose() when done. */
export async function testEnv() {
  const proxy = await getPlatformProxy<{ DB: D1Database; MEDIA: R2Bucket }>({ persist: false });
  for (const file of readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort()) {
    const sql = readFileSync(`${DIR}/${file}`, 'utf8').split('--> statement-breakpoint');
    for (const stmt of sql) if (stmt.trim()) await proxy.env.DB.prepare(stmt).run();
  }
  return { db: createDb(proxy.env.DB), d1: proxy.env.DB, bucket: proxy.env.MEDIA, dispose: () => proxy.dispose() };
}
