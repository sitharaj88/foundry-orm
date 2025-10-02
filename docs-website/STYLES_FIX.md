# 🎯 SOLUTION: View Your Documentation Website with Styles

## The Problem
The styles aren't loading because of the `basePath: '/orm'` configuration. This is needed for GitHub Pages but causes issues with local preview.

## ✅ Best Solution: Use Development Mode

**Run this command:**
```bash
cd /home/sitharaj/Documents/orm/docs-website
npm run dev
```

Then open: **http://localhost:3000**

### Why This Works:
- ✅ All styles load correctly
- ✅ No basePath issues
- ✅ Hot reload for instant updates
- ✅ Perfect for development

---

## Alternative: Preview Production Build

If you really want to test the production build locally:

### Step 1: Comment out basePath temporarily
Edit `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  // basePath: '/orm', // ← Comment this out
  images: {
    unoptimized: true,
  },
};
```

### Step 2: Rebuild
```bash
npm run build
```

### Step 3: Serve
```bash
npx serve@latest out -p 3000
```

### Step 4: Open
**http://localhost:3000** (now works at root!)

### ⚠️ Important: Before deploying to GitHub
Uncomment the basePath line in `next.config.ts`:
```typescript
basePath: '/orm', // ← Uncomment before deploying!
```

---

## 🚀 For GitHub Pages Deployment

### The basePath is REQUIRED for GitHub Pages
When deployed, your site will be at:
```
https://sitharaj88.github.io/foundry-orm/
```

The `basePath: '/orm'` ensures all assets load correctly at this URL.

### To Deploy:
```bash
# 1. Make sure basePath is UNcommented in next.config.ts
# 2. Commit and push
git add .
git commit -m "Add documentation website"
git push origin main

# 3. Enable GitHub Pages in repository settings
# Settings → Pages → Source: GitHub Actions
```

---

## 📝 Quick Reference

| Scenario | Command | URL | Notes |
|----------|---------|-----|-------|
| **Development** | `npm run dev` | http://localhost:3000 | ✅ Recommended |
| **Local Preview** | Comment basePath → `npm run build` → `npx serve out` | http://localhost:3000 | Uncomment before deploy |
| **GitHub Pages** | Push to GitHub | https://sitharaj88.github.io/foundry-orm/ | Needs basePath |

---

## 🎉 Summary

**For now, just run:**
```bash
cd /home/sitharaj/Documents/orm/docs-website
npm run dev
```

**Then visit:** http://localhost:3000

Your beautiful, styled documentation website will be there! 🚀
