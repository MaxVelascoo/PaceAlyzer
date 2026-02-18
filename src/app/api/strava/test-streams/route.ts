import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, activityId } = body;

    if (!userId || !activityId) {
      return NextResponse.json({ error: 'Missing userId or activityId' }, { status: 400 });
    }

    // 1) Obtener token de Strava
    const { data: acc, error: accErr } = await supabaseAdmin
      .from('strava_accounts')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (accErr || !acc) {
      return NextResponse.json({ error: 'No Strava account found' }, { status: 400 });
    }

    let accessToken = acc.access_token;

    // 2) Refresh token si es necesario
    if (!accessToken || Date.now() / 1000 > (acc.expires_at ?? 0) - 60) {
      const refreshRes = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.STRAVA_CLIENT_ID!,
          client_secret: process.env.STRAVA_CLIENT_SECRET!,
          grant_type: 'refresh_token',
          refresh_token: acc.refresh_token,
        }),
      });

      if (!refreshRes.ok) {
        const text = await refreshRes.text();
        return NextResponse.json({ error: `Token refresh failed: ${text}` }, { status: 500 });
      }

      const tokenData = await refreshRes.json();
      accessToken = tokenData.access_token;

      await supabaseAdmin
        .from('strava_accounts')
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
        })
        .eq('user_id', userId);
    }

    // 3) Obtener streams
    const streamUrl = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=watts,heartrate&key_by_type=true`;
    
    console.log('Fetching streams from:', streamUrl);
    
    const streamRes = await fetch(streamUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const responseText = await streamRes.text();
    console.log('Stream response status:', streamRes.status);
    console.log('Stream response:', responseText);

    if (!streamRes.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch streams',
        status: streamRes.status,
        response: responseText,
        url: streamUrl
      }, { status: 500 });
    }

    const streams = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      activityId,
      streams,
      hasWatts: !!streams.watts,
      hasHeartrate: !!streams.heartrate,
      wattsLength: streams.watts?.data?.length || 0,
      heartrateLength: streams.heartrate?.data?.length || 0,
    });

  } catch (e) {
    const error = e as Error;
    console.error('Test streams error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
