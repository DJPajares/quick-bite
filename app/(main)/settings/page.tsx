import { getUserLocale } from '@/services/locale';
import { SettingsPanel } from '@/components/shared/settings-panel';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const currentLocale = await getUserLocale();

  const t = await getTranslations('Settings');

  return (
    <div className="container mx-auto flex max-w-2xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <SettingsPanel currentLocale={currentLocale} />
    </div>
  );
}
