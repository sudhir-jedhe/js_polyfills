// middleware.js — rewrite "/" to a locale-prefixed route based on Accept-Language
import { NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'en';

function pickLocale(acceptLanguageHeader) {
  if (!acceptLanguageHeader) return DEFAULT_LOCALE;

  const preferred = acceptLanguageHeader
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2));

  return preferred.find((lang) => SUPPORTED_LOCALES.includes(lang)) ?? DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  const locale = pickLocale(request.headers.get('accept-language'));
  const url = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
