'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GsapPageScopeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Attaches GSAP entrance, ScrollTrigger reveals, staggered groups, and number count-ups
 * to any descendant elements annotated with `data-gsap` attributes.
 */
export function GsapPageScope({ children, className = '' }: GsapPageScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scopeRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const heroItems = root.querySelectorAll('[data-gsap="hero-item"]');
      if (heroItems.length > 0) {
        gsap.from(heroItems, {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }

      const heroCard = root.querySelectorAll('[data-gsap="hero-card"]');
      if (heroCard.length > 0) {
        gsap.from(heroCard, {
          x: 24,
          opacity: 0,
          duration: 0.7,
          delay: 0.16,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }

      const cardPops = root.querySelectorAll('[data-gsap="card-pop"]');
      if (cardPops.length > 0) {
        gsap.from(cardPops, {
          y: 18,
          scale: 0.985,
          opacity: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        });
      }

      const counters = root.querySelectorAll<HTMLElement>('[data-gsap="count"]');
      counters.forEach((el) => {
        const target = Number(el.dataset.target || '0');
        if (!Number.isFinite(target) || target <= 0) return;
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: target,
          duration: 1.1,
          delay: 0.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(counterObj.val));
          },
        });
      });

      const reveals = root.querySelectorAll('[data-gsap="reveal"]');
      reveals.forEach((el) => {
        gsap.from(el, {
          y: 22,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      const staggerGroups = root.querySelectorAll('[data-gsap="stagger-group"]');
      staggerGroups.forEach((group) => {
        const items = group.querySelectorAll('[data-gsap="stagger-item"]');
        if (items.length === 0) return;
        gsap.from(items, {
          y: 18,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: group,
            start: 'top 86%',
            once: true,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={scopeRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Animates a newly mounted dynamic element (e.g., optional member slot or async row).
 */
export function GsapMountPop({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 14,
        scale: 0.985,
        opacity: 0,
        duration: 0.4,
        delay,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

