'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';
import type { GroundName } from '@/lib/grounds';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import styles from './ColorWipe.module.css';

/* A pinned, scroll-scrubbed colour wipe.

   This is the icreon.com effect, built the way the reference builds it rather
   than the way the ground rhythm tried to: the stage is PINNED (sticky inside a
   tall track) so the type holds still while the colour travels across it. That
   pin is the part that makes it read as motion at all — an edge that moves at
   the same rate as the content it is crossing is indistinguishable from no
   transition, which is exactly what the previous full-viewport panel looked
   like once it was finally geometrically correct.

   The same content is rendered twice into one grid cell — once on the outgoing
   colours, once on the incoming ones — and the overlay's `clip-path` top inset
   is driven from `100%` to `0%` by scroll position, linearly. Because the two
   copies are identical and share a cell, the edge cuts each letter mid-glyph.

   `ease: 'none'` is not a detail: any easing between the scroll and the edge is
   what stops a scrub feeling connected to the wheel.

   The second copy is `aria-hidden` — a screen reader should hear this once. */

/* Which way the incoming colour arrives. All four are the same mechanism — two
   stacked copies and a scrubbed clip — so they cost the same and can be varied
   per boundary without any of them being a special case. */
export type WipeDirection = 'up' | 'down' | 'left' | 'right' | 'circle';

const CLIP_FROM: Record<WipeDirection, string> = {
  up: 'inset(100% 0 0 0)',
  down: 'inset(0 0 100% 0)',
  left: 'inset(0 0 0 100%)',
  right: 'inset(0 100% 0 0)',
  /* 0% at the centre. 75% of the box clears the corners at any aspect ratio. */
  circle: 'circle(0% at 50% 50%)',
};

/* How far through the pin the page's ground tokens step to `ground`, as a
   fraction of the scrubbed travel.

   Two things constrain this, and they pull in opposite directions.

   Not before 0: until the track's top reaches the window's top the stage does
   not cover the viewport, and the section ABOVE is still on screen. Stepping
   there repaints that section in the ground it is about to leave — the bug
   this replaced, where a light section went dark half a screen before the wipe
   that was supposed to take it there.

   Not long after the incoming colour reaches the TOP of the screen: the fixed
   header is the only thing left reading these tokens while the stage is up, so
   it should invert when the colour behind it does. That point is a property of
   the direction, not of the wipe: `down` arrives at the top first, `up` last,
   and the circle gets there once its radius clears the header band. */
const GROUND_STEP_AT: Record<WipeDirection, number> = {
  up: 0.92,
  down: 0.06,
  left: 0.5,
  right: 0.5,
  circle: 0.3,
};

const CLIP_TO: Record<WipeDirection, string> = {
  up: 'inset(0% 0 0 0)',
  down: 'inset(0 0 0% 0)',
  left: 'inset(0 0 0 0%)',
  right: 'inset(0 0% 0 0)',
  circle: 'circle(75% at 50% 50%)',
};

type ColorWipeProps = {
  direction?: WipeDirection;
  /* The section's own content. Rendered TWICE — once per layer — so whatever is
     handed in is what the wipe cuts through. This is the difference between a
     decorative headline card and a real section transition: the thing being
     wiped is the section, not a slogan invented to sit in front of it.

     Two constraints come with it. The content has to fit one screen, because
     the stage is pinned at 100vh; and it has to be static, because the second
     copy is inert and aria-hidden so a screen reader and the tab order only
     ever meet one of them. Interactive content does not belong in here. */
  children: ReactNode;
  /* Painted colours, not ground tokens: the two states have to be on screen at
     the same time, which a single set of document-level tokens cannot do. */
  fromBg: string;
  fromFg: string;
  toBg: string;
  toFg: string;
  /* Scroll distance the pin holds for, in viewport heights. */
  scrollLength?: number;
  ariaLabel: string;
  /* The ground the page is on AFTER this wipe. Declared so the rhythm counts
     the change as happening HERE.
     ------------------------------------------------------------------------
     Without it the wipe paints its own two layers, the rhythm never hears about
     it, and the next section — already the colour the wipe just arrived at —
     still triggers a fade to that same colour. You get the change twice: once
     as the wipe, then again as a pointless cross-fade a screen later.

     Declaring the incoming ground here is safe precisely because the stage is
     pinned and opaque: the rhythm's fade runs behind a full-viewport panel and
     is never seen, and by the time the wipe releases, the page is already on the
     new ground so the section below transitions to nothing. */
  ground: GroundName;
  /* Centre the content instead of running it flush left. */
  centred?: boolean;
  /* A `WipeNote` whose colour must differ per layer. The two copies are
     identical in everything else — they have to be, or the clip edge stops
     cutting the letters cleanly — but a note that is lime on the incoming dark
     layer cannot be lime on the outgoing light one (1.2:1). */
  noteColorFrom?: string;
  noteColorTo?: string;
};

