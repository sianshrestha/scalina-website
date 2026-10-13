import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import LegalView, { type LegalSection } from '@/components/legal/LegalView';
import LegalArticle, { contentsOf } from '@/components/legal/LegalArticle';
import { LEGAL, operatorName } from '@/lib/legal';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use | Scalina',
  description:
    'The terms for using the Scalina website: content and intellectual property, case studies, enquiries and quotes, links, liability and governing law.',
  path: '/terms',
});

/* Terms of use for the WEBSITE. Client engagements are governed by their own
   proposal or agreement, and this page says so rather than trying to be a
   services contract. Not legal advice: have it reviewed before relying on it. */
const mail = <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: 'about',
    title: 'About these terms',
    body: (
      <>
        <p>
          These terms apply to your use of this website, which is run by {operatorName()} of{' '}
          {LEGAL.location} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you agree to
          them. If you do not agree, please do not use the site.
        </p>
        <p>
          They cover the website only. Any work we do for you is governed by the proposal or
          agreement we sign with you, which takes priority over anything on this site.
        </p>
      </>
    ),
  },
  {
    id: 'content',
    title: 'Our content',
    body: (
      <>
        <p>
          The text, design, graphics, logos, code and other material on this site belong to us or
          are used with permission. You may view and share pages for your own information, but you
          may not copy, republish, sell or adapt any of it without our written permission.
        </p>
        <p>
          &ldquo;Scalina&rdquo;, &ldquo;Scalina Media&rdquo;, &ldquo;Scalina Systems&rdquo; and
          our logo identify our business. Please do not use them in a way that suggests we endorse
          you or your product.
        </p>
      </>
    ),
  },
  {
    id: 'case-studies',
    title: 'Case studies and client work',
    body: (
      <>
        <p>
          The clients shown on this site are named with their permission. Their names, logos,
          products and the content we made for them belong to them or to us under our agreements,
          and are shown here only as examples of our work.
        </p>
        <p>
          Figures in our case studies are counted from real projects and describe those projects.
          They are not a promise that any other project will achieve the same result. Screens of
          software we have built may use sample data rather than a client&rsquo;s real records.
        </p>
      </>
    ),
  },
  {
    id: 'enquiries',
    title: 'Enquiries and quotes',
    body: (
      <>
        <p>
          Sending an enquiry through the <Link href="/start">Start a project</Link> form does not
          create an agreement between us, and neither does anything we say in reply until both of
          us sign a proposal or agreement. Any quote is an estimate for the scope described in it.
        </p>
        <p>
          Please make sure what you send us is accurate, and do not send anything confidential
          until we have agreed how it will be handled. Our{' '}
          <Link href="/privacy">Privacy Policy</Link> explains what we do with your details.
        </p>
      </>
    ),
  },
  {
    id: 'acceptable-use',
    title: 'Using the site',
    body: (
      <>
        <p>When using this site, you must not:</p>
        <ul>
          <li>use it for anything unlawful, misleading or harmful;</li>
          <li>
            send spam, automated or bulk submissions through the enquiry form, or try to get around
            its bot protection;
          </li>
          <li>
            try to gain unauthorised access to the site or the systems behind it, or interfere with
            how it works; or
          </li>
          <li>scrape or copy the site in bulk.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'links',
    title: 'Links to other sites',
    body: (
      <p>
        This site links to other websites, including our clients&rsquo; sites and our social media
        accounts. We do not control them and are not responsible for their content or their
        privacy practices.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'Accuracy and liability',
    body: (
      <>
        <p>
          We work to keep this site accurate and available, but it is general information about
          our business, not advice, and we do not guarantee that it is complete, current or free of
          errors, or that it will always be available.
        </p>
        <p>
          Nothing in these terms excludes, restricts or modifies any right or remedy you have under
          the Australian Consumer Law or any other law that cannot be excluded. Subject to that, we
          are not liable for any loss arising from your use of, or reliance on, this website.
        </p>
      </>
    ),
  },
  {
    id: 'law',
    title: 'Governing law',
    body: (
      <p>
        These terms are governed by the laws of {LEGAL.jurisdiction}, Australia, and you agree to
        the non-exclusive jurisdiction of its courts.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes and contact',
    body: (
      <p>
        We may update these terms from time to time; the date at the top shows when they last
        changed, and using the site after a change means you accept it. Questions about these
        terms can go to {mail}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalView
      eyebrow="Legal"
      title="Terms of Use"
      lede={
        <p>
          The rules for using this website. Work we do for you is covered by the proposal or
          agreement we sign together, not by this page.
        </p>
      }
      contents={contentsOf(SECTIONS)}
    >
      <LegalArticle sections={SECTIONS} />
    </LegalView>
  );
}
