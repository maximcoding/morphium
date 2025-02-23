import * as tf from '@tensorflow/tfjs';
import {parsePhoneNumberFromString} from "libphonenumber-js";

export class AIService {
    private sensitivityModel: any;
    private anomalyDetectionModel: any;
    private fraudDetectionModel: any;

    constructor() {
        this.loadModels();
    }

    /**
     * Loads pre-trained models for AI-based features.
     * These models are responsible for sensitivity prediction, anomaly detection, and fraud detection.
     */
    async loadModels() {
        const modelPath = (modelName: string) => `https://${BUCKET_NAME}.s3.amazonaws.com/${modelName}/model.json`;

        this.sensitivityModel = await tf.loadLayersModel(modelPath('sensitivity-model'));
        this.anomalyDetectionModel = await tf.loadLayersModel(modelPath('anomaly-detection-model'));
        this.fraudDetectionModel = await tf.loadLayersModel(modelPath('fraud-detection-model'));
        console.log('All models loaded successfully.');
    }

    public smartFormatPhoneNumber(phoneNumber: string, region?: string): string {
        // @ts-ignore
        const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, region);
        if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
            throw new Error('Invalid phone number');
        }
        return parsedPhoneNumber.formatInternational();
    }

    /**
     * Predicts the sensitivity of the phone number using an AI model.
     * This can be used to apply stricter or looser masking based on sensitivity.
     *
     * @param phoneNumber The phone number to evaluate.
     * @returns A sensitivity score between 0 and 1.
     */
    async predictSensitivity(phoneNumber: string): Promise<number> {
        const inputTensor = this.preprocessPhoneNumber(phoneNumber);
        const prediction = await this.sensitivityModel.predict(inputTensor) as tf.Tensor;
        const sensitivity = prediction.dataSync()[0];  // Sensitivity score (0 to 1)
        return sensitivity;
    }

    /**
     * Detects if the phone number has anomalies, such as irregular patterns or invalid formats.
     *
     * @param phoneNumber The phone number to check.
     * @returns True if the number is anomalous, otherwise false.
     */
    async detectAnomaly(phoneNumber: string): Promise<boolean> {
        const inputTensor = this.preprocessPhoneNumber(phoneNumber);
        const anomalyScore = await this.anomalyDetectionModel.predict(inputTensor) as tf.Tensor;
        return anomalyScore.dataSync()[0] > 0.7;  // Anomaly threshold (0.7 in this case)
    }

    /**
     * Detects if the phone number is potentially fraudulent based on AI models.
     *
     * @param phoneNumber The phone number to check.
     * @returns True if the number is fraudulent, otherwise false.
     */
    async detectFraud(phoneNumber: string): Promise<boolean> {
        const inputTensor = this.preprocessPhoneNumber(phoneNumber);
        const fraudProbability = await this.fraudDetectionModel.predict(inputTensor) as tf.Tensor;
        return fraudProbability.dataSync()[0] > 0.9;  // Fraud threshold (0.9 in this case)
    }

    /**
     * Preprocesses the phone number by converting it into a tensor for model predictions.
     *
     * @param phoneNumber The phone number to preprocess.
     * @returns A tensor representation of the phone number digits.
     */
    private preprocessPhoneNumber(phoneNumber: string): tf.Tensor {
        const digits = phoneNumber.replace(/\D/g, '').split('').map(Number);
        return tf.tensor(digits, [1, digits.length]);
    }
}
