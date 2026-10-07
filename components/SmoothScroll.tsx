'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { getLenis, setLenis } from '@/lib/lenis';

/* Lenis smooth scrolling, driven by GSAP's ticker.

   HANDOFF.md used to say "do not add Lenis". What it was actually warning
   against was two things moving the scroll position at once — CSS
   `scroll-behavior: smooth` fighting ScrollTrigger's pin restoration. Lenis
   run like this has no second clock: it scrolls the real document (so every
   `position: sticky` stage still pins), it advances inside `gsap.ticker`
   (the same frame ScrollTrigger reads), and each Lenis scroll event calls
   `ScrollTrigger.update()`. Lag smoothing is off so a slow frame cannot put
   the two out of step.

   Wheel and trackpad only. Touch keeps the platform's own momentum
   (`syncTouch` stays off) — emulated inertia on a phone feels wrong in the
   hand. Reduced motion never creates an instance at all. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 1,
      // Anything that scrolls on its own (the enquiry chips, a code block)
      // opts out with data-lenis-prevent.
      prevent: (node) => node.hasAttribute('data-lenis-prevent'),
    });
    setLenis(lenis);

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  /* A route change lands on a new document height. Let Lenis re-measure, and
     make sure a page that was paused by the open menu does not arrive frozen. */
  const lastPath = useRef(pathname);
  useEffect(() => {
    const lenis = getLenis();
    // Only a real route change. The initial load (and Strict Mode's second
    // run of it) leaves the browser's scroll restoration and any #hash alone.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (!lenis) return;
    lenis.start();
    // An in-flight smooth scroll must not carry on down the new page.
    if (!window.location.hash) lenis.scrollTo(0, { immediate: true, force: true });
    const id = requestAnimationFrame(() => lenis.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
