'use client';

/* TextRoll — ported from Skiper UI `skiper58`.
   https://skiper-ui.com/r/skiper58.json

   Ported, not copied, on the same terms as every other vendored component here
   (see README → "Vendored components"): Skiper ships Tailwind-only markup and a
   `cn()` helper from `@/lib/utils`, neither of which exists in this project, and
   it imports `framer-motion` where we already have `motion` (v13) installed —
   `motion/react` is the same API under its current package name, so this adds no
   dependency.

   What is upstream's, unchanged: the two-layer construction (a resting copy and
   a duplicate positioned over it), the per-character stagger, and the
   centre-weighted delay so the roll opens from the middle of the word outwards.

   What is ours: the class names, `children` taking a string of any length, and
   the reduced-motion branch — a character-by-character roll is exactly the kind
   of motion `prefers-reduced-motion` exists for, and upstream has no guard.

   ---------------------------------------------------------------------------
   Skiper 58 — React + framer motion
   License & Usage:
   - Free to use and modify in both personal and commercial projects.
   - Attribution to Skiper UI is required when using the free version.
   - No attribution required with Skiper UI Pro.
   Author: @gurvinder-singh02 · https://gxuri.me · https://x.com/Gur__vi
   --------------------------------------------------------------------------- */

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import styles from './TextRoll.module.css';

const STAGGER = 0.035;

type TextRollProps = {
  children: string;
  className?: string;
  /* Centre-weighted stagger: the middle characters lead and the ends follow.
     Upstream's default is left-to-right. */
  center?: boolean;
  /* Rendered instead of the rolling layers under reduced motion. */
  fallback?: ReactNode;
};

export default function TextRoll({ children, className, center = false, fallback }: TextRollProps) {
  const chars = [...children];
  const delayFor = (i: number) =>
    center ? STAGGER * Math.abs(i - (chars.length - 1) / 2) : STAGGER * i;

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      whileFocus="hovered"
      className={[styles.roll, className].filter(Boolean).join(' ')}
    >
      {/* The real text, for screen readers and for copy/paste. The two visual
          layers below are split into per-character spans, which would otherwise
          be read out one letter at a time. */}
      <span className={styles.srOnly}>{children}</span>

      <span aria-hidden="true" className={styles.reducedOnly}>
        {fallback ?? children}
      </span>

      <span aria-hidden="true" className={styles.layers}>
        <span className={styles.layer}>
          {chars.map((c, i) => (
            <motion.span
              key={i}
              className={styles.char}
              variants={{ initial: { y: 0 }, hovered: { y: '-100%' } }}
              transition={{ ease: 'easeInOut', delay: delayFor(i) }}
            >
              {c === ' ' ? ' ' : c}
            </motion.span>
          ))}
        </span>
        {/* `sc-roll-incoming` is a plain global class, not a module one: it is
            the handle a consumer styles the incoming half through (the same way
            FlowingMenu and OptionWheel are styled from their wrappers). Module
            class names are hashed and cannot be targeted from outside. */}
        <span className={`${styles.layer} ${styles.layerIncoming} sc-roll-incoming`}>
          {chars.map((c, i) => (
            <motion.span
              key={i}
              className={styles.char}
              variants={{ initial: { y: '100%' }, hovered: { y: 0 } }}
              transition={{ ease: 'easeInOut', delay: delayFor(i) }}
            >
              {c === ' ' ? ' ' : c}
            </motion.span>
          ))}
        </span>
      </span>
    </motion.span>
  );
}

export { TextRoll };
