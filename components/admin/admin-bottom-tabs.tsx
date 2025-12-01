'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  UtensilsCrossedIcon,
  PackageIcon,
} from 'lucide-react';

const navigationItems = [
  {
    icon: LayoutDashboardIcon,
    href: '/admin/dashboard',
    label: 'Admin.nav.dashboard',
  },
  { icon: ShoppingBagIcon, href: '/admin/orders', label: 'Admin.nav.orders' },
  { icon: UtensilsCrossedIcon, href: '/admin/menu', label: 'Admin.nav.menu' },
  {
    icon: PackageIcon,
    href: '/admin/inventory',
    label: 'Admin.nav.inventory',
  },
];

export function AdminBottomTabs() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 border-t md:hidden">
      <div className="flex justify-around">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{t(item.label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
