#!/bin/bash

echo "🚀 Starting Tech Audit Questionnaire Builder Demo..."
echo "=================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🎯 Starting the development server..."
echo "🌐 The application will open at: http://localhost:3000"
echo "🚀 Click 'Load Demo Data' to see a pre-built example"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm start

