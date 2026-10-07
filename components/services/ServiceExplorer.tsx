'use client';

import dynamic from 'next/dynamic';
import { useCallback, useRef, useState } from 'react';
import type { Team } from '@/lib/services';
import styles from './ServiceExplorer.module.css';

/* OptionWheel measures itself on mount, so it is client-only. */
const OptionWheel = dynamic(() => import('@/components/vendor/OptionWheel'), { ssr: false });

export default function ServiceExplorer({ team }: { team: Team }) {
  /* The parent keys this component by team, so a switch remounts it and the
     wheel starts from the first option without an effect to reset it. */
  const [selected, setSelected] = useState(0);
  const wheelWrap = useRef<HTMLDivElement | null>(null);

  /* The wheel is a vendored component kept verbatim and it exposes no way to
     move the selection from outside — only its own wheel, drag and arrow-key
     handling. Rather than fork it, the buttons synthesise the keypress it
     already understands: React listens for native keydown at the root, so a
     dispatched event reaches its onKeyDown exactly as a real one would.
     Without these the control was effectively invisible — it worked, but only
     if you happened to try the arrow keys. */
  const step = useCallback((delta: -1 | 1) => {
    const wheel = wheelWrap.current?.querySelector<HTMLElement>('.option-wheel');
    if (!wheel) return;
    wheel.focus({ preventScroll: true });
    wheel.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: delta === -1 ? 'ArrowUp' : 'ArrowDown',
        bubbles: true,
      })
    );
  }, []);

  const service = team.services[selected] ?? team.services[0];
  const isDark = team.ground === 'dark';

  return (
    <section className={styles.section} data-ground={team.ground} aria-labelledby="services-explorer">
      <div className={styles.shell}>
        <div className={styles.wheelWrap} ref={wheelWrap}>
          <OptionWheel
            items={team.services.map((s) => s.name)}
            defaultSelected={0}
            onChange={(index: number) => setSelected(index)}
            side="left"
            /* fontSize is in rem, not px. */
            fontSize={2}
            textColor={isDark ? 'rgba(244,242,237,0.38)' : 'rgba(11,13,18,0.34)'}
            activeColor={isDark ? '#F4F2ED' : '#0B0D12'}
            loop
            draggable
          />

          <div className={styles.stepper}>
            <button
              type="button"
              className={`${styles.step} ${styles.stepUp}`}
              onClick={() => step(-1)}
              aria-label="Previous service"
            >
              <span aria-hidden="true">↑</span>
            </button>
            <button
              type="button"
              className={`${styles.step} ${styles.stepDown}`}
              onClick={() => step(1)}
              aria-label="Next service"
            >
              <span aria-hidden="true">↓</span>
            </button>
          </div>

          <p className={styles.hint}>
            Scroll, drag, or use <kbd className={styles.key}>↑</kbd>
            <kbd className={styles.key}>↓</kbd>
          </p>
        </div>

        <div key={`${team.key}-${selected}`} className={styles.panel}>
          <span className={styles.srOnly} id="services-explorer">
            What {team.name} does
          </span>
          <span className={styles.index}>
            {String(selected + 1).padStart(2, '0')} / {String(team.services.length).padStart(2, '0')}
          </span>
          <h2 className={styles.headline}>{service.headline}</h2>
          <p className={styles.body}>{service.body}</p>
          <ul className={styles.deliverables}>
            {service.deliverables.map((d) => (
              <li key={d}>
                <a
                  href={`/start?utm_source=services&utm_content=${encodeURIComponent(d)}`}
                  className={styles.deliverable}
                >
                  <span>{d}</span>
                  <span aria-hidden="true" className={styles.deliverableArrow}>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href="/start" className={`inlineLink ${styles.cta}`}>
            <span>Talk to us about {service.name.toLowerCase()}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
