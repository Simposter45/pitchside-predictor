import { Group, KnockoutMatchup } from '@/types';

export const WC_GROUPS: Group[] = [
  { name: 'A', teams: [{ f: '🇲🇽', n: 'Mexico', r: 15 }, { f: '🇿🇦', n: 'South Africa', r: 60 }, { f: '🇰🇷', n: 'South Korea', r: 23 }, { f: '🏴', n: 'Playoff W', r: null }] },
  { name: 'B', teams: [{ f: '🇨🇦', n: 'Canada', r: 40 }, { f: '🇧🇦', n: 'Bosnia-Herz.', r: 55 }, { f: '🇲🇦', n: 'Morocco', r: 14 }, { f: '🇺🇾', n: 'Playoff W', r: null }] },
  { name: 'C', teams: [{ f: '🇩🇪', n: 'Germany', r: 12 }, { f: '🇨🇼', n: 'Curaçao', r: 83 }, { f: '🇨🇮', n: "Côte d'Ivoire", r: 30 }, { f: '🇪🇨', n: 'Ecuador', r: 35 }] },
  { name: 'D', teams: [{ f: '🇺🇸', n: 'USA', r: 11 }, { f: '🇵🇾', n: 'Paraguay', r: 63 }, { f: '🇦🇺', n: 'Australia', r: 24 }, { f: '🏴', n: 'Playoff W', r: null }] },
  { name: 'E', teams: [{ f: '🇫🇷', n: 'France', r: 2 }, { f: '🇸🇳', n: 'Senegal', r: 18 }, { f: '🇳🇴', n: 'Norway', r: 34 }, { f: '🏴', n: 'Playoff W', r: null }] },
  { name: 'F', teams: [{ f: '🇳🇱', n: 'Netherlands', r: 7 }, { f: '🇯🇵', n: 'Japan', r: 17 }, { f: '🇹🇳', n: 'Tunisia', r: 32 }, { f: '🏴', n: 'Playoff W', r: null }] },
  { name: 'G', teams: [{ f: '🇧🇪', n: 'Belgium', r: 3 }, { f: '🇪🇬', n: 'Egypt', r: 36 }, { f: '🇮🇷', n: 'Iran', r: 22 }, { f: '🇳🇿', n: 'New Zealand', r: 85 }] },
  { name: 'H', teams: [{ f: '🇪🇸', n: 'Spain', r: 6 }, { f: '🇨🇻', n: 'Cape Verde', r: 71 }, { f: '🇸🇦', n: 'Saudi Arabia', r: 56 }, { f: '🇺🇾', n: 'Uruguay', r: 20 }] },
  { name: 'I', teams: [{ f: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', n: 'England', r: 5 }, { f: '🇭🇷', n: 'Croatia', r: 10 }, { f: '🇬🇭', n: 'Ghana', r: 60 }, { f: '🇵🇦', n: 'Panama', r: 72 }] },
  { name: 'J', teams: [{ f: '🇦🇷', n: 'Argentina', r: 1 }, { f: '🇩🇿', n: 'Algeria', r: 41 }, { f: '🇦🇹', n: 'Austria', r: 25 }, { f: '🇯🇴', n: 'Jordan', r: 88 }] },
  { name: 'K', teams: [{ f: '🇵🇹', n: 'Portugal', r: 8 }, { f: '🇺🇿', n: 'Uzbekistan', r: 68 }, { f: '🇨🇴', n: 'Colombia', r: 27 }, { f: '🏴', n: 'Playoff W', r: null }] },
  { name: 'L', teams: [{ f: '🇧🇷', n: 'Brazil', r: 4 }, { f: '🇲🇽', n: 'Mexico 2', r: 15 }, { f: '🇨🇱', n: 'Chile', r: 45 }, { f: '🇵🇪', n: 'Peru', r: 52 }] },
];

export function getFlag(name: string): string {
  for (const g of WC_GROUPS) {
    for (const t of g.teams) {
      if (t.n === name) return t.f;
    }
  }
  return '🏴';
}

export function getGroupAdvancers(groupPicks: Record<string, string[]>) {
  return WC_GROUPS.map((g) => ({
    group: g.name,
    winner: groupPicks[g.name]?.[0] || 'TBD',
    runnerup: groupPicks[g.name]?.[1] || 'TBD',
  }));
}

export function buildR32Matchups(groupPicks: Record<string, string[]>): KnockoutMatchup[] {
  const a = getGroupAdvancers(groupPicks);
  const pairs: [string, string][] = [
    ['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'],
    ['I', 'J'], ['K', 'L'], ['A', 'C'], ['B', 'D'],
    ['E', 'G'], ['F', 'H'], ['I', 'K'], ['J', 'L'],
    ['A', 'D'], ['B', 'C'], ['E', 'H'], ['F', 'G'],
  ];
  return pairs.map((pair, i) => {
    const g1 = a.find((x) => x.group === pair[0]);
    const g2 = a.find((x) => x.group === pair[1]);
    const t1 = g1?.winner || 'TBD';
    const t2 = g2?.runnerup || 'TBD';
    return { id: `r32_${i}`, label: `Match ${i + 1}`, team1: t1, team2: t2, flag1: getFlag(t1), flag2: getFlag(t2) };
  });
}

export function buildNextRound(
  prevPicks: Record<string, string>,
  prevMatchups: KnockoutMatchup[],
  count: number,
  prefix: string
): KnockoutMatchup[] {
  const matchups: KnockoutMatchup[] = [];
  for (let i = 0; i < count / 2; i++) {
    const m1 = prevMatchups[i * 2];
    const m2 = prevMatchups[i * 2 + 1];
    const t1 = prevPicks[m1?.id] || 'TBD';
    const t2 = prevPicks[m2?.id] || 'TBD';
    matchups.push({ id: `${prefix}_${i}`, label: `Match ${i + 1}`, team1: t1, team2: t2, flag1: getFlag(t1), flag2: getFlag(t2) });
  }
  return matchups;
}

export function buildAllKnockoutRounds(
  groupPicks: Record<string, string[]>,
  r32Picks: Record<string, string>,
  r16Picks: Record<string, string>,
  qfPicks: Record<string, string>
) {
  const r32 = buildR32Matchups(groupPicks);
  const r16 = buildNextRound(r32Picks, r32, 16, 'r16');
  const qf = buildNextRound(r16Picks, r16, 8, 'qf');
  const sf = buildNextRound(qfPicks, qf, 4, 'sf');
  return { r32, r16, qf, sf };
}
