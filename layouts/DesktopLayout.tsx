// import { Sidebar } from '@/components/desktop/sidebar';
import { TopNavigation } from '@/components/desktop/top-navigation';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <TopNavigation>{children}</TopNavigation>
    </div>
  );
}
