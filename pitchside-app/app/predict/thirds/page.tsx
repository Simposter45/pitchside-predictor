'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePredictionStore } from '@/lib/store';
import { WC_GROUPS, getFlag } from '@/lib/data';
import BottomNav from '@/components/BottomNav';
import ProgressBar from '@/components/ProgressBar';

export default function ThirdsPage() {
  const router = useRouter();
  const { groupPicks, thirdPicks, setThirdPick, user } = usePredictionStore();

  useEffect(() => {
    if (!user) {
      router.replace('/register');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // Collect all 3rd place picks from group stage
  const allThirds = WC_GROUPS
    .map((g) => ({
      group: g.name,
      team: groupPicks[g.name]?.[2] || null,
      flag: groupPicks[g.name]?.[2] ? getFlag(groupPicks[g.name][2]) : null,
    }))
    .filter((x) => x.team !== null) as { group: string; team: string; flag: string }[];

  const handleNext = () => {
    if (thirdPicks.length !== 8) {
      alert(`Please select exactly 8 third-place teams to advance. You have selected ${thirdPicks.length}.`);
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="bracket-header">
        <h1>3rd Place Picks</h1>
        <p>Choose 8 of the 12 third-place teams to advance to the Round of 32.</p>
        <ProgressBar step={2} />
      </div>

      <div className="thirds-wrap">
        <div className="thirds-counter">
          <span className={thirdPicks.length === 8 ? 'counter-done' : 'counter-pending'}>
            {thirdPicks.length} / 8 selected
          </span>
          {thirdPicks.length === 8 && (
            <span className="counter-badge">&#10003; Ready!</span>
          )}
        </div>

        <div className="thirds-grid">
          {allThirds.map(({ group, team, flag }) => {
            const isSelected = thirdPicks.includes(team);
            const isFull = !isSelected && thirdPicks.length >= 8;
            return (
              <button
                key={group}
                className={`third-card ${isSelected ? 'third-selected' : ''} ${isFull ? 'third-disabled' : ''}`}
                onClick={() => !isFull && setThirdPick(team)}
                disabled={isFull}
              >
                <div className="third-group-badge">Group {group}</div>
                <img
                  src={`https://flagcdn.com/w80/${flag}.png`}
                  alt={team}
                  className="third-flag-img"
                />
                <div className="third-team-name">{team}</div>
                {isSelected && <div className="third-check">&#10003;</div>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bottom-spacer" />

      <BottomNav
        backHref="/predict/groups"
        nextHref="/predict/knockouts"
        nextLabel="Knockout Stage &#8594;"
        countText={`${thirdPicks.length} / 8 third-place teams selected`}
        onNext={handleNext}
      />
    </>
  );
}
