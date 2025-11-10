#!/bin/bash
set -e

# Run database migrations
echo "🔄 Running database migrations..."
python run_migrations.py

# Start the application
echo "🚀 Starting the application..."
exec "$@"