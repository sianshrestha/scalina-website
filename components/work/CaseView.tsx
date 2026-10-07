'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ClosingBlock from '@/components/ClosingBlock';
import StartProject from '@/components/sections/StartProject';
import Reveal from '@/components/Reveal';
import Magnetic from '@/components/Magnetic';
import StatValue from '@/components/StatValue';
import CaseMedia from './CaseMedia';
import { CASES, getCase, type CaseChapter, type CaseMedia as Media, type CaseStudy } from '@/lib/work';
import { gsap, useGSAP } from '@/lib/gsap';
import { useGroundRhythm } from '@/lib/useGroundRhythm';
import styles from './CaseView.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/* A single client's case study.

   Reads top to bottom as the engagement happened: who they are, the picture,
   what it did (numbers first — the reader came to find out whether it
   worked), the brief, then one chapter per thing we made or built. The page
   is light the whole way down; the colour belongs to the work. */
export default function CaseView({ slug }: { slug: string }) {
  const c = getCase(slug) as CaseStudy;
  const index = CASES.indexOf(c);
  const next = CASES[(index + 1) % CASES.length];

  const rhythm = useRef<HTMLDivElement | null>(null);
  const scope = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  useGroundRhythm(rhythm, [slug]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        /* The cover opens as it rises into view — the panel's inset closes
           while the media inside settles from a slight zoom. Scrubbed, so it
           tracks the scroll rather than playing at its own pace. */
        const cover = scope.current?.querySelector('[data-cover]');
        if (cover) {
          gsap.fromTo(
            '[data-cover-panel]',
            { clipPath: 'inset(8% 6% 0% 6% round 28px)' },
            {
              clipPath: 'inset(0% 0% 0% 0% round 28px)',
              ease: 'none',
              scrollTrigger: { trigger: cover, start: 'top 90%', end: 'top 15%', scrub: true },
            }
          );
          gsap.fromTo(
            '[data-cover-media]',
            { scale: 1.06, yPercent: 4 },
            {
              scale: 1,
              yPercent: 0,
              ease: 'none',
              scrollTrigger: { trigger: cover, start: 'top 90%', end: 'top 15%', scrub: true },
            }
          );
        }

        /* Depth: media drifts against the scroll at its own rate. Phones in a
           row get different rates so the row reads as objects in space. */
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const speed = Number(el.dataset.parallax) || 1;
          gsap.fromTo(
            el,
            { y: 40 * speed },
            {
              y: -40 * speed,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });

        /* Each chapter's rule draws across as the chapter arrives. */
        gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((el) => {
          gsap.fromTo(
            el,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'expo.out',
              duration: 1.2,
              scrollTrigger: { trigger: el, start: 'top 88%' },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [slug] }
  );

  const words = c.client.split(' ');

  return (
    <>
      <SiteHeader />
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        <div ref={rhythm} className="rhythm">
          <div ref={scope}>
            {/* ---- hero ---------------------------------------------------- */}
            <section className={styles.hero} data-ground="light" aria-labelledby="case-title">
              <div className={styles.shell}>
                <div className={styles.topline}>
                  <Link href="/work" className={styles.back}>
                    <span aria-hidden="true">←</span> All work
                  </Link>
                  {c.logo ? (
                    <Image src={c.logo.src} alt={`${c.client} logo`} width={c.logo.w} height={c.logo.h} className={styles.logo} sizes="200px" />
                  ) : null}
                  <span className={styles.count}>
                    {String(index + 1).padStart(2, '0')} / {String(CASES.length).padStart(2, '0')}
                  </span>
                </div>

                <h1 id="case-title" className={styles.title}>
                  {/* The space sits between the masks, not inside one: trailing
                      whitespace in an inline-block collapses and the words run
                      together. */}
                  {words.map((w, i) => (
                    <Fragment key={i}>
                      <span className={styles.wordMask}>
                        <motion.span
                          className={styles.word}
                          initial={reduced ? false : { y: '110%' }}
                          animate={{ y: '0%' }}
                          transition={{ duration: 1, ease: EASE, delay: 0.08 + i * 0.07 }}
                        >
                          {w}
                        </motion.span>
                      </span>
                      {i < words.length - 1 ? ' ' : null}
                    </Fragment>
                  ))}
                </h1>

                <motion.p
                  className={styles.headline}
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
                >
                  {c.headline}
                </motion.p>

                <motion.dl
                  className={styles.meta}
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.55 }}
                >
                  <div>
                    <dt>Client</dt>
                    <dd>{c.client}</dd>
                  </div>
                  <div>
                    <dt>Sector</dt>
                    <dd>{c.sector}</dd>
                  </div>
                  <div>
                    <dt>Team</dt>
                    <dd>{c.teams.map((t) => (t === 'media' ? 'Scalina Media' : 'Scalina Systems')).join(' + ')}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      {c.status} · {c.year}
                    </dd>
                  </div>
                  <div className={styles.metaWide}>
                    <dt>What we did</dt>
                    <dd>
                      <ul className={styles.services}>
                        {c.services.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </motion.dl>
              </div>
            </section>

            {/* ---- cover --------------------------------------------------- */}
            <section className={styles.coverSection} data-ground="light" aria-label={`${c.short} cover`} data-cover>
              <div className={styles.coverPanel} data-cover-panel style={{ ['--tint' as string]: c.tint }}>
                <div className={styles.coverMedia} data-cover-media data-frame={frameOf(c.cover)}>
                  <CaseMedia media={c.cover} preload sizes="(max-width: 900px) 100vw, 80vw" />
                </div>
              </div>
            </section>

            {/* ---- results ------------------------------------------------- */}
            {c.results.length ? (
              <section className={styles.results} data-ground="light" aria-label="Results">
                <div className={styles.shell}>
                  <ul className={styles.resultGrid} data-count={c.results.length}>
                    {c.results.map((r, i) => (
                      <Reveal key={r.label} as="li" kind="number" delay={i * 70} className={styles.result}>
                        <span className={styles.resultValue}>
                          <StatValue value={r.value} />
                        </span>
                        <span className={styles.resultLabel}>{r.label}</span>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </section>
            ) : null}

            {/* ---- brief --------------------------------------------------- */}
            <section className={styles.brief} data-ground="light" aria-labelledby="case-brief">
              <div className={`${styles.shell} ${styles.split}`}>
                <Reveal kind="fade" as="h2" id="case-brief" className="eyebrow">
                  The brief
                </Reveal>
                <div>
                  <Reveal kind="fade" as="p" className={styles.briefText}>
                    {c.brief}
                  </Reveal>
                  <Reveal kind="fade" as="p" delay={80} className={styles.summary}>
                    {c.summary}
                  </Reveal>
                </div>
              </div>
            </section>

            {/* ---- chapters ------------------------------------------------ */}
            {c.chapters.map((ch, i) => (
              <Chapter key={ch.title} chapter={ch} n={i + 1} />
            ))}

            {/* ---- reel ---------------------------------------------------- */}
            {c.reel?.length ? (
              <section className={styles.reel} data-ground="light" aria-label="Delivered pieces">
                <div className={styles.shell}>
                  <p className="eyebrow">A few of the titles delivered</p>
                </div>
                <div className={styles.marquee} aria-hidden="true">
                  <div className={styles.track}>
                    {[...c.reel, ...c.reel].map((t, i) => (
                      <span key={i} className={styles.reelItem}>
                        {t}
                        <i />
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="srOnly">
                  {c.reel.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* ---- next ---------------------------------------------------- */}
            <section className={styles.next} data-ground="light" aria-label="Next case study">
              <div className={styles.shell}>
                <Link href={`/work/${next.slug}`} className={styles.nextLink}>
                  <span className="eyebrow">Next case</span>
                  <span className={styles.nextRow}>
                    <span className={styles.nextName}>{next.short}</span>
                    <Magnetic strength={0.35}>
                      <span className={styles.nextArrow} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="28" height="28">
                          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                    </Magnetic>
                  </span>
                  <span className={styles.nextHeadline}>{next.headline}</span>
                </Link>
              </div>
            </section>
          </div>

          <ClosingBlock>
            <StartProject />
            <SiteFooter />
          </ClosingBlock>
        </div>
      </main>
    </>
  );
}

function frameOf(m: Media) {
  return m.kind === 'designed' ? `designed-${m.design}` : m.frame ?? 'bare';
}

/* One thing we made or built: a numbered title and body, then its media in
   the layout that suits it. */
function Chapter({ chapter, n }: { chapter: CaseChapter; n: number }) {
  const media = chapter.media ?? [];
  const layout = chapter.layout ?? 'wide';
  return (
    <section className={styles.chapter} data-ground="light" aria-labelledby={`chapter-${n}`}>
      <div className={styles.shell}>
        <span className={styles.rule} data-rule aria-hidden="true" />
        <div className={styles.split}>
          <Reveal kind="fade" as="span" className={styles.chapterN}>
            {String(n).padStart(2, '0')}
          </Reveal>
          <div>
            <Reveal kind="fade" as="h2" id={`chapter-${n}`} className={styles.chapterTitle}>
              {chapter.title}
            </Reveal>
            <Reveal kind="fade" as="p" delay={60} className={styles.chapterBody}>
              {chapter.body}
            </Reveal>
          </div>
        </div>

        {media.length ? (
          <div className={styles.media} data-layout={layout}>
            {media.map((m, i) => (
              <MediaSlot key={i} layout={layout} i={i}>
                <CaseMedia
                  media={m}
                  sizes={
                    layout === 'phones' ? '(max-width: 900px) 70vw, 320px' :
                    layout === 'posters' ? '(max-width: 900px) 50vw, 30vw' :
                    layout === 'pair' ? '(max-width: 900px) 100vw, 50vw' :
                    '(max-width: 900px) 100vw, 1200px'
                  }
                />
              </MediaSlot>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* Per-layout wrapper: phones drift at staggered rates, posters tilt toward
   the pointer, everything else just rises in. */
function MediaSlot({ layout, i, children }: { layout: string; i: number; children: ReactNode }) {
  if (layout === 'posters') return <Tilt>{children}</Tilt>;
  if (layout === 'phones') {
    return (
      <div className={styles.slot} data-parallax={[0.6, 1.4, 0.9][i % 3]}>
        {children}
      </div>
    );
  }
  return (
    <Reveal kind="card" className={styles.slot}>
      {children}
    </Reveal>
  );
}

/* Hover tilt for the poster grid — the card turns a few degrees toward the
   pointer, like picking a print up off a table. */
function Tilt({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 220, damping: 20 });

  if (reduced) return <div className={styles.slot}>{children}</div>;

  return (
    <motion.div
      className={styles.slot}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: EASE }}
      whileHover={{ scale: 1.02 }}
      onPointerMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - box.left) / box.width);
        py.set((e.clientY - box.top) / box.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}
