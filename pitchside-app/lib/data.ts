import { Group, KnockoutMatchup } from '@/types';

export const WC_GROUPS: Group[] = [
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

export function getFlag(name: string): string {
  for (const g of WC_GROUPS) {
    for (const t of g.teams) {
      if (t.n === name) return t.f;
    }
  }
  return 'un'; // United Nations / generic flag fallback for TBD
}

export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode === 'un') return '🏳️';
  if (countryCode === 'gb-eng') return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
  if (countryCode === 'gb-wls') return '🏴󠁧󠁢󠁷󠁬󠁳󠁿';
  if (countryCode === 'gb-sct') return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function getGroupAdvancers(groupPicks: Record<string, string[]>) {
  return WC_GROUPS.map((g) => ({
    group: g.name,
    winner: groupPicks[g.name]?.[0] || 'TBD',
    runnerup: groupPicks[g.name]?.[1] || 'TBD',
  }));
}

export function buildR32Matchups(groupPicks: Record<string, string[]>, thirdPicks: string[]): KnockoutMatchup[] {
  const w = (gName: string) => groupPicks[gName]?.[0] || 'TBD';
  const r = (gName: string) => groupPicks[gName]?.[1] || 'TBD';
  const t = (i: number) => thirdPicks[i] || 'TBD';

  const matchups = [
    // Top Half - QF1
    { t1: r('A'), t2: r('B') }, // 73
    { t1: w('E'), t2: t(0) },   // 75
    { t1: w('C'), t2: r('F') }, // 74
    { t1: r('E'), t2: r('I') }, // 77
    // Top Half - QF2
    { t1: w('H'), t2: r('J') }, // 83
    { t1: r('K'), t2: r('L') }, // 84
    { t1: w('G'), t2: t(1) },   // 81
    { t1: w('D'), t2: t(2) },   // 82
    // Bottom Half - QF3
    { t1: w('F'), t2: r('C') }, // 76
    { t1: w('I'), t2: t(3) },   // 78
    { t1: w('A'), t2: t(4) },   // 79
    { t1: w('L'), t2: t(5) },   // 80
    // Bottom Half - QF4
    { t1: r('D'), t2: r('G') }, // 86
    { t1: w('K'), t2: t(6) },   // 88
    { t1: w('B'), t2: t(7) },   // 85
    { t1: w('J'), t2: r('H') }, // 87
  ];

  const r32Dates = [
    'Jun 28', 'Jun 30', 'Jun 29', 'Jul 2',
    'Jul 1', 'Jul 2', 'Jul 1', 'Jul 2',
    'Jun 29', 'Jun 30', 'Jun 30', 'Jul 1',
    'Jul 3', 'Jul 3', 'Jul 2', 'Jul 3',
  ];

  return matchups.map((m, i) => ({
    id: `r32_${i}`,
    label: r32Dates[i],
    team1: m.t1,
    team2: m.t2,
    flag1: getFlag(m.t1),
    flag2: getFlag(m.t2),
  }));
}

export function buildNextRound(
  prevPicks: Record<string, string>,
  prevMatchups: KnockoutMatchup[],
  count: number,
  prefix: string,
  dates: string[]
): KnockoutMatchup[] {
  const matchups: KnockoutMatchup[] = [];
  for (let i = 0; i < count / 2; i++) {
    const m1 = prevMatchups[i * 2];
    const m2 = prevMatchups[i * 2 + 1];
    const t1 = prevPicks[m1?.id] || 'TBD';
    const t2 = prevPicks[m2?.id] || 'TBD';
    matchups.push({ 
      id: `${prefix}_${i}`, 
      label: dates[i] || `Match ${i + 1}`, 
      team1: t1, 
      team2: t2, 
      flag1: getFlag(t1), 
      flag2: getFlag(t2) 
    });
  }
  return matchups;
}

export function buildAllKnockoutRounds(
  groupPicks: Record<string, string[]>,
  thirdPicks: string[],
  r32Picks: Record<string, string>,
  r16Picks: Record<string, string>,
  qfPicks: Record<string, string>
) {
  const r16Dates = ['Jul 4', 'Jul 4', 'Jul 5', 'Jul 5', 'Jul 6', 'Jul 6', 'Jul 7', 'Jul 7'];
  const qfDates = ['Jul 9', 'Jul 10', 'Jul 11', 'Jul 11'];
  const sfDates = ['Jul 14', 'Jul 15'];

  const r32 = buildR32Matchups(groupPicks, thirdPicks);
  const r16 = buildNextRound(r32Picks, r32, 16, 'r16', r16Dates);
  const qf = buildNextRound(r16Picks, r16, 8, 'qf', qfDates);
  const sf = buildNextRound(qfPicks, qf, 4, 'sf', sfDates);
  return { r32, r16, qf, sf };
}
