'use client';

import { Home, Search, ShoppingCart, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const navigationItems = [
  { icon: Home, href: '/', label: 'Navigation.home' },
  { icon: Search, href: '/search', label: 'Navigation.search' },
  { icon: ShoppingCart, href: '/orders', label: 'Navigation.orders' },
  { icon: User, href: '/profile', label: 'Navigation.profile' }
];

const bottomItems = [
  { icon: Settings, href: '/settings', label: 'Navigation.settings' }
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="flex flex-col w-64 border-r bg-background h-screen sticky top-0">
      {/* Logo/Brand */}
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="text-xl font-bold">Quick Bite</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map(({ icon: Icon, href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(label)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="px-3 pb-4 space-y-1">
        <Separator className="my-2" />
        {bottomItems.map(({ icon: Icon, href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(label)}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
