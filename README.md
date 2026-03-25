# Morphium

**Morphium** is a TypeScript library for formatting, masking, and protecting phone numbers in Node.js applications.

It is designed for products that need to balance **privacy**, **usability**, and **operational access**. Use it to safely display phone numbers, apply regional formatting, control visibility by role, and add advanced masking behavior when needed.

Morphium currently supports Node.js and server-side TypeScript/JavaScript.

The core masking and formatting logic is a good candidate for browser and React Native support, but the current package includes server-only features such as encryption, geolocation, and AI integrations.

## Why Morphium?

Phone numbers show up everywhere: admin tools, support dashboards, CRMs, onboarding flows, fraud systems, and internal operations panels.

Most teams end up solving the same problems repeatedly:

- reveal only the last few digits
- keep formatting readable
- apply stricter visibility for non-admin roles
- encrypt sensitive values before storage or display
- add smarter rules based on context, region, or risk signals

Morphium brings these workflows into one library so you can move faster and keep sensitive data safer.

---

## Features

### Core capabilities

- **Phone number masking**  
  Mask phone numbers while revealing only the digits you choose.

- **Region-based formatting**  
  Format phone numbers using common standards such as `E164`, `INTERNATIONAL`, `NATIONAL`, and `RFC3966`.

- **Role-based visibility**  
  Show different levels of phone number visibility based on user role.

- **AES-256-CBC encryption**  
  Encrypt phone numbers before masking or storage.

- **Custom masking patterns**  
  Use configurable characters and regex-based rules.

- **Formatting preservation**  
  Keep spaces, dashes, and other separators when masking values.

### Advanced capabilities

- **JWT-aware role masking**  
  Support visibility rules using token-based access control.

- **Adaptive sensitivity masking**  
  Adjust masking behavior dynamically based on sensitivity rules.

- **Geolocation-aware masking**  
  Apply stricter masking rules for requests from high-risk regions.

- **Anomaly and fraud signals**  
  Extend masking logic with detection-based workflows.

- **Custom hooks**  
  Add logic before validation, after validation, or when formatting changes.

---

## Installation

### Install from npm

```bash
npm install morphium
````

### Install from source

```bash
git clone https://github.com/maximcoding/morphium.git
cd morphium
npm install
npm run build
```

> If you are working directly from source, you may need to adjust import paths to match your local file structure until the package entrypoint is finalized.

---

## Quick Start

```ts
import { MorphiumService } from "morphium";

(async () => {
  const morphium = new MorphiumService();

  const masked = await morphium.transformPhoneNumber("+1234567890", {
    maskChar: "*",
    revealEndDigits: 4,
  });

  console.log(masked);
  // Example output: ******7890
})();
```

---

## Basic Usage

### 1) Mask a phone number

```ts
import { MorphiumService } from "morphium";

(async () => {
  const morphium = new MorphiumService();
  const phoneNumber = "+1234567890";

  const maskedNumber = await morphium.transformPhoneNumber(phoneNumber, {
    maskChar: "*",
    revealEndDigits: 4,
  });

  console.log(maskedNumber);
})();
```

### 2) Preserve formatting while masking

```ts
import { MorphiumService } from "morphium";

(async () => {
  const morphium = new MorphiumService();
  const phoneNumber = "+1 (234) 567-8900";

  const result = await morphium.transformPhoneNumber(phoneNumber, {
    maskChar: "*",
    revealEndDigits: 4,
    preserveFormatting: true,
  });

  console.log(result);
})();
```

### 3) Encrypt before masking

```ts
import { MorphiumService } from "morphium";

(async () => {
  const morphium = new MorphiumService();
  const phoneNumber = "+1234567890";

  const encryptedMasked = await morphium.transformPhoneNumber(phoneNumber, {
    encrypt: true,
    maskChar: "*",
    revealEndDigits: 4,
  });

  console.log(encryptedMasked);
})();
```

### 4) Role-based masking

```ts
import { MorphiumService } from "morphium";

(async () => {
  const morphium = new MorphiumService();
  const phoneNumber = "+1234567890";

  const supportView = await morphium.transformPhoneNumber(phoneNumber, {
    role: "support",
    maskChar: "*",
    revealEndDigits: 4,
    token: "YOUR_JWT_TOKEN",
  });

  console.log(supportView);
})();
```

### 5) Region-based formatting

```ts
import { MorphiumService } from "morphium";

(async () => {
  const morphium = new MorphiumService();
  const phoneNumber = "+1234567890";

  const formatted = await morphium.transformPhoneNumber(phoneNumber, {
    region: "US",
    format: "INTERNATIONAL",
    maskChar: "*",
    revealEndDigits: 4,
  });

  console.log(formatted);
})();
```

### 6) AI-driven masking

```ts
import { MorphiumService } from "morphium";

