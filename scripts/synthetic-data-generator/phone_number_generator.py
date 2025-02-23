
import random

COUNTRY_CODES = ['+1', '+44', '+91', '+49', '+33', '+81', '+86', '+7', '+380', '+972']  # US, UK, India, Germany, France, Japan, China, Russia, Ukraine, Israel
generated_numbers = set()

def generate_unique_phone_number():
    while True:
        country_code = random.choice(COUNTRY_CODES)
        number_length = random.randint(8, 11)  # Random length for variation
        number = ''.join([str(random.randint(0, 9)) for _ in range(number_length)])
        phone_number = f"{country_code}{number}"
        if phone_number not in generated_numbers:
            generated_numbers.add(phone_number)
            return phone_number
    