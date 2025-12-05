'use client';

import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import type { ToasterProps } from 'sonner';

type Position = ToasterProps['position'];

export function ToasterWrapper() {
  const [position, setPosition] = useState<Position>('bottom-right');

  useEffect(() => {
    const handleResize = () => {
      setPosition(window.innerWidth < 768 ? 'top-center' : 'bottom-right');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <Toaster position={position} />;
}
