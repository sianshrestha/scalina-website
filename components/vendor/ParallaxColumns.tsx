'use client';

/* ParallaxColumns — adapted from Skiper UI `skiper30` (Parallax_002).

   The idea is upstream's: four columns of media sliding past each other at
   different rates as the section crosses the viewport. The mechanics are not,
   any more, and for two bugs the upstream maths produced here:

   1. **Empty space.** Upstream pulls each column up by a fixed percentage and
      then pushes it DOWN by up to 3.3 viewport heights. On a wall shorter than
      upstream's 175vh that uncovers bare background above the columns before
      the section has left the screen.
   2. **A column that never moves.** A column pushed down by ~2 viewport
      heights while the page scrolls ~2 viewport heights holds still on
      screen — the left column read as frozen.

   Now each column is taller than the wall and centred in it (it overflows
   top and bottom equally), its travel is MEASURED — never more than the
   overflow on either side — and neighbouring columns move in opposite
   directions. The wall is always full, and every column visibly moves.

   Reduced motion: the columns sit still.

   ---------------------------------------------------------------------------
   Skiper 30 Parallax_002 — React + framer motion
   Inspired by and adapted from https://www.siena.film/films/my-project-x — an
   independent recreation, not affiliated.
   License & Usage:
   - Free to use and modify in both personal and commercial projects.
   - Attribution to Skiper UI is required when using the free version.
   - No attribution required with Skiper UI Pro.
   Author: @gurvinder-singh02 · https://gxuri.me · https://x.com/Gur__vi
   --------------------------------------------------------------------------- */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ScrollTrigger } from '@/lib/gsap';
import styles from './ParallaxColumns.module.css';

/* Direction and share of the available travel each column uses. Alternating
   signs are what make the columns read as separate strips. */
const DRIFT = [0.9, -0.75, 1, -0.85];

export default function ParallaxColumns({
  columns,
  label,
}: {
  columns: ReactNode[][];
  label?: string;
}) {
  const gallery = useRef<HTMLDivElement | null>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  const [travel, setTravel] = useState<number[]>([0, 0, 0, 0]);

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ['start end', 'end start'],
  });

  /* How far each column can move before its edge would enter the wall:
     half of (column height − wall height). Re-measured whenever either
     resizes, and ScrollTrigger refreshed a frame later because everything
     below this section shifts with it. */
  useEffect(() => {
    const wall = gallery.current;
    if (!wall || typeof ResizeObserver === 'undefined') return;
    let raf = 0;
    const measure = () => {
      const h = wall.clientHeight;
      setTravel(cols.current.map((c) => (c ? Math.max(0, (c.scrollHeight - h) / 2 - 8) : 0)));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const ro = new ResizeObserver(measure);
    ro.observe(wall);
    cols.current.forEach((c) => c && ro.observe(c));
    measure();
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const y0 = useTransform(scrollYProgress, [0, 1], [travel[0] * DRIFT[0], -travel[0] * DRIFT[0]]);
  const y1 = useTransform(scrollYProgress, [0, 1], [travel[1] * DRIFT[1], -travel[1] * DRIFT[1]]);
  const y2 = useTransform(scrollYProgress, [0, 1], [travel[2] * DRIFT[2], -travel[2] * DRIFT[2]]);
  const y3 = useTransform(scrollYProgress, [0, 1], [travel[3] * DRIFT[3], -travel[3] * DRIFT[3]]);
  const ys = [y0, y1, y2, y3];

  return (
    <div ref={gallery} className={styles.gallery} role={label ? 'group' : undefined} aria-label={label}>
      {columns.slice(0, 4).map((tiles, i) => (
        <motion.div
          key={i}
          ref={(el) => {
            cols.current[i] = el;
          }}
          className={styles.column}
          data-col={i}
          style={reduced ? undefined : { y: ys[i] }}
        >
          {tiles.map((tile, j) => (
            <div key={j} className={styles.tile}>
              {tile}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export { ParallaxColumns };
