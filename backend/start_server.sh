#!/bin/bash
# Startup script for iShop E-commerce Platform with proper CORS configuration

echo "Starting iShop E-commerce Platform..."

# Check if we're in the backend directory
if [ ! -f "app/main.py" ]; then
    echo "Error: app/main.py not found. Please run this script from the backend directory."
    exit 1
fi

# Check if .env file exists, if not create from example
if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please update the .env file with your specific configuration before continuing."
    echo "At minimum, set a proper SECRET_KEY value."
    exit 1
fi

# Validate essential environment variables
if [ -z "$SECRET_KEY" ] || [ "$SECRET_KEY" = "your-super-secret-and-long-random-key-here-make-it-at-least-32-chars-long" ]; then
    echo "Warning: SECRET_KEY is not properly set in .env file."
    echo "Generating a temporary SECRET_KEY for this session..."
    export SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
fi

echo "Starting the FastAPI application..."
echo "Application will be available at http://localhost:8000"
echo "CORS is configured for:"
if [ "$ENVIRONMENT" = "production" ]; then
    echo "  - Production origins from ALLOWED_ORIGINS variable"
else
    echo "  - Development: http://localhost:5173 (Vite default)"
    echo "  - Development: http://localhost:3000 (Create React App default)"
    echo "  - Production: https://ishooop.org"
    echo "  - Production: https://www.ishooop.org"
fi

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload