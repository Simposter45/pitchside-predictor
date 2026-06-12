import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = 'https://lrvoozapyzupkduwvsrt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxydm9vemFweXp1cGtkdXd2c3J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTExMTI0OCwiZXhwIjoyMDk2Njg3MjQ4fQ.KnSMObJdSEnkt-MuA6KPSahD1tqV2eQTPfx2-SLLKus';

const supabase = createClient(supabaseUrl, supabaseKey);

const WC_GROUPS = [
  { name: 'A', teams: [{ f: 'mx', n: 'Mexico', r: 15 }, { f: 'za', n: 'South Africa', r: 60 }, { f: 'kr', n: 'South Korea', r: 23 }, { f: 'cz', n: 'Czechia', r: 36 }] },
  { name: 'B', teams: [{ f: 'ca', n: 'Canada', r: 40 }, { f: 'ba', n: 'Bosnia-Herz.', r: 55 }, { f: 'qa', n: 'Qatar', r: 34 }, { f: 'ch', n: 'Switzerland', r: 19 }] },
  { name: 'C', teams: [{ f: 'br', n: 'Brazil', r: 5 }, { f: 'ma', n: 'Morocco', r: 13 }, { f: 'ht', n: 'Haiti', r: 89 }, { f: 'gb-sct', n: 'Scotland', r: 39 }] },
  { name: 'D', teams: [{ f: 'us', n: 'USA', r: 11 }, { f: 'py', n: 'Paraguay', r: 56 }, { f: 'au', n: 'Australia', r: 24 }, { f: 'tr', n: 'Türkiye', r: 40 }] },
  { name: 'E', teams: [{ f: 'de', n: 'Germany', r: 16 }, { f: 'cw', n: 'Curaçao', r: 90 }, { f: 'ci', n: 'Ivory Coast', r: 38 }, { f: 'ec', n: 'Ecuador', r: 31 }] },
  { name: 'F', teams: [{ f: 'nl', n: 'Netherlands', r: 7 }, { f: 'jp', n: 'Japan', r: 18 }, { f: 'se', n: 'Sweden', r: 26 }, { f: 'tn', n: 'Tunisia', r: 41 }] },
  { name: 'G', teams: [{ f: 'be', n: 'Belgium', r: 3 }, { f: 'eg', n: 'Egypt', r: 36 }, { f: 'ir', n: 'Iran', r: 20 }, { f: 'nz', n: 'New Zealand', r: 104 }] },
  { name: 'H', teams: [{ f: 'es', n: 'Spain', r: 8 }, { f: 'cv', n: 'Cape Verde', r: 65 }, { f: 'sa', n: 'Saudi Arabia', r: 53 }, { f: 'uy', n: 'Uruguay', r: 15 }] },
  { name: 'I', teams: [{ f: 'fr', n: 'France', r: 2 }, { f: 'sn', n: 'Senegal', r: 17 }, { f: 'iq', n: 'Iraq', r: 58 }, { f: 'no', n: 'Norway', r: 47 }] },
  { name: 'J', teams: [{ f: 'ar', n: 'Argentina', r: 1 }, { f: 'dz', n: 'Algeria', r: 43 }, { f: 'at', n: 'Austria', r: 25 }, { f: 'jo', n: 'Jordan', r: 71 }] },
  { name: 'K', teams: [{ f: 'pt', n: 'Portugal', r: 6 }, { f: 'cd', n: 'Congo', r: 60 }, { f: 'uz', n: 'Uzbekistan', r: 64 }, { f: 'co', n: 'Colombia', r: 14 }] },
  { name: 'L', teams: [{ f: 'gb-eng', n: 'England', r: 4 }, { f: 'hr', n: 'Croatia', r: 10 }, { f: 'gh', n: 'Ghana', r: 68 }, { f: 'pa', n: 'Panama', r: 44 }] },
];

function buildR32Matchups(groupPicks, thirdPicks) {
  const w = (gName) => groupPicks[gName]?.[0] || 'TBD';
  const r = (gName) => groupPicks[gName]?.[1] || 'TBD';
  const t = (i) => thirdPicks[i] || 'TBD';

  return [
    { id: 'r32_0', t1: r('A'), t2: r('B') },
    { id: 'r32_1', t1: w('E'), t2: t(0) },
    { id: 'r32_2', t1: w('C'), t2: r('F') },
    { id: 'r32_3', t1: r('E'), t2: r('I') },
    { id: 'r32_4', t1: w('H'), t2: r('J') },
    { id: 'r32_5', t1: r('K'), t2: r('L') },
    { id: 'r32_6', t1: w('G'), t2: t(1) },
    { id: 'r32_7', t1: w('D'), t2: t(2) },
    { id: 'r32_8', t1: w('F'), t2: r('C') },
    { id: 'r32_9', t1: w('I'), t2: t(3) },
    { id: 'r32_10', t1: w('A'), t2: t(4) },
    { id: 'r32_11', t1: w('L'), t2: t(5) },
    { id: 'r32_12', t1: r('D'), t2: r('G') },
    { id: 'r32_13', t1: w('K'), t2: t(6) },
    { id: 'r32_14', t1: w('B'), t2: t(7) },
    { id: 'r32_15', t1: w('J'), t2: r('H') },
  ];
}

function buildNextRound(prevPicks, prevMatchups, count, prefix) {
  const matchups = [];
  for (let i = 0; i < count / 2; i++) {
    const m1 = prevMatchups[i * 2];
    const m2 = prevMatchups[i * 2 + 1];
    const t1 = prevPicks[m1.id] || 'TBD';
    const t2 = prevPicks[m2.id] || 'TBD';
    matchups.push({ id: `${prefix}_${i}`, t1, t2 });
  }
  return matchups;
}

const hypedTeams = ['Argentina', 'Portugal', 'France', 'Brazil', 'England', 'Spain', 'Germany', 'Belgium'];

function pickWinner(t1, t2, nick) {
  // Hardcoded fan loyalties
  if (nick === 'messi_magic') {
    if (t1 === 'Argentina') return t1;
    if (t2 === 'Argentina') return t2;
  }
  if (nick === 'cr7_goat') {
    if (t1 === 'Portugal') return t1;
    if (t2 === 'Portugal') return t2;
  }

  const isT1Hyped = hypedTeams.includes(t1);
  const isT2Hyped = hypedTeams.includes(t2);

  if (isT1Hyped && !isT2Hyped) return Math.random() > 0.35 ? t1 : t2;
  if (!isT1Hyped && isT2Hyped) return Math.random() > 0.35 ? t2 : t1;
  return Math.random() > 0.5 ? t1 : t2;
}

const realNames = ["John Doe", "Jane Smith", "Alex Johnson", "Sam Williams", "Chris Brown", "Mike Miller", "Sarah Wilson", "David Moore", "Emily Taylor", "Tom Anderson"];
const userNicknames = ["striker99", "cr7_goat", "messi_magic", "footyfan24", "pitchside_pro", "goalmachine", "the_tactician", "ballondor_winner", "offside_trap", "goldenboot10"];
const instagrams = ["@john_d_199", "@jane_smith_fit", "@alexj_football", "@sam_w_fc", "@cbrown_sports", "@mike_m_official", "@sarahw_10", "@d_moore_kicks", "@em_taylor99", "@tom_a_soccer"];

