import crypto, { BinaryLike, CipherGCMTypes, CipherKey } from 'crypto';
export class EncryptionService {
  private algorithm: string;
  private key: Buffer;
  constructor() {
    this.algorithm = 'aes-256-cbc'; // Load key from environment variable and ensure it's 32 bytes long
    // this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
    // Load key from environment variable
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY is not defined in environment variables.');
    }
    // Convert the key from hex string to a Buffer
    this.key = Buffer.from(encryptionKey, 'hex');
    if (this.key.length !== 32) {
      throw new Error('Invalid key length. The key must be 32 bytes long.');
    } // Load IV from environment variable and ensure it's 16 bytes long
  }
  // Encrypt data
  public encrypt(text: string): string {
    // Generate a New IV for Each Encryption
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm as CipherGCMTypes, this.key as unknown as CipherKey, iv as unknown as BinaryLike);
    let encrypted = cipher.update(text);
    // @ts-ignore
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }
  // Decrypt data
  public decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm as CipherGCMTypes, this.key as unknown as CipherKey, iv as unknown as BinaryLike);
    // @ts-ignore
    let decrypted = decipher.update(encryptedText);
    // @ts-ignore
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
