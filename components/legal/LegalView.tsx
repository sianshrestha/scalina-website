'use client';

import { useRef, type ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClosingBlock from '@/components/ClosingBlock';
import WordRise from '@/components/WordRise';
import { useGroundRhythm } from '@/lib/useGroundRhythm';
import { LEGAL } from '@/lib/legal';
import styles from './LegalView.module.css';

export type LegalSection = { id: string; title: string; body: ReactNode };

/* /privacy, /terms and /cookies.

   Long-form reading, so the page is quiet on purpose: one light ground from top
   to footer, no reveals on the body (a policy that fades in paragraph by
   paragraph is one you cannot skim), and a contents list beside the text on
   wide screens so a reader can jump to the one section they came for.

   The copy is rendered on the server by `LegalArticle` and arrives as
   `children`; only the contents list (ids and titles) crosses as data. Passing
   the section bodies themselves as props made React re-check their children
   as unkeyed lists on the client. */
export default function LegalView({
  eyebrow,
  title,
  lede,
  contents,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: ReactNode;
  contents: { id: string; title: string }[];
  children: ReactNode;
}) {
  const rhythm = useRef<HTMLDivElement | null>(null);
  useGroundRhythm(rhythm);

  return (
    <>
      <SiteHeader />
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={rhythm} className="rhythm">
          <section className={styles.intro} data-ground="light" aria-labelledby="legal-heading">
            <div className={styles.shell}>
              <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
              <WordRise as="h1" id="legal-heading" className={styles.heading} lines={title} />
              <div className={styles.lede}>{lede}</div>
              <p className={styles.updated}>Last updated {LEGAL.updated}</p>
            </div>
          </section>

          <section className={styles.body} data-ground="light" aria-label={title}>
            <div className={styles.bodyShell}>
              <nav className={styles.contents} aria-label="On this page">
                <p className={styles.contentsTitle}>On this page</p>
                <ol className={styles.contentsList}>
                  {contents.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className={styles.contentsLink}>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              {children}
            </div>
          </section>

          <ClosingBlock>
            <SiteFooter />
          </ClosingBlock>
        </div>
      </main>
    </>
  );
}
