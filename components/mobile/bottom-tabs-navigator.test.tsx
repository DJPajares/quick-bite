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
      'Navigation.search': 'Search',
      'Navigation.orders': 'Orders',
      'Navigation.profile': 'Profile',
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
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<BottomTabsNavigator />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    const searchLink = screen.getByRole('link', { name: /search/i });
    const ordersLink = screen.getByRole('link', { name: /orders/i });
    const profileLink = screen.getByRole('link', { name: /profile/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(searchLink).toHaveAttribute('href', '/search');
    expect(ordersLink).toHaveAttribute('href', '/orders');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('highlights the active tab based on pathname', () => {
    render(<BottomTabsNavigator />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('text-primary');
  });

  it('applies inactive styles to non-active tabs', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<BottomTabsNavigator />);

    const searchLink = screen.getByRole('link', { name: /search/i });
    expect(searchLink).toHaveClass('text-muted-foreground');
    expect(searchLink).not.toHaveClass('text-primary');
  });

  it('highlights search tab when on search page', () => {
    (usePathname as jest.Mock).mockReturnValue('/search');
    render(<BottomTabsNavigator />);

    const searchLink = screen.getByRole('link', { name: /search/i });
    const homeLink = screen.getByRole('link', { name: /home/i });

    expect(searchLink).toHaveClass('text-primary');
    expect(homeLink).toHaveClass('text-muted-foreground');
  });

  it('highlights orders tab when on orders page', () => {
    (usePathname as jest.Mock).mockReturnValue('/orders');
    render(<BottomTabsNavigator />);

    const ordersLink = screen.getByRole('link', { name: /orders/i });
    expect(ordersLink).toHaveClass('text-primary');
  });

  it('highlights profile tab when on profile page', () => {
    (usePathname as jest.Mock).mockReturnValue('/profile');
    render(<BottomTabsNavigator />);

    const profileLink = screen.getByRole('link', { name: /profile/i });
    expect(profileLink).toHaveClass('text-primary');
  });

  it('applies correct styling to the navigation container', () => {
    render(<BottomTabsNavigator />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-background', 'h-16', 'border-t');
  });

  it('renders all icons for each tab', () => {
    const { container } = render(<BottomTabsNavigator />);

    // Each tab should have an icon (svg element)
    const icons = container.querySelectorAll('svg');
    expect(icons).toHaveLength(4);
  });
});
