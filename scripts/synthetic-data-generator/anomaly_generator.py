
import random
from utils import generate_unique_phone_number, generate_anomalous_phone_number

ANOMALY_RATIO = 0.01
TOTAL_SAMPLES = 10

def generate_anomaly_data(num_samples=TOTAL_SAMPLES, anomaly_ratio=ANOMALY_RATIO):
    data = []
    num_anomalies = int(num_samples * anomaly_ratio)
    num_normal = num_samples - num_anomalies

    # Generate normal numbers
    for _ in range(num_normal):
        phone_number = generate_unique_phone_number()
        data.append({"phoneNumber": phone_number, "label": 0})  # Normal

    # Generate anomalous numbers
    for _ in range(num_anomalies):
        phone_number = generate_anomalous_phone_number()
        data.append({"phoneNumber": phone_number, "label": 1})  # Anomalous

    # Shuffle data to mix normal and anomalous samples
    random.shuffle(data)
    return data
