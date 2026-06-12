import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const { data: entry, error } = await supabase
      .from('pitchside_entries')
      .select('id, nick, group_picks, third_picks, r32_picks, r16_picks, qf_picks, sf_picks, final_pick')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (err) {
    console.error('Entry fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch entry details' }, { status: 500 });
  }
}
