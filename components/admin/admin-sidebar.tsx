'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboardIcon,
  UtensilsCrossedIcon,
  ShoppingBagIcon,
  PackageIcon,
  LogOutIcon,
} from 'lucide-react';

import {
  useSidebar,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

import { APP_CONSTANTS } from '@/constants/app';

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

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { open } = useSidebar();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <UtensilsCrossedIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {APP_CONSTANTS.APP_NAME}
                  </span>
                  <span className="truncate text-xs">
                    {t('Admin.subtitle')}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('Admin.nav.main')}</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{t(item.label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              {open && t('Admin.nav.logout')}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
