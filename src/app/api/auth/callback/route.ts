// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const stateUserId = searchParams.get('state'); // ✅ Obtenemos el user_id desde state

  if (!code || !stateUserId) {
    return NextResponse.json(
      { error: 'Missing code or user state' },
      { status: 400 }
    );
  }

  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.STRAVA_REDIRECT_URI,
    }),
  });
  const tokenData = await tokenRes.json();

  if (!tokenRes.ok) {
    console.error('Strava token error:', tokenData);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }

  const athlete = tokenData.athlete;

  // 🔁 Insert o update en la tabla strava_accounts
  const { error } = await supabase
    .from('strava_accounts')
    .upsert(
      {
        strava_id: athlete.id,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_at,
        user_id: stateUserId, // vinculamos con tu tabla users
      },
      { onConflict: 'strava_id' }
    );

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Redirige al dashboard ya con cuenta vinculada
  const redirectUrl = new URL('/dashboard', process.env.BASE_URL || 'http://localhost:3000');
  return NextResponse.redirect(redirectUrl);
}
