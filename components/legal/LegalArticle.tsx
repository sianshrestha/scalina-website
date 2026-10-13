import type { LegalSection } from './LegalView';
import styles from './LegalView.module.css';

/* Server-rendered body of a legal page; see LegalView for why it is separate. */
export default function LegalArticle({ sections }: { sections: LegalSection[] }) {
  return (
    <article className={styles.prose}>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          {section.body}
        </section>
      ))}
    </article>
  );
}

export const contentsOf = (sections: LegalSection[]) =>
  sections.map(({ id, title }) => ({ id, title }));