(async () => {
  const morphium = new MorphiumService();
  const phoneNumber = "+1234567890";

  const result = await morphium.transformPhoneNumberWithAI(phoneNumber, {
    adaptiveSensitivity: true,
  });

  console.log(result);
})();
```

---

## API

## `MorphiumService`

### `transformPhoneNumber(phoneNumber: string, options: MaskingOptions): Promise<string>`

Transforms a phone number using the options you provide.

Use this for:

* masking
* formatting
* encryption
* role-aware visibility
* region-specific output

#### Parameters

* `phoneNumber` — the input phone number
* `options` — masking and formatting configuration

#### Returns

* `Promise<string>` — the transformed result

---

### `transformPhoneNumberWithAI(phoneNumber: string, options: MaskingOptions): Promise<string>`

Transforms a phone number using adaptive or AI-assisted masking logic.

Use this when you want masking behavior to respond to sensitivity or risk-related rules.

#### Parameters

* `phoneNumber` — the input phone number
* `options` — AI-related masking configuration

#### Returns

* `Promise<string>` — the transformed result

---

## Configuration

## `MaskingOptions`

```ts
export interface MaskingOptions {
  maskChar?: string;
  revealStartDigits?: number;
  revealEndDigits?: number;
  preserveFormatting?: boolean;
  region?: string;
  role?: string;
  regexMaskPattern?: string;
  format?: "E164" | "INTERNATIONAL" | "NATIONAL" | "RFC3966";
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

### Option Reference

| Option                | Type                                                   | Description                                                                          |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `maskChar`            | `string`                                               | Character used for masking hidden digits. Default is usually `*`.                    |
| `revealStartDigits`   | `number`                                               | Number of digits to reveal at the beginning of the phone number.                     |
| `revealEndDigits`     | `number`                                               | Number of digits to reveal at the end of the phone number.                           |
| `preserveFormatting`  | `boolean`                                              | Keeps spaces, dashes, parentheses, and other separators intact.                      |
| `region`              | `string`                                               | Region or country code used for parsing or formatting, such as `US` or `DE`.         |
| `role`                | `string`                                               | Role name used to determine visibility rules, such as `admin`, `support`, or `user`. |
| `regexMaskPattern`    | `string`                                               | Custom regex pattern for advanced masking logic.                                     |
| `format`              | `"E164" \| "INTERNATIONAL" \| "NATIONAL" \| "RFC3966"` | Output format for the phone number.                                                  |
| `showFlag`            | `boolean`                                              | Displays a country flag alongside the formatted number if supported.                 |
| `encrypt`             | `boolean`                                              | Encrypts the phone number before returning or masking it.                            |
| `smartMode`           | `boolean`                                              | Enables automatic correction or convenience behavior where supported.                |
| `customHooks`         | `object`                                               | Lets you run logic before validation, after validation, or after formatting changes. |
| `ip`                  | `string`                                               | IP address used for geolocation-aware masking decisions.                             |
| `token`               | `string`                                               | JWT token used for role-based access logic.                                          |
| `adaptiveSensitivity` | `boolean`                                              | Enables adaptive or AI-driven masking behavior.                                      |
| `detectAnomaly`       | `boolean`                                              | Enables anomaly-related checks or extensions.                                        |
| `detectFraud`         | `boolean`                                              | Enables fraud-related checks or extensions.                                          |

---

## Example Configuration

```ts
const options = {
  maskChar: "*",
  revealStartDigits: 2,
  revealEndDigits: 4,
  preserveFormatting: true,
  region: "US",
  role: "admin",
  format: "INTERNATIONAL",
  showFlag: true,
  encrypt: false,
  smartMode: true,
  customHooks: {
    preValidation: (num: string) => console.log("Before validation:", num),
    postValidation: (num: string) => console.log("After validation:", num),
    onFormatChange: (formatted: string) => console.log("Formatted:", formatted),
  },
  adaptiveSensitivity: true,
  detectAnomaly: true,
  detectFraud: true,
};
```

---

## Common Use Cases

Morphium is a strong fit for products that handle user contact data in sensitive environments, including:

* internal admin tools
* support dashboards
* CRMs and sales systems
* fintech and compliance workflows
* fraud and trust systems
* healthcare and privacy-sensitive apps
* customer data platforms

---

## Security Notes

Morphium can help reduce accidental exposure of sensitive phone numbers, but it should still be used as part of a broader data protection strategy.

A few good rules:

* never hardcode secrets in source code
* store encryption keys securely
* reveal the minimum number of digits needed for the task
* reserve full visibility for trusted roles only
* log carefully and avoid leaking raw phone numbers in logs

---

## Development

### Clone the repository

```bash
git clone https://github.com/maximcoding/morphium.git
cd morphium
```

### Install dependencies

```bash
npm install
```

### Build

```bash
npm run build
```

### Run tests

```bash
npm test
```

---

## Roadmap Ideas

Potential areas to expand:

* better package exports for direct npm usage
* framework-specific integrations
* stronger validation and normalization
* improved docs and examples
* more configurable policy presets
* clearer separation between core and advanced masking features

---

## Contributing

Contributions, bug reports, feature ideas, and pull requests are welcome.

If you plan to contribute, please open an issue first so the scope is clear and the implementation stays aligned with the project direction.

---

## License

This project includes GeoLite2 data created by MaxMind, available from MaxMind.

