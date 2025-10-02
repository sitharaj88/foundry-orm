# Documentation Website - Quick Start Guide

## ✅ Issues Fixed

1. **Multiple lockfiles warning** - Added `outputFileTracingRoot` to Next.js config
2. **Start command error** - Replaced `next start` with `npm run preview` for static exports

## 🚀 Development & Preview

### Development Mode (Recommended for local work)
```bash
cd docs-website
npm run dev
```
- Opens at: `http://localhost:3000`
- Hot reload enabled
- No basePath issues

### Preview Production Build
```bash
cd docs-website
npm run build
npm run preview
```
- Serves the static export
- Opens at: `http://localhost:3000/orm/` ⚠️ **Note the `/orm/` path!**
- This simulates GitHub Pages deployment

## 📝 Important Notes

### BasePath Configuration
The site is configured with `basePath: '/orm'` in `next.config.ts`. This means:

**Local Development (`npm run dev`):**
- ✅ Access at: `http://localhost:3000`
- No `/orm/` prefix needed

**Production Preview (`npm run preview`):**
- ✅ Access at: `http://localhost:3000/orm/`
- ⚠️ Must include `/orm/` prefix

**GitHub Pages (deployed):**
- ✅ Access at: `https://yourusername.github.io/orm/`
- Automatically includes `/orm/` prefix

### Why the BasePath?
GitHub Pages serves your site at `https://username.github.io/repository-name/`, so we need the basePath to match your repository name. 

**To Change Repository Name:**
1. Edit `next.config.ts`
2. Change `basePath: '/orm'` to `basePath: '/your-repo-name'`
3. Rebuild: `npm run build`

## 🔧 Common Commands

```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview built site
npm run preview

# Check for lint errors
npm run lint
```

## 📂 Output Structure

After `npm run build`, the `out/` directory contains:
```
out/
├── index.html           # Homepage
├── docs/
│   ├── getting-started/
│   └── examples/
├── _next/              # Next.js assets
└── *.html              # Other pages
```

## 🌐 Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add documentation website"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

3. **Wait for deployment:**
   - Check Actions tab for build status
   - Site will be live at: `https://yourusername.github.io/orm/`

### Manual Deployment

```bash
# Build the site
npm run build

# The 'out' directory can be deployed to any static host:
# - Netlify
# - Vercel
# - AWS S3
# - Any web server
```

## 🐛 Troubleshooting

### "404 Not Found" on preview
**Problem:** Accessing `http://localhost:3000` shows 404

**Solution:** Access `http://localhost:3000/orm/` instead (note the `/orm/` path)

### Build warnings about lockfiles
**Solution:** Already fixed! The `outputFileTracingRoot` is configured.

### GitHub Pages not updating
1. Check Actions tab for build errors
2. Verify GitHub Pages is enabled in Settings
3. Ensure `.github/workflows/deploy-docs.yml` is committed
4. Check that `basePath` matches repository name

### Assets not loading
1. Verify `basePath` in `next.config.ts` matches your repo name
2. Rebuild: `npm run build`
3. Clear browser cache

## 📚 Adding New Pages

1. Create a new page file:
   ```tsx
   // app/docs/my-page/page.tsx
   export default function MyPage() {
     return <div>My content</div>;
   }
   ```

2. Add to sidebar navigation:
   ```tsx
   // components/Sidebar.tsx
   {
     title: 'My Section',
     items: [
       { title: 'My Page', href: '/orm/docs/my-page' },
     ],
   }
   ```

3. Rebuild and test:
   ```bash
   npm run build
   npm run preview
   ```

## ✨ Tips

- **Use `npm run dev` for development** - It's faster and doesn't require the `/orm/` path
- **Test with `npm run preview`** before deploying - Catches path issues
- **Check GitHub Actions logs** if deployment fails
- **Update GitHub username** in links throughout the docs

---

**Need help?** Check the main README or create an issue on GitHub.
