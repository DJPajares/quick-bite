import { BottomTabsNavigator } from '@/components/mobile/bottom-tabs-navigator';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content - with bottom padding for tabs */}
      <main className="flex-1 pb-16 overflow-y-auto">{children}</main>

      {/* Bottom Tabs Navigator */}
      <BottomTabsNavigator />
    </div>
  );
}
