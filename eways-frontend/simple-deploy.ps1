# Simple Frontend Deployment to Vercel
Write-Host "🚀 EWAYS Frontend Deployment to Vercel" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Navigate to frontend directory
$frontendPath = "e:\EWAYS\eways-frontend"
Set-Location $frontendPath
Write-Host "📁 Working in: $frontendPath" -ForegroundColor Yellow

# Install Vercel CLI globally
Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
npm install -g vercel

# Install project dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
npm install

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy to Vercel
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    Write-Host "Note: You may need to login to Vercel first" -ForegroundColor Cyan
    
    vercel --prod
    
    Write-Host ""
    Write-Host "🎉 Deployment completed!" -ForegroundColor Green
    Write-Host "Don't forget to set environment variables in Vercel dashboard:" -ForegroundColor Yellow
    Write-Host "  VITE_API_URL = https://your-backend-url.com/api" -ForegroundColor Cyan
    Write-Host "  VITE_APP_NAME = Eways" -ForegroundColor Cyan
    Write-Host "  VITE_APP_VERSION = 1.0.0" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ Build failed! Check the errors above." -ForegroundColor Red
}
