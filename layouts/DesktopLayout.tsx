// import { Sidebar } from '@/components/desktop/sidebar';
import { TopNavigation } from '@/components/desktop/top-navigation';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <TopNavigation>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </TopNavigation>
      </div>
    </div>
  );
}
