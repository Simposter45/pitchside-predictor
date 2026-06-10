import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (uses service role key for writes if needed,
// but anon key works if RLS policy allows inserts from anon)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, groupPicks, r32Picks, r16Picks, qfPicks, sfPicks, finalPick, entryTime } = body;

    // Basic validation
    if (!user?.email || !user?.nick || !finalPick) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for duplicate entry by email
    const { data: existing } = await supabase
      .from('pitchside_entries')
      .select('id')
      .eq('email', user.email.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'An entry with this email already exists. One entry per person.' },
        { status: 409 }
      );
    }

    // Insert entry
    const { data, error } = await supabase
      .from('pitchside_entries')
      .insert({
        name: user.name,
        nick: user.nick,
        instagram: user.insta,
        email: user.email.toLowerCase(),
        phone: user.phone,
        final_pick: finalPick,
        group_picks: groupPicks,
        r32_picks: r32Picks,
        r16_picks: r16Picks,
        qf_picks: qfPicks,
        sf_picks: sfPicks,
        entry_time: entryTime || new Date().toISOString(),
        submitted_at: new Date().toISOString(),
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save your entry. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, entryId: data.id });
  } catch (err) {
    console.error('Submit API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
