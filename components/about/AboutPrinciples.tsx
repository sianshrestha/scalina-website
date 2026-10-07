'use client';

import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import styles from './AboutPrinciples.module.css';

/* How we work — told as a scroll story.

   Four commitments, one at a time. The section pins (CSS `position: sticky`,
   so it holds under Lenis and needs no ScrollTrigger pin-spacer) and the
   scroll moves you through them: each principle takes the stage in turn while
   the loop on the right draws a quarter further and lights one more of its
   four stages. The ring is a progress device, not a mapping of principle to
   stage — the centre says so by naming the loop, never a stage. The fourth — "we own the loop" — is the one that closes the ring.

   Without JS, or with reduced motion, it is simply the four principles as a
   list. The pinned layout is switched on by `data-story`, which only the
   scroll timeline sets. */
const PRINCIPLES = [
  {
    number: '01',
    title: 'No handover between the halves',
    body:
      'The people making the content and the people building the system are in the same studio, on the same brief. Nothing gets thrown over a wall, and nobody gets to blame the other side of it.',
    stage: 'Attract',
  },
  {
    number: '02',
    title: 'We won’t run growth into operations that can’t carry it',
    body:
      'If the campaign would generate more enquiries than the business can answer, that is not a campaign problem and more spend will not fix it. We will say so, and we will offer to fix the other half first.',
    stage: 'Amplify',
  },
  {
    number: '03',
    title: 'Real numbers only',
    body:
      'Every figure we report is verifiable in the platform it came from. We don’t publish results we cannot show you the account for, and we don’t write testimonials on a client’s behalf.',
    stage: 'Convert',
  },
  {
    number: '04',
    title: 'We own the loop, not one stage of it',
    body:
      'Attract, Amplify, Convert, Operate. Most agencies own a single stage and hand you the rest as your problem. Owning all four is the only way the handover cost disappears.',
    stage: 'Operate',
  },
];

/* Node positions on the ring, clockwise from the top. */
const NODES = [
  { x: 200, y: 40 },
  { x: 360, y: 200 },
  { x: 200, y: 360 },
  { x: 40, y: 200 },
];
const LABEL_AT = [
  { x: 200, y: 14, anchor: 'middle' },
  { x: 386, y: 205, anchor: 'start' },
  { x: 200, y: 396, anchor: 'middle' },
  { x: 14, y: 205, anchor: 'end' },
] as const;

export default function AboutPrinciples() {
  const section = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const root = section.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        root.dataset.story = 'on';
        ScrollTrigger.refresh();

        const items = gsap.utils.toArray<HTMLElement>('[data-principle]', root);
        const ring = root.querySelector<SVGCircleElement>('[data-ring]');
        const bar = root.querySelector<HTMLElement>('[data-progress]');
        const length = ring ? ring.getTotalLength() : 0;

        gsap.set(items, { autoAlpha: 0, y: 60 });
        gsap.set(items[0], { autoAlpha: 1, y: 0 });
        if (ring) gsap.set(ring, { strokeDasharray: length, strokeDashoffset: length });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.querySelector('[data-track]'),
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              const i = Math.min(PRINCIPLES.length - 1, Math.floor(self.progress * PRINCIPLES.length));
              setActive(i);
            },
          },
        });

        /* One unit of timeline per principle. The ring draws a quarter per
           unit; each hand-off happens across the unit boundary. */
        if (ring) tl.to(ring, { strokeDashoffset: 0, duration: PRINCIPLES.length }, 0);
        if (bar) tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: PRINCIPLES.length }, 0);
        items.forEach((item, i) => {
          if (i === 0) return;
          const at = i - 0.25;
          tl.to(items[i - 1], { autoAlpha: 0, y: -60, duration: 0.25, ease: 'power2.in' }, at);
          tl.fromTo(item, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, at + 0.2);
        });

        return () => {
          delete root.dataset.story;
        };
      });
      return () => mm.revert();
    },
    { scope: section, dependencies: [] }
  );

  return (
    <section ref={section} className={styles.section} data-ground="light" aria-labelledby="about-principles">
      <div className={styles.track} data-track>
        <div className={styles.stage}>
          <div className={styles.head}>
            <p className="eyebrow">How we work</p>
            <h2 id="about-principles" className={styles.heading}>
              Four things we hold to, including the one that costs us work.
            </h2>
            <div className={styles.counter} aria-hidden="true">
              <span className={styles.counterNow}>{PRINCIPLES[active].number}</span>
              <span className={styles.counterOf}>/ 04</span>
            </div>
            <div className={styles.rail} aria-hidden="true">
              <span className={styles.railFill} data-progress />
            </div>
          </div>

          <ol className={styles.list}>
            {PRINCIPLES.map((p) => (
              <li key={p.number} className={styles.item} data-principle>
                <span className={styles.number}>{p.number}</span>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.body}>{p.body}</p>
              </li>
            ))}
          </ol>

          <div className={styles.loop} aria-hidden="true">
            <svg viewBox="0 0 400 400" className={styles.loopSvg}>
              <circle cx="200" cy="200" r="160" className={styles.ringBase} />
              <circle
                cx="200"
                cy="200"
                r="160"
                className={styles.ring}
                data-ring
                transform="rotate(-90 200 200)"
              />
              {NODES.map((n, i) => (
                <g key={i} data-on={i <= active ? '' : undefined} className={styles.node}>
                  <circle cx={n.x} cy={n.y} r="14" className={styles.nodeHalo} />
                  <circle cx={n.x} cy={n.y} r="7" className={styles.nodeDot} />
                  <text x={LABEL_AT[i].x} y={LABEL_AT[i].y} textAnchor={LABEL_AT[i].anchor} className={styles.nodeLabel}>
                    {PRINCIPLES[i].stage}
                  </text>
                </g>
              ))}
              <text x="200" y="196" textAnchor="middle" className={styles.centerBig}>
                {active === 3 ? 'Closed' : 'The loop'}
              </text>
              <text x="200" y="222" textAnchor="middle" className={styles.centerSmall}>
                {active === 3 ? 'owned end to end' : `${active + 1} of 4 lit`}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
