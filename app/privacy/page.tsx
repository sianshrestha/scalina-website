import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import LegalView, { type LegalSection } from '@/components/legal/LegalView';
import LegalArticle, { contentsOf } from '@/components/legal/LegalArticle';
import { LEGAL, operatorName } from '@/lib/legal';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy | Scalina',
  description:
    'What personal information Scalina collects through this website, why, who processes it on our behalf, and how to access, correct or delete it.',
  path: '/privacy',
});

/* Written against what the site actually does: the only personal information
   it collects is what someone types into /start (lib/enquiry.ts is the full
   list of answers). If the form, the email provider, the CRM or analytics
   change, this page has to change with them. Not legal advice: have it
   reviewed before relying on it. */
const mail = <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    body: (
      <>
        <p>
          This website is run by {operatorName()}, an Australian creative, growth and technology agency based
          in {LEGAL.location}. In this policy, &ldquo;we&rdquo;, &ldquo;us&rdquo; and
          &ldquo;our&rdquo; mean {LEGAL.brand}.
        </p>
        <p>
          We handle personal information in line with the Australian Privacy Principles in the{' '}
          <em>Privacy Act 1988</em> (Cth). For anything in this policy, contact us at {mail}.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    body: (
      <>
        <p>
          You can browse this website without telling us who you are. We only collect personal
          information when you choose to send us an enquiry through the{' '}
          <Link href="/start">Start a project</Link> form or email us directly. The form asks for:
        </p>
        <ul>
          <li>
            <strong>Your contact details:</strong> your name and email address (required), and
            optionally your company, phone number and a note.
          </li>
          <li>
            <strong>About your enquiry:</strong> why you are getting in touch, the services you are
            interested in, your goals and what is getting in the way, your sector and team size,
            what you already have, your timeline and a budget range. These are multiple-choice
            answers.
          </li>
          <li>
            <strong>How you found us:</strong> the option you pick, plus the page that referred you
            and any campaign tags in the link you arrived on (for example{' '}
            <code>utm_source</code>), and when you arrived.
          </li>
        </ul>
        <p>
          When you use the site, our hosting and security provider also processes technical
          information such as your IP address, browser type and the pages you request. This is
          needed to deliver the site, protect it from abuse and keep it running.
        </p>
      </>
    ),
  },
  {
    id: 'how-we-use-it',
    title: 'How we use it',
    body: (
      <>
        <p>We use the information you send us to:</p>
        <ul>
          <li>reply to your enquiry and work out who on our team should pick it up;</li>
          <li>prepare for a conversation, a quote or a proposal you have asked for;</li>
          <li>keep a record of our dealings with you if we go on to work together; and</li>
          <li>
            understand, in aggregate, what businesses are asking for, so we can improve our
            services and this website.
          </li>
        </ul>
        <p>
          We do not sell your information, and we do not add you to a mailing list because you sent
          an enquiry. If we ever want to send you marketing, we will ask first, and every message
          will let you opt out.
        </p>
      </>
    ),
  },
  {
    id: 'who-processes-it',
    title: 'Who processes it for us',
    body: (
      <>
        <p>
          Your enquiry goes to our own team and nowhere else, but a few service providers handle it
          on our behalf to make that possible. They may only use it to provide their service to
          us:
        </p>
        <ul>
          <li>
            <strong>Cloudflare</strong> hosts this website, protects it from bots and abuse
            (including the Turnstile check on the enquiry form), and provides privacy-friendly
            visitor statistics.
          </li>
          <li>
            <strong>Resend</strong> delivers your enquiry to our inbox as an email.
          </li>
          <li>
            <strong>Google Workspace</strong> provides the inbox your enquiry arrives in.
          </li>
          <li>
            Our customer relationship management system, where we may keep a record of your
            enquiry and any work that follows.
          </li>
        </ul>
        <p>
          We may also disclose information where the law requires it, or to professional advisers
          such as our accountant or lawyer under a duty of confidence.
        </p>
      </>
    ),
  },
  {
    id: 'overseas',
    title: 'Information stored overseas',
    body: (
      <p>
        Some of our providers, including Cloudflare, Resend and Google, store or process data
        outside Australia, mainly in the United States. We choose providers that protect personal
        information to a standard comparable to the Australian Privacy Principles, but by sending
        us an enquiry you understand that it may be handled outside Australia.
      </p>
    ),
  },
  {
    id: 'cookies-analytics',
    title: 'Cookies and analytics',
    body: (
      <p>
        This website does not use advertising or tracking cookies, and our visitor statistics do
        not identify you. Our <Link href="/cookies">Cookie Policy</Link> explains the details.
      </p>
    ),
  },
  {
    id: 'security-retention',
    title: 'Security and how long we keep it',
    body: (
      <>
        <p>
          The site is served only over an encrypted connection, the enquiry form is protected
          against automated abuse, and access to enquiries is limited to the people on our team who
          need it.
        </p>
        <p>
          We keep enquiries for as long as we need them to respond and to maintain our business
          records, and then delete or de-identify them. If you become a client, we keep records of
          our work together for as long as the law requires.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Accessing, correcting or deleting your information',
    body: (
      <>
        <p>
          You can ask to see the personal information we hold about you, ask us to correct it, or
          ask us to delete it, by emailing {mail}. We will respond within 30 days. We may need to
          confirm your identity first, and in limited cases the law may allow or require us to keep
          something; if so, we will tell you why.
        </p>
        <p>
          You do not have to give us your personal information, and you can contact us without
          using the form. Without a name and an email address, though, we cannot reply.
        </p>
      </>
    ),
  },
  {
    id: 'complaints',
    title: 'Complaints',
    body: (
      <p>
        If you are concerned about how we have handled your personal information, email us at{' '}
        {mail} and we will respond within 30 days. If you are not satisfied with our response, you
        can contact the Office of the Australian Information Commissioner at{' '}
        <a href="https://www.oaic.gov.au" rel="noopener noreferrer" target="_blank">
          oaic.gov.au
        </a>
        .
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <p>
        We will update this policy when the way we handle personal information changes. The date at
        the top of the page shows when it last changed.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalView
      eyebrow="Legal"
      title="Privacy Policy"
      lede={
        <p>
          The short version: we only collect what you choose to send us, we use it to reply to
          you, and we never sell it or put you on a mailing list.
        </p>
      }
      contents={contentsOf(SECTIONS)}
    >
      <LegalArticle sections={SECTIONS} />
    </LegalView>
  );
}
