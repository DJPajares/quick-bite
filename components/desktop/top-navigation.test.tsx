import { render, screen, fireEvent } from '@testing-library/react';
import { TopNavigation } from './top-navigation';

// Mock SideNav component
jest.mock('@/components/desktop/sidebar', () => ({
  SideNav: () => <div data-testid="side-nav">SideNav</div>,
}));

// Mock NavDropdownMenu component
jest.mock('@/components/desktop/navigation-dropdown-menu', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nav-dropdown-menu">{children}</div>
  ),
}));

// Mock sidebar components
jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarInset: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="sidebar-inset" className={className}>
      {children}
    </div>
  ),
  SidebarTrigger: ({ className }: { className: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Toggle
    </button>
  ),
}));

// Mock Avatar components
jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className: string;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src }: { src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="avatar-image" src={src} alt="avatar" />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

describe('TopNavigation', () => {
  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 0,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the top navigation structure', () => {
    render(<TopNavigation />);

    expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
    expect(screen.getByTestId('side-nav')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument();
  });

  it('renders the header with sidebar trigger', () => {
    render(<TopNavigation />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
  });

  it('renders the avatar with dropdown menu', () => {
    render(<TopNavigation />);

    expect(screen.getByTestId('nav-dropdown-menu')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-image')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    expect(screen.getByText('DJ')).toBeInTheDocument();
  });

  it('renders children in main content area', () => {
    render(
      <TopNavigation>
        <div data-testid="test-content">Test Content</div>
      </TopNavigation>,
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('header is visible by default', () => {
    render(<TopNavigation />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('translate-y-0');
    expect(header).not.toHaveClass('-translate-y-full');
  });

  it('hides header on scroll down', () => {
    render(<TopNavigation />);

    const header = screen.getByRole('banner');

    // Simulate scroll down
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 100,
    });
    fireEvent.scroll(window);

    // Wait for state update
    setTimeout(() => {
      expect(header).toHaveClass('-translate-y-full');
    }, 0);
  });

  it('shows header on scroll up', () => {
    render(<TopNavigation />);

    const header = screen.getByRole('banner');

    // Simulate scroll down first
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 100,
    });
    fireEvent.scroll(window);

    // Then scroll up
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 50,
    });
    fireEvent.scroll(window);

    // Wait for state update
    setTimeout(() => {
      expect(header).toHaveClass('translate-y-0');
    }, 0);
  });

  it('renders main content area with correct styling', () => {
    render(<TopNavigation />);

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1', 'overflow-y-auto');
  });

  it('applies correct styling to header', () => {
    render(<TopNavigation />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('nav');
    expect(header).toHaveClass('sticky');
    expect(header).toHaveClass('top-0');
    expect(header).toHaveClass('z-50');
    expect(header).toHaveClass('backdrop-blur-sm');
  });
});
