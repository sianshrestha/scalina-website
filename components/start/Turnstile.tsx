'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import styles from './EnquiryFlow.module.css';

/* Cloudflare Turnstile, the bot check on the enquiry form.

   `appearance: 'interaction-only'` keeps it invisible for almost everyone: it
   runs in the background and only shows a checkbox when Cloudflare is unsure.
   A token is single-use, so the form calls `reset()` after any failed send.

   The site key is public and inlined at build time (NEXT_PUBLIC_*). Without
   one, nothing renders and the form sends no token; the server only demands a
   token when TURNSTILE_SECRET_KEY is set, so local dev works either way. */

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

/* One script for the page, however many times the step remounts. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile missing'));
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Turnstile failed to load'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type TurnstileHandle = { reset: () => void };

const Turnstile = forwardRef<TurnstileHandle, { onToken: (token: string | null) => void }>(
  function Turnstile({ onToken }, ref) {
    const container = useRef<HTMLDivElement | null>(null);
    const widgetId = useRef<string | null>(null);
    /* Held in a ref so a new callback identity never re-renders the widget. */
    const onTokenRef = useRef(onToken);
    useEffect(() => {
      onTokenRef.current = onToken;
    }, [onToken]);

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenRef.current(null);
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      },
    }));

    useEffect(() => {
      if (!TURNSTILE_SITE_KEY) return;
      let cancelled = false;
      loadTurnstile()
        .then((api) => {
          if (cancelled || !container.current) return;
          widgetId.current = api.render(container.current, {
            sitekey: TURNSTILE_SITE_KEY,
            action: 'enquiry',
            appearance: 'interaction-only',
            theme: 'light',
            size: 'flexible',
            callback: (token: string) => onTokenRef.current(token),
            'expired-callback': () => onTokenRef.current(null),
            'error-callback': () => onTokenRef.current(null),
          });
        })
        .catch(() => onTokenRef.current(null));
      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      };
    }, []);

    if (!TURNSTILE_SITE_KEY) return null;
    return <div ref={container} className={styles.turnstile} />;
  }
);

export default Turnstile;
