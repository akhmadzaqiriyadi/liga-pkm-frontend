import Image from 'next/image';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

/**
 * Circular emblem for PKM Center UTY, clipping the outer dark corners of the source JPG.
 */
export function BrandLogo({ size = 40, className = '' }: BrandLogoProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full overflow-hidden border border-border bg-white shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/logo-pkm-uty.jpg"
        alt="Logo PKM Center UTY"
        width={size}
        height={size}
        className="w-full h-full object-cover scale-105"
        priority
      />
    </span>
  );
}

