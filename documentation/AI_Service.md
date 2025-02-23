
# AIService Documentation

## Overview
The `AIService` provides advanced AI-driven features for phone number analysis and processing.
It is designed to enhance phone number masking, anomaly detection, and fraud detection using pre-trained TensorFlow.js models.

This service is particularly useful for applications that need dynamic and context-aware phone number masking based on sensitivity and security risks.

## Features
- **Sensitivity Prediction**: Predicts the sensitivity of a phone number, determining how strictly it should be masked.
- **Anomaly Detection**: Detects irregular patterns or invalid formats in phone numbers.
- **Fraud Detection**: Identifies potentially fraudulent phone numbers using AI models.
- **Smart Formatting**: Automatically corrects and formats phone numbers based on region.

## How It Works
1. The phone number is cleaned and converted into a tensor for model predictions.
2. The AI models analyze the number pattern and other features to make predictions.
3. The service returns:
    - A sensitivity score between 0 and 1.
    - A boolean value for anomaly or fraud detection.

## Why Predict Sensitivity?
Predicting sensitivity helps determine the level of privacy required for a phone number.
It allows the application to adjust masking rules dynamically based on how sensitive or private the phone number is.

### Real Use Cases:
- **VIP Numbers**: Apply stricter masking rules for high-profile users like CEOs or public figures.
- **Financial Accounts**: Enhance security for numbers linked to bank accounts or financial services.
- **Customer Support**: Apply moderate masking for customer support or business contact numbers.
- **Public Numbers**: Minimize masking for publicly available contact numbers (e.g., business hotlines).

### Example:
```typescript
const sensitivity = await aiService.predictSensitivity('+1234567890');
if (sensitivity > 0.8) {
    console.log('Highly Sensitive: Apply strict masking');
} else if (sensitivity > 0.5) {
    console.log('Medium Sensitivity: Apply moderate masking');
} else {
    console.log('Low Sensitivity: Minimal masking required');
}
```

## Why Predict Anomaly?
Anomaly detection helps identify irregular patterns, invalid formats, or suspicious behavior in phone numbers.
This is essential for maintaining data integrity and preventing fraud.

### Real Use Cases:
- **Irregular Patterns**: Detect phone numbers with irregular digit patterns or invalid formats.
- **Fake or Disposable Numbers**: Identify numbers that are temporary or generated using fake number services.
- **International Fraud Detection**: Flag numbers from high-risk countries or regions with known fraud activities.
- **Account Security**: Prevent account takeover attempts by detecting unusual phone numbers during registration.

### Example:
```typescript
const isAnomalous = await aiService.detectAnomaly('+1234567890');
if (isAnomalous) {
    console.log('Anomaly Detected: Apply stricter security measures');
} else {
    console.log('No anomaly detected: Proceed normally');
}
```

## Key Methods

### 1. `loadModels()`
- **Description**: Loads the pre-trained TensorFlow.js models for sensitivity prediction, anomaly detection, and fraud detection.
- **Usage**: This method is called automatically in the constructor and loads models from the local file system.
- **Example**:
    ```typescript
    const aiService = new AIService();
    aiService.loadModels();
    ```

### 2. `smartFormatPhoneNumber(phoneNumber: string, region?: string): string`
- **Description**: Automatically formats the phone number based on the region using `libphonenumber-js`.
- **Throws**: Error if the phone number is invalid.
- **Example**:
    ```typescript
    const formattedNumber = aiService.smartFormatPhoneNumber('+1234567890', 'US');
    console.log(formattedNumber);  // Output: +1 234-567-890
    ```

### 3. `predictSensitivity(phoneNumber: string): Promise<number>`
- **Description**: Predicts the sensitivity of a phone number using the AI model.
- **Output**: A sensitivity score between 0 and 1.
- **Example**:
    ```typescript
    const sensitivity = await aiService.predictSensitivity('+1234567890');
    console.log('Sensitivity Score:', sensitivity);
    ```

### 4. `detectAnomaly(phoneNumber: string): Promise<boolean>`
- **Description**: Checks if the phone number has irregular patterns or invalid formats.
- **Output**: `true` if anomalous, `false` otherwise.
- **Example**:
    ```typescript
    const isAnomalous = await aiService.detectAnomaly('+1234567890');
    console.log('Anomaly Detected:', isAnomalous);
    ```

### 5. `detectFraud(phoneNumber: string): Promise<boolean>`
- **Description**: Identifies potentially fraudulent phone numbers using AI models.
- **Output**: `true` if fraudulent, `false` otherwise.
- **Example**:
    ```typescript
    const isFraudulent = await aiService.detectFraud('+1234567890');
    console.log('Fraud Detected:', isFraudulent);
    ```

## How to Use AIService
```typescript
const aiService = new AIService();

(async () => {
    const phoneNumber = '+1234567890';
    const sensitivity = await aiService.predictSensitivity(phoneNumber);
    console.log('Sensitivity Score:', sensitivity);

    const isAnomalous = await aiService.detectAnomaly(phoneNumber);
    console.log('Anomaly Detected:', isAnomalous);

    const isFraudulent = await aiService.detectFraud(phoneNumber);
    console.log('Fraud Detected:', isFraudulent);
})();
```

## Why Use AIService?
- **Dynamic Masking**: Applies masking rules based on sensitivity scores.
- **Adaptive Sensitivity**: Adapts to new patterns, improving accuracy over time.
- **Enhanced Security**: Detects anomalies and fraud to prevent security risks.

## Dependencies
- `@tensorflow/tfjs`
- `libphonenumber-js`

## Installation
```bash
npm install @tensorflow/tfjs libphonenumber-js
```

## Notes
- Ensure the TensorFlow.js models are saved in the correct local paths.
- You can train your own models or use the provided dummy models for testing.

## Author
Developed by [Your Name]
