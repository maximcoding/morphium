import { GeoLocationService } from './geo-location.service';
import { open, Reader } from 'maxmind';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import axios from 'axios';

jest.mock('maxmind');
jest.mock('libphonenumber-js');
jest.mock('axios');

const mockedOpen = open as jest.Mock;
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedParsePhoneNumberFromString = parsePhoneNumberFromString as jest.Mock;

describe('GeoLocationService', () => {
    let geoService: GeoLocationService;

    beforeEach(() => {
        geoService = new GeoLocationService();
    });

    describe('loadMaxMindDatabase', () => {
        it('should load MaxMind GeoLite2 database', async () => {
            mockedOpen.mockResolvedValueOnce({
                get: jest.fn().mockReturnValue({
                    country: { names: { en: 'United States' } },
                    subdivisions: [{ names: { en: 'California' } }],
                    city: { names: { en: 'San Francisco' } },
                    location: { latitude: 37.7749, longitude: -122.4194 }
                })
            } as unknown as Reader<any>);

            await geoService['loadMaxMindDatabase']();
            expect(geoService['geoLookup']).toBeDefined();
        });
    });

    describe('getGeolocationByIP', () => {
        it('should return geolocation data for a valid IP', async () => {
            const mockGet = jest.fn().mockReturnValue({
                country: { names: { en: 'United States' } },
                subdivisions: [{ names: { en: 'California' } }],
                city: { names: { en: 'San Francisco' } },
                location: { latitude: 37.7749, longitude: -122.4194 }
            });

            geoService['geoLookup'] = { get: mockGet } as unknown as Reader<any>;
            const result = await geoService.getGeolocationByIP('8.8.8.8');

            expect(result).toEqual({
                ip: '8.8.8.8',
                country: 'United States',
                region: 'California',
                city: 'San Francisco',
                latitude: 37.7749,
                longitude: -122.4194
            });
        });

        it('should throw an error if GeoLite2 database is not loaded', async () => {
            geoService['geoLookup'] = undefined;
            await expect(geoService.getGeolocationByIP('8.8.8.8')).rejects.toThrow('GeoLite2 database is not loaded.');
        });

        it('should return error message if geolocation data is not found', async () => {
            const mockGet = jest.fn().mockReturnValue(null);
            geoService['geoLookup'] = { get: mockGet } as unknown as Reader<any>;
            const result = await geoService.getGeolocationByIP('8.8.8.8');
            expect(result).toEqual({ error: 'Geolocation data not found for this IP.' });
        });
    });

    describe('getCountryByPhoneNumber', () => {
        it('should return the country code for a valid phone number', () => {
            mockedParsePhoneNumberFromString.mockReturnValueOnce({
                country: 'US'
            });

            const country = geoService.getCountryByPhoneNumber('+14155552671');
            expect(country).toBe('US');
        });

        it('should return null for an invalid phone number', () => {
            mockedParsePhoneNumberFromString.mockReturnValueOnce(null);
            const country = geoService.getCountryByPhoneNumber('12345');
            expect(country).toBeNull();
        });

        it('should handle errors gracefully', () => {
            mockedParsePhoneNumberFromString.mockImplementationOnce(() => {
                throw new Error('Invalid phone number');
            });

            const country = geoService.getCountryByPhoneNumber('invalid');
            expect(country).toBeNull();
        });
    });

    describe('getGeolocationByPhoneNumber', () => {
        it('should return geolocation data for a valid phone number', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    valid: true,
                    country_name: 'United States',
                    carrier: 'AT&T Mobility',
                    line_type: 'mobile'
                }
            });
            const result = await geoService.getGeolocationByPhoneNumber('+14155552671');
            expect(result).toEqual({
                country: 'United States',
                carrier: 'AT&T Mobility',
                phoneType: 'mobile'
            });
        });

        it('should throw an error for an invalid phone number', async () => {
            // Mock a valid HTTP response with valid: false
            mockedAxios.get.mockResolvedValueOnce({
                data: {
                    valid: false,  // Numverify-specific invalid indicator
                    number: 'invalid-phone-number',
                    country_name: null,
                    carrier: null,
                    line_type: null
                }
            });

            // Expect the specific error message for invalid phone number
            await expect(geoService.getGeolocationByPhoneNumber('invalid-phone-number'))
                .rejects.toThrow('Invalid phone number or data not available.');
        });


        it('should throw an error if Numverify API request fails', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API request failed'));

            await expect(geoService.getGeolocationByPhoneNumber('+14155552671')).rejects.toThrow('API request failed');
        });
    });
});
