'use client';

import Reveal from '@/components/Reveal';
import WordRise from '@/components/WordRise';
import Bento from '@/components/Bento';
import { ABOUT_PROOF } from '@/lib/proof';
import styles from './AboutProof.module.css';

/* Proof, not a claim — as a bento of figures.

   It used to be two lists: what we shipped, and who named us. Lists of names
   prove less than one number you can check, so this is now the numbers, each
   with the folder, repository or account it was counted from printed under
   it. The figures live in lib/proof.ts, derived from the case studies. */
export default function AboutProof() {
  return (
    <section className={styles.section} data-ground="light" aria-labelledby="about-proof">
      <div className={styles.shell}>
        <div className={styles.head}>
          <WordRise inView as="h2" id="about-proof" className={styles.heading} lines="Proof, not a claim" />
          <Reveal kind="fade" as="p" delay={80} className={styles.note}>
            Every number here can be traced to a folder, a repository or an account. Almost no agency
            at this level ships software, so a good share of it is software.
          </Reveal>
        </div>
        <Bento tiles={ABOUT_PROOF} label="Studio figures" />
      </div>
    </section>
  );
}
