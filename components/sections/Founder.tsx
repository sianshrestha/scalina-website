import Image from 'next/image';
import Reveal from '@/components/Reveal';
import styles from './Founder.module.css';

/* `showLink` is off on the About page, where the link would point at the page
   you are already reading. */
export default function Founder({ showLink = true }: { showLink?: boolean }) {
  return (
    <section className={styles.section} data-ground="light" aria-label="Founder">
      <div className={styles.shell}>
        <Reveal kind="card" className={styles.portrait}>
          <Image
            src="/founder-portrait.jpg"
            alt="Suhan Shanker, founder of Scalina"
            fill
            sizes="(max-width: 899px) 100vw, 40vw"
            priority={false}
          />
          <span className={styles.portraitWash} />
        </Reveal>

        <div>
          <Reveal kind="fade" as="blockquote" delay={150} className={styles.quote}>
            &ldquo;We started building software because clients kept asking for it, and kept getting
            quoted six figures for something that should have taken six weeks. Now we won&rsquo;t run
            growth for a business whose operations can&rsquo;t handle it, because we&rsquo;ve watched
            that go wrong, and it&rsquo;s not a campaign problem.&rdquo;
          </Reveal>
          <p className={styles.attribution}>Suhan Shanker, Founder</p>
          {showLink ? (
            <a href="/about" className={`inlineLink ${styles.link}`}>
              <span>Read the full story</span>
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
