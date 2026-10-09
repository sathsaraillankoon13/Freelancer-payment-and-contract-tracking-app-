import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import * as Crypto from 'expo-crypto';
const iterations = 600000;
export async function hashPassword(password: string, salt?: string) {
  salt = salt || bytesToHex(await Crypto.getRandomBytesAsync(16));
  const hash = bytesToHex(await pbkdf2Async(sha256, password, salt, { c: iterations, dkLen: 32, asyncTick: 10 }));
  return { passwordHash: hash, passwordSalt: salt };
}
export async function verifyPassword(password: string, account: { passwordHash?: string; passwordSalt?: string }) {
  if (!password || !account.passwordHash || !account.passwordSalt) return false;
  const { passwordHash } = await hashPassword(password, account.passwordSalt);
  let difference = passwordHash.length ^ account.passwordHash.length;
  for (let i = 0; i < passwordHash.length; i++) difference |= passwordHash.charCodeAt(i) ^ account.passwordHash.charCodeAt(i);
  return difference === 0;
}
