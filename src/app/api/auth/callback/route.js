import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role para escritura segura desde backend
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const client_id = process.env.STRAVA_CLIENT_ID;
  const client_secret = process.env.STRAVA_CLIENT_SECRET;

  // Intercambiar código por token
  const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return NextResponse.json(tokenData, { status: 500 });
  }

  // Guarda token y datos usuario en Supabase
  const athlete = tokenData.athlete;

  const { error } = await supabase
    .from('users') // tabla que crees para usuarios
    .upsert({
      strava_id: athlete.id,
      firstname: athlete.firstname,
      lastname: athlete.lastname,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at,
      //email: athlete.email || null,
      // Otros campos que quieras
    }, { onConflict: 'strava_id' });

  if (error) {
    console.error('Error guardando usuario:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Guardar el strava_id para el siguiente paso (por ejemplo en cookie o query)
  // Aquí te lo paso por query para simplificar:
  const redirectUrl = new URL('/complete-registration', req.url);
  redirectUrl.searchParams.set('strava_id', athlete.id);

  return NextResponse.redirect(redirectUrl);
}
