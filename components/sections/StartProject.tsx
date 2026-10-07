import { CTA } from '@/lib/content';
import Magnetic from '@/components/Magnetic';
import styles from './StartProject.module.css';

/* One destination, one button. The wording changes with context across the
   site — start a project, get a quote, contact us — but every one of them
   lands on /start. */
export default function StartProject() {
  return (
    <section id="start" className={styles.section} data-ground="dark" aria-labelledby="start-a-project">
      <div className={styles.shell}>
        <h2 id="start-a-project" className={styles.heading}>
          <span className={styles.headingMuted}>Have a project in mind?</span>
          <span>Let&rsquo;s build it the right way.</span>
        </h2>

        <Magnetic>
          <a href="/start" className={styles.cta}>
            <span>{CTA.start}</span>
            <span aria-hidden="true" className={styles.ctaArrow}>
              →
            </span>
          </a>
        </Magnetic>
      </div>

    </section>
  );
}
