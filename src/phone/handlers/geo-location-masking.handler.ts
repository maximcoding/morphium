import {MaskingHandler, MaskingOptions} from "../services/masking.service";
import {GeoLocationService} from "../services/geo-location.service";

export class GeoLocationMaskingHandler extends MaskingHandler {
    private geoHandler = new GeoLocationService();

    /**
     * Handles masking based on geolocation information retrieved from the user's IP.
     * @param phoneNumber The phone number to be masked.
     * @param options Masking options including IP address.
     * @returns The masked phone number, or passes to the next handler in the chain.
     */
    async handle(phoneNumber: string, options: MaskingOptions): Promise<string> {
        if (!options.ip) {
            // If no IP is provided, continue with the next handler in the chain
            return super.handle(phoneNumber, options);
        }

        try {
            const geoData = await this.geoHandler.getGeolocationByIP(options.ip);

            // Get country code from geoData
            const countryCode = geoData?.country?.iso_code || 'Unknown';

            // Look up the masking rule for the country
            const maskingRule = globalMaskingRules[countryCode] || defaultMaskingRule;

            // Apply the masking rule based on the geolocation
            return this.applyMasking(phoneNumber, maskingRule);
        } catch (error) {
            console.error('Error retrieving geolocation data:', error);
            // If there's an error with geolocation, continue with the next handler
            return super.handle(phoneNumber, options);
        }
    }

    /**
     * Masking logic for geolocation-based masking.
     * @param phoneNumber The phone number to mask.
     * @param maskOptions Masking options specifying digits to reveal.
     * @returns The masked phone number.
     */
    private applyMasking(phoneNumber: string, maskOptions: {
        revealStartDigits: number,
        revealEndDigits: number
    }): string {
        const maskChar = '*';  // Default masking character
        const revealStart = maskOptions.revealStartDigits;
        const revealEnd = maskOptions.revealEndDigits;

        const start = phoneNumber.slice(0, revealStart);
        const masked = maskChar.repeat(phoneNumber.length - revealStart - revealEnd);
        const end = phoneNumber.slice(-revealEnd);

        return `${start}${masked}${end}`;
    }
}

// Define masking rules for different countries or regions
const globalMaskingRules: { [countryCode: string]: { revealStartDigits: number, revealEndDigits: number } } = {
    // North America
    'US': {revealStartDigits: 2, revealEndDigits: 4},  // United States
    'CA': {revealStartDigits: 2, revealEndDigits: 4},  // Canada
    'MX': {revealStartDigits: 2, revealEndDigits: 4},  // Mexico

    // Europe
    'GB': {revealStartDigits: 2, revealEndDigits: 4},  // United Kingdom
    'DE': {revealStartDigits: 0, revealEndDigits: 3},  // Germany
    'FR': {revealStartDigits: 2, revealEndDigits: 4},  // France
    'ES': {revealStartDigits: 2, revealEndDigits: 4},  // Spain
    'IT': {revealStartDigits: 2, revealEndDigits: 4},  // Italy
    'NL': {revealStartDigits: 2, revealEndDigits: 4},  // Netherlands
    'SE': {revealStartDigits: 2, revealEndDigits: 4},  // Sweden
    'CH': {revealStartDigits: 2, revealEndDigits: 4},  // Switzerland
    'PL': {revealStartDigits: 2, revealEndDigits: 4},  // Poland
    'RU': {revealStartDigits: 1, revealEndDigits: 3},  // Russia
    'UA': {revealStartDigits: 1, revealEndDigits: 3},  // Ukraine

    // Middle East
    'IL': {revealStartDigits: 1, revealEndDigits: 4},  // Israel
    'AE': {revealStartDigits: 1, revealEndDigits: 4},  // United Arab Emirates
    'TR': {revealStartDigits: 1, revealEndDigits: 4},  // Turkey
    'SA': {revealStartDigits: 0, revealEndDigits: 4},  // Saudi Arabia
    'EG': {revealStartDigits: 1, revealEndDigits: 4},  // Egypt

    // Asia
    'IN': {revealStartDigits: 1, revealEndDigits: 5},  // India
    'CN': {revealStartDigits: 1, revealEndDigits: 3},  // China
    'JP': {revealStartDigits: 0, revealEndDigits: 4},  // Japan
    'KR': {revealStartDigits: 1, revealEndDigits: 4},  // South Korea
    'SG': {revealStartDigits: 2, revealEndDigits: 4},  // Singapore
    'MY': {revealStartDigits: 2, revealEndDigits: 4},  // Malaysia
    'TH': {revealStartDigits: 2, revealEndDigits: 4},  // Thailand
    'PH': {revealStartDigits: 2, revealEndDigits: 4},  // Philippines
    'ID': {revealStartDigits: 2, revealEndDigits: 4},  // Indonesia
    'PK': {revealStartDigits: 2, revealEndDigits: 4},  // Pakistan
    'BD': {revealStartDigits: 2, revealEndDigits: 4},  // Bangladesh

    // South America
    'BR': {revealStartDigits: 2, revealEndDigits: 4},  // Brazil
    'AR': {revealStartDigits: 2, revealEndDigits: 4},  // Argentina
    'CO': {revealStartDigits: 2, revealEndDigits: 4},  // Colombia
    'CL': {revealStartDigits: 2, revealEndDigits: 4},  // Chile

    // Africa
    'ZA': {revealStartDigits: 2, revealEndDigits: 4},  // South Africa
    'NG': {revealStartDigits: 2, revealEndDigits: 4},  // Nigeria
    'KE': {revealStartDigits: 2, revealEndDigits: 4},  // Kenya
    'GH': {revealStartDigits: 2, revealEndDigits: 4},  // Ghana
    'MA': {revealStartDigits: 2, revealEndDigits: 4},  // Morocco

    // Oceania
    'AU': {revealStartDigits: 2, revealEndDigits: 4},  // Australia
    'NZ': {revealStartDigits: 2, revealEndDigits: 4},  // New Zealand
};




// Default masking rule if no specific country rule is defined
const defaultMaskingRule = {revealStartDigits: 1, revealEndDigits: 2};
