'use client';

import Reveal from '@/components/Reveal';
import Link from 'next/link';
import Magnetic from '@/components/Magnetic';
import ParallaxColumns from '@/components/vendor/ParallaxColumns';
import Image from 'next/image';
import { CASES } from '@/lib/work';
import { LoopVideo } from '@/components/work/CaseMedia';
import styles from './SelectedWork.module.css';

/* Latest work — a parallax wall of Scalina Media's output.

   Real output now: the Maya Lounge poster series and frames from the weekly
   UGC, all from the client's deliverables folder (lib/work.ts). The wall
   takes every image the Media case studies carry, so a new case study with
   pictures shows up here without touching this file. Tiles carry no text; the
   wall links to /work, where each piece is named. */

type WallItem = { kind: 'image' | 'video'; src: string; poster?: string; w: number; h: number };

const ALL = CASES.filter((c) => c.teams.includes('media'))
  .flatMap((c) => [c.cover, ...c.chapters.flatMap((ch) => ch.media ?? [])])
  .filter((m, i, all) => m.kind !== 'designed' && all.findIndex((o) => o.kind !== 'designed' && 'src' in o && 'src' in m && o.src === m.src) === i);

/* Stills: every poster, plus a frame from every video. Moving tiles: one
   video per column, never more — a wall of twenty decoding videos janks on
   any laptop, and one moving tile per column already reads as footage. */
const STILLS: WallItem[] = ALL.flatMap((m): WallItem[] =>
  m.kind === 'image' ? [{ kind: 'image', src: m.src, w: m.w, h: m.h }] :
  m.kind === 'video' ? [{ kind: 'image', src: m.poster, w: m.w, h: m.h }] :
  []
);
const MOVING: WallItem[] = ALL.flatMap((m): WallItem[] =>
  m.kind === 'video' ? [{ kind: 'video', src: m.src, poster: m.poster, w: m.w, h: m.h }] : []
);

/* Six per column: every column is well taller than the wall, which is what
   lets it drift both ways without ever showing a gap. The one video sits at a
   different row in each column so they never line up. */
const COLUMN_COUNT = 4;
const PER_COLUMN = 6;
const VIDEO_ROW = [1, 3, 2, 4];

export default function SelectedWork() {
  const columns = Array.from({ length: COLUMN_COUNT }, (_, col) =>
    Array.from({ length: PER_COLUMN }, (_, row) => {
      const item =
        row === VIDEO_ROW[col] && MOVING.length
          ? MOVING[(col * 3) % MOVING.length]
          : STILLS[(col * PER_COLUMN + row) % STILLS.length];
      return (
        /* Decorative here: every piece is named on its case study, and the
           wall links there. */
        <span
          key={`${item.src}-${col}-${row}`}
          className={styles.tile}
          style={{ aspectRatio: `${item.w} / ${item.h}` }}
          aria-hidden="true"
        >
          {item.kind === 'video' ? (
            <LoopVideo src={item.src} poster={item.poster as string} alt="" w={item.w} h={item.h} />
          ) : (
            <Image src={item.src} alt="" fill sizes="(max-width: 900px) 50vw, 25vw" className={styles.tileImg} />
          )}
        </span>
      );
    })
  );

  return (
    <section className={styles.section} data-ground="light" aria-labelledby="selected-work">
      <div className={styles.shell}>
        <Reveal kind="fade" as="h2" id="selected-work" className={styles.heading}>
          Latest work
        </Reveal>
      </div>

      <ParallaxColumns columns={columns} label="Latest work from Scalina Media" />

      <div className={styles.shell}>
        <div className={styles.footerCta}>
          <Magnetic>
            <Link href="/work" className="ghostBtn">
              <span>See all work</span>
              <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
