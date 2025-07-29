# Vercel Deployment Guide for EWAYS Frontend

## Prerequisites
1. Ensure your backend API is deployed and accessible
2. Update the `VITE_API_URL` environment variable in Vercel dashboard

## Deployment Steps

### 1. Environment Variables in Vercel
Set the following environment variables in your Vercel dashboard:
- `VITE_API_URL` = Your backend API URL (e.g., https://your-backend.herokuapp.com/api)
- `VITE_APP_NAME` = Eways
- `VITE_APP_VERSION` = 1.0.0

### 2. Build Settings
Vercel should automatically detect the build settings from `vercel.json`, but ensure:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 3. Domain Setup
Once deployed, you can:
- Use the provided vercel.app domain
- Add your custom domain in the Vercel dashboard

## Common Issues & Solutions

### 1. Build Failures
- Check that all dependencies are properly installed
- Ensure TypeScript compilation passes
- Verify environment variables are set

### 2. Runtime Errors
- Make sure GSAP is properly loaded
- Check that API endpoints are accessible
- Verify CORS settings on your backend

### 3. 404 Errors on Refresh
- The `vercel.json` file includes rewrites to handle SPA routing
- All routes will be redirected to `index.html`

## Post-Deployment Checklist
- [ ] Test all pages load correctly
- [ ] Verify contact form submissions work
- [ ] Check career form file uploads
- [ ] Test responsive design on mobile
- [ ] Verify all animations work properly
- [ ] Test API connectivity

## Troubleshooting
If you encounter issues:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Test the build locally with `npm run build && npm run preview`
4. Ensure your backend API allows requests from your Vercel domain
