# EWAYS Frontend Automatic Deployment Script
Write-Host "🚀 Starting EWAYS Frontend Deployment..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
$frontendPath = "e:\EWAYS\eways-frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "📁 Changed to frontend directory" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend directory not found: $frontendPath" -ForegroundColor Red
    exit 1
}

# Install Vercel CLI if not installed
Write-Host "🔧 Checking Vercel CLI..." -ForegroundColor Yellow
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
$buildResult = npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful!" -ForegroundColor Green

# Check if user is logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
try {
    vercel whoami | Out-Null
    Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "🔐 Please login to Vercel..." -ForegroundColor Yellow
    vercel login
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "⚠️  Don't forget to set environment variables in Vercel dashboard:" -ForegroundColor Yellow
Write-Host "   VITE_API_URL = https://your-backend-api-url.com/api" -ForegroundColor Cyan
Write-Host "   VITE_APP_NAME = Eways" -ForegroundColor Cyan
Write-Host "   VITE_APP_VERSION = 1.0.0" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Your website should be live now!" -ForegroundColor Green
