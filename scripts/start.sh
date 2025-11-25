#!/bin/bash

# SAMACHAR Quick Start Script

echo "🗞️  Starting SAMACHAR News Aggregator..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Please edit .env and add your NEWS_API_KEY"
    echo ""
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

# Check for superuser
echo ""
echo "👤 Do you want to create a superuser? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "📱 Access the app at: http://127.0.0.1:8000/"
echo "🔐 Admin panel at: http://127.0.0.1:8000/admin/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start server
python manage.py runserver
