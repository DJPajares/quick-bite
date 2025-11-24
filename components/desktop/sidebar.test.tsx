import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SideNav } from './sidebar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

// Mock the sidebar context
jest.mock('@/components/ui/sidebar', () => ({
  useSidebar: () => ({
    setOpenMobile: jest.fn(),
  }),
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
  SidebarHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu">{children}</div>
  ),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-menu-item">{children}</div>
  ),
  SidebarMenuButton: ({
    children,
    isActive,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
    isActive?: boolean;
  }) => (
    <div data-testid="sidebar-menu-button" data-active={isActive}>
      {children}
    </div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group-label">{children}</div>
  ),
  SidebarRail: () => <div data-testid="sidebar-rail" />,
}));

// Mock APP_CONSTANTS
jest.mock('@/constants/app', () => ({
  APP_CONSTANTS: {
    APP_NAME: 'QuickBite',
  },
}));

describe('SideNav', () => {
  const mockTranslations = (key: string) => {
    const translations: Record<string, string> = {
      'Navigation.home': 'Home',
      'Navigation.search': 'Search',
      'Navigation.orders': 'Orders',
      'Navigation.profile': 'Profile',
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

  it('renders the sidebar with app name', () => {
    render(<SideNav />);

    expect(screen.getByText('QuickBite')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<SideNav />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders settings in bottom section', () => {
    render(<SideNav />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('highlights the active navigation item based on pathname', () => {
    (usePathname as jest.Mock).mockReturnValue('/search');

    render(<SideNav />);

    const menuButtons = screen.getAllByTestId('sidebar-menu-button');
    const activeButton = menuButtons.find(
      (button) => button.getAttribute('data-active') === 'true',
    );

    expect(activeButton).toBeDefined();
  });

  it('renders navigation links with correct hrefs', () => {
    render(<SideNav />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    const searchLink = screen.getByRole('link', { name: /search/i });
    const ordersLink = screen.getByRole('link', { name: /orders/i });
    const profileLink = screen.getByRole('link', { name: /profile/i });
    const settingsLink = screen.getByRole('link', { name: /settings/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(searchLink).toHaveAttribute('href', '/search');
    expect(ordersLink).toHaveAttribute('href', '/orders');
    expect(profileLink).toHaveAttribute('href', '/profile');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('renders the sidebar structure correctly', () => {
    render(<SideNav />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-rail')).toBeInTheDocument();
  });

  it('renders group label for pages', () => {
    render(<SideNav />);

    expect(screen.getByText('Pages')).toBeInTheDocument();
  });
});
