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
        </Reveal>

        <div>
          <Reveal kind="fade" as="blockquote" delay={150} className={styles.quote}>
            <p>
              &ldquo;We built Scalina Systems after seeing businesses quoted six figures for software
              that should be far simpler to build. We believe technology should fit the business, not
              the other way around.
            </p>
            <p>
              That same thinking shapes how we approach growth. Marketing creates demand, but the
              systems behind a business must be ready to support it. That&rsquo;s why we bring
              creative, growth and technology together to build businesses that are ready to
              scale.&rdquo;
            </p>
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
