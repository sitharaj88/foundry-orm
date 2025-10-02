import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: path.join(process.cwd()),
  basePath: '/foundry-orm',
  assetPrefix: '/foundry-orm',
};

export default nextConfig;
