import Reveal from '@/components/Reveal';
import Magnetic from '@/components/Magnetic';
import type { Team } from '@/lib/services';
import styles from './ServiceCta.module.css';

/* Same destination as everywhere else — the wording changes to match the
   problem the team on screen actually solves. */
export default function ServiceCta({ team }: { team: Team }) {
  return (
    <section id="start" className={styles.section} data-ground="dark" aria-labelledby="services-cta">
      <div className={styles.shell}>
        <div>
          <Reveal kind="fade" as="h2" id="services-cta" className={styles.heading}>
            {team.cta.heading}
          </Reveal>
          <Reveal kind="fade" as="p" delay={90} className={styles.body}>
            {team.cta.body}
          </Reveal>
        </div>

        <Reveal kind="fade" delay={150}>
          <Magnetic>
            <a href="/start" className={styles.cta}>
              <span>{team.cta.label}</span>
              <span aria-hidden="true" className={styles.arrow}>
                →
              </span>
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
