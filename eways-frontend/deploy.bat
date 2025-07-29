@echo off
echo Starting EWAYS Frontend Deployment Process...
echo.

echo Step 1: Installing Vercel CLI globally (if not already installed)
npm install -g vercel

echo.
echo Step 2: Logging into Vercel
vercel login

echo.
echo Step 3: Setting up environment variables
echo Please set these environment variables in Vercel dashboard:
echo VITE_API_URL=https://your-backend-api-url.com/api
echo VITE_APP_NAME=Eways
echo VITE_APP_VERSION=1.0.0
echo.

echo Step 4: Installing project dependencies
npm install

echo.
echo Step 5: Building the project locally to check for errors
npm run build

echo.
echo Step 6: Deploying to Vercel
vercel --prod

echo.
echo Deployment completed! Check your Vercel dashboard for the live URL.
pause
