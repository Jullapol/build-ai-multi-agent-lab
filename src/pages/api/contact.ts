import type { APIRoute } from 'astro';
import { insertContact } from '../../lib/db';
import { checkRateLimit, clientIp, RATE_LIMITS } from '../../lib/rate-limit';

export const prerender = false;

/**
 * POST /api/contact
 * Validate JSON {name,email,message}, persist with insertContact, return 201.
 * Rate limited per client IP (D-03).
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const rl = checkRateLimit(
      `contact:${clientIp(request.headers)}`,
      RATE_LIMITS.contact.limit,
      RATE_LIMITS.contact.windowMs
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
    // Honeypot (D-05): bots fill every field. Non-empty hidden "website" -> silent 201, nothing stored.
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      });
    }
    const row = insertContact(body);
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
