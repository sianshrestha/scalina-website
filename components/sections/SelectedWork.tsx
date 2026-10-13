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

   Real output: the delivered short-form videos from the Media case studies
   (lib/work.ts). A new case study with video shows up here without touching
   this file. Tiles carry no text; the
   wall links to /work, where each piece is named. */

type WallItem = { kind: 'image' | 'video'; src: string; poster?: string; w: number; h: number };

const ALL = CASES.filter((c) => c.teams.includes('media'))
  .flatMap((c) => [c.cover, ...c.chapters.flatMap((ch) => ch.media ?? [])])
  .filter((m, i, all) => m.kind !== 'designed' && all.findIndex((o) => o.kind !== 'designed' && 'src' in o && 'src' in m && o.src === m.src) === i);

/* Every card plays: the wall is the delivered videos only (owner, Oct 2026).
   It used to be one video per column among stills, which on a phone read as
   footage that had stalled. The designed posters still live on their case
   study. Cost stays bounded because LoopVideo loads nothing until a tile
   scrolls into view (`preload="none"`) and pauses it once it leaves, so only
   what is on screen is decoding. */
const TILES: WallItem[] = ALL.flatMap((m): WallItem[] =>
  m.kind === 'video' ? [{ kind: 'video', src: m.src, poster: m.poster, w: m.w, h: m.h }] : []
);

/* Six per column: every column is well taller than the wall, which is what
   lets it drift both ways without ever showing a gap. */
const COLUMN_COUNT = 4;
const PER_COLUMN = 6;

export default function SelectedWork() {
  const columns = Array.from({ length: COLUMN_COUNT }, (_, col) =>
    Array.from({ length: PER_COLUMN }, (_, row) => {
      /* Row-major across the columns, so the first two columns (all a phone
         shows) get a mix of the newest pieces rather than one client each. */
      const item = TILES[(row * COLUMN_COUNT + col) % TILES.length];
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
