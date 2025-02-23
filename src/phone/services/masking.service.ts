import {RegexMaskingHandler} from '../handlers/regex-masking.handler';
import {JWTMaskingHandler} from '../handlers/jwt-masking.handler';
import {RoleBasedMaskingHandler} from '../handlers/role-base-masking.handler';
import {FallbackMaskingHandler} from '../handlers/fallback-masking.handler';
import {EncryptionService} from "./encryption.service";
import {AIService} from "./ai.service";
import {GeoLocationMaskingHandler} from "../handlers/geo-location-masking.handler";

const {parsePhoneNumberFromString} = require('libphonenumber-js');

export interface MaskingOptions {
    maskChar?: string;
    revealStartDigits?: number;
    revealEndDigits?: number;
    preserveFormatting?: boolean;
    region?: string;
    role?: string;
    regexMaskPattern?: string;
    format?: 'E164' | 'INTERNATIONAL' | 'NATIONAL' | 'RFC3966';
    showFlag?: boolean;
    encrypt?: boolean;
    smartMode?: boolean;
    customHooks?: {
        preValidation?: Function;
        postValidation?: Function;
        onFormatChange?: Function;
    };
    ip?: string;
    token?: string;
    adaptiveSensitivity?: boolean;
    detectAnomaly?: boolean;
    detectFraud?: boolean;
}

export abstract class MaskingHandler {
    private nextHandler?: MaskingHandler;

    setNext(handler: MaskingHandler): MaskingHandler {
        this.nextHandler = handler;
        return handler;
    }

    // Updated to return Promise<string>
    async handle(phoneNumber: string, options: any): Promise<string> {
        if (this.nextHandler) {
            return await this.nextHandler.handle(phoneNumber, options);
        }
        return phoneNumber;  // Default return if no further handlers exist
    }
}

export class MaskingService {
    private readonly regexHandler = new RegexMaskingHandler();
    private readonly roleHandler = new RoleBasedMaskingHandler();
    private readonly geoHandler = new GeoLocationMaskingHandler();
    private readonly jwtHandler = new JWTMaskingHandler();
    private readonly fallbackHandler = new FallbackMaskingHandler();
    private readonly encryptionService = new EncryptionService();
    private readonly aiService = new AIService();

    constructor() {

        this.aiService.loadModels();  // Load AI models asynchronously

        this.regexHandler
            .setNext(this.jwtHandler)
            .setNext(this.roleHandler)
            .setNext(this.geoHandler)
            .setNext(this.fallbackHandler);
    }
    // Main method to mask phone numbers with provided options
    async maskPhoneNumber(phoneNumber: string, options: MaskingOptions): Promise<string> {
        if (options.customHooks?.preValidation) {
            options.customHooks.preValidation(phoneNumber);
        }
        // Check for anomalies if enabled
        if (options.detectAnomaly) {
            const isAnomalous = await this.aiService.detectAnomaly(phoneNumber);
            if (isAnomalous) {
                throw new Error('Anomalous phone number detected');
            }
        }

        // Check for fraud detection if enabled
        if (options.detectFraud) {
            const isFraudulent = await this.aiService.detectFraud(phoneNumber);
            if (isFraudulent) {
                throw new Error('Fraudulent phone number detected');
            }
        }

        let formattedNumber = this.formatPhoneNumber(phoneNumber, options.region, options.format);

        if (options.smartMode) {
            formattedNumber = this.aiService.smartFormatPhoneNumber(phoneNumber, options.region);
        }

        if (options.encrypt) {
            formattedNumber = this.encryptionService.encryptPhoneNumber(formattedNumber);
        }

        let maskedNumber = await this.regexHandler.handle(formattedNumber, options);

        if (options.customHooks?.postValidation) {
            options.customHooks.postValidation(maskedNumber);
        }

        return maskedNumber;
    }

    // AI-driven masking based on sensitivity prediction
    async maskPhoneNumberWithAI(phoneNumber: string, options: MaskingOptions): Promise<string> {
        const sensitivity = await this.aiService.predictSensitivity(phoneNumber);
        if (sensitivity > 0.8) {
            return this.defaultMasking(phoneNumber, 0, 2, '*');
        } else if (sensitivity > 0.5) {
            return this.defaultMasking(phoneNumber, 0, 4, '*');
        } else {
            return this.defaultMasking(phoneNumber, 2, 4, '*');
        }
    }

    // Helper method to format phone numbers based on region and format type
    private formatPhoneNumber(phoneNumber: string, region?: string, formatType?: string): string {
        if (!region) return phoneNumber;
        const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, region);
        if (!parsedPhoneNumber) {
            throw new Error('Invalid phone number');
        }
        switch (formatType) {
            case 'E164':
                return parsedPhoneNumber.format('E.164');
            case 'INTERNATIONAL':
                return parsedPhoneNumber.formatInternational();
            case 'NATIONAL':
                return parsedPhoneNumber.formatNational();
            case 'RFC3966':
                return parsedPhoneNumber.formatRFC3966();
            default:
                return parsedPhoneNumber.formatInternational();
        }
    }
    private defaultMasking(phoneNumber: string, revealStart: number, revealEnd: number, maskChar: string): string {
        const start = phoneNumber.slice(0, revealStart);
        const masked = maskChar.repeat(phoneNumber.length - revealStart - revealEnd);
        const end = phoneNumber.slice(-revealEnd);
        return `${start}${masked}${end}`;
    }
}
