'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { SideNav } from '@/components/desktop/sidebar';
import NavDropdownMenu from '@/components/desktop/navigation-dropdown-menu';

interface TopNavigationProps {
  children?: React.ReactNode;
}

export function TopNavigation({ children }: TopNavigationProps) {
  const t = useTranslations();

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
    <SidebarProvider>
      <SideNav />

      <SidebarInset>
        <header
          className={`nav bg-background/85 sticky top-0 z-50 flex h-12 items-center justify-between p-3 backdrop-blur-sm transition-transform duration-300 sm:h-14 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <SidebarTrigger className="-ml-1" />

          {/* <Label className="font-bold!">APP</Label> */}

          <NavDropdownMenu>
            <Avatar className="hover:border-primary h-8 w-8 cursor-pointer">
              <AvatarImage src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              <AvatarFallback>DJ</AvatarFallback>
            </Avatar>
          </NavDropdownMenu>
        </header>

        <div>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
