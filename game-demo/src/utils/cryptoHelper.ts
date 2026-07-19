import Dexie, { type Table } from 'dexie';

export class SecureVaultDB extends Dexie {
  evidence!: Table<{ id: string; encryptedData: string; iv: string }, string>;
  
  constructor() {
    super('EchoShieldVault');
    this.version(1).stores({
      evidence: 'id'
    });
  }
}
export const vaultDb = new SecureVaultDB();

export class CryptoVault {
  static async deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw", enc.encode(pin), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false, ["encrypt", "decrypt"]
    );
  }

  static async encryptData(data: any, key: CryptoKey): Promise<{ encrypted: string, iv: string }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(data))
    );
    return {
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
      iv: btoa(String.fromCharCode(...iv))
    };
  }
}
