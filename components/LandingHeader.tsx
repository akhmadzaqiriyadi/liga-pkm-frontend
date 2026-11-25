'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';

const NAV_ITEMS = [
  { id: 'alur', label: 'Alur' },
  { id: 'ketentuan', label: 'Ketentuan' },
  { id: 'bidang', label: 'Bidang PKM' },
];

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      data-gsap="header"
      className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <BrandLogo size={36} />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              Liga PKM UTY
            </span>
            <span className="font-mono text-xs font-medium text-primary bg-accent px-2 py-0.5 rounded border border-primary/15 shrink-0">
              2026
            </span>
          </div>
        </Link>

        {/* Desktop & Tablet Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <Link href="/daftar">
            <Button className="h-9 px-4 bg-primary text-primary-foreground hover:bg-[#083d82] font-medium">
              Daftar Tim
            </Button>
          </Link>
        </nav>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="h-9 px-3 rounded-md border border-border bg-card text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? 'Tutup' : 'Menu'}
          </button>
          <Link href="/daftar">
            <Button size="sm" className="h-9 px-3.5 bg-primary text-primary-foreground hover:bg-[#083d82] font-medium">
              Daftar
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

