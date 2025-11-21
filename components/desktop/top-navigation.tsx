'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function TopNavigation() {
  const t = useTranslations();

  return (
    <header className="flex h-16 border-b bg-background items-center px-6 justify-between sticky top-0 z-40">
      {/* Left side - Page title or breadcrumbs */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">{t('Home.title')}</h2>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel>{t('Navigation.myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('Navigation.profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('Navigation.settings')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('Navigation.logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
