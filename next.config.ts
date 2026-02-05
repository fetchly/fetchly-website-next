import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ── Live-sessions env validation ──────────────────────────────────────
// Both vars must be set together. See .env.example and README.md for setup.
const trackerUrl = process.env.NEXT_PUBLIC_TRACKER_URL;
const trackerSiteId = process.env.NEXT_PUBLIC_TRACKER_SITE_ID;

if (trackerUrl && !trackerSiteId) {
  throw new Error(
    'NEXT_PUBLIC_TRACKER_URL is set but NEXT_PUBLIC_TRACKER_SITE_ID is missing.\n' +
    'Both are required for live-session tracking. See .env.example for details.',
  );
}
if (!trackerUrl && trackerSiteId) {
  throw new Error(
    'NEXT_PUBLIC_TRACKER_SITE_ID is set but NEXT_PUBLIC_TRACKER_URL is missing.\n' +
    'Both are required for live-session tracking. See .env.example for details.',
  );
}
if (trackerUrl && !/^https?:\/\/.+/.test(trackerUrl)) {
  throw new Error(
    `NEXT_PUBLIC_TRACKER_URL must be a valid URL (got "${trackerUrl}").\n` +
    'Example: http://localhost:3800 (dev) or https://sessions.fetch.ly (prod).',
  );
}

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  reactCompiler: true,
  turbopack: {},
  images: {
    loaderFile: './src/lib/image-loader.ts',
  },
  transpilePackages: ['@fetchly/live-sessions'],
  async headers() {
    if (!trackerUrl) return [];
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: trackerUrl },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: trackerUrl },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
