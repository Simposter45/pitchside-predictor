'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
  const { groupPicks, thirdPicks, r32Picks, r16Picks, qfPicks, sfPicks, user } = usePredictionStore();

  const prevR32Count = useRef(Object.keys(r32Picks).length);
  const prevR16Count = useRef(Object.keys(r16Picks).length);
  const prevQfCount = useRef(Object.keys(qfPicks).length);
  
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 1. All hooks must be called at the top level
  useEffect(() => {
    if (!user) {
      router.replace('/register');
    }
  }, [user, router]);

  useEffect(() => {
    const r32C = Object.keys(r32Picks).length;
    if (r32C === 16 && prevR32Count.current < 16) {
      setTimeout(() => colRefs.current[1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 300);
    }
    prevR32Count.current = r32C;

    const r16C = Object.keys(r16Picks).length;
    if (r16C === 8 && prevR16Count.current < 8) {
      setTimeout(() => colRefs.current[2]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 300);
    }
    prevR16Count.current = r16C;

    const qfC = Object.keys(qfPicks).length;
    if (qfC === 4 && prevQfCount.current < 4) {
      setTimeout(() => colRefs.current[3]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }), 300);
    }
    prevQfCount.current = qfC;
  }, [r32Picks, r16Picks, qfPicks]);

  // 2. Early return AFTER hooks
  if (!user) {
    return null;
  }

  const { r32, r16, qf, sf } = buildAllKnockoutRounds(groupPicks, thirdPicks, r32Picks, r16Picks, qfPicks);

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
        <ProgressBar step={3} />
      </div>

      <div className="horizontal-bracket-container">
        {rounds.map(({ label, matchups, key }, i) => (
          <div key={key} className="bracket-column" ref={(el) => { colRefs.current[i] = el; }}>
            <div className="round-label sticky-top">{label}</div>
            <div className="bracket-matches">
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
