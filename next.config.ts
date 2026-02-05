import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  reactCompiler: true,
  images: {
    loaderFile: './src/lib/image-loader.ts',
  },
  transpilePackages: ['@fetchly/live-sessions'],
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
