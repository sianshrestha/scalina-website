import type { Metadata } from 'next';

/* Where the site lives. Canonical URLs, the sitemap, robots.txt and the
   absolute share-image URLs are all built from this. Set in .env.production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalinamedia.com').replace(
  /\/$/,
  ''
);

export const SITE_NAME = 'Scalina';

/* The share image (public/og-image.png, drawn by scripts/og-image). Named on
   every page explicitly: a page that sets its own `openGraph` replaces the
   parent's, so an inherited image silently disappears from inner pages. */
export const SHARE_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Scalina: Go Digital, or Go Invisible. Content, campaigns and the software your business runs on.',
};

/* One page's metadata: title, description, canonical URL, and the same title
   and description for link previews, with the share image. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'en_AU',
      type: 'website',
      images: [SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SHARE_IMAGE] },
  };
}
