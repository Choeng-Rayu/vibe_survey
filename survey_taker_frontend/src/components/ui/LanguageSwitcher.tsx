import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from '@/hooks/useLocale';
import React from 'react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSwitch = (lang: string) => {
    if (lang === locale) return;
    setLocale(lang);
    const params = new URLSearchParams(searchParams);
    const newPath = `/${lang}${pathname}`;
    router.replace(`${newPath}?${params.toString()}`);
  };

  return (
    <div>
      <button onClick={() => handleSwitch('en')} disabled={locale === 'en'}>English</button>
      <button onClick={() => handleSwitch('km')} disabled={locale === 'km'}>Khmer</button>
    </div>
  );
}
