import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { BottomTabsNavigator } from './bottom-tabs-navigator';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

describe('BottomTabsNavigator', () => {
  const mockTranslations = (key: string) => {
    const translations: Record<string, string> = {
      'Navigation.home': 'Home',
      'Navigation.menu': 'Menu',
      'Navigation.cart': 'Cart',
      'Navigation.bill': 'Bill',
      'Navigation.settings': 'Settings',
    };
    return translations[key] || key;
  };

  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
    (useTranslations as jest.Mock).mockReturnValue(mockTranslations);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the bottom tabs navigator', () => {
    render(<BottomTabsNavigator />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass('fixed', 'bottom-0', 'z-50');
  });

  it('renders all navigation tabs including settings', () => {
    render(<BottomTabsNavigator />);
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Bill')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs including settings', () => {
    render(<BottomTabsNavigator />);
    const menuLink = screen.getByRole('link', { name: /menu/i });
    const cartLink = screen.getByRole('link', { name: /cart/i });
    const billLink = screen.getByRole('link', { name: /bill/i });
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(menuLink).toHaveAttribute('href', '/');
    expect(cartLink).toHaveAttribute('href', '/cart');
    expect(billLink).toHaveAttribute('href', '/bill');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('highlights the menu tab (root path) as active', () => {
    render(<BottomTabsNavigator />);
    const menuLink = screen.getByRole('link', { name: /menu/i });
    expect(menuLink).toHaveClass('text-primary');
  });

  it('applies inactive styles to non-active tabs (cart while on root)', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<BottomTabsNavigator />);
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toHaveClass('text-muted-foreground');
    expect(cartLink).not.toHaveClass('text-primary');
  });

  it('highlights cart tab when on cart page', () => {
    (usePathname as jest.Mock).mockReturnValue('/cart');
    render(<BottomTabsNavigator />);
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toHaveClass('text-primary');
  });

  it('highlights bill tab when on bill page', () => {
    (usePathname as jest.Mock).mockReturnValue('/bill');
    render(<BottomTabsNavigator />);
    const billLink = screen.getByRole('link', { name: /bill/i });
    expect(billLink).toHaveClass('text-primary');
  });

  it('highlights settings tab when on settings page', () => {
    (usePathname as jest.Mock).mockReturnValue('/settings');
    render(<BottomTabsNavigator />);
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toHaveClass('text-primary');
  });

  it('applies correct styling to the navigation container', () => {
    render(<BottomTabsNavigator />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-sidebar', 'h-16', 'border-t');
  });

  it('renders all icons for each tab including settings', () => {
    const { container } = render(<BottomTabsNavigator />);
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(4);
  });
});
