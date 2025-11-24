import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

import { raleway } from '@/lib/fonts';
import { Providers } from '@/providers/providers';
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
      <body className={`${raleway.variable} antialiased`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
