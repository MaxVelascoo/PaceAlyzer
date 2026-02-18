import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔥 solo en server
);

async function refreshStravaToken(refreshToken: string) {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID!,
      client_secret: process.env.STRAVA_CLIENT_SECRET!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strava token refresh failed: ${text}`);
  }
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }>;
}

async function fetchStravaActivities(accessToken: string, afterEpoch: number) {
  const activities: Array<Record<string, unknown>> = [];
  let page = 1;

  while (true) {
    const url = new URL('https://www.strava.com/api/v3/athlete/activities');
    url.searchParams.set('after', String(afterEpoch));
    url.searchParams.set('per_page', '200');
    url.searchParams.set('page', String(page));

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Strava activities failed: ${text}`);
    }

    const batch = (await res.json()) as Array<Record<string, unknown>>;
    activities.push(...batch);

    if (batch.length < 200) break;
    page += 1;
  }

  return activities;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body.userId as string | undefined;
    const startDate = body.startDate as string | undefined; // YYYY-MM-DD
    const endDate = body.endDate as string | undefined; // YYYY-MM-DD
    const lookbackDays = Number(body.lookbackDays ?? 30);

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // 1) cargar cuenta strava
    const { data: acc, error: accErr } = await supabaseAdmin
      .from('strava_accounts')
      .select('user_id, refresh_token, access_token, expires_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (accErr) throw accErr;
    if (!acc) return NextResponse.json({ error: 'No Strava account' }, { status: 400 });

    // 2) determinar desde cuándo sincronizar
    let afterEpoch: number;
    
    if (startDate && endDate) {
      // Si se proporcionan fechas específicas, usar startDate
      const start = new Date(startDate);
      afterEpoch = Math.floor(start.getTime() / 1000);
    } else {
      // Fallback: usar última fecha guardada o lookbackDays
      const { data: lastRow, error: lastErr } = await supabaseAdmin
        .from('trainings')
        .select('date')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastErr) throw lastErr;

      const now = new Date();
      const fallback = new Date(now);
      fallback.setDate(now.getDate() - Number(lookbackDays));

      const sinceDate = lastRow?.date ? new Date(lastRow.date) : fallback;
      sinceDate.setDate(sinceDate.getDate() - 1); // margen -1 día

      afterEpoch = Math.floor(sinceDate.getTime() / 1000);
    }

    // 3) asegurar token válido (refresh si expira)
    const expiresAt = acc.expires_at ?? 0;
    let accessToken = acc.access_token;

    if (!accessToken || Date.now() / 1000 > expiresAt - 60) {
      const t = await refreshStravaToken(acc.refresh_token);

      accessToken = t.access_token;

      await supabaseAdmin
        .from('strava_accounts')
        .update({
          access_token: t.access_token,
          refresh_token: t.refresh_token,
          expires_at: t.expires_at,
        })
        .eq('user_id', userId);
    }

    // 4) pedir actividades a Strava
    const activities = await fetchStravaActivities(accessToken, afterEpoch);

    // 5) filtrar ciclismo (Strava types: Ride, VirtualRide, eBikeRide, etc.)
    let cycling = activities.filter(a =>
      ['Ride', 'VirtualRide', 'EBikeRide', 'eBikeRide'].includes(String(a.type))
    );

    // Si se proporcionan fechas específicas, filtrar por rango
    if (startDate && endDate) {
      cycling = cycling.filter(a => {
        const activityDate = String(a.start_date_local ?? a.start_date).slice(0, 10);
        return activityDate >= startDate && activityDate <= endDate;
      });
    }

    // 6) obtener streams (watts y heartrate) para cada actividad
    const rowsPromises = cycling.map(async (a) => {
      let powerStream = null;
      let hrStream = null;

      try {
        const streamUrl = `https://www.strava.com/api/v3/activities/${a.id}/streams?keys=watts,heartrate&key_by_type=true`;
        const streamRes = await fetch(streamUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (streamRes.ok) {
          const streams = await streamRes.json() as Record<string, { data: number[] }>;
          powerStream = streams.watts?.data || null;
          hrStream = streams.heartrate?.data || null;
          
          console.log(`Activity ${a.id}: power=${powerStream?.length || 0} points, hr=${hrStream?.length || 0} points`);
        } else {
          console.warn(`Failed to fetch streams for activity ${a.id}: ${streamRes.status}`);
        }
      } catch (err) {
        console.warn(`Failed to fetch streams for activity ${a.id}:`, err);
      }

      return {
        user_id: userId,
        activity_id: Number(a.id),
        name: String(a.name ?? 'Entreno'),
        type: String(a.type),
        date: String(a.start_date_local ?? a.start_date).slice(0, 10), // YYYY-MM-DD
        distance: Number(a.distance), // metros
        duration: Math.round(Number(a.moving_time ?? a.elapsed_time ?? 0)), // segundos
        avgheartrate: a.average_heartrate ? Number(a.average_heartrate) : null,
        weighted_average_watts: a.weighted_average_watts ? Number(a.weighted_average_watts) : null,
        altitude: a.total_elevation_gain ? Number(a.total_elevation_gain) : null,
        power_stream: powerStream,
        hr_stream: hrStream,
      };
    });

    const rows = await Promise.all(rowsPromises);

    // 7) UPSERT por activity_id (necesitas unique constraint en DB)
    const { error: upErr } = await supabaseAdmin
      .from('trainings')
      .upsert(rows, { onConflict: 'activity_id' });

    if (upErr) throw upErr;

    return NextResponse.json({
      insertedOrUpdated: rows.length,
      dateRange: startDate && endDate ? `${startDate} to ${endDate}` : 'auto',
    });
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return NextResponse.json({ error: error.message ?? 'Unknown error' }, { status: 500 });
  }
}
