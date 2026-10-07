import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up and finds the
  // stray package.json in the home directory and warns about it.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
