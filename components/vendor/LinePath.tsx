'use client';

/* LinePath — ported from Skiper UI `skiper19`.
   https://skiper-ui.com/r/skiper19.json

   Upstream `skiper19` is a whole demo page: a 350vh section, hardcoded
   `#FAFDEE` / `#1F3A4B` colours, its own headings and a skiperui.com wordmark.
   The reusable idea inside it is the `LinePath` — an SVG stroke whose
   `pathLength` is driven by scroll progress, so the line draws itself as you
   move down the section. That is what is taken here; the demo page is not.

   What is upstream's, unchanged: the technique — `useScroll` on a target
   element, `useTransform` mapping progress onto `pathLength`, and the
   `strokeDashoffset: 1 - pathLength` pairing that makes the stroke draw from
   its start rather than fading in.

   What is ours: the path itself (upstream's is a 1278x2319 squiggle built for
   their layout), the colour coming from `--accent-fg` instead of a hardcoded
   lime, the reduced-motion branch, and `aria-hidden` — it is decoration.

   `framer-motion` upstream; `motion/react` here, which is the same API under
   the package this project already has.

   ---------------------------------------------------------------------------
   Skiper 19 — React + framer motion
   Inspired by and adapted from https://comgio.ai/ — an independent recreation
   meant to study interaction design, not affiliated with comgio.ai.
   License & Usage:
   - Free to use and modify in both personal and commercial projects.
   - Attribution to Skiper UI is required when using the free version.
   - No attribution required with Skiper UI Pro.
   Author: @gurvinder-singh02 · https://gxuri.me · https://x.com/Gur__vi
   --------------------------------------------------------------------------- */

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
/* useScroll's `offset` is typed as a tuple of literal edge/intersection unions
   (`ScrollOffset`), which a plain string[] does not satisfy. Taking the option
   type straight off useScroll keeps the prop honest instead of casting it away
   at the call site. */
type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];
import type { RefObject } from 'react';
import styles from './LinePath.module.css';

type LinePathProps = {
  /* The element whose scroll progress drives the draw. */
  target: RefObject<HTMLElement | null>;
  /* SVG path data, in the viewBox below. */
  d: string;
  viewBox: string;
  className?: string;
  strokeWidth?: number;
  /* Progress at which the stroke starts and finishes drawing. Upstream runs
     0.5 -> 1, which means the line is already half drawn on arrival. */
  from?: number;
  to?: number;
  /* Where in the target's travel the draw starts and finishes, in useScroll's
     offset syntax. */
  offset?: ScrollOffset;
  /* Default preserves the path's aspect ratio. Pass "none" to stretch the path
     to its box — safe for a broadly horizontal path, where the two scale
     factors stay close and the stroke does not visibly distort. */
  preserveAspectRatio?: string;
};

export default function LinePath({
  target,
  d,
  viewBox,
  className,
  strokeWidth = 8,
  from = 0,
  to = 1,
  offset = ['start 0.85', 'end 0.55'],
  preserveAspectRatio,
}: LinePathProps) {
  const reduced = useReducedMotion();

  /* `offset` is ours, and it matters more than it looks. Upstream leaves it at
     the default, which measures from the moment the target's top enters the
     viewport to the moment its bottom leaves — a range built for their 350vh
     demo. On a normally-sized section that range is mostly spent off-screen, so
     the line arrives ~80% drawn and the effect reads as a static squiggle.
     Measured: 0.80 -> 0.93 across the whole section. Starting the draw when the
     section is already near the top of the viewport and finishing before it
     leaves puts the whole 0 -> 1 into the span you actually read it in. */
  const { scrollYProgress } = useScroll({
    target,
    offset,
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [from, to]);
  const dashoffset = useTransform(pathLength, (v: number) => 1 - v);

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      fill="none"
      overflow="visible"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      className={[styles.svg, className].filter(Boolean).join(' ')}
    >
      <motion.path
        d={d}
        stroke="var(--accent-fg)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        /* Reduced motion: draw it once, statically, rather than tying a
           continuously-updating transform to the scroll position. */
        style={reduced ? { pathLength: to } : { pathLength, strokeDashoffset: dashoffset }}
      />
    </svg>
  );
}

export { LinePath };
