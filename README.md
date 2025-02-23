
# Morphium

**Morphium** is a powerful phone number transformation library designed to provide advanced features such as:

- **Phone Number Masking**: Mask phone numbers with custom characters while revealing specific parts.
- **Region-Based Formatting**: Format phone numbers based on regional standards (e.g., US, EU, etc.).
- **Encryption**: Secure phone numbers with AES-256-CBC encryption.
- **Role-Based Masking**: Customize masking based on user roles (e.g., support vs. admin) with JWT token support.
- **AI-Driven Masking**: Use machine learning to apply masking based on the sensitivity of phone numbers.
- **Geolocation-Based Masking**: Apply stricter masking if the user's IP comes from a high-risk region.

## Features

- **Masking**: Hide portions of phone numbers while revealing specific parts.
- **Region-Based Formatting**: Format phone numbers according to regional standards.
- **Role-Based Masking**: Show different parts of phone numbers based on user roles.
- **AES-256-CBC Encryption**: Secure phone numbers using strong encryption.
- **AI-Powered Sensitivity Masking**: Dynamically adjust the level of masking based on AI predictions.
- **Geolocation-Based Masking**: Stricter masking for users from high-risk regions based on IP.

## Installation

To install **Morphium**, follow these steps:

1. **Install the library dependencies**:

```bash
npm install
```

2. **Clone or include the Morphium code** in your project directory.

```bash
git clone https://github.com/your-repo/morphium-service.git
```

3. **Ensure TypeScript and Jest are installed** (for TypeScript support and testing):

```bash
npm install typescript ts-jest @types/jest --save-dev
```

---

## How to Use

### Basic Setup

In your project, import and use **Morphium** to perform various phone number transformations such as masking, encryption, and role-based masking.

### Example 1: Basic Phone Number Masking

This example shows how to mask a phone number while revealing the last 4 digits.

```typescript
import { MorphiumService } from './services/morphium.service';

(async () => {
  const morphiumService = new MorphiumService();
  const phoneNumber = '+1234567890';

  const options = {
    maskChar: '*',
    revealEndDigits: 4,  // Reveal the last 4 digits
  };

  const maskedNumber = await morphiumService.transformPhoneNumber(phoneNumber, options);
  console.log(maskedNumber);  // Output: ******7890
})();
```

### Example 2: Masking with AES-256 Encryption

You can encrypt the phone number before masking it, ensuring additional security.

```typescript
import { MorphiumService } from './services/morphium.service';

(async () => {
  const morphiumService = new MorphiumService();
  const phoneNumber = '+1234567890';

  const options = {
    encrypt: true,  // Enable encryption
    maskChar: '*',
    revealEndDigits: 4,
  };

  const encryptedMaskedNumber = await morphiumService.transformPhoneNumber(phoneNumber, options);
  console.log(encryptedMaskedNumber);  // Output: Encrypted and masked phone number
})();
```

### Example 3: Role-Based Masking Using JWT

This example demonstrates role-based masking using JWT tokens. For example, support staff may see only the last 4 digits, while admins see the entire phone number.

```typescript
import { MorphiumService } from './services/morphium.service';

(async () => {
  const morphiumService = new MorphiumService();
  const phoneNumber = '+1234567890';

  const options = {
    maskChar: '*',
    role: 'support',  // Set role to 'support'
    revealEndDigits: 4,
    token: 'YOUR_JWT_TOKEN',  // JWT token for role verification
  };

  const roleBasedMaskedNumber = await morphiumService.transformPhoneNumber(phoneNumber, options);
  console.log(roleBasedMaskedNumber);  // Output: Role-based masked number
})();
```

### Example 4: AI-Driven Masking Based on Sensitivity

Use AI to dynamically adjust masking based on the sensitivity of the phone number.

```typescript
import { MorphiumService } from './services/morphium.service';

(async () => {
  const morphiumService = new MorphiumService();
  const phoneNumber = '+1234567890';

  const options = {
    adaptiveSensitivity: true,  // Enable AI-driven sensitivity
  };

  const aiMaskedNumber = await morphiumService.transformPhoneNumberWithAI(phoneNumber, options);
  console.log(aiMaskedNumber);  // Output: AI-driven masked phone number
})();
```

### Example 5: Region-Based Formatting

You can format a phone number based on its region, using regional standards like E164, National, or International formats.

```typescript
import { MorphiumService } from './services/morphium.service';

(async () => {
  const morphiumService = new MorphiumService();
  const phoneNumber = '+1234567890';

  const options = {
    region: 'US',  // Format based on US standards
    format: 'INTERNATIONAL',  // International format
    maskChar: '*',
    revealEndDigits: 4,
  };

  const formattedMaskedNumber = await morphiumService.transformPhoneNumber(phoneNumber, options);
  console.log(formattedMaskedNumber);  // Output: Masked and regionally formatted phone number
})();
```

---

## API

### Morphium Methods

#### `transformPhoneNumber(phoneNumber: string, options: MaskingOptions): Promise<string>`

- **Description**: Transforms and masks the phone number based on the provided options.
- **Parameters**:
  - `phoneNumber`: The phone number to mask/transform.
  - `options`: An object defining how to mask, format, or encrypt the phone number.
- **Returns**: A `Promise` that resolves to the masked/formatted/encrypted phone number.

#### `transformPhoneNumberWithAI(phoneNumber: string, options: MaskingOptions): Promise<string>`

- **Description**: Uses AI to dynamically mask the phone number based on sensitivity analysis.
- **Parameters**:
  - `phoneNumber`: The phone number to mask.
  - `options`: An object defining how the phone number should be masked based on AI sensitivity.
