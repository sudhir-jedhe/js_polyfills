// app/api/me/route.js
// Reading headers and cookies inside a Route Handler.

import { NextResponse } from 'next/server';

export async function GET(request) {
  const userAgent = request.headers.get('user-agent');
  const sessionToken = request.cookies.get('session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Pretend this validates the token against a session store.
  const user = { id: 'u_1', name: 'Ada Lovelace' };

  const response = NextResponse.json({ user, userAgent });
  // Refresh the cookie's expiry on every authenticated request.
  response.cookies.set('session', sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
