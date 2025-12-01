'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useTheme } from 'next-themes';
import { languages, defaultLocale } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SettingsPanelProps {
  currentLocale: string;
}

export function SettingsPanel({ currentLocale }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  const [mounted, setMounted] = useState(false);
  const [draftLocale, setDraftLocale] = useState(currentLocale);

  // Sync draftLocale when server-provided currentLocale changes after refresh
  useEffect(() => {
    setDraftLocale(currentLocale);
  }, [currentLocale]);

  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);

  const handleDraftLocaleChange = useCallback((val: string) => {
    setDraftLocale(val);
  }, []);

  const commitLocaleChange = useCallback(() => {
    if (draftLocale === currentLocale) return;
    startTransition(async () => {
      const { setUserLocale } = await import('@/services/locale');
      if (languages.some((l) => l.value === draftLocale)) {
        await setUserLocale(draftLocale as (typeof languages)[number]['value']);
        const { toast } = await import('sonner');
        toast.success(t('Settings.toast.languageUpdated'));
        router.refresh();
      }
    });
  }, [draftLocale, currentLocale, router, t]);

  const handleReset = useCallback(() => {
    startTransition(async () => {
      const { resetLocale } = await import('@/services/locale');
      await resetLocale();
      // Optimistically update dropdown before refresh
      setDraftLocale(defaultLocale);
      const { toast } = await import('sonner');
      toast.success(t('Settings.toast.preferencesReset'));
      router.refresh();
    });
  }, [router, t]);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('Settings.appearance.title')}</CardTitle>
          <CardDescription>
            {t('Settings.appearance.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">
              {t('Settings.appearance.themeLabel')}
            </span>
            {mounted ? (
              <ToggleGroup
                type="single"
                value={theme}
                onValueChange={(val) => val && setTheme(val)}
              >
                <ToggleGroupItem
                  value="light"
                  aria-label={t('Settings.appearance.light')}
                >
                  {t('Settings.appearance.light')}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="dark"
                  aria-label={t('Settings.appearance.dark')}
                >
                  {t('Settings.appearance.dark')}
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="system"
                  aria-label={t('Settings.appearance.system')}
                >
                  {t('Settings.appearance.system')}
                </ToggleGroupItem>
              </ToggleGroup>
            ) : (
              <div
                className="h-9 w-56 animate-pulse rounded-md border"
                aria-hidden="true"
              />
            )}
          </div>
        </CardContent>
        <CardFooter />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('Settings.language.title')}</CardTitle>
          <CardDescription>
            {t('Settings.language.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="locale" className="text-sm font-medium">
                {t('Settings.language.selectLabel')}
              </label>
              <Select
                value={draftLocale}
                onValueChange={handleDraftLocaleChange}
              >
                <SelectTrigger
                  id="locale"
                  aria-label={t('Settings.language.title')}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <LanguageConfirmSubmit
              t={t}
              pending={pending}
              disabled={draftLocale === currentLocale}
              onCommit={commitLocaleChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('Settings.reset.title')}</CardTitle>
          <CardDescription>{t('Settings.reset.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetConfirmSubmit t={t} onConfirm={handleReset} pending={pending} />
        </CardContent>
      </Card>
    </div>
  );
}

function LanguageConfirmSubmit({
  t,
  pending,
  disabled,
  onCommit,
}: {
  t: (key: string) => string;
  pending: boolean;
  disabled: boolean;
  onCommit: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant="default"
        onClick={() => setOpen(true)}
        disabled={disabled || pending}
      >
        {pending
          ? t('Settings.language.save') + '...'
          : t('Settings.language.save')}
      </Button>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title={t('Settings.language.confirm.title')}
        description={t('Settings.language.confirm.description')}
        confirmText={t('Settings.language.confirm.confirmText')}
        onConfirm={() => {
          onCommit();
          setOpen(false);
        }}
      />
    </div>
  );
}

function ResetConfirmSubmit({
  t,
  onConfirm,
  pending,
}: {
  t: (key: string) => string;
  onConfirm: () => void;
  pending: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-3">
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        {pending
          ? t('Settings.reset.button') + '...'
          : t('Settings.reset.button')}
      </Button>
      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title={t('Settings.reset.confirm.title')}
        description={t('Settings.reset.confirm.description')}
        confirmText={t('Settings.reset.confirm.confirmText')}
        variant="destructive"
        onConfirm={() => {
          onConfirm();
          setOpen(false);
        }}
      />
    </div>
  );
}
