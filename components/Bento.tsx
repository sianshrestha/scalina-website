'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import StatValue from '@/components/StatValue';
import type { ProofTile } from '@/lib/proof';
import styles from './Bento.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/* A bento grid of figures.

   Size carries rank: the headline figure takes a 2×2 cell with real footage
   behind it, the supporting ones sit round it at 1×1. Sources live in
   lib/proof.ts rather than on the tile. A light follows the
   pointer across each tile, and tiles that point at a case study are links. */
export default function Bento({ tiles, label }: { tiles: ProofTile[]; label: string }) {
  const reduced = useReducedMotion();
  return (
    <ul className={styles.grid} aria-label={label}>
      {tiles.map((t, i) => (
        <motion.li
          key={t.label}
          className={styles.cell}
          data-span={t.span}
          initial={reduced ? false : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE, delay: (i % 4) * 0.07 }}
        >
          <Tile tile={t} />
        </motion.li>
      ))}
    </ul>
  );
}

function Tile({ tile: t }: { tile: ProofTile }) {
  const body = (
    <>
      {t.media ? <TileMediaLayer tile={t} /> : null}
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.content}>
        <span className={styles.value}>{t.pending ? <span className={styles.dash} aria-label="Pending" /> : <StatValue value={t.value} />}</span>
        <span className={styles.label}>{t.label}</span>
        {t.list ? (
          <span className={styles.list}>
            {t.list.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
        ) : null}
      </span>
      {t.href ? (
        <span className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      ) : null}
    </>
  );

  return (
    <Spotlight
      className={styles.tile}
      tone={t.tone}
      pending={t.pending}
      hasMedia={Boolean(t.media)}
      mediaKind={t.media?.kind}
      href={t.href}
    >
      {body}
    </Spotlight>
  );
}

/* Writes the pointer position into two custom properties; the CSS draws the
   light. No re-render per move. */
function Spotlight({
  children,
  className,
  tone,
  pending,
  hasMedia,
  mediaKind,
  href,
}: {
  children: ReactNode;
  className: string;
  tone?: string;
  pending?: boolean;
  hasMedia: boolean;
  mediaKind?: string;
  href?: string;
}) {
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`);
  };
  const props = {
    className,
    'data-tone': tone,
    'data-pending': pending ? '' : undefined,
    'data-media': hasMedia ? mediaKind : undefined,
    onPointerMove: onMove,
  };
  return href ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <div {...props}>{children}</div>
  );
}

function TileMediaLayer({ tile }: { tile: ProofTile }) {
  const m = tile.media!;
  if (m.kind === 'image') {
    return (
      <span className={styles.shot} aria-hidden="true">
        <Image src={m.src} alt="" width={m.w} height={m.h} sizes="(max-width: 900px) 90vw, 600px" />
      </span>
    );
  }
  return <TileVideo src={m.src} poster={m.poster} />;
}

function TileVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? el.play().catch(() => {}) : el.pause()), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return (
    <span className={styles.video} aria-hidden="true">
      <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" />
    </span>
  );
}
