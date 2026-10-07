'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

/* Single registration point so plugins are never registered twice. */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

/* Refresh every trigger once the page has actually stopped moving.
   ---------------------------------------------------------------------------
   Several sections on this site size themselves AFTER first paint: the parallax
   wall is 175vh measured from JS, the perspective stage is measured by a
   ResizeObserver, and the display face is a webfont that reflows every heading
   when it swaps in. Triggers created before any of that settles are positioned
   against a layout that then moves, and a scrubbed one simply reports the wrong
   progress for the rest of the session.

   The symptom is quiet rather than obviously broken, which is why this is
   central rather than per-component: the tagline wipe's circle was measured
   stuck at its from-state, and then — after a partial fix — reaching only 40%
   where it should have been at 67%, because its start sat ~327px below where it
   had been computed.

   Guarded so the listeners are attached once per page load, not once per
   component that imports this module. */
if (typeof window !== 'undefined') {
  const w = window as Window & { __scalinaStRefresh?: boolean };
  if (!w.__scalinaStRefresh) {
    w.__scalinaStRefresh = true;
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh, { once: true });
    if (document.fonts) document.fonts.ready.then(refresh).catch(() => {});
  }
}

export { gsap, ScrollTrigger, ScrollToPlugin, useGSAP };
