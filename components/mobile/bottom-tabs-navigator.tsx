'use client';

import { Home, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const tabs = [
  { icon: Home, href: '/', label: 'Navigation.home' },
  { icon: Search, href: '/search', label: 'Navigation.search' },
  { icon: ShoppingCart, href: '/orders', label: 'Navigation.orders' },
  { icon: User, href: '/profile', label: 'Navigation.profile' },
];

export function BottomTabsNavigator() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 h-16 border-t">
      <div className="flex h-full items-center justify-around px-2">
        {tabs.map(({ icon: Icon, href, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{t(label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
