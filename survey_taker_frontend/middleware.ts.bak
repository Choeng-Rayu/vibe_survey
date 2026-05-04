import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const acceptLanguage = request.headers.get('accept-language');
  let locale = 'en';
  if (cookieLocale) {
    locale = cookieLocale;
  } else if (acceptLanguage) {
    const primary = acceptLanguage.split(',')[0].trim();
    if (primary.startsWith('km')) locale = 'km';
  }

  const pathname = request.nextUrl.pathname;
  // If already prefixed with locale, continue
  if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
