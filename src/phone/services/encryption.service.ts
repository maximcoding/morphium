import crypto from "crypto";

export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key = crypto.randomBytes(32);  // 32 bytes key for AES-256
    private readonly iv = crypto.randomBytes(16);   // 16 bytes IV for AES

    // Method to encrypt the phone number
    encryptPhoneNumber(phoneNumber: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        let encrypted = cipher.update(phoneNumber, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    // Optional: Method to decrypt the phone number (if required)
    decryptPhoneNumber(encryptedPhoneNumber: string): string {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        let decrypted = decipher.update(encryptedPhoneNumber, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}
