'use client';

import * as React from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import styles from './VerticalMarquee.module.css';

/* Adapted from unlumen UI — vertical-marquee.
 * https://ui.unlumen.com/r/vertical-marquee.json
 *
 * Two changes from upstream, both deliberate:
 *
 * 1. Upstream renders X/Twitter cards — it takes `tweetIds`, fetches through
 *    `react-tweet/api` and renders `MagicTweet`. Scalina's testimonials are
 *    written client quotes, not tweets, so the card renderer is replaced with
 *    an `items` array of nodes. The scroll engine below (measure, ease, wrap)
 *    is upstream's, unchanged.
 * 2. Upstream is Tailwind-only and references shadcn theme tokens this project
 *    does not have; its utility classes are ported to a CSS module.
 */

type ColumnProps = {
  items: React.ReactNode[];
  speed: number;
  gap: number;
  reverse?: boolean;
  paused: boolean;
};

function MarqueeColumn({ items, speed, gap, reverse = false, paused }: ColumnProps) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [singleHeight, setSingleHeight] = React.useState(0);
  const y = useMotionValue(0);
  const pos = React.useRef(0);
  const currentSpeed = React.useRef(0);
  const initialized = React.useRef(false);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const height = el.scrollHeight / 2;
      if (height <= 0) return;
      setSingleHeight(height);
      if (!initialized.current) {
        pos.current = reverse ? -height : 0;
        y.set(pos.current);
        initialized.current = true;
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();

    return () => observer.disconnect();
  }, [reverse, items, y]);

  useAnimationFrame((_, delta) => {
    if (!singleHeight) return;

    // Easing the speed toward the target is what makes hover decelerate
    // smoothly instead of stopping dead.
    const targetSpeed = paused ? 0 : singleHeight / speed;
    currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.08;

    const step = currentSpeed.current * (delta / 1000);
    if (reverse) {
      pos.current += step;
      if (pos.current >= 0) pos.current -= singleHeight;
    } else {
      pos.current -= step;
      if (pos.current <= -singleHeight) pos.current += singleHeight;
    }

    y.set(pos.current);
  });

  const doubled = [...items, ...items];

  return (
    <div className={styles.column}>
      <motion.div ref={wrapRef} style={{ y }}>
        {doubled.map((item, index) => (
          <div key={index} style={{ marginBottom: `${gap}px` }} className={styles.item}>
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export type VerticalMarqueeProps = {
  /** Cards to scroll. Replaces upstream's `tweetIds`. */
  items: React.ReactNode[];
  /** Number of scrolling columns. @default 2 */
  columns?: 1 | 2;
  /** Scroll duration in seconds per full loop. @default 20 */
  speed?: number;
  /** Vertical gap between cards in px. @default 16 */
  gap?: number;
  /** Height of the fade zone at top and bottom in px. @default 120 */
  blurSize?: number;
  /** Smoothly decelerate to a stop when hovering. @default true */
  pauseOnHover?: boolean;
  className?: string;
};

export function VerticalMarquee({
  items,
  columns = 2,
  speed = 20,
  gap = 16,
  blurSize = 120,
  pauseOnHover = true,
  className,
}: VerticalMarqueeProps) {
  const [paused, setPaused] = React.useState(false);

  if (!items.length) return null;

  const mid = Math.ceil(items.length / 2);
  const col1 = columns === 2 ? items.slice(0, mid) : items;
  const col2 = columns === 2 ? items.slice(mid) : items;

  const mask = `linear-gradient(to bottom, transparent 0%, black ${blurSize}px, black calc(100% - ${blurSize}px), transparent 100%)`;

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.columns} style={{ gap: `${gap}px` }}>
        <MarqueeColumn items={col1.length ? col1 : items} speed={speed} gap={gap} paused={paused} />
        {columns === 2 && (
          <MarqueeColumn
            items={col2.length ? col2 : items}
            speed={speed * 1.25}
            gap={gap}
            reverse
            paused={paused}
          />
        )}
      </div>
    </div>
  );
}

export default VerticalMarquee;
