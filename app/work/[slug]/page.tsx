import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseView from '@/components/work/CaseView';
import { pageMetadata } from '@/lib/seo';
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
  return pageMetadata({
    title: `${c.client} | Work | Scalina`,
    description: c.summary,
    path: `/work/${c.slug}`,
  });
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getCase(slug)) notFound();
  return <CaseView slug={slug} />;
}
