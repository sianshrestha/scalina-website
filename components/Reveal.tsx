'use client';

import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import styles from './Reveal.module.css';

/* Scroll-triggered reveals — the real implementation of what `data-reveal`
   stood for in the design prototype.

   Every kind uses the same trigger point and the same easing so the page reads
   as one system: expo.out is GSAP's equivalent of the design file's
   cubic-bezier(0.16, 1, 0.3, 1). */

export type RevealKind = 'fade' | 'line' | 'number' | 'card' | 'clip';

/* Shortened from 0.7-0.9s and started earlier (see START).
   ---------------------------------------------------------------------------
   Captures taken three to four seconds after navigation repeatedly caught
   headings still at partial opacity: the reveal was slow enough, and fired
   late enough, that a normal scroll read washed-out type rather than an
   entrance. An arrival the reader can catch mid-flight is not an arrival.
   These land before the element reaches a comfortable reading position. */
const DURATION: Record<RevealKind, number> = {
  fade: 0.5,
  line: 0.55,
  number: 0.6,
  card: 0.6,
  clip: 0.45,
};

const FROM: Record<Exclude<RevealKind, 'clip' | 'line'>, gsap.TweenVars> = {
  fade: { y: 24 },
  number: { y: 20 },
  card: { y: 40, scale: 1.04 },
};

const START = 'top 92%';

type RevealProps = {
  kind?: RevealKind;
  delay?: number;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
} & Record<string, unknown>;

export default function Reveal({
  kind = 'fade',
  delay = 0,
  as,
  children,
  className,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = (as ?? 'div') as ElementType;
  const delaySeconds = delay / 1000;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* Deliberately NOT `once: true`.
           `once` kills the ScrollTrigger the moment it fires. On a page that
           loads already scrolled — a #hash link, or a plain reload with scroll
           restoration — every reveal above the fold fires and kills itself
           during the same commit in which the reveals below it are still being
           created. ScrollTrigger's refresh() walks the live `_triggers` array
           backwards by index, so an entry disappearing mid-walk makes it read
           `.end` off `undefined` and throw. The throw lands inside
           `gsap.fromTo`, after it has applied the `from` state, which leaves
           that section stuck at opacity 0 for the rest of the session.
           Reproduced in a production build, not just under Strict Mode.

           Without `once`, the default toggleActions ("play none none none")
           still play the reveal exactly once and never reverse it; the trigger
           simply stays registered instead of removing itself mid-refresh. */
        const scrollTrigger = { trigger: el, start: START } as const;

        if (kind === 'line') {
          const inner = el.querySelector<HTMLElement>(`.${styles.lineInner}`);
          if (!inner) return;
          gsap.fromTo(
            inner,
            { yPercent: 105, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: DURATION.line,
              delay: delaySeconds,
              ease: 'expo.out',
              scrollTrigger,
            }
          );
          return;
        }

        if (kind === 'clip') {
          const media = el.firstElementChild as HTMLElement | null;
          const tl = gsap.timeline({ scrollTrigger, delay: delaySeconds });
          tl.to(el, { opacity: 1, duration: DURATION.clip, ease: 'expo.out' }, 0);
          if (media) {
            tl.fromTo(
              media,
              { clipPath: 'inset(100% 0 0 0)' },
              { clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'expo.out' },
              0
            );
          }
          return;
        }

        gsap.fromTo(
          el,
          { ...FROM[kind], opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: DURATION[kind],
            delay: delaySeconds,
            ease: 'expo.out',
            scrollTrigger,
          }
        );
      });

      // gsap.matchMedia() owns its own context; revert it or its
      // ScrollTriggers outlive this run.
      return () => mm.revert();
    },
    { dependencies: [kind, delaySeconds] }
  );

  const classes = [
    kind === 'clip' ? styles.clipMedia : null,
    kind === 'line' ? null : styles.reveal,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (kind === 'line') {
    return (
      <Tag
        ref={ref}
        className={[styles.lineMask, className].filter(Boolean).join(' ')}
        style={style}
        {...rest}
      >
        <span className={styles.lineInner}>{children}</span>
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={classes} style={style} {...rest}>
      {children}
    </Tag>
  );
}
