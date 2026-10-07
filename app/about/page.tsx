import type { Metadata } from 'next';
import AboutView from '@/components/about/AboutView';

/* Server shell so the page can carry its own metadata — the view underneath is
   a client component because the ground rhythm measures scroll. */
export const metadata: Metadata = {
  title: 'About | Scalina',
  description:
    'Two specialist teams under one roof: Scalina Media makes the content that gets a business found, Scalina Systems builds the software it runs on. Australian, Sydney-born, working nationally.',
};

export default function AboutPage() {
  return <AboutView />;
}
