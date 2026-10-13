import type { Metadata, Viewport } from 'next';
import { Inter_Tight, IBM_Plex_Mono, Oswald } from 'next/font/google';
import 'lenis/dist/lenis.css';
import './globals.css';
import Script from 'next/script';
import SmoothScroll from '@/components/SmoothScroll';
import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import { PHONE, SOCIAL_LINKS } from '@/lib/content';

/* Three faces, and only three — see DESIGN.md §2.

   Oswald 700 uppercase is the display face: headings, section titles, the hero
   wordmark, the overlay menu, the logo. Always -0.02em, and only ever two or
   three words at a time.

   Inter Tight carries body, UI, and any heading that is a full sentence — a
   whole sentence in condensed caps is a wall.

   IBM Plex Mono is reserved for tracked-out labels, stage numbers and section
   eyebrows. Never body copy.

   Fraunces was the fourth face and is gone: it survived only on the closing
   CTA, the four stage card titles and the manifesto line, which is a whole
   variable-font download for three pieces of text in a system that has no
   serif in it. */
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-plex-mono',
  display: 'swap',
});

/* Defaults every page inherits. Each page sets its own title, description and
   canonical through `pageMetadata` (lib/seo.ts), which also names the share
   image; these are the fallback for anything that does not. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Scalina | Go Digital, or Go Invisible.',
  description:
    'Scalina builds the content, the campaigns, and the system your business runs on. One team for the work that brings people in, and one for the work that keeps them.',
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, locale: 'en_AU', type: 'website', images: [SHARE_IMAGE] },
  twitter: { card: 'summary_large_image', images: [SHARE_IMAGE] },
};

/* Cloudflare Web Analytics: cookieless, so no consent banner (see /cookies).
   Only loads when a beacon token is set in .env.production. */
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

/* Who runs the site, for search engines. Only facts the site already states.
   `sameAs` ties the site to its social profiles (and, through them, to the
   Google Business Profile); LinkedIn joins when lib/content.ts has it. */
const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: ['Scalina Media', 'Scalina Systems'],
  url: SITE_URL,
  logo: `${SITE_URL}/apple-icon.png`,
  email: 'info@scalinamedia.com',
  telephone: PHONE.international,
  sameAs: SOCIAL_LINKS.map((link) => link.href),
  slogan: 'Go Digital, or Go Invisible.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sydney',
    addressRegion: 'NSW',
    addressCountry: 'AU',
  },
  areaServed: 'AU',
};

export const viewport: Viewport = {
  themeColor: '#0B0D12',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${interTight.variable} ${oswald.variable} ${plexMono.variable}`}>
      <head>
        {/* Reveals start at opacity 0 and the hero opens from a black,
            chrome-less state — both are resolved by GSAP. If JS never runs,
            this makes sure the page is still fully readable. Keyed on data
            attributes rather than class names so it cannot drift when the CSS
            module hashes change. */}
        <noscript>
          <style>{`[class*="Reveal_reveal"],[class*="Reveal_lineInner"]{opacity:1!important;transform:none!important}[class*="Reveal_clipMedia"]>:first-child{clip-path:none!important}[data-hero-curtain]{display:none!important}[data-hero-text]{opacity:1!important;visibility:visible!important;transform:none!important}[data-hero-fill]{clip-path:none!important}[data-hero-outline]{opacity:0!important}[data-site-chrome]{opacity:1!important;visibility:visible!important}[data-word-rise]{transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SmoothScroll />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }}
        />
        {CF_BEACON_TOKEN ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          />
        ) : null}
      </body>
    </html>
  );
}
