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

  it('renders all navigation tabs', () => {
    render(<BottomTabsNavigator />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Bill')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<BottomTabsNavigator />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    const menuLink = screen.getByRole('link', { name: /menu/i });
    const cartLink = screen.getByRole('link', { name: /cart/i });
    const billLink = screen.getByRole('link', { name: /bill/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(menuLink).toHaveAttribute('href', '/menu');
    expect(cartLink).toHaveAttribute('href', '/cart');
    expect(billLink).toHaveAttribute('href', '/bill');
  });

  it('highlights the active tab based on pathname', () => {
    render(<BottomTabsNavigator />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('text-primary');
  });

  it('applies inactive styles to non-active tabs', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<BottomTabsNavigator />);

    const menuLink = screen.getByRole('link', { name: /menu/i });
    expect(menuLink).toHaveClass('text-muted-foreground');
    expect(menuLink).not.toHaveClass('text-primary');
  });

  it('highlights menu tab when on menu page', () => {
    (usePathname as jest.Mock).mockReturnValue('/menu');
    render(<BottomTabsNavigator />);

    const menuLink = screen.getByRole('link', { name: /menu/i });
    const homeLink = screen.getByRole('link', { name: /home/i });

    expect(menuLink).toHaveClass('text-primary');
    expect(homeLink).toHaveClass('text-muted-foreground');
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

  it('applies correct styling to the navigation container', () => {
    render(<BottomTabsNavigator />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-sidebar', 'h-16', 'border-t');
  });

  it('renders all icons for each tab', () => {
    const { container } = render(<BottomTabsNavigator />);

    // Each tab should have an icon (svg element)
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(4);
  });
});
