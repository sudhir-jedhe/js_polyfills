// middleware.js — A/B test via rewrite, URL stays /pricing for both buckets
import { NextResponse } from 'next/server';

export function middleware(request) {
  const existingBucket = request.cookies.get('ab-bucket')?.value;
  const bucket = existingBucket ?? (Math.random() < 0.5 ? 'control' : 'variant');

  let response;
  if (bucket === 'variant') {
    response = NextResponse.rewrite(new URL('/pricing-variant', request.url));
  } else {
    response = NextResponse.next();
  }

  if (!existingBucket) {
    response.cookies.set('ab-bucket', bucket, { maxAge: 60 * 60 * 24 * 30 });
  }

  return response;
}

export const config = {
  matcher: ['/pricing'],
};
