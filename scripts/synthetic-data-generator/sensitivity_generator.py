import random
from utils import generate_unique_phone_number, generate_anomalous_phone_number

SENSITIVITY_RATIO = 0.05
TOTAL_SAMPLES = 10

def generate_sensitivity_data(num_samples=TOTAL_SAMPLES, sensitivity_ratio=SENSITIVITY_RATIO):
    data = []
    num_sensitive = int(num_samples * sensitivity_ratio)
    num_insensitive = num_samples - num_sensitive

    insensitive_numbers = [{"phoneNumber": generate_unique_phone_number(), "label": 0.1} for _ in range(num_insensitive)]
    sensitive_numbers = [{"phoneNumber": generate_anomalous_phone_number(), "label": 0.9} for _ in range(num_sensitive)]

    data = insensitive_numbers + sensitive_numbers
    random.shuffle(data)
    return data
