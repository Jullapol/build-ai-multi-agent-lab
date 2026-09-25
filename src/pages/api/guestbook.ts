import type { APIRoute } from 'astro';
import { insertGuestbook, listGuestbook } from '../../lib/db';

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
