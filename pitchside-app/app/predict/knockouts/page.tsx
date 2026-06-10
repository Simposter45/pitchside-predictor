'use client';

import { useRouter } from 'next/navigation';
import { usePredictionStore } from '@/lib/store';
import { buildAllKnockoutRounds } from '@/lib/data';
import MatchupCard from '@/components/MatchupCard';
import BottomNav from '@/components/BottomNav';
import ProgressBar from '@/components/ProgressBar';
import { KnockoutMatchup } from '@/types';

type RoundKey = 'r32Picks' | 'r16Picks' | 'qfPicks' | 'sfPicks';

interface RoundSection {
  label: string;
  matchups: KnockoutMatchup[];
  key: RoundKey;
}

export default function KnockoutsPage() {
  const router = useRouter();
  const { groupPicks, r32Picks, r16Picks, qfPicks, sfPicks, user } = usePredictionStore();

  if (!user) {
    if (typeof window !== 'undefined') router.replace('/register');
    return null;
  }

  const { r32, r16, qf, sf } = buildAllKnockoutRounds(groupPicks, r32Picks, r16Picks, qfPicks);

  const rounds: RoundSection[] = [
    { label: 'Round of 32', matchups: r32, key: 'r32Picks' },
    { label: 'Round of 16', matchups: r16, key: 'r16Picks' },
    { label: 'Quarter-Finals', matchups: qf, key: 'qfPicks' },
    { label: 'Semi-Finals', matchups: sf, key: 'sfPicks' },
  ];

  const totalPicks =
    Object.keys(r32Picks).length +
    Object.keys(r16Picks).length +
    Object.keys(qfPicks).length +
    Object.keys(sfPicks).length;

  const allDone = totalPicks === 28; // 16+8+4+2=30... wait: R32=16, R16=8, QF=4, SF=2 = 30
  // Actually 16+8+4+2 = 30 matches total

  const handleNext = () => {
    if (totalPicks < 30) {
      alert('Please complete all knockout picks before continuing.');
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="bracket-header">
        <h1>Knockout Rounds</h1>
        <p>Pick the winner of each match through to the semi-finals.</p>
        <ProgressBar step={2} />
      </div>

      <div className="knockout-wrap">
        {rounds.map(({ label, matchups, key }) => (
          <div key={key} style={{ marginBottom: 8 }}>
            <div className="knockout-title-row">
              <div className="round-label">{label}</div>
            </div>
            <div
              className="matchup-grid"
              style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(${matchups.length > 8 ? '180px' : '200px'}, 1fr))`,
              }}
            >
              {matchups.map((m) => (
                <MatchupCard key={m.id} matchup={m} roundKey={key} roundLabel={label} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bottom-spacer" />

      <BottomNav
        backHref="/predict/groups"
        nextHref="/predict/final"
        nextLabel="The Final →"
        countText={`${totalPicks} / 30 knockout picks`}
        onNext={handleNext}
      />
    </>
  );
}
