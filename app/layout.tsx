import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { montserrat } from '@/lib/fonts';
import { Providers } from '@/providers/providers';
import { ToasterWrapper } from '@/components/shared/toaster-wrapper';
import { APP_CONSTANTS } from '@/constants/app';
import './globals.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: APP_CONSTANTS.APP_NAME,
  description: APP_CONSTANTS.APP_TAGLINE,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <ToasterWrapper />
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
