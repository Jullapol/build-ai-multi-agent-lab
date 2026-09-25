import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../src/lib/rate-limit';

describe('checkRateLimit (D-03 anti-spam)', () => {
  const WINDOW = 60_000;

  it('allows up to the limit within the window', () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i++) {
      const r = checkRateLimit('k1', 3, WINDOW, now);
      expect(r.ok).toBe(true);
    }
  });

  it('blocks beyond the limit and reports retry-after', () => {
    const now = 2_000_000;
    checkRateLimit('k2', 2, WINDOW, now);
    checkRateLimit('k2', 2, WINDOW, now);
    const blocked = checkRateLimit('k2', 2, WINDOW, now);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(WINDOW / 1000);
  });

  it('resets after the window passes', () => {
    const start = 3_000_000;
    checkRateLimit('k3', 1, WINDOW, start);
    const blocked = checkRateLimit('k3', 1, WINDOW, start + WINDOW - 1);
    expect(blocked.ok).toBe(false);
    const allowed = checkRateLimit('k3', 1, WINDOW, start + WINDOW + 1);
    expect(allowed.ok).toBe(true);
  });

  it('keys are isolated per endpoint/ip', () => {
    const now = 4_000_000;
    expect(checkRateLimit('a:1', 1, WINDOW, now).ok).toBe(true);
    expect(checkRateLimit('a:1', 1, WINDOW, now).ok).toBe(false);
    expect(checkRateLimit('a:2', 1, WINDOW, now).ok).toBe(true);
    expect(checkRateLimit('b:1', 1, WINDOW, now).ok).toBe(true);
  });
});