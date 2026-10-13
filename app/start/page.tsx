import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import StartView from '@/components/start/StartView';

/* Server shell so the page can carry its own metadata — the view underneath is
   a client component because the enquiry flow and the ground rhythm both need
   to be. */
export const metadata: Metadata = pageMetadata({
  title: 'Start a project | Scalina',
  description:
    'Tell us what you are trying to do. A handful of taps and two fields, no brief required. You will get a reply from someone who has read it, within one business day.',
  path: '/start',
});

export default function StartPage() {
  return <StartView />;
}
