'use client';

import {
  Home,
  Search,
  ShoppingCart,
  User,
  Settings,
  TrendingUpIcon,
  UtensilsCrossedIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
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
import { Label } from '@/components/ui/label';
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
    // <aside className="flex flex-col w-64 border-r bg-background h-screen sticky top-0">
    //   {/* Logo/Brand */}
    //   <div className="h-16 flex items-center px-6 border-b">
    //     <h1 className="text-xl font-bold">Quick Bite</h1>
    //   </div>

    //   {/* Navigation Items */}
    //   <nav className="flex-1 px-3 py-4 space-y-1">
    //     {navigationItems.map(({ icon: Icon, href, label }) => {
    //       const isActive = pathname === href;

    //       return (
    //         <Link
    //           key={href}
    //           href={href}
    //           className={cn(
    //             'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    //             isActive
    //               ? 'bg-primary text-primary-foreground'
    //               : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    //           )}
    //         >
    //           <Icon className="h-5 w-5" />
    //           <span>{t(label)}</span>
    //         </Link>
    //       );
    //     })}
    //   </nav>

    //   {/* Bottom Items */}
    //   <div className="px-3 pb-4 space-y-1">
    //     <Separator className="my-2" />
    //     {bottomItems.map(({ icon: Icon, href, label }) => {
    //       const isActive = pathname === href;

    //       return (
    //         <Link
    //           key={href}
    //           href={href}
    //           className={cn(
    //             'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    //             isActive
    //               ? 'bg-primary text-primary-foreground'
    //               : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
    //           )}
    //         >
    //           <Icon className="h-5 w-5" />
    //           <span>{t(label)}</span>
    //         </Link>
    //       );
    //     })}
    //   </div>
    // </aside>

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
