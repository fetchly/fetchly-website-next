import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  reactCompiler: true,
  images: {
    loaderFile: './src/lib/image-loader.ts',
  },
};

export default nextConfig;
