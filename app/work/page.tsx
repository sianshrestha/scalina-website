import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import WorkView from '@/components/work/WorkView';

export const metadata: Metadata = pageMetadata({
  title: 'Work | Scalina',
  description:
    'Selected work from both Scalina teams: content, social and paid from Scalina Media, and the websites, custom software and automation built by Scalina Systems.',
  path: '/work',
});

export default function WorkPage() {
  return <WorkView />;
}