- **Returns**: A `Promise` that resolves to the masked phone number.

---

## Options for Masking

The `MaskingOptions` interface provides a powerful and flexible configuration for masking phone numbers or sensitive data. It allows you to control how the data is masked, formatted, and displayed, supporting a wide range of advanced features, including role-based masking, geolocation-based rules, and AI-driven detection.

---

## Table of Contents

- [Interface Overview](#interface-overview)
- [Properties](#properties)
  - [maskChar](#maskchar)
  - [revealStartDigits](#revealstartdigits)
  - [revealEndDigits](#revealenddigits)
  - [preserveFormatting](#preserveformatting)
  - [region](#region)
  - [role](#role)
  - [regexMaskPattern](#regexmaskpattern)
  - [format](#format)
  - [showFlag](#showflag)
  - [encrypt](#encrypt)
  - [smartMode](#smartmode)
  - [customHooks](#customhooks)
  - [ip](#ip)
  - [token](#token)
  - [adaptiveSensitivity](#adaptivesensitivity)
  - [detectAnomaly](#detectanomaly)
  - [detectFraud](#detectfraud)
- [Example Usage](#example-usage)

---

## Interface Overview

```typescript
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
```

---

## Properties

### maskChar
- **Type**: `string`
- **Default**: `'*'`
- **Description**: Character used for masking the hidden digits.
- **Example**:
  ```typescript
  maskChar: '#'
  ```

### revealStartDigits
- **Type**: `number`
- **Description**: Number of digits to reveal at the start of the phone number.
- **Example**:
  ```typescript
  revealStartDigits: 2
  ```

### revealEndDigits
- **Type**: `number`
- **Description**: Number of digits to reveal at the end of the phone number.
- **Example**:
  ```typescript
  revealEndDigits: 4
  ```

### preserveFormatting
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Preserves original formatting (e.g., dashes, spaces).
- **Example**:
  ```typescript
  preserveFormatting: true
  ```

### region
- **Type**: `string`
- **Description**: Region or country code for formatting (e.g., 'US', 'DE').
- **Example**:
  ```typescript
  region: 'US'
  ```

### role
- **Type**: `string`
- **Description**: Role-based masking (e.g., 'admin', 'user') for different visibility rules.
- **Example**:
  ```typescript
  role: 'admin'
  ```

### regexMaskPattern
- **Type**: `string`
- **Description**: Custom regex pattern for flexible masking rules.
- **Example**:
  ```typescript
  regexMaskPattern: '\d{3}-\d{3}-\d{4}'
  ```

### format
- **Type**: `'E164' | 'INTERNATIONAL' | 'NATIONAL' | 'RFC3966'`
- **Description**: Format of the phone number output.
- **Example**:
  ```typescript
  format: 'INTERNATIONAL'
  ```

### showFlag
- **Type**: `boolean`
- **Description**: Display country flag alongside the phone number.
- **Example**:
  ```typescript
  showFlag: true
  ```

### encrypt
- **Type**: `boolean`
- **Description**: Encrypt the phone number before masking.
- **Example**:
  ```typescript
  encrypt: true
  ```

### smartMode
- **Type**: `boolean`
- **Description**: Enables automatic correction and formatting.
- **Example**:
  ```typescript
  smartMode: true
  ```

### customHooks
- **Type**: `object`
- **Description**: Custom hooks for extending validation and formatting.
  - **preValidation**: Runs before validation.
  - **postValidation**: Runs after validation.
  - **onFormatChange**: Runs when format changes.
- **Example**:
  ```typescript
  customHooks: {
    preValidation: (num) => console.log('Pre-Validation:', num),
    postValidation: (num) => console.log('Post-Validation:', num)
  }
  ```

### ip
- **Type**: `string`
- **Description**: User's IP for geolocation-based masking rules.
- **Example**:
  ```typescript
  ip: '192.168.1.1'
  ```

### token
- **Type**: `string`
- **Description**: JWT token for role-based visibility control.
- **Example**:
  ```typescript
  token: 'eyJhbGciOi...'
  ```

### adaptiveSensitivity
- **Type**: `boolean`
- **Description**: AI-driven sensitivity adjustment for masking.
- **Example**:
  ```typescript
  adaptiveSensitivity: true
  ```

### detectAnomaly
- **Type**: `boolean`
- **Description**: AI-powered anomaly detection for unusual patterns.
- **Example**:
  ```typescript
  detectAnomaly: true
  ```

### detectFraud
- **Type**: `boolean`
- **Description**: Enables fraud detection to identify potential threats.
- **Example**:
  ```typescript
  detectFraud: true
  ```

---

## Example Usage

```typescript
const options: MaskingOptions = {
  maskChar: '*',
  revealStartDigits: 2,
  revealEndDigits: 4,
  preserveFormatting: true,
  region: 'US',
  role: 'admin',
  format: 'INTERNATIONAL',
  showFlag: true,
  encrypt: false,
  smartMode: true,
  customHooks: {
    preValidation: (num) => console.log('Before Validation:', num),
    postValidation: (num) => console.log('After Validation:', num)
  },
  adaptiveSensitivity: true,
  detectAnomaly: true,
  detectFraud: true
};
```

---

## Conclusion

The `MaskingOptions` interface provides comprehensive control over how phone numbers or sensitive data are masked and formatted. It supports advanced features like geolocation-based masking, role-based visibility, and AI-driven anomaly and fraud detection.

This flexible interface allows developers to implement complex masking rules while maintaining maintainable and readable code.

Feel free to extend or modify it to suit your use case.



---

## License

This product includes GeoLite2 data created by MaxMind, available from https://www.maxmind.com.
