import random

from utils import generate_unique_phone_number, generate_anomalous_phone_number

FRAUD_RATIO = 0.02
TOTAL_SAMPLES = 10

def generate_fraud_data(num_samples=TOTAL_SAMPLES, fraud_ratio=FRAUD_RATIO):
    data = []
    num_fraud = int(num_samples * fraud_ratio)
    num_legit = num_samples - num_fraud

    legit_numbers = [{"phoneNumber": generate_unique_phone_number(), "label": 0} for _ in range(num_legit)]
    fraud_numbers = [{"phoneNumber": generate_anomalous_phone_number(), "label": 1} for _ in range(num_fraud)]

    data = legit_numbers + fraud_numbers
    random.shuffle(data)
    return data
