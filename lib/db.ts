import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const url = process.env.DATABASE_URL || 'file:./data/meet.db';
const isFile = url.startsWith('file:');
const path = isFile ? url.replace(/^file:/, '') : ':memory:';

if (isFile) mkdirSync(dirname(path), { recursive: true });

const sqlite = new Database(path);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    code         TEXT PRIMARY KEY,
    created_at   INTEGER NOT NULL,
    created_by   TEXT,
    title        TEXT,
    ended_at     INTEGER,
    summary      TEXT,
    transcript   TEXT
  );

  CREATE TABLE IF NOT EXISTS participants (
    room_code    TEXT NOT NULL REFERENCES rooms(code) ON DELETE CASCADE,
    user_id      TEXT NOT NULL,
    name         TEXT NOT NULL,
    joined_at    INTEGER NOT NULL,
    left_at      INTEGER,
    PRIMARY KEY (room_code, user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_rooms_created ON rooms(created_at DESC);
`);

export const db = {
  rooms: {
    create(code: string, title: string | null, createdBy: string | null) {
      sqlite
        .prepare('INSERT INTO rooms (code, created_at, created_by, title) VALUES (?, ?, ?, ?)')
        .run(code, Date.now(), createdBy, title);
    },
    get(code: string) {
      return sqlite.prepare('SELECT * FROM rooms WHERE code = ?').get(code) as
        | { code: string; created_at: number; title: string | null; ended_at: number | null; summary: string | null; transcript: string | null }
        | undefined;
    },
    end(code: string, summary: string | null, transcript: string | null) {
      sqlite
        .prepare('UPDATE rooms SET ended_at = ?, summary = ?, transcript = ? WHERE code = ?')
        .run(Date.now(), summary, transcript, code);
    },
  },
  participants: {
    join(code: string, userId: string, name: string) {
      sqlite
        .prepare('INSERT OR REPLACE INTO participants (room_code, user_id, name, joined_at) VALUES (?, ?, ?, ?)')
        .run(code, userId, name, Date.now());
    },
    leave(code: string, userId: string) {
      sqlite.prepare('UPDATE participants SET left_at = ? WHERE room_code = ? AND user_id = ?').run(Date.now(), code, userId);
    },
    list(code: string) {
      return sqlite.prepare('SELECT * FROM participants WHERE room_code = ? ORDER BY joined_at').all(code);
    },
  },
};