function generateEntry(index) {
  const name = realNames[index % realNames.length];
  const nick = userNicknames[index % userNicknames.length];
  const instagram = instagrams[index % instagrams.length];
  
  const randomSuffix = Math.random().toString(36).substring(2, 5);
  const email = `${nick.replace('_', '')}${randomSuffix}@example.com`;
  const phone = `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  
  const groupPicks = {};
  const allThirds = [];
  WC_GROUPS.forEach(g => {
    const teams = [...g.teams].sort(() => 0.5 - Math.random());
    const hypedInGroup = teams.filter(t => hypedTeams.includes(t.n));
    
    let winner, others;

    if (nick === 'messi_magic' && teams.some(t => t.n === 'Argentina')) {
      winner = 'Argentina';
      others = teams.filter(t => t.n !== winner).map(t => t.n);
    } else if (nick === 'cr7_goat' && teams.some(t => t.n === 'Portugal')) {
      winner = 'Portugal';
      others = teams.filter(t => t.n !== winner).map(t => t.n);
    } else if (hypedInGroup.length > 0 && Math.random() > 0.2) {
      winner = hypedInGroup[0].n;
      others = teams.filter(t => t.n !== winner).map(t => t.n);
    } else {
      winner = teams[0].n;
      others = [teams[1].n, teams[2].n];
    }

    groupPicks[g.name] = [winner, others[0], others[1]];
    allThirds.push(others[1]);
  });

  const thirdPicks = allThirds.sort(() => 0.5 - Math.random()).slice(0, 8);

  const r32Matchups = buildR32Matchups(groupPicks, thirdPicks);
  const r32Picks = {};
  r32Matchups.forEach(m => { r32Picks[m.id] = pickWinner(m.t1, m.t2, nick); });

  const r16Matchups = buildNextRound(r32Picks, r32Matchups, 16, 'r16');
  const r16Picks = {};
  r16Matchups.forEach(m => { r16Picks[m.id] = pickWinner(m.t1, m.t2, nick); });

  const qfMatchups = buildNextRound(r16Picks, r16Matchups, 8, 'qf');
  const qfPicks = {};
  qfMatchups.forEach(m => { qfPicks[m.id] = pickWinner(m.t1, m.t2, nick); });

  const sfMatchups = buildNextRound(qfPicks, qfMatchups, 4, 'sf');
  const sfPicks = {};
  sfMatchups.forEach(m => { sfPicks[m.id] = pickWinner(m.t1, m.t2, nick); });

  const finalMatchups = buildNextRound(sfPicks, sfMatchups, 2, 'final');
  const finalPick = pickWinner(finalMatchups[0].t1, finalMatchups[0].t2, nick);

  // Generate staggered random times within the last 48 hours
  const baseTime = new Date().getTime();
  const msToSubtract = Math.floor(Math.random() * (48 * 60 * 60 * 1000 - 10 * 60 * 1000)) + 10 * 60 * 1000;
  const entryTime = new Date(baseTime - msToSubtract).toISOString();
  // submitted_at is between 2 to 8 minutes after entry time
  const submitOffset = Math.floor(Math.random() * (6 * 60 * 1000)) + 2 * 60 * 1000;
  const submitTime = new Date(baseTime - msToSubtract + submitOffset).toISOString();

  return {
    name, nick, instagram, email, phone,
    group_picks: groupPicks, third_picks: thirdPicks,
    r32_picks: r32Picks, r16_picks: r16Picks, qf_picks: qfPicks, sf_picks: sfPicks,
    final_pick: finalPick,
    entry_time: entryTime,
    submitted_at: submitTime,
    created_at: submitTime,
    fingerprint_hash: crypto.randomBytes(16).toString('hex')
  };
}

async function run() {
  console.log('Carefully deleting only test entries ending in @example.com...');
  // This ensures we NEVER delete PITCHSIDE_TV or any other real user
  const { error: delError } = await supabase.from('pitchside_entries').delete().like('email', '%@example.com');
  
  if (delError) {
    console.error('Error deleting test data:', delError);
    return;
  }

  const numberOfEntries = 9;
  const entries = Array.from({length: numberOfEntries}, (_, i) => generateEntry(i));
  
  const { error } = await supabase.from('pitchside_entries').insert(entries);
  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log(`Successfully inserted ${numberOfEntries} updated fake entries!`);
  }
}

run();
