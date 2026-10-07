'use client';

import { useId, useState } from 'react';
import Reveal from '@/components/Reveal';
import styles from './StartFaq.module.css';

/* Answers to the things that stop people sending the form. Every one of these
   is answerable from what Scalina actually does — none of them quotes a
   turnaround, a price or a result we cannot stand behind. */
const FAQS = [
  {
    q: 'Do I need a brief first?',
    a: 'No. The questions above are the brief, which is why they are multiple choice. If you already have a written scope, say so at the end and send it over; we will read that instead.',
  },
  {
    q: 'Can we just talk before committing to anything?',
    a: 'Yes, and it costs nothing. Most projects are scoped properly in a conversation and badly on a form, so we would rather have the conversation. If it turns out we are not the right people, we will tell you that on the call.',
  },
  {
    q: 'Do you only take on both halves, content and software?',
    a: 'No. Plenty of work is one team only: a website with no campaign behind it, or content for a business whose systems are already fine. What we will not do is run growth into operations that cannot carry it, because we have watched that go wrong and it is not a campaign problem.',
  },
  {
    q: 'Why do you ask about budget?',
    a: 'So the first thing we send you is a proposal you can actually act on rather than a range with three options in it. A band is enough, and it decides what we propose, not whether we reply.',
  },
  {
    q: 'What happens to what I send?',
    a: 'It goes to us and nowhere else. We use the answers to work out who should pick it up and what to prepare before the call, and in aggregate to understand what the market is asking for. We do not sell it and we do not add you to a mailing list.',
  },
  {
    q: 'What if I am not a business?',
    a: 'Pick "Work with us" or "Something else" at the top and the flow gets out of your way and skips straight to your details.',
  },
];

export default function StartFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section className={styles.section} data-ground="lime" aria-labelledby="start-faq">
      <div className={`split3070 ${styles.shell}`}>
        <Reveal kind="fade" as="h2" id="start-faq" className={styles.heading}>
          Before you
          <br />
          send it
        </Reveal>

        <div className={styles.list}>
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            const panelId = `${base}-panel-${index}`;
            const buttonId = `${base}-button-${index}`;
            return (
              <div key={item.q} className={styles.item}>
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
                  {...(isOpen ? {} : { inert: true })}
                >
                  <p className={styles.answer}>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
