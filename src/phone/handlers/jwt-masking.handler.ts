import {jwtDecode} from "jwt-decode";
import {MaskingHandler, MaskingOptions} from "../services/masking.service";

export class JWTMaskingHandler extends MaskingHandler {
    handle(phoneNumber: string, options: MaskingOptions): Promise<string> {
        if (options.role && options.token) {
            const decodedToken = this.verifyAndDecodeToken(options.token);
            if (!decodedToken) {
                throw new Error('Invalid token');
            }
            return Promise.resolve(this.applyRoleBasedMasking(phoneNumber, decodedToken.role, options));
        }
        return super.handle(phoneNumber, options);
    }

    private verifyAndDecodeToken(token: string): any {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('JWT token verification failed', error);
            return null;
        }
    }

    private applyRoleBasedMasking(phoneNumber: string, role: string, options: MaskingOptions): string {
        if (role === 'admin') {
            return phoneNumber;
        }
        return this.defaultMasking(phoneNumber, options.revealStartDigits || 0, options.revealEndDigits || 4, options.maskChar || '*');
    }

    private defaultMasking(phoneNumber: string, revealStart: number, revealEnd: number, maskChar: string): string {
        const start = phoneNumber.slice(0, revealStart);
        const masked = maskChar.repeat(phoneNumber.length - revealStart - revealEnd);
        const end = phoneNumber.slice(-revealEnd);
        return `${start}${masked}${end}`;
    }
}
