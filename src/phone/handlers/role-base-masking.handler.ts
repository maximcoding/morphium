import {MaskingHandler, MaskingOptions} from "../services/masking.service";

export class RoleBasedMaskingHandler extends MaskingHandler {

    handle(phoneNumber: string, options: MaskingOptions): Promise<string> {
        if (options.role) {
            return Promise.resolve(this.applyRoleBasedMasking(phoneNumber, options.role, options));
        }
        return super.handle(phoneNumber, options);
    }

    private applyRoleBasedMasking(phoneNumber: string, role: string, options: MaskingOptions): string {
        if (role === 'admin') {
            return phoneNumber;  // Admins see the full phone number
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
