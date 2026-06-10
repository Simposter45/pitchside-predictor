'use client';

import { useRouter } from 'next/navigation';
import { usePredictionStore } from '@/lib/store';
import { WC_GROUPS } from '@/lib/data';
import GroupCard from '@/components/GroupCard';
import BottomNav from '@/components/BottomNav';
import ProgressBar from '@/components/ProgressBar';

export default function GroupsPage() {
  const router = useRouter();
  const { groupPicks, user } = usePredictionStore();

  // Guard: must have registered
  if (!user) {
    if (typeof window !== 'undefined') router.replace('/register');
    return null;
  }

  const totalPicked = Object.values(groupPicks).reduce((acc, picks) => acc + picks.length, 0);
  const allGroupsDone = WC_GROUPS.every((g) => (groupPicks[g.name] || []).length === 2);

  const handleNext = () => {
    if (!allGroupsDone) {
      alert(`Please pick 2 teams from all ${WC_GROUPS.length} groups before continuing.`);
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="bracket-header">
        <h1>Group Stage Picks</h1>
        <p>Select 2 teams to advance from each group. Top pick = group winner.</p>
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
        nextHref="/predict/knockouts"
        nextLabel="Knockout Stage →"
        countText={`${totalPicked} / 24 teams picked`}
        onNext={handleNext}
      />
    </>
  );
}
