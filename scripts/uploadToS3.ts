
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

// Set your S3 Bucket Name here
const BUCKET_NAME = 'phone-models-storage';

// Base directory for models
const BASE_DIR = './src/phone/models';

// Configure AWS SDK
AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();

// Function to upload a file to S3
const uploadFile = (filePath: string, s3Key: string) => {
    const fileContent = fs.readFileSync(filePath);

    const params = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ACL: 'private'
    };

    return s3.upload(params).promise()
        .then(data => {
            console.log(`Uploaded ${s3Key} to ${data.Location}`);
        })
        .catch(err => {
            console.error(`Error uploading ${s3Key}:`, err);
        });
};

// Function to recursively upload model files
const uploadModel = (modelName: string) => {
    const modelDir = path.join(BASE_DIR, modelName);

    if (fs.existsSync(modelDir)) {
        console.log(`Uploading ${modelName} to S3...`);
        fs.readdirSync(modelDir).forEach(file => {
            const filePath = path.join(modelDir, file);
            const s3Key = `${modelName}/${file}`;
            uploadFile(filePath, s3Key);
        });
    } else {
        console.log(`Directory ${modelName} not found. Skipping...`);
    }
};

// Main function to upload all models
const main = () => {
    uploadModel('sensitivity-model');
    uploadModel('anomaly-detection-model');
    uploadModel('fraud-detection-model');
    console.log("All models uploaded successfully.");
};

main();
