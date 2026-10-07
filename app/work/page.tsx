import type { Metadata } from 'next';
import WorkView from '@/components/work/WorkView';

export const metadata: Metadata = {
  title: 'Work | Scalina',
  description:
    'Selected work from both Scalina teams: content, social and paid from Scalina Media, and the websites, custom software and automation built by Scalina Systems.',
};

export default function WorkPage() {
  return <WorkView />;
}
