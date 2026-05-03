import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789';
const grp = customAlphabet(alphabet, 4);

export function newRoomCode(): string {
  return `${grp()}-${grp()}-${grp()}`;
}

export function isValidRoomCode(code: string): boolean {
  return /^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/.test(code);
}
