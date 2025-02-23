import {MaskingHandler, MaskingOptions} from "../services/masking.service";

export class FallbackMaskingHandler extends MaskingHandler {
    handle(phoneNumber: string, options: MaskingOptions): Promise<string> {
        try {
            return super.handle(phoneNumber, options);
        } catch (error) {
            console.error('Primary masking failed, applying fallback strategy:', error);
            return Promise.resolve(this.defaultMasking(phoneNumber, 0, 2, '*'));
        }
    }

    private defaultMasking(phoneNumber: string, revealStart: number, revealEnd: number, maskChar: string): string {
        const start = phoneNumber.slice(0, revealStart);
        const masked = maskChar.repeat(phoneNumber.length - revealStart - revealEnd);
        const end = phoneNumber.slice(-revealEnd);
        return `${start}${masked}${end}`;
    }
}
