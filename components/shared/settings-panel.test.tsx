import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { SettingsPanel } from './settings-panel';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/services/locale', () => ({
  setUserLocale: jest.fn(),
  resetLocale: jest.fn(),
}));

// sonner toast mock to avoid warnings
jest.mock('sonner', () => ({
  toast: { success: jest.fn() },
}));

// next-themes mock
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'system', setTheme: jest.fn() }),
}));

// UI component mocks (minimal)
jest.mock('@/components/ui/select', () => {
  interface SelectProps {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (val: string) => void;
  }
  interface SelectItemProps {
    children: React.ReactNode;
    value: string;
  }
  return {
    Select: ({ children, value, onValueChange }: SelectProps) => (
      <div
        data-testid="select"
        data-value={value}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'BUTTON') {
            const val = target.getAttribute('value');
            if (val) onValueChange?.(val);
          }
        }}
      >
        {children}
      </div>
    ),
    SelectTrigger: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectContent: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    SelectItem: ({
      children,
      value,
      onClick,
    }: SelectItemProps & { onClick?: () => void }) => (
      <button data-testid={`option-${value}`} onClick={onClick} value={value}>
        {children}
      </button>
    ),
    SelectValue: () => null,
  };
});

jest.mock('@/components/shared/confirmation-dialog', () => ({
  ConfirmationDialog: ({
    open,
    title,
    description,
    confirmText,
    onConfirm,
  }: {
    open: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }) =>
    open ? (
      <div data-testid="dialog">
        <h2>{title}</h2>
        <p>{description}</p>
        <button onClick={onConfirm}>{confirmText}</button>
      </div>
    ) : null,
}));

jest.mock('@/components/ui/toggle-group', () => ({
  ToggleGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ToggleGroupItem: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
  }) => <button {...props}>{children}</button>,
}));

// React already imported at top
import { setUserLocale, resetLocale } from '@/services/locale';

describe('SettingsPanel', () => {
  const tMock = (key: string) => {
    const map: Record<string, string> = {
      'Settings.appearance.title': 'Appearance',
      'Settings.appearance.description': 'Customize look',
      'Settings.appearance.themeLabel': 'Theme',
      'Settings.appearance.light': 'Light',
      'Settings.appearance.dark': 'Dark',
      'Settings.appearance.system': 'System',
      'Settings.language.title': 'Language',
      'Settings.language.description': 'Change display language',
      'Settings.language.selectLabel': 'Select language',
      'Settings.language.save': 'Save Language',
      'Settings.language.confirm.title': 'Change Language',
      'Settings.language.confirm.description': 'Confirm language change?',
      'Settings.language.confirm.confirmText': 'Yes, change',
      'Settings.reset.title': 'Reset',
      'Settings.reset.description': 'Restore defaults',
      'Settings.reset.button': 'Reset Settings',
      'Settings.reset.confirm.title': 'Reset Preferences',
      'Settings.reset.confirm.description': 'Confirm reset?',
      'Settings.reset.confirm.confirmText': 'Yes, reset',
      'Settings.toast.languageUpdated': 'Language updated',
      'Settings.toast.preferencesReset': 'Preferences reset',
    };
    return map[key] || key;
  };

  beforeEach(() => {
    (useTranslations as jest.Mock).mockReturnValue(tMock);
    (useRouter as jest.Mock).mockReturnValue({ refresh: jest.fn() });
    jest.clearAllMocks();
  });

  it('renders basic sections', () => {
    render(<SettingsPanel currentLocale="en" />);
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('does not commit locale immediately on select change', () => {
    render(<SettingsPanel currentLocale="en" />);
    const jaOption = screen.getByTestId('option-ja');
    fireEvent.click(jaOption);
    expect(setUserLocale).not.toHaveBeenCalled();
  });

  it('commits locale only after confirmation', async () => {
    render(<SettingsPanel currentLocale="en" />);
    const jaOption = screen.getByTestId('option-ja');
    fireEvent.click(jaOption);
    const saveBtn = screen.getByRole('button', { name: 'Save Language' });
    fireEvent.click(saveBtn);
    const confirmBtn = screen.getByRole('button', { name: 'Yes, change' });
    fireEvent.click(confirmBtn);
    await waitFor(() => expect(setUserLocale).toHaveBeenCalled());
  });

  it('resets preferences via dialog confirmation', async () => {
    render(<SettingsPanel currentLocale="en" />);
    const resetBtn = screen.getByRole('button', { name: 'Reset Settings' });
    fireEvent.click(resetBtn);
    const confirmBtn = screen.getByRole('button', { name: 'Yes, reset' });
    fireEvent.click(confirmBtn);
    await waitFor(() => expect(resetLocale).toHaveBeenCalled());
  });

  it('disables save button when no locale change', () => {
    render(<SettingsPanel currentLocale="en" />);
    const saveBtn = screen.getByRole('button', { name: 'Save Language' });
    expect(saveBtn).toBeDisabled();
  });
});
