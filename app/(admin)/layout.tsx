import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminBottomTabs } from '@/components/admin/admin-bottom-tabs';
import { AdminTopNavigation } from '@/components/admin/admin-top-navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminTopNavigation />
        <main className="flex flex-1 flex-col pb-16 md:pb-0">{children}</main>
      </SidebarInset>
      <AdminBottomTabs />
    </SidebarProvider>
  );
}
