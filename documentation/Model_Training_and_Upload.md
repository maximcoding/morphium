
Monitor with TensorBoard:

``tensorboard --logdir=logs``

Open http://localhost:6006 to monitor training.

# AIService Model Training and Uploading

## Overview
This guide explains how to:
1. **Train TensorFlow.js models locally** for Sensitivity Prediction, Anomaly Detection, and Fraud Detection.
2. **Upload trained models to an S3 bucket** for scalable storage and dynamic loading.

---

## Prerequisites

### 1. Install Dependencies
Ensure you have **Node.js** and **TensorFlow.js** installed:
```bash
npm install @tensorflow/tfjs-node aws-sdk
```

### 2. AWS S3 Setup
- **Create an S3 Bucket**: In your AWS console, create a bucket (e.g., `phone-models-storage`).
- **Configure IAM User**:
  - Create an IAM user with `AmazonS3FullAccess`.
  - Generate Access Key and Secret Access Key.

### 3. Configure AWS Credentials
Configure AWS credentials locally:
```bash
aws configure
```
Alternatively, manually edit `~/.aws/credentials`:
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY
aws_secret_access_key = YOUR_SECRET_KEY
```

---

## Directory Structure

```
src
└── phone
    ├── models
    │   ├── train-models.py          # Training Script
    │   ├── uploadToS3.ts          # S3 Upload Script
    │   ├── sensitivity-model        # Saved Sensitivity Model
    │   ├── anomaly-detection-model  # Saved Anomaly Detection Model
    │   └── fraud-detection-model    # Saved Fraud Detection Model
```

---

## 1. Training Models Locally

### Description:
This will:
- Train models for:
  - **Sensitivity Prediction**: Predicts how sensitive a phone number is.
  - **Anomaly Detection**: Detects irregular patterns.
  - **Fraud Detection**: Identifies potential fraud.
- Save models locally in `models` folder.

### Script: `src/phone/models/train-models.py`
This script:
- Preprocesses phone numbers to numeric arrays.
- Creates feedforward neural network models.
- Trains the models with the specified datasets.
- Saves the models locally.

### Example Training Data Format:
Create training data files:
- `sensitivity-data.json`
- `anomaly-data.json`
- `fraud-data.json`

```json
[
    {
        "phoneNumber": "+1234567890",
        "label": 0.9
    },
    {
        "phoneNumber": "+0987654321",
        "label": 0.1
    }
]
```

### Run Training Script:
```bash
npx ts-node src/phone/models/train_models.py
```
This will create model directories with:
- `model.json`
- `weights.bin`

### Models Saved Locally:
- `src/phone/models/sensitivity-model/`
- `src/phone/models/anomaly-detection-model/`
- `src/phone/models/fraud-detection-model/`

---

## 2. Uploading Models to S3

### Description:
This script uploads the trained models to your S3 bucket for scalable storage.

### Script: `src/phone/models/uploadToS3.ts`
This script:
- Reads the saved models from the local file system.
- Uploads them to the specified S3 bucket.

### Update S3 Bucket Name
In `uploadToS3.ts`, update:
```js
const BUCKET_NAME = 'phone-models-storage';
```

### Run Upload Script:
```bash
npx ts-node src/phone/models/uploadToS3.ts
```
This will:
- Upload models to S3 in directories:
  - `sensitivity-model/`
  - `anomaly-detection-model/`
  - `fraud-detection-model/`
- Example S3 URL:
```
https://phone-models-storage.s3.amazonaws.com/sensitivity-model/model.json
```

---

## 3. Loading Models from S3 in `AIService`

### Update `AIService`:
Update the model loading logic to use S3 URLs:
```typescript
async loadModels() {
    const modelPath = (modelName: string) => 
        `https://phone-models-storage.s3.amazonaws.com/${modelName}/model.json`;

    this.sensitivityModel = await tf.loadLayersModel(modelPath('sensitivity-model'));
    this.anomalyDetectionModel = await tf.loadLayersModel(modelPath('anomaly-detection-model'));
    this.fraudDetectionModel = await tf.loadLayersModel(modelPath('fraud-detection-model'));

    console.log('All models loaded successfully from S3.');
}
```

---

## 4. Security Best Practices

1. **Use IAM Roles** – Avoid hardcoding keys, use roles if deploying on EC2 or Lambda.
2. **Restrict Bucket Permissions** – Only allow read access from your application.
3. **Enable Server-Side Encryption** – Use S3-managed keys (SSE-S3).

---

## 5. Add to `.gitignore`

```gitignore
# TensorFlow.js Models
src/phone/models/sensitivity-model/
src/phone/models/anomaly-detection-model/
src/phone/models/fraud-detection-model/
```

---

## 6. Monitoring with TensorBoard

Start TensorBoard to monitor training:
```bash
npx tensorboard --logdir=logs
```
Open [http://localhost:6006](http://localhost:6006) to view training metrics.

---

## Summary

- **Train Models Locally** – Using `train-models.py`.
- **Upload Models to S3** – Using `uploadToS3.ts`.
- **Dynamic Loading** – AIService loads models directly from S3 URLs.
- **Scalable Storage** – S3 provides scalable and secure storage for ML models.

This setup ensures **scalable storage**, **easy updates**, and **secure access** to models for your AIService.

---

## Author
Developed by [Your Name]

For more information or support, feel free to reach out!
