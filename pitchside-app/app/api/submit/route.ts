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

const DISPOSABLE_DOMAINS = [
  'yopmail.com', 'mailinator.com', 'tempmail.com', '10minutemail.com',
  'guerrillamail.com', 'throwawaymail.com', 'temp-mail.org', 'tempmail.net',
  'sharklasers.com', 'grr.la', 'mail.ru'
];

// ─── POST /api/submit ───────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user,
      groupPicks,
      thirdPicks,
      r32Picks,
      r16Picks,
      qfPicks,
      sfPicks,
      finalPick,
      entryTime,
      fingerprint,
    } = body;

    // ── Pre-process fields ──
    let email     = user?.email ? user.email.toLowerCase().trim() : '';
    let phone     = user?.phone ? normalizePhone(user.phone) : '';
    let instagram = user?.insta ? normalizeInstagram(user.insta) : '';
    let nick      = user?.nick ? user.nick.trim() : '';
    let fp        = fingerprint;

    // ── TESTING BYPASS ──
    const isTestBypass = process.env.NODE_ENV === 'development' && nick.toUpperCase() === 'TESTER99';
    
    if (isTestBypass) {
      const ts = Date.now().toString();
      email = `test_${ts}@pitchside.com`;
      phone = `+91000${ts.slice(-7)}`;
      instagram = `test_${ts}`;
      nick = `TESTER99_${ts}`;
      if (fp) fp = `${fp}_${ts}`;
    }

    // ── Basic field validation ──
    if (!isTestBypass && (!email || !nick || !phone || !instagram)) {
      return NextResponse.json({ error: 'Missing required contact fields.' }, { status: 400 });
    }
    if (!finalPick) {
      return NextResponse.json({ error: 'Missing required final pick.' }, { status: 400 });
    }

    // ── Disposable Email Check ──
    const emailDomain = email.split('@')[1];
    if (!isTestBypass && DISPOSABLE_DOMAINS.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a real, permanent email address. Disposable emails are not allowed.' },
        { status: 400 }
      );
    }

    // ── Phone validation ──
    if (!phone.startsWith('+')) {
      return NextResponse.json(
        { error: 'Phone number must include your country code (e.g. +91 for India).' },
        { status: 400 }
      );
    }
    
    // Extract just the digits after the plus sign
    const justDigits = phone.substring(1);
    
    // In our frontend, we combined +XX with the input. We want the user input part to be 10 digits exactly.
    // However, some country codes are 1, 2, or 3 digits. 
    // To strictly enforce 10 digits for the local part, we could check user.phone from the frontend payload.
    // The frontend sends user.phone as `+919876543210`.
    // It's safer to rely on the frontend validation for the exact 10 digit requirement, 
    // but we can add a basic length check. (Must be at least 11 total digits including country code).
    if (justDigits.length < 11 || justDigits.length > 14) {
       return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number with your country code.' },
        { status: 400 }
      );
    }

    // ── Instagram strict regex ──
    if (!/^[a-zA-Z0-9._]{1,30}$/.test(instagram)) {
      return NextResponse.json(
        { error: 'Please enter a valid Instagram handle (letters, numbers, periods, underscores).' },
        { status: 400 }
      );
    }

    // ── Duplicate checks — run all in parallel for speed ──
    let emailCheck: any = { data: null };
    let phoneCheck: any = { data: null };
    let instaCheck: any = { data: null };
    let nickCheck: any = { data: null };
    let fingerprintCheck: any = { data: null };

    if (!isTestBypass) {
      const results = await Promise.all([
        supabase.from('pitchside_entries').select('id').eq('email', email).maybeSingle(),
        supabase.from('pitchside_entries').select('id').eq('phone', phone).maybeSingle(),
        supabase.from('pitchside_entries').select('id').eq('instagram', instagram).maybeSingle(),
        supabase.from('pitchside_entries').select('id').ilike('nick', nick).maybeSingle(),
        fp
          ? supabase.from('pitchside_entries').select('id').eq('fingerprint_hash', fp).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      [emailCheck, phoneCheck, instaCheck, nickCheck, fingerprintCheck] = results;
    }

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
    if (nickCheck.data) {
      return NextResponse.json(
        { error: 'This nickname is already taken. Please choose another one.' },
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
        name:            user.name || nick,
        nick:            nick,
        instagram,
        email,
        phone,
        final_pick:      finalPick,
        group_picks:     groupPicks,
        third_picks:     thirdPicks || {},
        r32_picks:       r32Picks,
        r16_picks:       r16Picks,
        qf_picks:        qfPicks,
        sf_picks:        sfPicks,
        entry_time:      typeof entryTime === 'number' ? new Date(entryTime).toISOString() : (entryTime || new Date().toISOString()),
        submitted_at:    new Date().toISOString(),
        fingerprint_hash: fp || null,
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
