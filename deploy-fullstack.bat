@echo off
REM EWAYS Full Stack Deployment Script for Vercel (Windows)
echo 🚀 EWAYS Full Stack Deployment Setup
echo =====================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the root directory where package.json is located
    exit /b 1
)

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd eways-frontend
call npm install
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd eways-backend
call npm install
cd ..

REM Build frontend
echo 🔨 Building frontend...
cd eways-frontend
call npm run build
cd ..

REM Test build
echo 🧪 Testing build...
if exist "eways-frontend\dist" (
    echo ✅ Frontend build successful
) else (
    echo ❌ Frontend build failed
    exit /b 1
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call npx vercel --prod

echo ✅ Deployment completed!
echo 🌐 Your app should be live on Vercel
