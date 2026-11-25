'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const BANNERS = [
  {
    src: '/images/banner1.webp',
    alt: 'Latar belakang Banner Liga PKM UTY 2026 - 1',
  },
  {
    src: '/images/banner2.webp',
    alt: 'Latar belakang Banner Liga PKM UTY 2026 - 2',
  },
  {
    src: '/images/banner3.webp',
    alt: 'Latar belakang Banner Liga PKM UTY 2026 - 3',
  },
];

const AUTOPLAY_INTERVAL_MS = 5000;

export function HeroBannerBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      data-gsap="hero-parallax"
      className="absolute inset-0 z-0 overflow-hidden bg-[#051d40]"
      aria-hidden="true"
    >
      {BANNERS.map((banner, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={banner.src}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              isActive ? 'opacity-50 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        );
      })}

      {/* 50% dark blue overlay so hero text stays crisp and never clashes with banner content */}
      <div className="absolute inset-0 bg-[#051d40]/50" />
    </div>
  );
}
