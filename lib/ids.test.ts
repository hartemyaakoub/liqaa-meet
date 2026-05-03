import { describe, expect, it } from 'vitest';
import { isValidRoomCode, newRoomCode } from './ids';

describe('newRoomCode', () => {
  it('matches the canonical 4-4-4 lowercase pattern', () => {
    for (let i = 0; i < 200; i++) {
      const code = newRoomCode();
      expect(code).toMatch(/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/);
    }
  });

  it('avoids ambiguous characters that read like each other', () => {
    const banned = ['0', 'o', 'l', '1'];
    for (let i = 0; i < 500; i++) {
      const code = newRoomCode().replace(/-/g, '');
      for (const ch of banned) expect(code).not.toContain(ch);
    }
  });

  it('produces different codes on consecutive calls (probabilistically)', () => {
    const codes = new Set<string>();
    for (let i = 0; i < 1000; i++) codes.add(newRoomCode());
    // Birthday-paradox tolerance: at 1000 samples in a 32^12 space we expect zero collisions.
    expect(codes.size).toBe(1000);
  });
});

describe('isValidRoomCode', () => {
  it('accepts well-formed codes', () => {
    expect(isValidRoomCode('abcd-efgh-ijkm')).toBe(true);
    expect(isValidRoomCode('2345-6789-pqrs')).toBe(true);
  });

  it('rejects malformed codes', () => {
    expect(isValidRoomCode('')).toBe(false);
    expect(isValidRoomCode('abc-def-ghi')).toBe(false);
    expect(isValidRoomCode('abcd-efgh')).toBe(false);
    expect(isValidRoomCode('abcd-efgh-ijklm')).toBe(false);
    expect(isValidRoomCode('ABCD-EFGH-IJKM')).toBe(false);
    expect(isValidRoomCode('abcd_efgh_ijkm')).toBe(false);
    expect(isValidRoomCode("abcd-efgh-ijkm; DROP TABLE rooms")).toBe(false);
  });

  it('round-trips with newRoomCode', () => {
    for (let i = 0; i < 50; i++) expect(isValidRoomCode(newRoomCode())).toBe(true);
  });
});
