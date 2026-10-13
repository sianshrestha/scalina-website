import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

/* Every page on this site is prerendered at build time and none revalidates,
   so the incremental cache is read-only and served from Workers Static Assets.
   No R2 bucket, queue or tag cache is needed. If a page ever starts using
   `revalidate`, this has to move to the R2 cache (see opennext.js.org). */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
