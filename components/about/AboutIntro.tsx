import Reveal from '@/components/Reveal';
import WordRise from '@/components/WordRise';
import styles from './AboutIntro.module.css';

export default function AboutIntro() {
  return (
    <section className={styles.section} data-ground="light" aria-labelledby="about-heading">
      <div className={styles.shell}>
        <Reveal kind="fade" as="p" className={styles.eyebrow}>
          About
        </Reveal>
        <WordRise as="h1" id="about-heading" delay={0.1} stagger={0.08} className={styles.heading} lines={['Most agencies', 'pick a side.']} />

        <div className={styles.body}>
          <Reveal kind="fade" as="p" delay={260} className="statement">
            Some make the content that gets a business noticed. Others build the software that lets
            it operate. Scalina does both. One team for the work that brings people in, and one for
            the work that keeps them.
          </Reveal>
          <p className={styles.support}>
            We&rsquo;re an Australian creative, growth and technology agency. Sydney-born, working
            nationally. The businesses winning right now are the ones that show up everywhere and
            run on systems that don&rsquo;t break under the weight of it. So we build both halves,
            and we don&rsquo;t hand the middle to anyone else.
          </p>
        </div>
      </div>
    </section>
  );
}
