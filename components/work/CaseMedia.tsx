'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import VideoLightbox from './VideoLightbox';
import { useReducedMotion } from 'motion/react';
import type { CaseMedia as Media } from '@/lib/work';
import { DmFlow, VoiceCall, UgcCover, Cadence } from './Designed';
import styles from './CaseMedia.module.css';

/* One piece of case-study media, in its frame.

   The frame says what the thing IS before the picture does: a browser for
   software, a phone for vertical video and mobile screens, a poster card for
   print and social design. `sizes` is passed in by the layout that knows how
   wide the slot is. */
export default function CaseMedia({
  media,
  sizes = '(max-width: 900px) 100vw, 70vw',
  preload = false,
  className,
}: {
  media: Media;
  sizes?: string;
  preload?: boolean;
  className?: string;
}) {
  if (media.kind === 'designed') {
    const body =
      media.design === 'dm-flow' ? <DmFlow /> :
      media.design === 'voice-call' ? <VoiceCall /> :
      media.design === 'cadence' ? <Cadence weeks={media.weeks} total={media.total} /> :
      <UgcCover label={media.label ?? ''} />;
    return (
      <figure className={[styles.figure, className].filter(Boolean).join(' ')}>
        {body}
      </figure>
    );
  }

  const frame = media.frame ?? 'bare';
  const inner =
    media.kind === 'video' ? (
      <LoopVideo src={media.src} poster={media.poster} alt={media.alt} w={media.w} h={media.h} />
    ) : (
      <Image
        src={media.src}
        alt={media.alt}
        width={media.w}
        height={media.h}
        sizes={sizes}
        preload={preload}
        className={styles.img}
      />
    );

  return (
    <figure className={[styles.figure, className].filter(Boolean).join(' ')} data-frame={frame}>
      {frame === 'browser' ? (
        <div className={styles.browser}>
          <div className={styles.chrome} aria-hidden="true">
            <span className={styles.dots}><i /><i /><i /></span>
            {media.kind === 'image' && media.url ? <span className={styles.url}>{media.url}</span> : null}
          </div>
          <div className={styles.viewport}>{inner}</div>
        </div>
      ) : frame === 'phone' ? (
        <div className={styles.phone}>
          <div className={styles.screen}>
            {inner}
            {media.kind === 'video' && media.full ? (
              <WatchButton full={media.full} poster={media.poster} title={media.alt} />
            ) : null}
          </div>
        </div>
      ) : frame === 'poster' ? (
        <div className={styles.poster}>{inner}</div>
      ) : (
        <div className={styles.bare}>{inner}</div>
      )}
    </figure>
  );
}

/* Opens the full edit, with sound. The whole screen is the hit area; the pill
   is the label for it. */
function WatchButton({ full, poster, title }: { full: string; poster: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={styles.watch} onClick={() => setOpen(true)} aria-label={`Watch ${title} with sound`}>
        <span className={styles.watchPill}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M7 5v14l12-7z" fill="currentColor" />
          </svg>
          Watch with sound
        </span>
      </button>
      <VideoLightbox src={full} poster={poster} title={title} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* A muted loop that only plays while it is on screen.

   Several phones share a row on the Maya page; playing all of them all the
   time costs battery for footage nobody is looking at. Reduced motion shows
   the poster and never starts. `preload="none"` keeps the index page from
   pulling video it may never show. */
export function LoopVideo({ src, poster, alt, w, h }: { src: string; poster: string; alt: string; w: number; h: number }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={styles.img}
      src={src}
      poster={poster}
      width={w}
      height={h}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    />
  );
}
