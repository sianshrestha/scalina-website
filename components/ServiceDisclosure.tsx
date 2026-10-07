'use client';

import { useEffect, useId, useRef, useState } from 'react';
import ServiceMenu, { type ServiceItem } from '@/components/ServiceMenu';
import styles from './ServiceDisclosure.module.css';

/* A pillar heading and its service rows, collapsed behind a disclosure.

   The trigger sits on the heading's own line, hard against the right edge of
   the content column — it used to sit on a line of its own underneath, which
   read as an orphaned control and pushed the rows further from the name they
   belong to. The whole head is here rather than in WhatWeDo so the button and
   the name share one row without WhatWeDo having to reach into this
   component's open state. */
export default function ServiceDisclosure({
  number,
  pillar,
  items,
  spaced = false,
}: {
  number: string;
  pillar: string;
  items: ServiceItem[];
  /* Every pillar but the first carries the gap above it. */
  spaced?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelId = useId();

  /* Animate to the measured height, then release to `auto` so the rows can
     still respond to a resize while open. */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!open) {
      panel.style.height = `${panel.scrollHeight}px`;
      requestAnimationFrame(() => {
        panel.style.height = '0px';
      });
      return;
    }

    panel.style.height = `${panel.scrollHeight}px`;
    const onEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'height') panel.style.height = 'auto';
    };
    panel.addEventListener('transitionend', onEnd);
    return () => panel.removeEventListener('transitionend', onEnd);
  }, [open]);

  return (
    <>
      <div className={`split3070 ${styles.head} ${spaced ? styles.headSpaced : ''}`}>
        <span className={styles.number}>
          {number}
        </span>

        <div className={styles.nameRow}>
          <span className={styles.name}>
            {pillar}
          </span>

          <button
            type="button"
            className={styles.trigger}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`${styles.icon} ${open ? styles.iconOpen : ''}`} aria-hidden="true" />
            <span>
              {open ? 'Hide' : 'View'} {items.length} {pillar.toLowerCase()} services
            </span>
          </button>
        </div>
      </div>

      <div
        id={panelId}
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        // Collapsed content stays out of the tab order and the a11y tree.
        {...(open ? {} : { inert: true })}
      >
        <ServiceMenu items={items} />
      </div>
    </>
  );
}
