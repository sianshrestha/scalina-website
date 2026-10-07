'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/* A number that counts up the first time it is scrolled to.

   The final value is rendered on the server and left in the DOM, so the figure
   is correct before hydration, correct without JS, and correct for anything
   reading the page rather than watching it. The animation only ever overwrites
   it on the way up. */
export default function Counter({
  value,
  suffix = '',
  decimals = 0,
  duration = 1.4,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const counter = { n: 0 };
        let started = false;
        gsap.to(counter, {
          n: value,
          duration,
          ease: 'power2.out',
          /* Both of these exist for the same reason. A ScrollTrigger tween is
             rendered at its start state when it is created, which called
             onUpdate with n = 0 and overwrote the real figure with a zero
             before the section had even been scrolled to — so the number read
             0 until you reached it, and stayed 0 forever if you never did. */
          immediateRender: false,
          onStart: () => {
            started = true;
          },
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: () => {
            if (!started) return;
            el.textContent = counter.n.toFixed(decimals) + suffix;
          },
          onComplete: () => {
            el.textContent = value.toFixed(decimals) + suffix;
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [value, suffix, decimals, duration] }
  );

  return (
    <span ref={ref} className="tabularNums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
