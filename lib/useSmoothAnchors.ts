'use client';

import { useEffect } from 'react';
import { gsap, ScrollTrigger } from './gsap';
import { getLenis } from './lenis';

/* Smooth in-page anchor scrolling.

   This replaces CSS `scroll-behavior: smooth`, which cannot be used on a page
   that pins with ScrollTrigger: the two fight over scroll position and the
   page scrolls away on its own. ScrollToPlugin goes through GSAP, so
   ScrollTrigger stays in sync.

   Reduced motion gets an instant jump rather than no navigation at all. */
export function useSmoothAnchors() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#') || href === '#') return;

      const target = href === '#top' ? 0 : document.querySelector<HTMLElement>(href);
      if (target === null) return;

      event.preventDefault();

      // Lenis owns the scroll when it is running; a second tween on the same
      // position would fight it frame by frame.
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.1, onComplete: () => ScrollTrigger.refresh() });
        return;
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.to(window, {
        duration: reduced ? 0 : 0.9,
        ease: 'power2.inOut',
        scrollTo: { y: target, autoKill: true },
        onComplete: () => ScrollTrigger.refresh(),
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
