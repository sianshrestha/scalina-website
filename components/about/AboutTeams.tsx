'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import styles from './AboutTeams.module.css';

/* Two specialist teams, one roof — the wipe and the section it becomes.

   ONE pinned stage, two moves, no seam between them.

   1. The circle wipe. The same two-copy mechanism the rest of the site's
      boundaries use: the heading is drawn twice in one cell, once in ink on
      the light ground and once in bone on cobalt, and the cobalt copy's
      `clip-path` circle opens from the centre, so the edge cuts each letter
      mid-glyph rather than cross-fading it.
   2. The shrink. The cobalt does not fade out; its clip closes down to a band
      and the heading rides down into it, scaling to the size it holds there.
      What the cobalt uncovers on its way is the section itself — two streams
      of the teams' own vocabulary running in opposite directions, and the two
      team columns under them. The beam the heading ends up in IS the wipe,
      shrunk. That is the whole idea: the colour that carried the title becomes
      the rule that holds it.

   Why these are one component rather than ColorWipe plus a reveal below it.
   A sticky stage always has one viewport of track left after it unpins, so a
   wipe and a following pinned section are separated by a screen of scroll in
   which BOTH are visible — the wipe's final frame leaving at the top and the
   reveal's first frame arriving at the bottom, each with its own copy of the
   same heading. Two titles on screen at once, scrolling past each other. One
   stage has no such gap.

   The heading moves by FLIP: it is laid out in the beam at the DISPLAY size,
   the timeline opens it centred on the stage at that size, and it scales DOWN
   into the band — never up, because type magnified by a transform is
   rasterised at its layout size first and arrives soft. The factor comes off
   `.probe`, which carries the size it settles at, so it is measured rather
   than written down twice. Everything is measured again on every ScrollTrigger
   refresh, so a font swap or a resize re-lands it. */

const TEAMS = [
  {
    number: '01',
    name: 'Scalina Media',
    character: 'Expressive, tactile, culturally fluent.',
    body:
      'Works in vertical video and print texture. Makes the content that gets a business found, followed and remembered, at the volume the feed demands.',
    services: [
      'Content creation & UGC',
      'Creative & graphic design',
      'Creative production',
      'Social media management',
      'Paid advertising & campaigns',
    ],
    stream: ['Media', 'Content', 'UGC', 'Reels', 'Social', 'Paid', 'Design'],
    href: '/services?view=media',
  },
  {
    number: '02',
    name: 'Scalina Systems',
    character: 'Precise, engineered, structural.',
    body:
      'Works in interface and grid. Builds the websites, tools and automation a business actually runs on. The infrastructure that carries the volume the front of the business creates.',
    services: [
      'Website development',
      'Custom software (CRM, ERP, WMS, portals)',
      'Automation & AI workflows',
      'Funnels & lead generation',
      'SEO & search infrastructure',
    ],
    stream: ['Systems', 'Software', 'Websites', 'Automation', 'Funnels', 'SEO', 'Portals'],
    href: '/services?view=systems',
  },
] as const;

const HEADING = ['Two specialist', 'teams, one roof'];

const DESKTOP = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';
const FLAT = '(max-width: 899px), (prefers-reduced-motion: reduce)';

/* Where in the pin each half of the sequence sits, as a fraction of the
   scrubbed travel. Named so the ground steps below can be reasoned about
   against the same numbers the timeline uses. */
const T = {
  wipeEnd: 0.34,
  dropFrom: 0.36,
  shrinkStart: 0.42,
  shrinkEnd: 0.86,
};

/* When the page's ground tokens step, in the same units. The stage is opaque
   for all of this, so the only thing still reading them is the fixed header:
   cobalt once the circle has passed behind it, light again once the band has
   shrunk back below it. See the `data-ground-line` note in useGroundRhythm. */
const GROUND_AT = { cobalt: 0.1, light: 0.6 };

