import {MaskingHandler, MaskingOptions} from "../services/masking.service";

export class RegexMaskingHandler extends MaskingHandler {
    handle(phoneNumber: string, options: MaskingOptions): Promise<string>  {
        if (options.regexMaskPattern) {
            return Promise.resolve(this.regexMask(phoneNumber, options.regexMaskPattern, options.maskChar || '*'));
        }
        return super.handle(phoneNumber, options);
    }

    private regexMask(phoneNumber: string, pattern: string, maskChar: string): string {
        const regex = new RegExp(pattern, 'g');
        return phoneNumber.replace(regex, match => maskChar.repeat(match.length));
    }
}
