const PBKDF2_ITERATIONS = 600000;
const SALT_BYTES = 32;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex: string): Uint8Array | null {
  const match = hex.match(/.{1,2}/g);
  if (!match) return null;
  return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return `${bytesToHex(salt)}:${bytesToHex(new Uint8Array(hash))}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [saltHex, originalHashHex] = parts;

  const salt = hexToBytes(saltHex);
  if (!salt) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const newHash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  if (bytesToHex(new Uint8Array(newHash)) === originalHashHex) return true;

  if (salt.length !== 16) return false;

  const oldHash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: 10000, hash: "SHA-256" },
    key,
    256
  );
  return bytesToHex(new Uint8Array(oldHash)) === originalHashHex;
}
