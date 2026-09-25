/**
 * SQLite helpers for contact + guestbook. Lab 05 (OpenCode): persistence implemented.
 */
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export type GuestbookEntry = {
  id: number;
  name: string;
  message: string;
  created_at: string;
};

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dir = process.env.DATA_DIR || join(process.cwd(), 'data');
  mkdirSync(dir, { recursive: true });
  db = new Database(join(dir, 'site.sqlite'));
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  return db;
}

/** Lab 05: validate + insert. Throws Error('VALIDATION: …') on bad input. */
export function insertContact(input: {
  name: string;
  email: string;
  message: string;
}): ContactMessage {
  const name = requireText(input?.name, 'name', 1, 100);
  const email = requireEmail(input?.email);
  const message = requireText(input?.message, 'message', 1, 2000);

  const database = getDb();
  const info = database
    .prepare(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)'
    )
    .run(name, email, message);

  const id = Number(info.lastInsertRowid);
  const row = database
    .prepare(
      'SELECT id, name, email, message, created_at FROM contact_messages WHERE id = ?'
    )
    .get(id) as ContactMessage;
  return row;
}

/** Lab 05: list guestbook entries, newest first. */
export function listGuestbook(): GuestbookEntry[] {
  const database = getDb();
  return database
    .prepare(
      'SELECT id, name, message, created_at FROM guestbook ORDER BY id DESC'
    )
    .all() as GuestbookEntry[];
}

/** Lab 05: validate + insert guestbook entry. Throws Error('VALIDATION: …'). */
export function insertGuestbook(input: {
  name: string;
  message: string;
}): GuestbookEntry {
  const name = requireText(input?.name, 'name', 1, 100);
  const message = requireText(input?.message, 'message', 1, 1000);

  const database = getDb();
  const info = database
    .prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)').run(
      name,
      message
    );

  const id = Number(info.lastInsertRowid);
  const row = database
    .prepare(
      'SELECT id, name, message, created_at FROM guestbook WHERE id = ?'
    )
    .get(id) as GuestbookEntry;
  return row;
}

/* --- validation helpers (error text is safe to surface to clients) --- */

function requireText(
  value: unknown,
  field: string,
  min: number,
  max: number
): string {
  if (typeof value !== 'string') {
    throw new Error(`VALIDATION: ${field} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    throw new Error(`VALIDATION: ${field} must be ${min}-${max} characters`);
  }
  return trimmed;
}

function requireEmail(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('VALIDATION: email must be a string');
  }
  const email = value.trim();
  if (email.length === 0 || email.length > 254) {
    throw new Error('VALIDATION: email must be 1-254 characters');
  }
  // Basic shape check — deliberately permissive (no exhaustive RFC 5322).
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('VALIDATION: email format is invalid');
  }
  return email;
}
