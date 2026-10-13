import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Pin the workspace root. Without this, Turbopack walks up and finds the
  // stray package.json in the home directory and warns about it.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

/* Lets `next dev` read Cloudflare bindings (wrangler.jsonc) the same way the
   deployed Worker does. */
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