export default function AboutTeams() {
  const track = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const world = useRef<HTMLDivElement | null>(null);
  const wipeFrom = useRef<HTMLDivElement | null>(null);
  const paint = useRef<HTMLDivElement | null>(null);
  const mask = useRef<HTMLDivElement | null>(null);
  const beam = useRef<HTMLDivElement | null>(null);
  const heading = useRef<HTMLHeadingElement | null>(null);
  const headingCopy = useRef<HTMLParagraphElement | null>(null);
  const probe = useRef<HTMLSpanElement | null>(null);
  const markCobalt = useRef<HTMLSpanElement | null>(null);
  const markLight = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* The lines are attributes, read live by the ground rhythm on every
         scroll, so setting them after mount is safe — unlike `data-ground`
         itself, which is collected once. */
      const setLines = (cobalt: number, light: number) => {
        if (markCobalt.current) markCobalt.current.dataset.groundLine = String(cobalt);
        if (markLight.current) markLight.current.dataset.groundLine = String(light);
        return () => {
          if (markCobalt.current) delete markCobalt.current.dataset.groundLine;
          if (markLight.current) delete markLight.current.dataset.groundLine;
        };
      };

      mm.add(DESKTOP, () => {
        const trackEl = track.current;
        const stageEl = stage.current;
        const beamEl = beam.current;
        const headEl = heading.current;
        const copyEl = headingCopy.current;
        const probeEl = probe.current;
        if (!trackEl || !stageEl || !beamEl || !headEl || !copyEl || !probeEl) return;

        /* One source of truth for the track's height: the stylesheet, so the
           media query that flattens this on narrow screens cannot be
           contradicted by an inline style. */
        const trackVh =
          parseFloat(getComputedStyle(trackEl).getPropertyValue('--track-vh')) || 360;
        const travel = trackVh / 100 - 1;

        /* The two ends of the heading's travel, in the heading's own
           untransformed frame: `open` is centred on the stage at full size,
           `settled` is scaled down and centred in the band. Both are measured,
           never assumed — the display size is a clamp and the band is a
           percentage, so neither is a number this file can know. */
        const open = { x: 0, y: 0 };
        const settled = { y: 0, scale: 1 };
        const band = { top: 0, bottom: 0 };

        const measure = () => {
          gsap.set([headEl, copyEl], { x: 0, y: 0, scale: 1 });
          const s = stageEl.getBoundingClientRect();
          const h = headEl.getBoundingClientRect();
          const b = beamEl.getBoundingClientRect();

          const target = parseFloat(getComputedStyle(probeEl).fontSize) || 0;
          const drawn = parseFloat(getComputedStyle(headEl).fontSize) || 1;
          settled.scale = target / drawn;

          /* transform-origin is the top-left corner, so a translate puts that
             corner exactly where the arithmetic says and the scale happens
             around it. */
          open.x = s.left + s.width / 2 - (h.left + h.width / 2);
          open.y = s.top + s.height / 2 - (h.top + h.height / 2);
          settled.y = b.top + (b.height - h.height * settled.scale) / 2 - h.top;

          band.top = b.top - s.top;
          band.bottom = s.bottom - b.bottom;
        };

        measure();

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: trackEl,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            /* Sections above this one settle after mount (the intro's reveals,
               the display face swapping in), so the start this was created
               against moves. Without it the scrub reports the wrong progress
               for the rest of the session. */
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
        });

        tl
          /* 1 — the circle opens. 75% of the box clears the corners at any
             aspect ratio, so the cobalt is whole before anything else runs. */
          .fromTo(
            mask.current,
            { clipPath: 'circle(0% at 50% 50%)' },
            { clipPath: 'circle(75% at 50% 50%)', duration: T.wipeEnd },
            0
          )
          /* The outgoing copy is dropped once it is completely covered, so the
             shrink uncovers the section rather than uncovering it again. */
          .set(wipeFrom.current, { autoAlpha: 0 }, T.dropFrom)

          /* 2 — the cobalt closes onto the band. Both ends of the clip are
             written with the same units in the same slots: a `0%` start
             against a `240px` end is interpolated number-for-number and lands
             nowhere near the band. */
          .fromTo(
            paint.current,
            { clipPath: 'inset(0px 0% 0px 0%)' },
            {
              clipPath: () => `inset(${band.top}px 0% ${band.bottom}px 0%)`,
              duration: T.shrinkEnd - T.shrinkStart,
            },
            T.shrinkStart
          )
          /* The heading lands before the cobalt has finished closing, so it is
             never in flight over ground the clip has already given back. */
          .fromTo(
            [headEl, copyEl],
            { x: () => open.x, y: () => open.y, scale: 1 },
            {
              x: 0,
              y: () => settled.y,
              scale: () => settled.scale,
              duration: 0.32,
            },
            T.shrinkStart
          )
          .fromTo(world.current, { opacity: 0.3 }, { opacity: 1, duration: 0.2 }, 0.44)
          .fromTo(`.${styles.lit}`, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.46)
          .fromTo(
            `.${styles.card}`,
            { autoAlpha: 0, y: 46 },
            { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.07 },
            0.62
          )
          .fromTo(
            `.${styles.lede}`,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.18 },
            0.66
          );

        return setLines(-(GROUND_AT.cobalt * travel), -(GROUND_AT.light * travel));
      });

      /* Flattened: a full-height cobalt title block, then the section. The
         lines follow the blocks rather than a pin — cobalt from the top of the
         first, light once the second has reached the usual trigger line. */
      mm.add(FLAT, () => setLines(0.55, -0.45));

      return () => mm.revert();
    },
    { scope: track }
  );

  return (
    <section
      ref={track}
      className={styles.track}
      aria-labelledby="about-teams"
      data-teams-track
    >
      {/* Zero-size, pinned to the track rather than to the sticky stage, so
          they measure scroll through the pin. `data-ground` is in the markup
          because the rhythm collects it once; the lines are written above. */}
      <span ref={markCobalt} className={styles.mark} data-ground="cobalt" aria-hidden="true" />
      <span ref={markLight} className={styles.mark} data-ground="light" aria-hidden="true" />

      <div ref={stage} className={styles.stage}>
        <span ref={probe} className={styles.probe} aria-hidden="true" />

        {/* Document order is the order these read in with the pin OFF — the
            title block, then the section. On the pin, z-index puts the paint
            back on top. */}

        {/* The cobalt. Full screen through the wipe, the beam by the end. */}
        <div ref={paint} className={styles.paint}>
          <div ref={mask} className={styles.mask}>
            <Streams tone={styles.lit} />
            <div ref={beam} className={styles.beam}>
              <h2 ref={heading} id="about-teams" className={styles.heading}>
                {HEADING.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className={styles.lede}>
                Not a generalist team stretched across a service list. Two teams that do different
                work, in the same building, on the same brief.
              </p>
            </div>
          </div>
        </div>

        {/* The outgoing copy of the wipe: the same heading, in ink on the light
            ground, in the same box. Identical to the pixel or the circle stops
            cutting the letters. */}
        <div ref={wipeFrom} className={styles.wipeFrom} aria-hidden="true">
          <div className={styles.beam}>
            <p ref={headingCopy} className={styles.heading}>
              {HEADING.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>
        </div>

        {/* The section, underneath everything, uncovered by the shrink. */}
        <div ref={world} className={styles.world}>
          <Streams tone={styles.base} />

          <div className={styles.cards}>
            {TEAMS.map((team) => (
              <article key={team.name} className={styles.card} data-team={team.number}>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardName}>{team.name}</h3>
                </div>
                <p className={styles.character}>{team.character}</p>
                <p className={styles.cardBody}>{team.body}</p>
                <ul className={styles.services}>
                  {team.services.map((service) => (
                    <li key={service}>
                      <a href={team.href} className={styles.service}>
                        <span>{service}</span>
                        <span aria-hidden="true" className={styles.serviceArrow}>
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a href={team.href} className={styles.cardLink}>
                  <span>Explore {team.name.split(' ')[1]}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* The two streams, rendered twice: once on the light ground as a near-invisible
   texture, once inside the cobalt where they read. Same markup and the same
   animation started in the same commit, so the two copies stay in step and the
   words appear to light up as the beam passes over them. */
function Streams({ tone }: { tone: string }) {
  return (
    <div className={`${styles.streams} ${tone}`} aria-hidden="true">
      {TEAMS.map((team, index) => {
        const loop = [...team.stream, ...team.stream];
        return (
          <div key={team.number} className={styles.column}>
            <div
              className={styles.vtrack}
              style={{ animationDirection: index === 0 ? 'normal' : 'reverse' }}
            >
              {loop.map((word, i) => (
                <span key={`${word}-${i}`} className={styles.vword}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
