// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID!;
  const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET!;
  const REDIRECT_URI = process.env.STRAVA_REDIRECT_URI!;
  

  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    return NextResponse.json({ error: 'Failed to get token', details: tokenData }, { status: 500 });
  }

  // Aquí podrías guardar en Supabase, por ahora solo lo mostramos
  return NextResponse.json({ success: true, tokenData });
}
