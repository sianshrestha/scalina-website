import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseView from '@/components/work/CaseView';
import { CASES, getCase } from '@/lib/work';

/* One case study per client, prerendered. Only the slugs in lib/work.ts exist;
   anything else is a 404 rather than an empty page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: `${c.client} | Work | Scalina`,
    description: c.summary,
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCase(slug)) notFound();
  return <CaseView slug={slug} />;
}
