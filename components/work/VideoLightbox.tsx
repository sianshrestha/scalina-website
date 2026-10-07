'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { getLenis } from '@/lib/lenis';
import styles from './VideoLightbox.module.css';

const EASE = [0.16, 1, 0.3, 1] as const;

/* The full edit, with sound, over the page.

   The page only ever autoplays short muted loops; sound is always the
   visitor's choice. Escape, the close button or a click on the backdrop
   closes it; the page underneath holds still while it is open, and focus
   goes back to the phone that opened it. */
export default function VideoLightbox({
  src,
  poster,
  title,
  open,
  onClose,
}: {
  src: string;
  poster: string;
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
      lenis?.start();
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          data-lenis-prevent
        >
          <motion.div
            className={styles.frame}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.55, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <video className={styles.video} src={src} poster={poster} controls autoPlay playsInline />
          </motion.div>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
          <p className={styles.title}>{title}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
