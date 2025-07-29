# EWAYS Vercel Deployment Guide

## 🚀 Quick Deploy Commands

### Option 1: Automatic Deployment (Recommended)
```bash
# Push to GitHub (automatic Vercel deployment)
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Option 2: Manual Deployment
```bash
cd eways-frontend
npm ci
npm run build
vercel --prod
```

## 🔧 Pre-deployment Checklist

### 1. Environment Variables
✅ VITE_API_URL is set in Vercel dashboard  
✅ VITE_APP_NAME is configured  
✅ VITE_APP_VERSION is specified  

### 2. Build Configuration
✅ Node.js version 18+ specified (.nvmrc)  
✅ Vercel.json properly configured  
✅ Package.json has correct build scripts  

### 3. Dependencies
✅ All npm packages are up to date  
✅ TypeScript compilation passes  
✅ No build errors locally  

## 🐛 Common Issues & Solutions

### Issue 1: "Command 'vite build' exited with 127"
**Solution:**
- Ensure Node.js 18+ is specified
- Check package.json build scripts
- Verify all dependencies are installed

### Issue 2: "NODE_ENV not supported in .env"
**Solution:**
- Remove NODE_ENV from .env files
- Set in vite.config.ts instead
- Use Vercel's build environment

### Issue 3: Build timeout or memory issues
**Solution:**
- Check chunk sizes (should be < 1MB)
- Optimize large dependencies
- Enable terser minification

## 📊 Deployment Performance

### Current Build Stats:
- **Build time:** ~3.5 seconds
- **Bundle sizes:**
  - CSS: 39.46 kB (6.88 kB gzipped)
  - Lucide icons: 5.99 kB (2.48 kB gzipped)
  - GSAP: 69.66 kB (27.30 kB gzipped)
  - Main JS: 109.53 kB (32.32 kB gzipped)
  - React: 139.34 kB (45.07 kB gzipped)

### Optimization Features:
✅ Asset compression with gzip  
✅ Code splitting by vendor  
✅ Tree shaking enabled  
✅ Minification with terser  

## 🔗 Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Select your project: `eways-revamp`
3. Check deployment status
4. View build logs if needed

## 🚨 Emergency Rollback

If deployment fails:
```bash
# Rollback to previous commit
git log --oneline -5
git reset --hard <previous-commit-hash>
git push origin main --force
```

## 📞 Support

If issues persist:
1. Check Vercel build logs
2. Test local build: `npm run build`
3. Verify TypeScript: `npm run typecheck`
4. Contact support with error details

---
**Last Updated:** July 29, 2025  
**Status:** ✅ Ready for Production
