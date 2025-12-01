import { BottomTabsNavigator } from '@/components/mobile/bottom-tabs-navigator';
import { TopNavigation } from '@/components/desktop/top-navigation';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
