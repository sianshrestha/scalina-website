'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import WordRise from '@/components/WordRise';
import Bento from '@/components/Bento';
import type { Team } from '@/lib/services';
import { MEDIA_PROOF, SYSTEMS_PROOF } from '@/lib/proof';
import { CASES } from '@/lib/work';
import styles from './ServiceProof.module.css';

/* Figures and clients for one team.

   The figures are a bento (lib/proof.ts) — every tile prints where its number
   came from, and the two the studio still needs from clients render as
   visibly pending rather than guessed.

   The client list is DERIVED from the case studies, so a name can only appear
   here if there is a real engagement behind it — and each name now opens it. */
export default function ServiceProof({ team }: { team: Team }) {
  const clients = CASES.filter((c) => c.teams.includes(team.key) && c.client !== 'Scalina');
  const tiles = team.key === 'media' ? MEDIA_PROOF : SYSTEMS_PROOF;

  /* This is the one section that inverts against its team: Media's numbers sit
     on dark and Systems' on light, so each services page changes ground in the
     middle rather than running one colour end to end. */
  return (
    <section
      className={styles.section}
      data-ground={team.ground === 'dark' ? 'light' : 'dark'}
      aria-label={`${team.name} results`}
    >
      <div className={styles.shell}>
        <div className={styles.block}>
          <div className={styles.head}>
            <WordRise inView as="h2" className={styles.heading} lines="The work, in numbers." />
            <Reveal kind="fade" as="p" delay={80} className={styles.note}>
              Counted, not estimated. Each figure names the folder, repository or account it came from.
            </Reveal>
          </div>
          <Bento tiles={tiles} label={`${team.name} figures`} />
        </div>

        <div className={styles.block}>
          <WordRise inView as="h2" className={styles.heading} lines="Who we do it for." />
          <ul className={styles.clients}>
            {clients.map((c) => (
              <li key={c.slug}>
                <Link href={`/work/${c.slug}`} className={styles.client}>
                  <span>{c.client}</span>
                  <span className={styles.clientArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className={styles.clientNote}>
            Quotes are being collected and will appear here once signed off. We don&rsquo;t write them on
            a client&rsquo;s behalf.
          </p>
        </div>
      </div>
    </section>
  );
}
