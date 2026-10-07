'use client';

import { motion, useReducedMotion } from 'motion/react';
import WordRise from '@/components/WordRise';
import type { Team, TeamKey } from '@/lib/services';
import styles from './ServicesHero.module.css';

/* The team headline is the whole hero: one long, light, very large Inter Tight
   line that says what the team does before anything else on the page. */
export default function ServicesHero({
  team,
  onSwitch,
}: {
  team: Team;
  onSwitch: (key: TeamKey) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <section
      className={styles.hero}
      data-ground={team.ground}
      aria-label={`${team.name} services`}
    >
      <div className={styles.shell}>
        {/* The switch shares the eyebrow's line and sits on the page's centre
            line, so the control that changes the whole page is level with the
            label that says which page you are on. */}
        <div className={styles.topRow}>
          <span className={styles.eyebrow}>{team.eyebrow}</span>
          <button type="button" className={styles.switch} onClick={() => onSwitch(team.other)}>
            <span className={styles.switchLabel}>
              Switch to{' '}
              <span className={styles.switchTarget}>
                {team.other === 'media' ? 'Scalina Media' : 'Scalina Systems'}
              </span>
            </span>
          </button>
        </div>

        {/* Keyed by team, so switching replays the entrance for the new
            headline rather than swapping text under a settled one. */}
        <div key={team.key} className={styles.copy}>
          <WordRise as="h1" className={styles.headline} lines={team.headline} delay={0.05} stagger={0.045} />
          <motion.p
            className={styles.lede}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          >
            {team.lede}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
