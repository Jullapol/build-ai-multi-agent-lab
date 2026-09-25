/**
 * In-memory per-IP rate limiter (fixed-window buckets).
 * D-03 (docs/DECISIONS.md): backend anti-spam for public POST endpoints.
 *
 * Scope note: single-process only (Astro node adapter, one instance).
 * A multi-instance deployment would need a shared store (e.g. Redis) — out of scope.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Hard cap so a flood of unique keys cannot grow memory unbounded. */
const MAX_BUCKETS = 10_000;

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): { ok: boolean; retryAfterSec: number } {
  // Opportunistic sweep of expired buckets when the map gets large.
  if (buckets.size >= MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
    if (buckets.size >= MAX_BUCKETS) {
      // Still full of live entries — drop the oldest-inserted to stay bounded.
      const first = buckets.keys().next().value;
      if (first !== undefined) buckets.delete(first);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (bucket.count < limit) {
    bucket.count++;
    return { ok: true, retryAfterSec: 0 };
  }
  return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
}

/** Best-effort client IP behind a reverse proxy (x-forwarded-for) or direct. */
export function clientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return headers.get('x-real-ip') ?? 'unknown';
}

/** Endpoint policies (per client IP). */
export const RATE_LIMITS = {
  contact: { limit: 3, windowMs: 10 * 60 * 1000 },
  guestbook: { limit: 5, windowMs: 10 * 60 * 1000 },
} as const;