export default function ColorWipe({
  direction = 'up',
  children,
  fromBg,
  fromFg,
  toBg,
  toFg,
  scrollLength = 2.4,
  ariaLabel,
  ground,
  centred = false,
  noteColorFrom,
  noteColorTo,
}: ColorWipeProps) {
  const track = useRef<HTMLElement | null>(null);
  const overlay = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = track.current;
      const over = overlay.current;
      if (!el || !over) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* Scrubbed against the track's own travel. `scrub: true` with
           `ease: 'none'` is the 1:1 mapping — the edge is wherever the scroll
           is, and it runs backwards when the scroll does. */
        gsap.fromTo(
          over,
          { clipPath: CLIP_FROM[direction] },
          {
            clipPath: CLIP_TO[direction],
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              /* Not optional here. Two siblings on this page size themselves
                 after mount — the parallax wall reads the viewport height in an
                 effect, and the perspective stage is measured by a
                 ResizeObserver — so every trigger below them is positioned
                 against a layout that then moves. Without this the wipe's
                 start/end stay where they were computed and the tween simply
                 never advances: measured stuck at its from-state, `circle(0%)`,
                 at every scroll position through the pin. */
              invalidateOnRefresh: true,
            },
          }
        );
      });

      /* Refresh once this wipe's own trigger exists, deferred a frame so it
         runs after the commit that created it.
         --------------------------------------------------------------------
         Every wipe on a page adds a pinned stage, and each one shifts the
         positions of the triggers created before it. On the homepage that left
         the SECOND wipe measured non-linear on a cold load — 94% / 63.8% /
         59.1% / 1.6% across an even scroll, with a visible stall in the middle
         — while a forced refresh gave a clean 100 / 66.7 / 33.4 / 0.06. */
      const id = requestAnimationFrame(() => ScrollTrigger.refresh());

      /* gsap.matchMedia() is not reverted by useGSAP's own cleanup — the trap
         recorded in HANDOFF. */
      return () => {
        cancelAnimationFrame(id);
        mm.revert();
      };
    },
    { scope: track, dependencies: [direction] }
  );

  const body = (fg: string, noteColor?: string) => (
    <div
      className={[styles.inner, centred ? styles.centred : ''].filter(Boolean).join(' ')}
      style={{ color: fg, ...(noteColor ? { ['--wipe-note-color' as string]: noteColor } : {}) }}
    >
      {children}
    </div>
  );

  return (
    <section
      ref={track}
      className={styles.track}
      style={{ height: `${scrollLength * 100}vh` } as CSSProperties}
      data-ground={ground}
      /* Negative: measured from the window's top upward, so the ground cannot
         land before this stage owns the screen. See GROUND_STEP_AT. */
      data-ground-line={-(GROUND_STEP_AT[direction] * Math.max(0, scrollLength - 1))}
      aria-label={ariaLabel}
    >
      <div className={styles.stage}>
        <div className={styles.layer} style={{ background: fromBg }}>
          {body(fromFg, noteColorFrom)}
        </div>
        <div
          ref={overlay}
          className={`${styles.layer} ${styles.overlay}`}
          style={{ background: toBg }}
          aria-hidden="true"
          inert
        >
          {body(toFg, noteColorTo)}
        </div>
      </div>
    </section>
  );
}

/* Typography for whatever a wipe carries. Exported rather than written at the
   call site so both layers, and every wipe on the site, share one scale — the
   two copies have to be identical to the pixel or the clip edge stops cutting
   the letters cleanly. */
export function WipeEyebrow({ children }: { children: ReactNode }) {
  return <p className={styles.eyebrow}>{children}</p>;
}

export function WipeWords({ lines }: { lines: string[] }) {
  return (
    <p className={styles.words}>
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </p>
  );
}

export function WipeNote({ children }: { children: ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}

export { ColorWipe };
