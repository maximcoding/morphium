import {open, Reader} from 'maxmind';
import path from 'path';
import {parsePhoneNumberFromString} from "libphonenumber-js";
import axios from 'axios';

export class GeoLocationService {

    private geoLookup: Reader<any> | undefined;
    private readonly apiKey: string = 'e5081a7e0014677f1a9773f1a007c924';  // Replace with your Numverify API key
    private readonly lookupApiUrl: string = 'https://apilayer.net/api/validate';

    constructor() {
        this.loadMaxMindDatabase();  // Load MaxMind database on initialization
    }

    /**
     * Loads the MaxMind GeoLite2 database file.
     * This should be updated weekly as MaxMind releases new data.
     */
    private async loadMaxMindDatabase() {
        const dbPath = path.join(__dirname + '/../resources', 'GeoLite2-City.mmdb');  // Adjust the path to where your GeoLite2 database is stored
        this.geoLookup = await open(dbPath);
        console.log('MaxMind GeoLite2 database loaded successfully.');
    }

    /**
     * Fetches geolocation information based on the user's IP.
     * @param ip The IP address of the user.
     * @returns Geolocation data including country, region, city, latitude, and longitude.
     */
    async getGeolocationByIP(ip: string): Promise<any> {
        if (!this.geoLookup) {
            throw new Error('GeoLite2 database is not loaded.');
        }

        // Perform lookup using the MaxMind GeoLite2 database
        const geoData = this.geoLookup.get(ip);

        if (!geoData) {
            return {
                error: 'Geolocation data not found for this IP.'
            };
        }

        return {
            ip: ip,
            country: geoData?.country?.names?.en || 'Unknown',
            region: geoData?.subdivisions?.[0]?.names?.en || 'Unknown',
            city: geoData?.city?.names?.en || 'Unknown',
            latitude: geoData?.location?.latitude || 'Unknown',
            longitude: geoData?.location?.longitude || 'Unknown'
        };
    }


    /**
     * Get country for a phone number using Google's libphonenumber library.
     * @param phoneNumber The phone number in E.164 format (e.g., +1234567890).
     * @returns The country associated with the phone number.
     */
    getCountryByPhoneNumber(phoneNumber: string): string | null {
        try {
            const phoneNumberParsed = parsePhoneNumberFromString(phoneNumber);
            if (!phoneNumberParsed) {
                throw new Error('Invalid phone number');
            }
            return phoneNumberParsed.country || null;  // Returns the country code (ISO 3166-1 alpha-2) like 'US'
        } catch (error: any) {
            return null;
        }
    }

    /**
     * Get geolocation data (carrier, phone type) for a phone number using Numverify.
     * @param phoneNumber The phone number in E.164 format (e.g., +1234567890).
     * @returns Geolocation data including country, carrier, phone type, etc.
     */
    async getGeolocationByPhoneNumber(phoneNumber: string): Promise<any> {
        try {
            // Make the API request to Numverify
            const response = await axios.get(this.lookupApiUrl, {
                params: {
                    access_key: this.apiKey,
                    number: phoneNumber,
                },
            });
            // Check if the response is valid
            if (response.data && response.data.valid === false) {
                throw new Error('Invalid phone number or data not available.');
            }
            // If valid, process the data
            const { country_name, carrier, line_type } = response.data;
            return {
                country: country_name,
                carrier: carrier,
                phoneType: line_type
            };
        } catch (error: any) {
            // Axios network error
            if (error.isAxiosError && !error.response) {
                throw new Error(error?.message || 'Network error: Unable to fetch geolocation data.');
            }
            // Invalid phone number (from the Numverify API response)
            if (error.response?.data && error.response.data.valid === false) {
                throw new Error(error?.message || 'Invalid phone number or data not available.');
            }
            throw new Error(error?.message);
        }
    }

}
