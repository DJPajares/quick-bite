import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background font-sans">
      <div className="flex flex-col items-center gap-6">
        <Label>{t('Home.title')}</Label>

        <Button
          variant="outline"
          size="lg"
        >
          {t('Button.continue')}
        </Button>
      </div>
    </main>
  );
}
