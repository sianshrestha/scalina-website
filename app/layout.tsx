import type { Metadata, Viewport } from 'next';
import { Inter_Tight, IBM_Plex_Mono, Oswald } from 'next/font/google';
import 'lenis/dist/lenis.css';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

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

export const metadata: Metadata = {
  title: 'Scalina | Go Digital, or Go Invisible.',
  description:
    'Scalina builds the content, the campaigns, and the system your business runs on. One team for the work that brings people in, and one for the work that keeps them.',
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
      </body>
    </html>
  );
}
