import type { MetadataRoute } from 'next';
import { CASES } from '@/lib/work';
import { SITE_URL } from '@/lib/seo';

/* Every public route. Case studies come from lib/work.ts, so a new client is
   in the sitemap the moment it has a page. Submit /sitemap.xml in Google
   Search Console once the domain is verified. */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'monthly',
    priority,
  });

  return [
    page('/', 1),
    page('/services', 0.9),
    page('/work', 0.9),
    page('/about', 0.8),
    page('/start', 0.8),
    ...CASES.map((c) => page(`/work/${c.slug}`, 0.7)),
    page('/privacy', 0.2),
    page('/terms', 0.2),
    page('/cookies', 0.2),
  ];
}
