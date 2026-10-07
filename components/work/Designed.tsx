'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import styles from './Designed.module.css';

/* Drawn media for work that a screenshot cannot show — a DM conversation, a
   phone call, a weekly cadence. Each is captioned as illustrative wherever it
   is used; none of them carries a number that is not in lib/work.ts. */

const EASE = [0.16, 1, 0.3, 1] as const;

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.45, delayChildren: 0.2 } } };
const bubble: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/* ---- Gurung: ad → DM → automated reply → booking ------------------------ */
const STEPS = [
  { k: 'Ad', v: 'Runs on Meta' },
  { k: 'DM', v: 'Customer taps “Send message”' },
  { k: 'Auto-reply', v: 'Asks pickup, drop-off, date, passengers' },
  { k: 'Booked', v: 'Owner confirms in the morning' },
];

const CHAT: { from: 'them' | 'bot'; text: string }[] = [
  { from: 'them', text: 'Hi, do you do airport pickups this Saturday?' },
  { from: 'bot', text: 'Hi! Yes we do 🚐 Where are we picking you up from, and what time does your flight land?' },
  { from: 'them', text: 'Parramatta, landing 6:40am. 3 people + bags' },
  { from: 'bot', text: 'Got it: Parramatta, Sat 6:40am, 3 passengers. We’ll confirm your booking first thing ✅' },
];

export function DmFlow() {
  const reduced = useReducedMotion();
  return (
    <div className={styles.dm}>
      <motion.ol
        className={styles.steps}
        variants={list}
        initial={reduced ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        {STEPS.map((s, i) => (
          <motion.li key={s.k} className={styles.step} variants={bubble}>
            <span className={styles.stepIndex}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.stepKey}>{s.k}</span>
            <span className={styles.stepVal}>{s.v}</span>
          </motion.li>
        ))}
      </motion.ol>

      <div className={styles.chatPhone} aria-label="Illustrative DM conversation">
        <div className={styles.chatHead}>
          <span className={styles.avatar} aria-hidden="true">GS</span>
          <span>
            <strong>Gurung Shuttles</strong>
            <em>Replies instantly</em>
          </span>
          <span className={styles.clock}>1:47 am</span>
        </div>
        <motion.ul
          className={styles.chat}
          variants={list}
          initial={reduced ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          {CHAT.map((m, i) => (
            <motion.li key={i} className={m.from === 'bot' ? styles.bot : styles.them} variants={bubble}>
              {m.text}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}

/* ---- OZI HP: the voice agent ------------------------------------------- */
const LINES = [
  { who: 'Agent', text: 'Thanks for calling OZI Hygiene & Packaging. How can I help?' },
  { who: 'Caller', text: 'Hi, I want to check when our order is being delivered.' },
  { who: 'Agent', text: 'Sure. Can I get the business name on the account?' },
];

export function VoiceCall() {
  const reduced = useReducedMotion();
  return (
    <div className={styles.call}>
      <div className={styles.callHead}>
        <span className={styles.live} aria-hidden="true" />
        <span className={styles.callTitle}>Incoming call · Voice agent</span>
        <span className={styles.callTime}>00:18</span>
      </div>
      <div className={styles.wave} aria-hidden="true">
        {Array.from({ length: 36 }, (_, i) => (
          <i key={i} style={{ animationDelay: `${(i % 9) * -0.13}s`, height: `${30 + ((i * 37) % 60)}%` }} />
        ))}
      </div>
      <motion.ul
        className={styles.transcript}
        variants={list}
        initial={reduced ? 'show' : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        {LINES.map((l, i) => (
          <motion.li key={i} variants={bubble} data-who={l.who}>
            <span>{l.who}</span>
            {l.text}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

/* ---- Weekly cadence: one column per week, one dot per video ------------- */
export function Cadence({ weeks = 13, total = 38 }: { weeks?: number; total?: number }) {
  const reduced = useReducedMotion();
  const base = Math.floor(total / weeks);
  const extra = total - base * weeks;
  const cols = Array.from({ length: weeks }, (_, i) => base + (i >= weeks - extra ? 1 : 0));
  return (
    <div className={styles.cadence}>
      <div className={styles.cadenceGrid} style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))` }}>
        {cols.map((n, w) => (
          <div key={w} className={styles.week}>
            <div className={styles.dots}>
              {Array.from({ length: n }, (_, d) => (
                <motion.span
                  key={d}
                  className={styles.dot}
                  initial={reduced ? false : { scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: w * 0.06 + d * 0.05, duration: 0.4, ease: EASE }}
                />
              ))}
            </div>
            <span className={styles.weekLabel}>{String(w + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>
      <p className={styles.cadenceNote}>
        <strong>{total} videos</strong> across <strong>{weeks} weeks</strong>
      </p>
    </div>
  );
}

/* ---- A UGC cover for clients without footage on the site yet ------------ */
export function UgcCover({ label }: { label: string }) {
  return (
    <div className={styles.ugc} aria-hidden="true">
      <span className={styles.rec}>
        <i /> REC
      </span>
      <span className={styles.ugcLabel}>{label}</span>
      <span className={styles.ugcTag}>UGC</span>
      <span className={styles.bar}>
        <i />
      </span>
    </div>
  );
}
