import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useLocale() {
  const [locale, setLocaleState] = useState<string>('en');
  const router = useRouter();

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]*)/);
    const cookieLocale = match ? decodeURIComponent(match[1]) : null;
    setLocaleState(cookieLocale || 'en');
  }, []);

  const setLocale = useCallback(
    (lang: string) => {
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `NEXT_LOCALE=${encodeURIComponent(lang)}; path=/; max-age=${60 * 60 * 24 * 365}`;
      setLocaleState(lang);
      // Reload current page with same pathname (router.replace)
      router.replace(window.location.pathname);
    },
    [router]
  );

  return { locale, setLocale };
}
