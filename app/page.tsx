import type { Metadata } from 'next';
import HomeView from '@/components/HomeView';
import { pageMetadata } from '@/lib/seo';

/* Server shell so the homepage carries its own metadata; the view is a client
   component because the ground rhythm and smooth anchors measure scroll. */
export const metadata: Metadata = pageMetadata({
  title: 'Scalina | Go Digital, or Go Invisible.',
  description:
    'Scalina is an Australian creative, growth and technology agency. Scalina Media makes the content and campaigns that get a business found; Scalina Systems builds the websites, software and automation it runs on.',
  path: '/',
});

export default function HomePage() {
  return <HomeView />;
}
