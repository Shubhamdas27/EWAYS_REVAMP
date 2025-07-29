#!/bin/bash

# EWAYS Full Stack Deployment Script for Vercel
echo "🚀 EWAYS Full Stack Deployment Setup"
echo "====================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the root directory (where package.json is located)"
    exit 1
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd eways-frontend
npm install
cd ..

# Install backend dependencies  
echo "📦 Installing backend dependencies..."
cd eways-backend
npm install
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd eways-frontend
npm run build
cd ..

# Test build
echo "🧪 Testing build..."
if [ -d "eways-frontend/dist" ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment completed!"
echo "🌐 Your app should be live on Vercel"
