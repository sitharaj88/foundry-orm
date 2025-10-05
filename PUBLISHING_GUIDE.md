# 🚀 Publishing FoundryORM to NPM

## ✅ Pre-Publishing Checklist - COMPLETED

- [x] **Version**: Updated to `0.1.0-alpha.1`
- [x] **Keywords**: Reduced to 15 focused keywords
- [x] **README.md**: Updated with version badges and alpha notice
- [x] **CHANGELOG.md**: Created with v0.1.0-alpha.1 details
- [x] **Author**: Added author information
- [x] **Repository**: GitHub links configured
- [x] **Homepage**: Added homepage URL
- [x] **Bugs**: Added issues URL
- [x] **License**: Apache-2.0 license present
- [x] **.npmignore**: Created to exclude unnecessary files
- [x] **Files**: Configured to include only dist, README, LICENSE
- [x] **Engines**: Set Node.js >= 16.0.0
- [x] **Build**: Successful (`npm run build`)
- [x] **Tests**: Passing (`npm test`)
- [x] **Package Content**: Verified (`npm pack --dry-run`)
- [x] **NPM Login**: Logged in as `sitharaj08`
- [x] **Package Name**: Available (`foundry-orm`)

## 📦 Package Details

- **Name**: foundry-orm
- **Version**: 0.1.0-alpha.1
- **Size**: ~18.7 KB (packed), ~80 KB (unpacked)
- **Files**: 31 files (dist folder + README + LICENSE)
- **Tag**: alpha
- **Access**: public

## 🎯 Publishing Command

```bash
npm publish --tag alpha --access public
```

## 📋 What Happens When You Publish

1. **prepublishOnly script runs**:
   - `npm run build` - Compiles TypeScript
   - `npm test` - Runs test suite

2. **Package is created**:
   - Files are bundled according to `.npmignore`
   - Tarball is created: `foundry-orm-0.1.0-alpha.1.tgz`

3. **Published to npm**:
   - Available at: https://www.npmjs.com/package/foundry-orm
   - Tagged as: `alpha`
   - Can be installed with: `npm install foundry-orm@alpha`

## 📥 Installation After Publishing

Users can install with:

```bash
# Install alpha version (latest pre-release)
npm install foundry-orm@alpha

# Or specific version
npm install foundry-orm@0.1.0-alpha.1
```

## 🔄 Post-Publishing Steps

1. **Verify Publication**
   ```bash
   npm view foundry-orm
   npm view foundry-orm versions
   ```

2. **Test Installation** (in a separate directory)
   ```bash
   mkdir test-install && cd test-install
   npm init -y
   npm install foundry-orm@alpha
   ```

3. **Create Git Tag**
   ```bash
   git add .
   git commit -m "chore: release v0.1.0-alpha.1"
   git tag v0.1.0-alpha.1
   git push origin master --tags
   ```

4. **Create GitHub Release**
   - Go to: https://github.com/sitharaj88/foundry-orm/releases/new
   - Tag: v0.1.0-alpha.1
   - Title: v0.1.0-alpha.1 - Initial Alpha Release
   - Description: Copy from CHANGELOG.md
   - Mark as pre-release: ✓

## 🎉 Ready to Publish!

Everything is configured and tested. When you're ready, run:

```bash
npm publish --tag alpha --access public
```

---

## 🔄 Future Version Updates

### Next Alpha Version (0.1.0-alpha.2)
```bash
npm version prerelease --preid=alpha
npm publish --tag alpha --access public
```

### Move to Beta (0.1.0-beta.1)
```bash
npm version 0.1.0-beta.1
npm publish --tag beta --access public
```

### First Stable Release (1.0.0)
```bash
npm version 1.0.0
npm publish --access public
```
