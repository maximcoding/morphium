import {MaskingOptions, MaskingService} from "./phone/services/masking.service";

export class MorphiumService {
    private maskingService = new MaskingService();

    /**
     * Formats and masks a phone number based on the provided options.
     * @param phoneNumber The raw phone number to be masked.
     * @param options MaskingOptions for customizing how the phone number is masked.
     * @returns Masked phone number.
     */
    async transformPhoneNumber(phoneNumber: string, options: MaskingOptions): Promise<string> {
        // Use the MaskingService to apply transformations
        return await this.maskingService.maskPhoneNumber(phoneNumber, options);
    }
    /**
     * Uses AI to determine sensitivity and mask the phone number accordingly.
     * @param phoneNumber The raw phone number to be masked.
     * @param options MaskingOptions for customizing how the phone number is masked.
     * @returns Masked phone number based on AI-driven sensitivity.
     */
    async transformPhoneNumberWithAI(phoneNumber: string, options: MaskingOptions): Promise<string> {
        return await this.maskingService.maskPhoneNumberWithAI(phoneNumber, options);
    }
}

