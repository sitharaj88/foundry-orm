import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // Only use static export in production (for GitHub Pages)
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    images: {
      unoptimized: true,
    },
    outputFileTracingRoot: path.join(process.cwd()),
    basePath: '/foundry-orm',
    assetPrefix: '/foundry-orm',
  }),
};

export default nextConfig;
