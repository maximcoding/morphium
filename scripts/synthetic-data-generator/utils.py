import random

# ====================
# Configuration
# ====================
# Country codes for phone number generation
COUNTRY_CODES = ['+1', '+44', '+91', '+49', '+33', '+81', '+86', '+7', '+380', '+972']
# Blacklisted prefixes and anomalous patterns for anomaly generation
BLACKLISTED_PREFIXES = ['+999', '+12345', '+666', '+000']
ANOMALOUS_PATTERNS = ['1111111111', '1234567890', '0000000000']

# Set to store generated phone numbers to ensure uniqueness
generated_numbers = set()

# ====================
# Helper Functions
# ====================
def generate_random_digits(length):
    """
    Generates a random sequence of digits of a specified length.
    """
    return ''.join(random.choices('0123456789', k=length))

def is_unique_phone_number(phone_number):
    """
    Checks if the generated phone number is unique.
    """
    return phone_number not in generated_numbers

# ====================
# Phone Number Generation
# ====================
def generate_unique_phone_number():
    """
    Generates a unique and valid phone number.
    Ensures uniqueness by storing generated numbers in a set.
    """
    while True:
        # Choose a random country code and a random length for variation
        country_code = random.choice(COUNTRY_CODES)
        number_length = random.randint(8, 11)  # Standard length for phone numbers
        number = generate_random_digits(number_length)

        # Concatenate to form the phone number
        phone_number = f"{country_code}{number}"

        # Check uniqueness before returning
        if is_unique_phone_number(phone_number):
            generated_numbers.add(phone_number)
            return phone_number

# ====================
# Anomalous Phone Number Generation
# ====================
def generate_anomalous_phone_number():
    """
    Generates an anomalous phone number by introducing anomalies in:
    - Format (too short, too long)
    - Pattern (repeated digits, suspicious sequences)
    - Blacklist (prefixes known for spam or invalid numbers)
    """
    anomaly_type = random.choice(['format', 'pattern', 'blacklist'])

    # Format Anomalies: Too short, too long, or illegal characters
    if anomaly_type == 'format':
        # 50% chance for too short or too long
        if random.random() < 0.5:
            # Too short (e.g., +1234)
            return '+' + generate_random_digits(random.randint(3, 7))
        else:
            # Too long (e.g., +123456789012345)
            return '+' + generate_random_digits(random.randint(12, 15))

    # Pattern Anomalies: Repeated digits or suspicious sequences
    elif anomaly_type == 'pattern':
        return '+' + random.choice(ANOMALOUS_PATTERNS)

    # Blacklist Anomalies: Using blacklisted prefixes
    elif anomaly_type == 'blacklist':
        return random.choice(BLACKLISTED_PREFIXES) + generate_random_digits(7)

# ====================
# Testing and Validation
# ====================
if __name__ == "__main__":
    # Generate and print unique phone numbers
    print("Unique Phone Numbers:")
    for _ in range(5):
        print(generate_unique_phone_number())

    # Generate and print anomalous phone numbers
    print("\nAnomalous Phone Numbers:")
    for _ in range(5):
        print(generate_anomalous_phone_number())
