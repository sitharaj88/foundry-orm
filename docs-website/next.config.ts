import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: path.join(process.cwd()),
  // No basePath - GitHub Pages handles this automatically
  // Local preview uses serve-script.js with URL rewriting
};

export default nextConfig;
