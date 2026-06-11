import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-().]/g, '');
}

function normalizeInstagram(handle: string): string {
  return handle.toLowerCase().replace(/^@/, '').trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { email, phone, instagram, nick, fingerprint } = body;

    email = email ? email.toLowerCase().trim() : '';
    phone = phone ? normalizePhone(phone) : '';
    instagram = instagram ? normalizeInstagram(instagram) : '';
    nick = nick ? nick.trim() : '';
    let fp = fingerprint;

    const isTestBypass = process.env.NODE_ENV === 'development' && nick.toUpperCase() === 'TESTER99';
    
    if (isTestBypass) {
      return NextResponse.json({ success: true });
    }

    if (!email || !nick || !phone || !instagram) {
      return NextResponse.json({ error: 'Missing required contact fields.' }, { status: 400 });
    }

    const results = await Promise.all([
      supabase.from('pitchside_entries').select('id').eq('email', email).maybeSingle(),
      supabase.from('pitchside_entries').select('id').eq('phone', phone).maybeSingle(),
      supabase.from('pitchside_entries').select('id').eq('instagram', instagram).maybeSingle(),
      supabase.from('pitchside_entries').select('id').ilike('nick', nick).maybeSingle(),
      fp
        ? supabase.from('pitchside_entries').select('id').eq('fingerprint_hash', fp).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    const [emailCheck, phoneCheck, instaCheck, nickCheck, fingerprintCheck] = results;

    if (emailCheck.data) {
      return NextResponse.json({ error: 'An entry with this email already exists. One entry per person.' }, { status: 409 });
    }
    if (phoneCheck.data) {
      return NextResponse.json({ error: 'An entry with this phone number already exists. One entry per person.' }, { status: 409 });
    }
    if (instaCheck.data) {
      return NextResponse.json({ error: 'An entry with this Instagram handle already exists. One entry per person.' }, { status: 409 });
    }
    if (nickCheck.data) {
      return NextResponse.json({ error: 'This nickname is already taken. Please choose another one.' }, { status: 409 });
    }
    if (fingerprintCheck.data) {
      return NextResponse.json({ error: 'An entry from this device has already been submitted. One entry per person.' }, { status: 409 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Check duplicate API error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
