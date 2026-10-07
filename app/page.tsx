'use client';

import { useRef } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClosingBlock from '@/components/ClosingBlock';
import Hero from '@/components/sections/Hero';
import Teams from '@/components/sections/Teams';
import WhatWeDo from '@/components/sections/WhatWeDo';
import Shipped from '@/components/sections/Shipped';
import SelectedWork from '@/components/sections/SelectedWork';
import ScalinaSystem from '@/components/sections/ScalinaSystem';
import Founder from '@/components/sections/Founder';
import Manifesto from '@/components/sections/Manifesto';
import ColorWipe, { WipeEyebrow, WipeWords } from '@/components/ColorWipe';
import StartProject from '@/components/sections/StartProject';
import { useGroundRhythm } from '@/lib/useGroundRhythm';
import { useSmoothAnchors } from '@/lib/useSmoothAnchors';

export default function HomePage() {
  const rhythm = useRef<HTMLDivElement | null>(null);

  useGroundRhythm(rhythm);

  // Smooth #shipped / #start / #top jumps, done through GSAP so ScrollTrigger
  // stays in sync (see the note in globals.css).
  useSmoothAnchors();

  return (
    <>
      <SiteHeader />
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={rhythm} className="rhythm">
          {/* Order: the two teams, then the work that proves them, then what
              we sell, then how it runs, then the rest of the work. */}
          <Hero />
          <Teams />
          <Shipped />

          {/* UP WIPE — the brand tagline (DESIGN.md §7), which appeared nowhere
              on the site until now, only in the <title>.

              It arrives on COBALT and wipes to light. The brand colour gets a
              full screen of its own between the dark half of the page and the
              light half, instead of the tagline being one more dark screen
              among several.

              `ground="light"` is what stops the change happening twice: the
              rhythm counts the crossing HERE, behind the pinned opaque stage,
              so What We Do below — already light — transitions to nothing, and
              has no entrance of its own for the same reason. */}
          <ColorWipe
            direction="up"
            ariaLabel="Go Digital, or Go Invisible"
            ground="light"
            fromBg="#1E45FB"
            fromFg="#F4F2ED"
            toBg="#F5F2F3"
            toFg="#0B0D12"
            scrollLength={2}
          >
            <WipeEyebrow>Scalina</WipeEyebrow>
            <WipeWords lines={['Go Digital,', 'or Go Invisible.']} />
          </ColorWipe>

          <WhatWeDo />
          <ScalinaSystem />
          <SelectedWork />
          <Founder />
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
