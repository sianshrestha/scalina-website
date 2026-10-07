import Reveal from '@/components/Reveal';
import WordRise from '@/components/WordRise';
import styles from './StartIntro.module.css';

/* The top of /start. Deliberately short: the page's job is the flow below it,
   and every line here is a line between the visitor and getting started. */
export default function StartIntro() {
  return (
    <section className={styles.section} data-ground="light" aria-labelledby="start-heading">
      <div className={styles.shell}>
        <Reveal kind="fade" as="p" className={styles.eyebrow}>
          Start a project
        </Reveal>
        <WordRise as="h1" id="start-heading" delay={0.08} className={styles.heading} lines="Tell us what you’re trying to do." />
        <Reveal kind="fade" as="p" delay={320} className={styles.lede}>
          A handful of taps and two fields. No brief required, and nothing you have to write out.
          You&rsquo;ll get a reply from someone who has actually read it, within one business day.
        </Reveal>

        <Reveal kind="fade" delay={420}>
          <ul className={styles.meta}>
            <li>About a minute</li>
            <li>Nothing you send is shared</li>
            <li>
              Prefer email?{' '}
              <a href="mailto:info@scalinamedia.com" className="inlineLink">
                info@scalinamedia.com
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
