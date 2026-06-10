import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Helpers ───────────────────────────────────────────────
function normalizePhone(phone: string): string {
  // Strip all spaces, dashes, parentheses — keep + and digits
  return phone.replace(/[\s\-().]/g, '');
}

function normalizeInstagram(handle: string): string {
  return handle.toLowerCase().replace(/^@/, '').trim();
}

// ─── POST /api/submit ───────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user,
      groupPicks,
      r32Picks,
      r16Picks,
      qfPicks,
      sfPicks,
      finalPick,
      entryTime,
      fingerprint,
    } = body;

    // ── Basic field validation ──
    if (!user?.email || !user?.nick || !user?.phone || !user?.insta || !finalPick) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const email     = user.email.toLowerCase().trim();
    const phone     = normalizePhone(user.phone);
    const instagram = normalizeInstagram(user.insta);

    // ── Phone must include country code ──
    if (!phone.startsWith('+')) {
      return NextResponse.json(
        { error: 'Phone number must include your country code (e.g. +91 for India).' },
        { status: 400 }
      );
    }

    // ── Duplicate checks — run all in parallel for speed ──
    const [emailCheck, phoneCheck, instaCheck, fingerprintCheck] = await Promise.all([
      supabase.from('pitchside_entries').select('id').eq('email', email).maybeSingle(),
      supabase.from('pitchside_entries').select('id').eq('phone', phone).maybeSingle(),
      supabase.from('pitchside_entries').select('id').eq('instagram', instagram).maybeSingle(),
      fingerprint
        ? supabase.from('pitchside_entries').select('id').eq('fingerprint_hash', fingerprint).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    if (emailCheck.data) {
      return NextResponse.json(
        { error: 'An entry with this email already exists. One entry per person.' },
        { status: 409 }
      );
    }
    if (phoneCheck.data) {
      return NextResponse.json(
        { error: 'An entry with this phone number already exists. One entry per person.' },
        { status: 409 }
      );
    }
    if (instaCheck.data) {
      return NextResponse.json(
        { error: 'An entry with this Instagram handle already exists. One entry per person.' },
        { status: 409 }
      );
    }
    if (fingerprintCheck.data) {
      return NextResponse.json(
        { error: 'An entry from this device has already been submitted. One entry per person.' },
        { status: 409 }
      );
    }

    // ── Insert entry ──
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const { data, error } = await supabase
      .from('pitchside_entries')
      .insert({
        name:            user.name,
        nick:            user.nick,
        instagram,
        email,
        phone,
        final_pick:      finalPick,
        group_picks:     groupPicks,
        r32_picks:       r32Picks,
        r16_picks:       r16Picks,
        qf_picks:        qfPicks,
        sf_picks:        sfPicks,
        entry_time:      entryTime || new Date().toISOString(),
        submitted_at:    new Date().toISOString(),
        fingerprint_hash: fingerprint || null,
        ip_address:      ip,
      })
      .select('id')
      .single();

    if (error) {
      // Catch DB-level unique constraint violations as a safety net
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A duplicate entry was detected. One entry per person.' },
          { status: 409 }
        );
      }
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save your entry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, entryId: data.id });
  } catch (err) {
    console.error('Submit API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
