'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Home,
  Search,
  ShoppingCart,
  User,
  Settings,
  UtensilsCrossedIcon,
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
  SidebarRail,
} from '@/components/ui/sidebar';

import { APP_CONSTANTS } from '@/constants/app';

const navigationItems = [
  { icon: Home, href: '/', label: 'Navigation.home' },
  { icon: Search, href: '/search', label: 'Navigation.search' },
  { icon: ShoppingCart, href: '/orders', label: 'Navigation.orders' },
  { icon: User, href: '/profile', label: 'Navigation.profile' },
];

const bottomItems = [
  { icon: Settings, href: '/settings', label: 'Navigation.settings' },
];

export function SideNav() {
  const { setOpenMobile } = useSidebar();
  const t = useTranslations();

  const pathname = usePathname();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" onClick={handleLinkClick} passHref>
              <SidebarMenuButton size="lg" className="flex flex-row gap-3">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <UtensilsCrossedIcon className="size-4" />
                </div>

                <div className="grid flex-1 text-left leading-tight">
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    {APP_CONSTANTS.APP_NAME}
                  </h3>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pages</SidebarGroupLabel>
          <SidebarMenu>
            {navigationItems.map(({ icon: Icon, href, label }) => {
              const isActive = pathname === href;

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={handleLinkClick}
                  >
                    <Link href={href}>
                      <Icon className="h-5 w-5" />
                      <span>{t(label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            {bottomItems.map(({ icon: Icon, href, label }) => {
              const isActive = pathname === href;

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={handleLinkClick}
                  >
                    <Link href={href}>
                      <Icon className="h-5 w-5" />
                      <span>{t(label)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
