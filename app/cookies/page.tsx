import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import LegalView, { type LegalSection } from '@/components/legal/LegalView';
import LegalArticle, { contentsOf } from '@/components/legal/LegalArticle';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = pageMetadata({
  title: 'Cookie Policy | Scalina',
  description:
    'This website sets no advertising or tracking cookies. What Cloudflare does to keep the site secure, and how our visitor statistics work without identifying you.',
  path: '/cookies',
});

/* True of the build as of the date in lib/legal.ts: no first-party cookies,
   no localStorage or sessionStorage, fonts and video self-hosted, no embeds.
   Adding any of those (a chat widget, a YouTube embed, Google Analytics, a
   Meta pixel) makes this page wrong and probably needs a consent banner. */
const SECTIONS: LegalSection[] = [
  {
    id: 'short-version',
    title: 'The short version',
    body: (
      <p>
        This website does not set advertising or tracking cookies, does not store anything in your
        browser, and does not follow you around the web. That is why there is no cookie banner:
        there is nothing to agree to.
      </p>
    ),
  },
  {
    id: 'what-cookies-are',
    title: 'What cookies are',
    body: (
      <p>
        Cookies are small files a website saves in your browser. Some are needed for a site to
        work or stay secure; others are used to track what you do across sites, usually for
        advertising. We do not use the second kind.
      </p>
    ),
  },
  {
    id: 'security',
    title: 'Security cookies from Cloudflare',
    body: (
      <>
        <p>
          Our hosting provider, Cloudflare, may set a strictly necessary cookie (for example{' '}
          <code>__cf_bm</code>) to tell people from bots and protect the site from attacks. It is
          short-lived, is not used for advertising, and the site cannot be protected without it.
        </p>
        <p>
          The enquiry form uses Cloudflare Turnstile to check that a person, not a bot, is sending
          it. Turnstile looks at signals from your browser to do that. It does not use cookies to
          track you, and its data is used only to detect bots.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: 'Visitor statistics',
    body: (
      <p>
        We count visits with Cloudflare Web Analytics, which does not use cookies, does not store
        anything in your browser, and does not identify individual visitors. It tells us things like
        how many people visited a page and which country they were in, never who they were.
      </p>
    ),
  },
  {
    id: 'third-party',
    title: 'Fonts, video and other content',
    body: (
      <p>
        Our fonts, images and videos are served from this website itself, not loaded from Google,
        YouTube or social networks, so viewing a page does not send your details to them. Links to
        our social media accounts only take you there when you click them.
      </p>
    ),
  },
  {
    id: 'control',
    title: 'Controlling cookies',
    body: (
      <p>
        You can block or delete cookies in your browser settings. Blocking Cloudflare&rsquo;s
        security cookie may mean you are asked to complete a check more often, but the site will
        still work.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes and contact',
    body: (
      <p>
        If we start using any cookie that is not strictly necessary, we will update this page and
        ask for your consent first. For more on how we handle personal information, see our{' '}
        <Link href="/privacy">Privacy Policy</Link>, or email{' '}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalView
      eyebrow="Legal"
      title="Cookie Policy"
      lede={<p>No tracking cookies, no advertising cookies, and nothing to accept.</p>}
      contents={contentsOf(SECTIONS)}
    >
      <LegalArticle sections={SECTIONS} />
    </LegalView>
  );
}
