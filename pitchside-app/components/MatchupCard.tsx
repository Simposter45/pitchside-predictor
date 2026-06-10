'use client';

import { KnockoutMatchup } from '@/types';
import { usePredictionStore } from '@/lib/store';

type RoundKey = 'r32Picks' | 'r16Picks' | 'qfPicks' | 'sfPicks';

interface MatchupCardProps {
  matchup: KnockoutMatchup;
  roundKey: RoundKey;
  roundLabel: string;
}

export default function MatchupCard({ matchup, roundKey, roundLabel }: MatchupCardProps) {
  const { setKnockoutPick } = usePredictionStore();
  const picks = usePredictionStore((s) => s[roundKey]);
  const picked = picks[matchup.id];

  const tbd1 = matchup.team1 === 'TBD';
  const tbd2 = matchup.team2 === 'TBD';

  return (
    <div className="matchup-card">
      <div className="matchup-top">
        {roundLabel} · {matchup.label}
      </div>
      <div
        className={`matchup-team ${picked === matchup.team1 ? 'picked' : ''} ${tbd1 ? 'tbd' : ''}`}
        onClick={() => !tbd1 && setKnockoutPick(roundKey, matchup.id, matchup.team1)}
      >
        <span className="flag">{matchup.flag1}</span>
        <span className="name">{matchup.team1}</span>
        <span className="checkmark">✓</span>
      </div>
      <div
        className={`matchup-team ${picked === matchup.team2 ? 'picked' : ''} ${tbd2 ? 'tbd' : ''}`}
        onClick={() => !tbd2 && setKnockoutPick(roundKey, matchup.id, matchup.team2)}
      >
        <span className="flag">{matchup.flag2}</span>
        <span className="name">{matchup.team2}</span>
        <span className="checkmark">✓</span>
      </div>
    </div>
  );
}
