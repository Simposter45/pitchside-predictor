'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePredictionStore } from '@/lib/store';
import { WC_GROUPS } from '@/lib/data';
import GroupCard from '@/components/GroupCard';
import BottomNav from '@/components/BottomNav';
import ProgressBar from '@/components/ProgressBar';

export default function GroupsPage() {
  const router = useRouter();
  const { groupPicks, user } = usePredictionStore();

  // Guard: must have registered
  useEffect(() => {
    if (!user) {
      router.replace('/register');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const totalPicked = Object.values(groupPicks).reduce((acc, picks) => acc + picks.length, 0);

  const handleNext = () => {
    const allGroupsDone = WC_GROUPS.every((g) => (groupPicks[g.name] || []).length === 3);
    if (!allGroupsDone) {
      alert(`Please pick 3 teams (1st, 2nd, and 3rd place) from all ${WC_GROUPS.length} groups before continuing.`);
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="bracket-header">
        <h1>Group Stage Picks</h1>
        <p>Pick 3 teams from every group — 1st, 2nd, and 3rd place. The 8 best 3rd-place teams advance to the Round of 32.</p>
        <ProgressBar step={1} />
      </div>

      <div className="groups-grid">
        {WC_GROUPS.map((group) => (
          <GroupCard key={group.name} group={group} />
        ))}
      </div>

      <div className="bottom-spacer" />

      <BottomNav
        hideBack
        nextHref="/predict/thirds"
        nextLabel="Pick 3rd Place Teams →"
        countText={`${totalPicked} / 36 teams picked`}
        onNext={handleNext}
      />
    </>
  );
}
