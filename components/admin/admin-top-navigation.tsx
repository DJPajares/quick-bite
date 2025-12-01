'use client';

import { useEffect, useRef, useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function AdminTopNavigation() {
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= 0) {
        setIsVisible(true); // Show navbar at the top of the page
      } else if (currentScroll > lastScrollRef.current) {
        setIsVisible(false); // Hide navbar on scroll down
      } else {
        setIsVisible(true); // Show navbar on scroll up
      }

      lastScrollRef.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`nav bg-background/85 sticky top-0 z-50 flex h-12 items-center justify-between p-3 backdrop-blur-sm transition-transform duration-300 sm:h-14 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <SidebarTrigger className="-ml-1" />
    </header>
  );
}
