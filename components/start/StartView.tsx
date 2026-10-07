'use client';

import { useRef } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClosingBlock from '@/components/ClosingBlock';
import StartIntro from './StartIntro';
import StartFaq from './StartFaq';
import EnquiryFlow from './EnquiryFlow';
import { useGroundRhythm } from '@/lib/useGroundRhythm';
import styles from './StartView.module.css';

export default function StartView() {
  const rhythm = useRef<HTMLDivElement | null>(null);
  useGroundRhythm(rhythm);

  return (
    <>
      <SiteHeader />
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={rhythm} className="rhythm">
          <StartIntro />

          {/* The flow gets the light ground: it is a working surface, and the
              chips need the contrast to read as tappable rather than as text. */}
          <section className={styles.flowSection} data-ground="light" aria-label="Enquiry">
            <div className={styles.flowShell}>
              <EnquiryFlow />
            </div>
          </section>

          <StartFaq />

          <ClosingBlock>
            <section className={styles.direct} data-ground="dark" aria-labelledby="start-direct">
              <div className={styles.directShell}>
                <h2 id="start-direct" className="sectionHeading">
                  Rather just talk?
                </h2>
                <ul className={styles.directList}>
                  <li>
                    <a href="mailto:info@scalinamedia.com" className={styles.directLink}>
                      info@scalinamedia.com
                    </a>
                  </li>
                  {/* PLACEHOLDER number, same as the footer. */}
                  <li>
                    <a href="tel:+61491570156" className={styles.directLink}>
                      0491 570 156
                    </a>
                  </li>
                </ul>
              </div>
            </section>
            <SiteFooter />
          </ClosingBlock>
        </div>
      </main>
    </>
  );
}
