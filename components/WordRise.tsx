'use client';

import { Fragment, useRef, type ElementType } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import styles from './WordRise.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/* A heading whose words rise out of a mask, one after another.

   The same entrance as the case-study titles, shared so every page intro
   arrives the same way. `inView` switches it from "on load" (page intros) to
   "when scrolled to" (section headings). Each line is its own block, so a
   deliberate line break survives; words wrap naturally inside a line.

   The text is real text in the DOM — only the transform animates — so it
   reads correctly to assistive tech and search. Reduced motion and no-JS both
   get the settled heading (see the noscript rule in app/layout.tsx). */
export default function WordRise({
  as,
  lines,
  className,
  id,
  delay = 0,
  stagger = 0.06,
  inView = false,
}: {
  as?: ElementType;
  lines: string | string[];
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const reduced = useReducedMotion();
  const Tag = (as ?? 'h2') as ElementType;
  /* In-view is measured on the HEADING, never on the words. A word starts
     translated below its own overflow mask, so it is fully clipped and an
     observer on it never reports it visible — the headings sat invisible. */
  const ref = useRef<HTMLElement | null>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const show = !inView || seen;
  const list = Array.isArray(lines) ? lines : [lines];
  let n = 0;

  return (
    <Tag ref={ref} className={className} id={id}>
      {list.map((line, li) => {
        const words = line.split(' ');
        return (
          <span key={li} className={list.length > 1 ? styles.line : undefined}>
            {words.map((w, wi) => {
              const i = n++;
              return (
                <Fragment key={wi}>
                  <span className={styles.mask}>
                    <motion.span
                      className={styles.word}
                      data-word-rise=""
                      initial={reduced ? false : { y: '112%' }}
                      animate={show ? { y: '0%' } : { y: '112%' }}
                      transition={{ duration: 0.95, ease: EASE, delay: delay + i * stagger }}
                    >
                      {w}
                    </motion.span>
                  </span>
                  {wi < words.length - 1 ? ' ' : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
