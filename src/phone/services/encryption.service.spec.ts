import crypto from 'crypto';
import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
    let encryptionService: EncryptionService;
    let randomBytesSpy: jest.SpyInstance;
    let cipherSpy: jest.SpyInstance;
    let decipherSpy: jest.SpyInstance;

    beforeEach(() => {
        // Mock crypto.randomBytes to return consistent key and IV for testing
        randomBytesSpy = jest.spyOn(crypto, 'randomBytes').mockImplementation((size: number) => {
            return Buffer.alloc(size, 'a');  // Consistent value for testing
        });

        encryptionService = new EncryptionService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('encryptPhoneNumber', () => {
        it('should correctly encrypt a phone number', () => {
            const phoneNumber = '+1234567890';
            const encrypted = encryptionService.encryptPhoneNumber(phoneNumber);

            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');
            expect(encrypted).not.toEqual(phoneNumber);  // Should not be plaintext
        });

        it('should encrypt consistently with the same key and IV', () => {
            const phoneNumber = '+1234567890';
            const encrypted1 = encryptionService.encryptPhoneNumber(phoneNumber);
            const encrypted2 = encryptionService.encryptPhoneNumber(phoneNumber);

            expect(encrypted1).toEqual(encrypted2);  // Consistent encryption
        });

        it('should produce different outputs for different phone numbers', () => {
            const phoneNumber1 = '+1234567890';
            const phoneNumber2 = '+0987654321';

            const encrypted1 = encryptionService.encryptPhoneNumber(phoneNumber1);
            const encrypted2 = encryptionService.encryptPhoneNumber(phoneNumber2);

            expect(encrypted1).not.toEqual(encrypted2);  // Different inputs produce different outputs
        });

        it('should handle empty strings gracefully', () => {
            const phoneNumber = '';
            const encrypted = encryptionService.encryptPhoneNumber(phoneNumber);

            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');
        });

        it('should handle special characters in phone number', () => {
            const phoneNumber = '+1-234-567-8900';
            const encrypted = encryptionService.encryptPhoneNumber(phoneNumber);

            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');
        });
    });

    describe('decryptPhoneNumber', () => {
        it('should correctly decrypt an encrypted phone number', () => {
            const phoneNumber = '+1234567890';
            const encrypted = encryptionService.encryptPhoneNumber(phoneNumber);
            const decrypted = encryptionService.decryptPhoneNumber(encrypted);

            expect(decrypted).toBe(phoneNumber);
        });

        it('should decrypt consistently with the same key and IV', () => {
            const phoneNumber = '+1234567890';
            const encrypted1 = encryptionService.encryptPhoneNumber(phoneNumber);
            const encrypted2 = encryptionService.encryptPhoneNumber(phoneNumber);

            const decrypted1 = encryptionService.decryptPhoneNumber(encrypted1);
            const decrypted2 = encryptionService.decryptPhoneNumber(encrypted2);

            expect(decrypted1).toEqual(decrypted2);
        });

        it('should handle empty strings gracefully', () => {
            const phoneNumber = '';
            const encrypted = encryptionService.encryptPhoneNumber(phoneNumber);
            const decrypted = encryptionService.decryptPhoneNumber(encrypted);

            expect(decrypted).toBe(phoneNumber);
        });

        it('should handle special characters in phone number', () => {
            const phoneNumber = '+1-234-567-8900';
            const encrypted = encryptionService.encryptPhoneNumber(phoneNumber);
            const decrypted = encryptionService.decryptPhoneNumber(encrypted);

            expect(decrypted).toBe(phoneNumber);
        });

        it('should throw an error for tampered encrypted data', () => {
            const tamperedData = 'abcdef1234567890';

            expect(() => {
                encryptionService.decryptPhoneNumber(tamperedData);
            }).toThrow();
        });
    });
});
