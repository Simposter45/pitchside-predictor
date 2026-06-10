'use client';

import { Group } from '@/types';
import { usePredictionStore } from '@/lib/store';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { groupPicks, setGroupPick } = usePredictionStore();
  const picks = groupPicks[group.name] || [];

  return (
    <div className="group-card">
      <div className="group-card-header">
        <div className="group-name">Group {group.name}</div>
        <div className="group-instruction">{picks.length}/2 through</div>
      </div>

      {group.teams.map((team) => {
        const isWinner = picks[0] === team.n;
        const isRunnerup = picks[1] === team.n;
        const pickClass = isWinner ? 'winner' : isRunnerup ? 'selected' : '';

        return (
          <div
            key={team.n}
            className="team-row"
            onClick={() => setGroupPick(group.name, team.n)}
          >
            <span className="team-flag">{team.f}</span>
            <span className="team-name">{team.n}</span>
            {team.r && <span className="team-rank">#{team.r}</span>}
            <div className={`team-pick ${pickClass}`}>
              {isWinner ? '★' : isRunnerup ? '✓' : ''}
            </div>
          </div>
        );
      })}

      <div className="pick-label">
        {picks[0] ? (
          <>
            <span style={{ color: 'var(--gold)' }}>★ {picks[0]}</span>
            {picks[1] && (
              <> · <span style={{ color: 'var(--blue)' }}>✓ {picks[1]}</span></>
            )}
          </>
        ) : (
          <span style={{ color: 'var(--gray)' }}>Pick group winner first</span>
        )}
      </div>
    </div>
  );
}
