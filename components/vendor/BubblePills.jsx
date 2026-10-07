'use client';

/* eslint-disable */
// @ts-nocheck
/* Vendored from the Claude Design handoff (React Bits derived).
 * React Bits BubbleMenu overlay, used for the mobile nav.
 * Only the module boundary was changed: globals (React / window.THREE) became
 * real imports and the component is a default export. The implementation is
 * otherwise the handoff version verbatim - keep it that way so it can be
 * diffed against upstream React Bits.
 */

/* BubblePills — React Bits BubbleMenu overlay, controlled by an `open` prop.
   Inline styles only; the staggered scale-in runs on CSS transitions. */
import React, { useState, useRef, useEffect } from 'react';

const DEFAULT_ITEMS = [
  { label: 'Work', href: '/work', rotation: -8 },
  { label: 'Services', href: '/services', rotation: 8 },
  { label: 'The Scalina System', href: '/the-scalina-system', rotation: -8 },
  { label: 'About', href: '/about', rotation: 8 },
  { label: 'Start a project', href: '/start', rotation: -8 }
];

function BubblePills({
  open = false,
  items,
  bg = '#F4F2ED',
  textColor = '#0C0C0F',
  borderColor = 'rgba(12,12,15,0.10)',
  backdrop = 'rgba(8,8,10,0.72)',
  onClose,
  animationDuration = 0.5,
  staggerDelay = 0.12
}) {
  const menuItems = items && items.length ? items : DEFAULT_ITEMS;
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [hovered, setHovered] = useState(-1);
  const overlayRef = useRef(null);

  useEffect(() => {
    let raf1 = 0, raf2 = 0, t = 0;
    if (open) {
      setMounted(true);
      setShown(false);
      raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setShown(true)); });
    } else {
      setShown(false);
      t = setTimeout(() => setMounted(false), 320);
    }
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      if (t) clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 900;

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: backdrop,
    opacity: open ? 1 : 0,
    transition: 'opacity 260ms cubic-bezier(0.4,0,0.2,1)',
    pointerEvents: open ? 'auto' : 'none'
  };

  const listStyle = {
    listStyle: 'none', margin: 0, padding: '0 clamp(16px, 3vw, 40px)',
    display: 'flex', flexWrap: 'wrap', rowGap: isDesktop ? 6 : 16,
    width: '100%', maxWidth: 1600, position: 'relative'
  };

  return React.createElement(
    'div',
    { ref: overlayRef, role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Menu', style: overlayStyle },
    React.createElement('div', {
      'aria-hidden': 'true',
      style: {
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(50% 50% at 75% 30%, rgba(6,42,94,0.45) 0%, rgba(6,42,94,0) 70%)'
      }
    }),
    React.createElement(
      'ul',
      { role: 'menu', 'aria-label': 'Menu links', style: listStyle },
      menuItems.map((item, idx) => {
        const rot = isDesktop ? (item.rotation ?? 0) : 0;
        const isHover = hovered === idx;
        const hoverBg = (item.hoverStyles && item.hoverStyles.bgColor) || '#F6C700';
        const hoverColor = (item.hoverStyles && item.hoverStyles.textColor) || '#0C0C0F';
        return React.createElement(
          'li',
          { key: idx, role: 'none', style: { display: 'flex', justifyContent: 'center', flex: isDesktop ? '0 0 33.3333%' : '0 0 100%', boxSizing: 'border-box', padding: isDesktop ? '0 4px' : 0 } },
          React.createElement(
            'a',
            {
              role: 'menuitem',
              href: item.href,
              'aria-label': item.ariaLabel || item.label,
              onClick: onClose,
              onMouseEnter: () => setHovered(idx),
              onMouseLeave: () => setHovered(-1),
              style: {
                width: '100%',
                minHeight: isDesktop ? 150 : 84,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxSizing: 'border-box',
                borderRadius: 999,
                background: isHover ? hoverBg : bg,
                color: isHover ? hoverColor : textColor,
                border: '1px solid ' + borderColor,
                fontFamily: 'Fraunces, Georgia, serif',
                fontWeight: 350,
                letterSpacing: '-0.02em',
                fontSize: 'clamp(1.15rem, 2.4vw, 2.5rem)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                transform: 'rotate(' + rot + 'deg) scale(' + (shown ? (isHover ? 1.05 : 1) : 0) + ')',
                transition: 'transform ' + (shown ? animationDuration : 0.22) + 's ' + (shown ? 'cubic-bezier(0.34,1.4,0.5,1)' : 'cubic-bezier(0.4,0,1,1)') + ', background 300ms ease, color 300ms ease, border-color 300ms ease',
                transitionDelay: (shown ? idx * staggerDelay : 0) + 's, 0s, 0s, 0s',
                willChange: 'transform'
              }
            },
            React.createElement('span', {
              style: {
                display: 'inline-block', lineHeight: 1.2, willChange: 'transform, opacity',
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(24px)',
                transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1), opacity 320ms ease',
                transitionDelay: (shown ? idx * staggerDelay + 0.12 : 0) + 's'
              }
            }, item.label)
          )
        );
      })
    )
  );
}

export default BubblePills;
