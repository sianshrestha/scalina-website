'use client';

import { useEffect, useRef, useState } from 'react';
import { TEAM_PANELS, type TeamPanel } from '@/lib/teams';
import styles from './Teams.module.css';

/* The two teams, directly under the hero — a second hero, not a card row.

   Two full-bleed bands, each running its own vocabulary as a marquee in the
   opposite direction to the other. Nothing in the section is at rest, and the
   two things moving are moving against each other: that counter-motion is the
   argument (two teams, one brief) made before a word of copy is read. It is
   also the section's ONLY motion — there is no entrance. The hero hands
   straight over to this on the same ground, and an intro on top of a section
   that is already moving reads as a stutter.

   Clicking a band takes the screen. It grows to SPLIT of the viewport, its own
   type SLOWS — the expanding thing calming down rather than speeding up is
   what stops the move reading as a zoom — and the band giving way speeds up.
   Click, not hover: a hover target the height of half the viewport opens and
   shuts on its own as the page scrolls under the pointer, which is the glitch
   this replaced.

   The seam is one lime hairline and it MOVES with the split, carrying the
   badge with it, because a boundary that stays put while the thing it bounds
   changes size reads as a bug. Both are driven off one `--seam` custom
   property so they cannot drift apart.

   Bands paint fixed colours, not ground tokens: this is the one place on the
   page with both grounds on screen at once, so neither can follow the page's
   current one. The PAGE stays dark throughout — the section declares dark like
   the hero above and Shipped below, so nothing outside it ever repaints. The
   one thing that does have to follow the band is the fixed header, and it does
   that on its own tokens (`data-chrome`, see globals.css). */

/* Marquee periods, seconds. Slower when the band is open (it has the room to
   be calm), faster when it is being squeezed. */
const SPEED = { open: 54, idle: 34, shut: 19 };

export default function Teams() {
  const scope = useRef<HTMLElement | null>(null);
  const media = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState<TeamPanel['key'] | null>(null);

  /* The header's ground, not the page's.
     ----------------------------------------------------------------------
     The light Media band passes under the fixed header while the page is on
     the dark ground, so the header has to invert without the page doing so.
     This writes `data-chrome` on the document whenever the light band is the
     thing behind the header, and the header's own tokens follow it.

     Re-run when the split changes as well as on scroll: opening a band moves
     the seam, which can put a different band under the header at the same
     scroll position. */
  useEffect(() => {
    const band = media.current;
    if (!band) return;
    const root = document.documentElement;

    const probe = () => {
      const header = document.querySelector('header');
      const line = (header?.getBoundingClientRect().height ?? 72) / 2;
      const rect = band.getBoundingClientRect();
      if (rect.top <= line && rect.bottom >= line) root.setAttribute('data-chrome', 'light');
      else root.removeAttribute('data-chrome');
    };

    probe();
    window.addEventListener('scroll', probe, { passive: true });
    window.addEventListener('resize', probe);
    return () => {
      window.removeEventListener('scroll', probe);
      window.removeEventListener('resize', probe);
      root.removeAttribute('data-chrome');
    };
  }, [open]);

  return (
    <section ref={scope} className={styles.section} data-ground="dark" aria-labelledby="teams">
      <h2 id="teams" className={styles.srOnly}>
        The two teams
      </h2>

      <div className={styles.stack} data-open={open ?? 'none'}>
        {TEAM_PANELS.map((team) => (
          <Band
            key={team.key}
            ref={team.key === 'media' ? media : undefined}
            team={team}
            open={open === team.key}
            other={open !== null && open !== team.key}
            onToggle={() =>
              setOpen((current) => (current === team.key ? null : team.key))
            }
          />
        ))}

        {/* Rides the seam. Inside `.stack`, not inside a band, so it is not
            clipped by the band's own overflow. */}
        <p className={styles.badge} aria-hidden="true">
          <span>Scalina</span>
          <span className={styles.badgeRule} />
          <span>
            {open === 'media' ? '01 / Media' : open === 'systems' ? '02 / Systems' : 'Two teams'}
          </span>
        </p>
      </div>
    </section>
  );
}

function Band({
  ref,
  team,
  open,
  other,
  onToggle,
}: {
  ref?: React.Ref<HTMLDivElement>;
  team: TeamPanel;
  open: boolean;
  other: boolean;
  onToggle: () => void;
}) {
  const isMedia = team.key === 'media';
  const detailId = `team-detail-${team.key}`;

  /* The band's own vocabulary, said once and then said again: the track is
     translated by exactly -50%, so the list has to be exactly two copies of
     itself or the loop steps. Padding, not `gap`, for the same reason — a gap
     adds one extra interval that -50% does not account for. */
  const words = [team.display, ...team.pills.map((pill) => pill.label)];
  const loop = [...words, ...words];

  const figures = team.stats
    .map((stat) => `${stat.value}${stat.suffix ?? ''} ${stat.label.toLowerCase()}`)
    .join(' · ');

  return (
    <div
      ref={ref}
      className={`${styles.band} ${isMedia ? styles.bandLight : styles.bandDark}`}
      /* Which band this is, for the CSS. Positional selectors do not work
         here: the badge is the stack's last child, so `.band:last-child`
         matched nothing and took the seam rule and the second band's basis
         with it. */
      data-band={team.key}
      data-state={open ? 'open' : other ? 'shut' : 'idle'}
    >
      <div className={styles.marquee} aria-hidden="true">
        <div
          className={styles.track}
          style={{
            animationDuration: `${open ? SPEED.open : other ? SPEED.shut : SPEED.idle}s`,
            animationDirection: isMedia ? 'normal' : 'reverse',
          }}
        >
          {loop.map((word, index) => (
            <span className={styles.item} key={`${word}-${index}`}>
              <span className={styles.word}>{word}</span>
              <span className={styles.diamond} />
            </span>
          ))}
        </div>
      </div>

      {/* The band-sized control. A real button rather than a click handler on
          the band, so it is reachable and announced; it sits under the copy
          layer, which passes clicks through everywhere except its own link. */}
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={detailId}
        onClick={onToggle}
      >
        <span className={styles.srOnly}>
          {open ? `Collapse ${team.name}` : `Expand ${team.name}`}
        </span>
      </button>

      <div className={styles.inner}>
        <div className={styles.label}>
          <span className={styles.number}>{team.number}</span>
          <h3 className={styles.name}>{team.name}</h3>
        </div>

        <div className={styles.detail} id={detailId}>
          <p className={styles.statement}>{team.statement}</p>
          <p className={styles.figures}>{figures}</p>
          <p className={styles.source}>{team.source}</p>
          <a className={styles.more} href={team.href} tabIndex={open ? undefined : -1}>
            <span>What {team.display} does</span>
            <span aria-hidden="true" className={styles.moreArrow}>
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
