import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook } from '../../lib/db';
import { checkRateLimit, clientIp, RATE_LIMITS } from '../../lib/rate-limit';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const rows = listGuestbook();
    return new Response(JSON.stringify({ entries: rows }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'error';
    const status = message.startsWith('VALIDATION:') ? 400 : 500;
    // Never leak internal error details (paths, SQL) to clients.
    const safe = message.startsWith('VALIDATION:') ? message : 'internal error';
    return new Response(JSON.stringify({ error: safe }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const rl = checkRateLimit(
      `guestbook:${clientIp(request.headers)}`,
      RATE_LIMITS.guestbook.limit,
      RATE_LIMITS.guestbook.windowMs
    );
    if (!rl.ok) {
      return new Response(
        JSON.stringify({ error: 'RATE_LIMIT: too many requests, try again later' }),
        {
          status: 429,
          headers: {
            'content-type': 'application/json',
            'retry-after': String(rl.retryAfterSec),
          },
        }
      );
    }
    const body = await request.json();
    const row = insertGuestbook(body);
    return new Response(JSON.stringify(row), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'error';
    const status = message.startsWith('VALIDATION:') ? 400 : 500;
    // Never leak internal error details (paths, SQL) to clients.
    const safe = message.startsWith('VALIDATION:') ? message : 'internal error';
    return new Response(JSON.stringify({ error: safe }), {
      status,
      headers: { 'content-type': 'application/json' },
    });
  }
};
