# TypeScript ORM Documentation

🚀 **Professional documentation website for TypeScript ORM** - Built with Next.js 14, Tailwind CSS, and deployed to GitHub Pages.

## 🌟 Features

- **📱 Fully Responsive** - Works perfectly on all devices
- **🎨 Modern UI** - Beautiful design with Tailwind CSS
- **🌙 Dark Mode Ready** - Automatic dark mode support
- **🔍 Syntax Highlighting** - Code examples with syntax highlighting
- **📊 Comprehensive Docs** - Complete API reference and guides
- **🚀 GitHub Pages Deploy** - Automatic deployment via GitHub Actions
- **⚡ Lightning Fast** - Static site generation for optimal performance
- **♿ Accessible** - WCAG compliant

## 📚 Documentation Sections

- **Getting Started** - Installation and quick start guide
- **Core Concepts** - Models, connections, query builder
- **Database Adapters** - PostgreSQL, MySQL, SQLite, MongoDB
- **Advanced Topics** - Transactions, error handling, logging
- **Examples** - Real-world integration examples
- **API Reference** - Complete API documentation

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS
- **Code Highlighting:** react-syntax-highlighter
- **Icons:** Lucide React
- **Deployment:** GitHub Pages via GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
# Navigate to docs directory
cd docs-website

# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build

```bash
# Build for production
npm run build

# The static site will be generated in the 'out' directory
```

## 📁 Project Structure

```
docs-website/
├── app/
│   ├── docs/                    # Documentation pages
│   │   ├── getting-started/     # Getting started guide
│   │   ├── examples/            # Code examples
│   │   ├── adapters/            # Database adapter docs
│   │   ├── api/                 # API reference
│   │   └── ...                  # More doc pages
│   ├── layout.tsx               # Root layout with nav
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/
│   ├── Header.tsx               # Top navigation bar
│   ├── Sidebar.tsx              # Side navigation menu
│   └── CodeBlock.tsx            # Code syntax highlighting
├── public/                      # Static assets
├── .github/
│   └── workflows/
│       └── deploy-docs.yml      # GitHub Pages deployment
├── next.config.ts               # Next.js configuration
└── tailwind.config.ts           # Tailwind configuration
```

## 🌐 Deployment

### GitHub Pages

The documentation is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

#### Setup Steps:

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Configure Repository Name**:
   - Update `basePath` in `next.config.ts` if your repo name is different from `/orm`

3. **Push to Main Branch**:
   ```bash
   git add .
   git commit -m "Update documentation"
   git push origin main
   ```

4. **GitHub Actions** will automatically:
   - Install dependencies
   - Build the Next.js site
   - Deploy to GitHub Pages

5. **Access Your Site**:
   - URL: `https://yourusername.github.io/orm/`

### Manual Deployment

```bash
# Build the site
npm run build

# The 'out' directory contains the static site
# Deploy this directory to any static hosting service
```

## 🎨 Customization

### Update Branding

Edit these files to customize the docs:

- `app/layout.tsx` - Site metadata
- `components/Header.tsx` - Logo and navigation
- `next.config.ts` - Base path and configuration

### Add New Pages

1. Create a new page in `app/docs/[section]/page.tsx`
2. Add the page to navigation in `components/Sidebar.tsx`
3. Use the `CodeBlock` component for code examples

Example:

```tsx
import { CodeBlock } from '@/components/CodeBlock';

export default function MyPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>My Documentation Page</h1>
      <CodeBlock
        code="console.log('Hello World');"
        language="typescript"
        filename="example.ts"
      />
    </div>
  );
}
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the build: `npm run build`
5. Submit a pull request

## 📝 Writing Documentation

### Guidelines

- **Clear and Concise** - Keep explanations simple
- **Code Examples** - Include working code snippets
- **Visual Hierarchy** - Use headings appropriately
- **Links** - Link to related documentation
- **Consistency** - Follow existing patterns

### Code Blocks

Use the `CodeBlock` component for all code examples:

```tsx
<CodeBlock
  code={`your code here`}
  language="typescript"  // or javascript, bash, json, etc.
  filename="optional-filename.ts"
/>
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next out
npm install
npm run build
```

### GitHub Pages Not Updating

1. Check GitHub Actions tab for build errors
2. Verify GitHub Pages is enabled in repository settings
3. Ensure `basePath` in `next.config.ts` matches your repo name

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Links

- **Live Documentation**: https://yourusername.github.io/orm/
- **Main Repository**: https://github.com/yourusername/typescript-orm
- **Report Issues**: https://github.com/yourusername/typescript-orm/issues

---

Built with ❤️ using Next.js and Tailwind CSS
