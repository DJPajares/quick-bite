import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminBottomTabs } from '@/components/admin/admin-bottom-tabs';
import { AdminTopNavigation } from '@/components/admin/admin-top-navigation';
import { AdminAuthProvider } from '@/components/admin/admin-auth-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminTopNavigation />
          <main className="flex flex-1 flex-col pb-16 md:pb-0">{children}</main>
        </SidebarInset>
        <AdminBottomTabs />
      </SidebarProvider>
    </AdminAuthProvider>
  );
}
