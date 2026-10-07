'use client';

import FlowingMenu from '@/components/vendor/FlowingMenu';
import styles from './ServiceMenu.module.css';

export type ServiceItem = { label: string; href: string };

/* Service rows, rendered with React Bits' FlowingMenu.

   Colours are handed over as ground tokens rather than literals, so the
   marquee inverts along with the page: it reveals in the current text colour
   with the current background colour as its type. */
export default function ServiceMenu({ items }: { items: ServiceItem[] }) {
  return (
    <div className={styles.inner}>
      <div className={styles.wrap} style={{ '--rows': items.length } as React.CSSProperties}>
        <FlowingMenu
          items={items.map((item) => ({ link: item.href, text: item.label, image: '' }))}
          speed={18}
          textColor="var(--muted)"
          bgColor="transparent"
          marqueeBgColor="var(--text)"
          marqueeTextColor="var(--bg)"
          borderColor="var(--line)"
        />
      </div>
    </div>
  );
}
