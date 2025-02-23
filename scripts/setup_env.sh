
#!/bin/bash

# Check if requirements.txt exists
if [ ! -f requirements.txt ]; then
    echo "requirements.txt not found. Please make sure it is in the current directory."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python -m venv venv

# Check if virtual environment was created successfully
if [ ! -d "venv" ]; then
    echo "Failed to create virtual environment."
    exit 1
fi

# Activate virtual environment based on OS
echo "Activating virtual environment..."
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv\Scripts\activate
else
    # Unix/Linux/MacOS
    source venv/bin/activate
fi

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Confirm completion
echo "Virtual environment setup complete. To activate it manually, use:"
echo "  source venv/bin/activate  (Unix/Linux/MacOS)"
echo "  venv\Scripts\activate   (Windows)"
