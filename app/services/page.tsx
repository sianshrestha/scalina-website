import type { Metadata } from 'next';
import ServicesView from '@/components/services/ServicesView';

/* Server shell so the page can carry its own metadata — it was the only route
   inheriting the homepage's title, which meant a /services tab, bookmark and
   search result all read "Go Digital, or Go Invisible." The view underneath is
   a client component because the team is read from the URL. */
export const metadata: Metadata = {
  title: 'Services | Scalina',
  description:
    'What each team sells. Scalina Media: content and UGC, creative and design, production, social and paid. Scalina Systems: websites, custom software, automation and AI, funnels and SEO.',
};

export default function ServicesPage() {
  return <ServicesView />;
}
