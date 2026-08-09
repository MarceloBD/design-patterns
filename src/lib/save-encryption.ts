const ENCRYPTION_ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;
const EXPORT_SIGNATURE = "PQ_ENC_V2";

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: ENCRYPTION_ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

function getDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width.toString(),
    screen.height.toString(),
    new Date().getTimezoneOffset().toString(),
  ];
  return components.join("|");
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptSaveData(plaintext: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const password = getDeviceFingerprint() + "_pattern_quest_2026";

  const key = await deriveKey(password, salt);
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    encoder.encode(plaintext)
  );

  const payload = new Uint8Array(SALT_LENGTH + IV_LENGTH + encrypted.byteLength);
  payload.set(salt, 0);
  payload.set(iv, SALT_LENGTH);
  payload.set(new Uint8Array(encrypted), SALT_LENGTH + IV_LENGTH);

  return EXPORT_SIGNATURE + "." + arrayBufferToBase64(payload.buffer);
}

export async function decryptSaveData(encryptedString: string): Promise<string> {
  if (!encryptedString.startsWith(EXPORT_SIGNATURE + ".")) {
    throw new Error("Invalid save format");
  }

  const base64Data = encryptedString.slice(EXPORT_SIGNATURE.length + 1);
  const payload = new Uint8Array(base64ToArrayBuffer(base64Data));

  const salt = payload.slice(0, SALT_LENGTH);
  const iv = payload.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = payload.slice(SALT_LENGTH + IV_LENGTH);

  const password = getDeviceFingerprint() + "_pattern_quest_2026";
  const key = await deriveKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGORITHM, iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

export function isEncryptedFormat(data: string): boolean {
  return data.startsWith(EXPORT_SIGNATURE + ".");
}

export function isLegacyJsonFormat(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    return parsed.version && parsed.data;
  } catch {
    return false;
  }
}
