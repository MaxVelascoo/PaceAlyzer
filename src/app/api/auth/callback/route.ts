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
  const stateUserId = searchParams.get('state'); // ✅ user_id desde state

  if (!code || !stateUserId) {
    return NextResponse.json(
      { error: 'Missing code or user state' },
      { status: 400 }
    );
  }

  // 🔁 Intercambio de código por tokens
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

  // 🔁 Guardar cuenta Strava
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
        user_id: stateUserId,
      },
      { onConflict: 'strava_id' }
    );

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // 📥 Obtener actividades desde Strava
  const activitiesRes = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=50`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const activities = await activitiesRes.json();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentActivities = activities.filter((act: any) => {
    const actDate = new Date(act.start_date);
    return actDate >= sevenDaysAgo;
  });

  for (const act of recentActivities) {
    await supabase
      .from('activities')
      .upsert({
        strava_activity_id: act.id,
        user_id: stateUserId,
        name: act.name,
        distance: act.distance,
        moving_time: act.moving_time,
        start_date: act.start_date,
        type: act.type,
        // Si tienes más columnas, añádelas aquí
      }, { onConflict: 'strava_activity_id' });
  }

  const redirectUrl = new URL('/dashboard', process.env.BASE_URL || 'http://localhost:3000');
  return NextResponse.redirect(redirectUrl);
}
