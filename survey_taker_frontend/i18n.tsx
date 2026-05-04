import { PropsWithChildren } from 'react';
import { NextIntlProvider as NextIntlProviderBase } from 'next-intl';
import { useLocale } from '@/hooks/useLocale';

// Wrapper component for next-intl provider that loads locale messages dynamically.
export function NextIntlProvider({ children }: PropsWithChildren) {
  const { locale } = useLocale();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const messages = require(`./messages/${locale}.json`);
  return (
    <NextIntlProviderBase messages={messages} locale={locale}>
      {children}
    </NextIntlProviderBase>
  );
}
