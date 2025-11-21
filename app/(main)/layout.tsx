import { DesktopLayout } from '@/layouts/DesktopLayout';
import { MobileLayout } from '@/layouts/MobileLayout';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
