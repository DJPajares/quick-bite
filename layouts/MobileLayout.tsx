import { BottomTabsNavigator } from '@/components/mobile/bottom-tabs-navigator';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto">{children}</main>

      <div className="fixed right-0 bottom-0 left-0 z-50">
        <BottomTabsNavigator />
      </div>
    </div>
  );
}
