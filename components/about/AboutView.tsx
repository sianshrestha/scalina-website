'use client';

import { useRef } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClosingBlock from '@/components/ClosingBlock';
import AboutIntro from './AboutIntro';
import AboutTeams from './AboutTeams';
import AboutPrinciples from './AboutPrinciples';
import AboutProof from './AboutProof';
import Founder from '@/components/sections/Founder';
import Manifesto from '@/components/sections/Manifesto';
import StartProject from '@/components/sections/StartProject';
import { useGroundRhythm } from '@/lib/useGroundRhythm';

export default function AboutView() {
  const rhythm = useRef<HTMLDivElement | null>(null);
  useGroundRhythm(rhythm);

  return (
    <>
      <SiteHeader />
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={rhythm} className="rhythm">
          {/* Light the whole way down, with one boundary at the manifesto —
              dark from there through the close. Asked for directly: the page
              is an argument told in one voice, and the three ground flips it
              used to make cut it into chapters that were not there.
              `Manifesto` is shared with the homepage and stays dark on both.
              See DESIGN.md §10 → "Ground order". */}
          <AboutIntro />
          <AboutTeams />
          <AboutPrinciples />
          <AboutProof />
          <Founder showLink={false} />
          <Manifesto />
          <ClosingBlock>
            <StartProject />
            <SiteFooter />
          </ClosingBlock>
        </div>
      </main>
    </>
  );
}
