'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-8 px-3 text-xs font-medium shrink-0"
    >
      {copied ? 'Tersalin' : 'Salin ID'}
    </Button>
  );
}

