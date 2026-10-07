'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { CASES, type CaseStudy, type WorkTeam } from '@/lib/work';
import { UgcCover } from './Designed';
import styles from './CaseIndex.module.css';

/* The work index: one row per client.

   Minimal on purpose — a list of names you can read in one pass, with the
   picture only arriving when you point at a row. On a list the name is the
   information; a wall of thumbnails makes you decode eight images to find the
   one client you came for. Touch has no hover, so each row carries a small
   thumbnail there instead. */

type Filter = 'all' | WorkTeam;
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'media', label: 'Media' },
  { key: 'systems', label: 'Systems' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function coverSrc(c: CaseStudy): string | null {
  if (c.thumb) return c.thumb;
  if (c.cover.kind === 'image') return c.cover.src;
  if (c.cover.kind === 'video') return c.cover.poster;
  if (c.logo) return c.logo.src;
  return null;
}

/* Logos and bare marks sit on white rather than being cropped. */
function coverFit(c: CaseStudy): 'contain' | 'cover' {
  if (c.thumb) return 'cover';
  if (c.cover.kind === 'image') return c.cover.frame === 'bare' ? 'contain' : 'cover';
  if (c.cover.kind === 'video') return 'cover';
  return 'contain';
}

export default function CaseIndex() {
  const [filter, setFilter] = useState<Filter>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement | null>(null);

  const cases = useMemo(
    () => (filter === 'all' ? CASES : CASES.filter((c) => c.teams.includes(filter))),
    [filter]
  );
  const counts = useMemo(
    () => ({
      all: CASES.length,
      media: CASES.filter((c) => c.teams.includes('media')).length,
      systems: CASES.filter((c) => c.teams.includes('systems')).length,
    }),
    []
  );

  /* The cursor-follow preview. Springs, not a direct write: the card trails
     the pointer slightly, which is what makes it read as an object rather than
     a tooltip glued to the cursor. */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (event: React.PointerEvent) => {
    const box = listRef.current?.getBoundingClientRect();
    if (!box) return;
    x.set(event.clientX - box.left);
    y.set(event.clientY - box.top);
  };

  const active = hovered ? CASES.find((c) => c.slug === hovered) ?? null : null;

  return (
    <section className={styles.section} data-ground="light" aria-label="Case studies">
      <div className={styles.shell}>
        <LayoutGroup>
          <div className={styles.filters} role="group" aria-label="Filter by team">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={styles.filter}
                aria-pressed={filter === f.key}
                onClick={() => setFilter(f.key)}
              >
                {filter === f.key ? (
                  <motion.span
                    layoutId="work-filter"
                    className={styles.filterPill}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                ) : null}
                <span className={styles.filterLabel}>{f.label}</span>
                <span className={styles.filterCount}>{counts[f.key]}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div
          ref={listRef}
          className={styles.listWrap}
          onPointerMove={onMove}
          onPointerLeave={() => setHovered(null)}
        >
          <motion.ol className={styles.list} layout={!reduced}>
            <AnimatePresence initial={false} mode="popLayout">
              {cases.map((c, i) => {
                const src = coverSrc(c);
                return (
                  <motion.li
                    key={c.slug}
                    layout={!reduced}
                    className={styles.item}
                    data-dim={hovered !== null && hovered !== c.slug ? '' : undefined}
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 6) * 0.05 }}
                  >
                    <Link
                      href={`/work/${c.slug}`}
                      className={styles.row}
                      onPointerEnter={(e) => {
                        if (e.pointerType === 'mouse') setHovered(c.slug);
                      }}
                      onFocus={() => setHovered(c.slug)}
                      onBlur={() => setHovered(null)}
                    >
                      <span className={styles.index}>{String(CASES.indexOf(c) + 1).padStart(2, '0')}</span>
                      <span className={styles.thumb} aria-hidden="true" style={{ background: c.tint }}>
                        {src ? (
                          <Image src={src} alt="" width={120} height={120} sizes="64px" />
                        ) : (
                          <span className={styles.initials}>{c.short.slice(0, 2)}</span>
                        )}
                      </span>
                      <span className={styles.name}>
                        <span className={styles.client}>{c.short}</span>
                        <span className={styles.sector}>{c.sector}</span>
                      </span>
                      <span className={styles.services}>{c.services.join(' · ')}</span>
                      <span className={styles.teams}>
                        {c.teams.map((t) => (
                          <span key={t} className={styles.team} data-team={t}>
                            {t === 'media' ? 'Media' : 'Systems'}
                          </span>
                        ))}
                      </span>
                      <span className={styles.arrow} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ol>

          {/* Decorative: the row itself names the client. */}
          {!reduced ? (
            <motion.div className={styles.preview} style={{ x: sx, y: sy }} aria-hidden="true">
              <AnimatePresence>
                {active ? (
                  <motion.div
                    key={active.slug}
                    className={styles.previewCard}
                    style={{ background: active.tint }}
                    initial={{ opacity: 0, scale: 0.86, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {coverSrc(active) ? (
                      <Image
                        src={coverSrc(active) as string}
                        alt=""
                        width={560}
                        height={420}
                        sizes="340px"
                        className={styles.previewImg}
                        data-fit={coverFit(active)}
                      />
                    ) : (
                      <UgcCover label={active.short} />
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
