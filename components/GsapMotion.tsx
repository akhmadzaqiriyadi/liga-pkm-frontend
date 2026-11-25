'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GsapPageScopeProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Creative GSAP Animation Suite:
 * - On-load entrance animations (header, hero badges, title, description, CTAs)
 * - Number count-up animation on hero stats
 * - ScrollTrigger staggered section reveals (Alur, Ketentuan, 10 Bidang PKM)
 * - Micro-interactions (hover lift with elastic spring)
 * - Parallax scroll on hero background
 */
export function GsapPageScope({ children, className = '' }: GsapPageScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scopeRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Header Dropdown Entrance
      const header = root.querySelectorAll('[data-gsap="header"]');
      if (header.length > 0) {
        gsap.from(header, {
          y: -24,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }

      // 2. Hero Elements Staggered Sequence
      const heroBadge = root.querySelectorAll('[data-gsap="hero-badge"]');
      if (heroBadge.length > 0) {
        gsap.from(heroBadge, {
          y: 16,
          scale: 0.92,
          opacity: 0,
          duration: 0.6,
          delay: 0.1,
          ease: 'back.out(1.4)',
          clearProps: 'transform,opacity',
        });
      }

      const heroTitle = root.querySelectorAll('[data-gsap="hero-title"]');
      if (heroTitle.length > 0) {
        gsap.from(heroTitle, {
          y: 35,
          opacity: 0,
          duration: 0.85,
          delay: 0.2,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }

      const heroDesc = root.querySelectorAll('[data-gsap="hero-desc"]');
      if (heroDesc.length > 0) {
        gsap.from(heroDesc, {
          y: 25,
          opacity: 0,
          duration: 0.75,
          delay: 0.35,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        });
      }

      const heroCta = root.querySelectorAll('[data-gsap="hero-cta"]');
      if (heroCta.length > 0) {
        gsap.from(heroCta, {
          y: 20,
          scale: 0.9,
          opacity: 0,
          duration: 0.65,
          delay: 0.45,
          stagger: 0.1,
          ease: 'back.out(1.5)',
          clearProps: 'transform,opacity',
        });
      }

      const heroStats = root.querySelectorAll('[data-gsap="hero-stats"]');
      if (heroStats.length > 0) {
        gsap.from(heroStats, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          delay: 0.6,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      }

      // 3. Dynamic Number Count-Up (Stats on Hero)
      const counters = root.querySelectorAll<HTMLElement>('[data-gsap="count"]');
      counters.forEach((el) => {
        const target = Number(el.dataset.target || '0');
        if (!Number.isFinite(target) || target <= 0) return;
        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: target,
          duration: 1.4,
          delay: 0.7,
          ease: 'power3.out',
          onUpdate: () => {
            el.textContent = String(Math.round(counterObj.val));
          },
        });
      });

      // 4. Parallax Background on Hero
      const parallaxBg = root.querySelectorAll('[data-gsap="hero-parallax"]');
      if (parallaxBg.length > 0) {
        gsap.to(parallaxBg, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: root.querySelector('section'),
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 5. Section Headings (ScrollTrigger reveal)
      const sectionHeadings = root.querySelectorAll('[data-gsap="section-heading"]');
      sectionHeadings.forEach((heading) => {
        gsap.from(heading, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // 6. Alur Pendaftaran (3 Staggered Timeline Cards)
      const alurGroup = root.querySelector('[data-gsap="alur-group"]');
      if (alurGroup) {
        const alurCards = alurGroup.querySelectorAll('[data-gsap="alur-card"]');
        gsap.from(alurCards, {
          y: 40,
          scale: 0.95,
          opacity: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: alurGroup,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // 7. Ketentuan Tim (Split Column Reveal)
      const ketentuanSection = root.querySelector('#ketentuan');
      if (ketentuanSection) {
        const leftCol = ketentuanSection.querySelector('[data-gsap="ketentuan-left"]');
        if (leftCol) {
          gsap.from(leftCol, {
            x: -30,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: ketentuanSection,
              start: 'top 82%',
              once: true,
            },
          });
        }

        const items = ketentuanSection.querySelectorAll('[data-gsap="ketentuan-item"]');
        if (items.length > 0) {
          gsap.from(items, {
            x: 35,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: ketentuanSection,
              start: 'top 82%',
              once: true,
            },
          });
        }
      }

      // 8. 10 Bidang PKM Grid (Dynamic Stagger Pop)
      const bidangGrid = root.querySelector('[data-gsap="bidang-grid"]');
      if (bidangGrid) {
        const bidangCards = bidangGrid.querySelectorAll('[data-gsap="bidang-card"]');
        gsap.from(bidangCards, {
          y: 30,
          scale: 0.94,
          opacity: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.2)',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: bidangGrid,
            start: 'top 85%',
            once: true,
          },
        });
      }

      // 9. Bottom CTA Box
      const ctaBox = root.querySelector('[data-gsap="cta-box"]');
      if (ctaBox) {
        gsap.from(ctaBox, {
          y: 35,
          scale: 0.95,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: ctaBox,
            start: 'top 88%',
            once: true,
          },
        });
      }

      // 10. Footer Fade In
      const footer = root.querySelector('[data-gsap="footer"]');
      if (footer) {
        gsap.from(footer, {
          opacity: 0,
          y: 15,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: footer,
            start: 'top 95%',
            once: true,
          },
        });
      }

      // 11. Interactive Hover Micro-Springs for all interactive cards
      const interactiveCards = root.querySelectorAll<HTMLElement>('.gsap-hover-card');
      interactiveCards.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -4,
            scale: 1.015,
            duration: 0.28,
            ease: 'power2.out',
            boxShadow: '0 10px 25px -5px rgba(10, 77, 162, 0.12)',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: 'power2.out',
            boxShadow: 'none',
          });
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
 * Animates a newly mounted dynamic element (e.g. form fields or extra member rows).
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
        y: 16,
        scale: 0.98,
        opacity: 0,
        duration: 0.45,
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
