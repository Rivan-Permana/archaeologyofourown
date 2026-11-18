// One pick per Asia/Jakarta calendar day, shared by the build and the browser (AD-16, AR45).
// Jakarta has no daylight saving time, so UTC+7 is exact.
export const jakartaDate = (now: Date): string => new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);

// FNV-1a: small, stable across engines, no dependency.
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** Same ids and same date always give the same id. `date` is `YYYY-MM-DD` in Asia/Jakarta. */
export function pickDaily(poolIds: string[], date: string): string | undefined {
  if (!poolIds.length) return undefined;
  const sorted = [...poolIds].sort();
  return sorted[hash(date) % sorted.length];
}
