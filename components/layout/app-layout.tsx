import { MobileLayout } from '@/layouts/MobileLayout';
import { DesktopLayout } from '@/layouts/DesktopLayout';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      {/* Mobile Layout - visible only on mobile screens */}
      <div className="md:hidden">
        <MobileLayout>{children}</MobileLayout>
      </div>

      {/* Desktop Layout - visible only on tablet/desktop screens */}
      <div className="hidden md:block">
        <DesktopLayout>{children}</DesktopLayout>
      </div>
    </>
  );
}
