import { describe, it, expect } from 'vitest';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * D-04 server-side sanitization — control chars must not reach SQLite.
 */
describe('db sanitize (D-04)', () => {
  const dataDir = join(process.cwd(), 'data', 'vitest-hardening');

  it('insertContact strips control characters from text fields', async () => {
    process.env.DATA_DIR = dataDir;
    rmSync(dataDir, { recursive: true, force: true });
    mkdirSync(dataDir, { recursive: true });
    const { insertContact } = await import('../src/lib/db');
    const row = insertContact({
      name: 'A\u0000d\u0007a',
      email: 'ada@example.com',
      message: 'line1\nline2\u001B[31m',
    });
    expect(row.name).toBe('Ada');
    expect(row.message).toBe('line1\nline2[31m'); // \n kept, ESC stripped
  });

  it('insertContact rejects email containing control characters', async () => {
    const { insertContact } = await import('../src/lib/db');
    expect(() =>
      insertContact({
        name: 'Ada',
        email: 'ada\u0000@example.com',
        message: 'hi',
      })
    ).toThrowError(/VALIDATION: email format is invalid/);
  });
});