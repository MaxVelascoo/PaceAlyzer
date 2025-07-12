import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID!;
  const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET!;
  const REDIRECT_URI = process.env.STRAVA_REDIRECT_URI!;

  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    return NextResponse.json({ error: 'Token exchange failed', details: tokenData }, { status: 500 });
  }

  const athlete = tokenData.athlete;

  // Upsert en tabla "users"
  const { error } = await supabase
    .from('users')
    .upsert({
      strava_id: athlete.id,
      firstname: athlete.firstname,
      lastname: athlete.lastname,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at,
      // email no se incluye si no lo devuelve Strava
    }, { onConflict: 'strava_id' });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  const redirectUrl = new URL(`/dashboard`, BASE_URL); // redirige al dashboard

  return NextResponse.redirect(redirectUrl);
}
