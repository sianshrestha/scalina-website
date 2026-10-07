'use client';

import { useRef } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClosingBlock from '@/components/ClosingBlock';
import StartProject from '@/components/sections/StartProject';
import Reveal from '@/components/Reveal';
import WordRise from '@/components/WordRise';
import CaseIndex from './CaseIndex';
import { TOTALS } from '@/lib/work';
import { useGroundRhythm } from '@/lib/useGroundRhythm';
import styles from './WorkView.module.css';

/* /work — case studies, one per client.

   Minimal by request: a short intro, then the list. The deck (skiper48) and
   the filterable card grid that used to sit here listed deliverables rather
   than clients, and between them put three layers of chrome in front of the
   work. Each client now has its own case-study page at /work/<slug>. */
export default function WorkView() {
  const rhythm = useRef<HTMLDivElement | null>(null);
  useGroundRhythm(rhythm);

  return (
    <>
      <SiteHeader />
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={rhythm} className="rhythm">
          <section className={styles.intro} data-ground="light" aria-labelledby="work-heading">
            <div className={styles.shell}>
              <Reveal kind="fade" as="p" className={`eyebrow ${styles.eyebrow}`}>
                Case studies
              </Reveal>
              <WordRise as="h1" id="work-heading" delay={0.08} className={styles.heading} lines="Work" />
              <Reveal kind="fade" as="p" delay={120} className={styles.lede}>
                {TOTALS.clientBusinesses} clients, most of them buying more than one thing. Each case
                is the whole engagement: what we made, what we built, and what it did.
              </Reveal>
            </div>
          </section>

          <CaseIndex />

          <ClosingBlock>
            <StartProject />
            <SiteFooter />
          </ClosingBlock>
        </div>
      </main>
    </>
  );
}
