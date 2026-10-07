'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ETHER } from '@/lib/ether';
import styles from './ClosingBlock.module.css';

/* LiquidEther boots a WebGL fluid sim, so it is client-only and loaded lazily —
   it must never block first paint or run during SSR. */
const LiquidEther = dynamic(() => import('@/components/vendor/LiquidEther'), { ssr: false });

/* Wraps the closing CTA and the footer in one positioned field so a single
   fluid layer spans both. Keeping it as a wrapper rather than stretching the
   footer's own layer upward means there is no height to keep in sync.

   THE FIELD IS NOT MOUNTED UNTIL IT IS NEARLY IN VIEW
   ---------------------------------------------------------------------------
   The field itself already pauses its render loop offscreen and on
   `document.hidden` — that part was never the problem. The cost is everything
   that happens before the first frame: this block sits at the foot of every
   route, so `/about`, `/work`, `/services` and `/start` were each fetching the
   2.3MB three.js chunk, compiling shaders and allocating a WebGL context and
   its framebuffers for a decorative layer thousands of pixels below the fold,
   which the visitor may never reach.

   Gating the MOUNT on proximity means those routes pay nothing until the
   closing block is a screen away. On the homepage the hero has already loaded
   the same chunk, so this costs nothing there either.

   `rootMargin` is a full viewport, so the field is mounted, compiled and
   running well before it is looked at — the point is to move the work off the
   critical path, not to make the visitor watch it start. */
export default function ClosingBlock({ children }: { children: ReactNode }) {
  const block = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = block.current;
    if (!el) return;
    /* No IntersectionObserver (or no JS at all): the field is decorative and
       aria-hidden, so not mounting it is a complete outcome, not a fallback. */
    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: '100% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={block} className={styles.block}>
      <div aria-hidden="true" className={styles.ether}>
        {near ? <LiquidEther {...ETHER} /> : null}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
