'use client';

import { Suspense, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClosingBlock from '@/components/ClosingBlock';
import ServicesHero from './ServicesHero';
import ServiceExplorer from './ServiceExplorer';
import ServiceProof from './ServiceProof';
import ServiceCta from './ServiceCta';
import { TEAMS, type TeamKey } from '@/lib/services';
import { useGroundRhythm } from '@/lib/useGroundRhythm';
import { useSmoothAnchors } from '@/lib/useSmoothAnchors';

function ServicesContent() {
  const rhythm = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const params = useSearchParams();

  /* The homepage links here as /services?view=media|systems. The URL is the
     only source of truth — deriving from it rather than mirroring it into
     state means a shared link, a back button and the toggle all agree. */
  const view: TeamKey = params.get('view') === 'systems' ? 'systems' : 'media';

  const switchTeam = useCallback(
    (key: TeamKey) => {
      router.replace(`/services?view=${key}`, { scroll: false });
    },
    [router]
  );

  useGroundRhythm(rhythm, [view]);
  useSmoothAnchors();

  const team = TEAMS[view];

  return (
    <>
      <SiteHeader />
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={rhythm} className="rhythm">
          <ServicesHero team={team} onSwitch={switchTeam} />
          {/* Keyed so switching teams remounts the wheel at its first option. */}
          <ServiceExplorer key={team.key} team={team} />
          <ServiceProof team={team} />
          <ClosingBlock>
            <ServiceCta team={team} />
            <SiteFooter />
          </ClosingBlock>
        </div>
      </main>
    </>
  );
}

export default function ServicesView() {
  // useSearchParams needs a Suspense boundary to stay statically renderable.
  return (
    <Suspense fallback={null}>
      <ServicesContent />
    </Suspense>
  );
}
