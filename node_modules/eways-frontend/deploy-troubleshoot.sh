#!/bin/bash

# EWAYS Frontend - Vercel Deployment Troubleshooting Script
echo "🚀 EWAYS Frontend Deployment Script"
echo "=================================="

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version
npm --version

# Clean install dependencies
echo "🧹 Cleaning and installing dependencies..."
rm -rf node_modules package-lock.json
npm install

# Update browserslist
echo "🔄 Updating browserslist..."
npx update-browserslist-db@latest

# Run TypeScript check
echo "🔍 Running TypeScript check..."
npm run typecheck

# Build the project
echo "🔨 Building the project..."
npm run build

# Check build output
echo "📁 Build output:"
ls -la dist/

echo "✅ Build completed successfully!"
echo "📦 Deploy with: vercel --prod"
