'use client';

import { usePathname } from 'next/navigation';
import { BottomTabsNavigator } from '@/components/mobile/bottom-tabs-navigator';
import { TopNavigation } from '@/components/desktop/top-navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminBottomTabs } from '@/components/admin/admin-bottom-tabs';
import { AdminTopNavigation } from '@/components/admin/admin-top-navigation';
import { AdminAuthProvider } from '@/components/admin/admin-auth-provider';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminAuthProvider>
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <AdminTopNavigation />
            <main className="flex flex-1 flex-col pb-16 md:pb-0">
              {children}
            </main>
          </SidebarInset>
          <AdminBottomTabs />
        </SidebarProvider>
      </AdminAuthProvider>
    );
  }

  return (
    <>
      {/* Mobile Layout - visible only on mobile screens */}
      <div className="md:hidden">
        <div className="relative flex h-screen flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
            {children}
          </main>

          <div className="fixed right-0 bottom-0 left-0 z-50">
            <BottomTabsNavigator />
          </div>
        </div>
      </div>

      {/* Desktop Layout - visible only on tablet/desktop screens */}
      <div className="hidden md:block">
        <div className="relative flex h-screen overflow-hidden">
          <TopNavigation>{children}</TopNavigation>
        </div>
      </div>
    </>
  );
}
