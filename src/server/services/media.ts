import { eq } from 'drizzle-orm';
import type { Db } from '../db/client.ts';
import { mediaAsset } from '../db/schema.ts';

// AR27: only this shape is ever served. `staging/...`, traversal and anything else fail the match.
export const MEDIA_KEY = /^([0-9a-f-]{36})(-w\d+)?\.(jpg|png|webp)$/;

export interface MediaFile { body: ReadableStream; contentType: string; filename: string }

/** Reads one object by exact key through its media_asset row; never lists the bucket. */
export async function getPublicMedia(db: Db, bucket: R2Bucket, key: string): Promise<MediaFile | null> {
  const m = MEDIA_KEY.exec(key);
  if (!m) return null;
  const [asset] = await db.select({ mime: mediaAsset.mime, status: mediaAsset.status }).from(mediaAsset).where(eq(mediaAsset.id, m[1])).limit(1);
  if (!asset || asset.status !== 'ready') return null;
  const object = await bucket.get(key);
  if (!object) return null;
  return { body: object.body, contentType: asset.mime, filename: key };
}
