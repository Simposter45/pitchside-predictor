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
        <div className="group-instruction">{picks.length}/3 picked</div>
      </div>

      {group.teams.map((team) => {
        const isWinner = picks[0] === team.n;
        const isRunnerup = picks[1] === team.n;
        const isThird = picks[2] === team.n;
        
        let pickClass = '';
        let pickIcon = '';
        if (isWinner) {
          pickClass = 'winner';
          pickIcon = '1';
        } else if (isRunnerup) {
          pickClass = 'selected';
          pickIcon = '2';
        } else if (isThird) {
          pickClass = 'third-place';
          pickIcon = '3';
        }

        return (
          <div
            key={team.n}
            className="team-row"
            onClick={() => setGroupPick(group.name, team.n)}
          >
            <span className="team-flag">
              <img 
                src={`https://flagcdn.com/w40/${team.f}.png`} 
                alt={team.n}
                style={{ width: '20px', borderRadius: '2px', display: 'block' }} 
              />
            </span>
            <span className="team-name">{team.n}</span>
            {team.r && <span className="team-rank">#{team.r}</span>}
            <div className={`team-pick ${pickClass}`}>
              {pickIcon && <div className="number-icon">{pickIcon}</div>}
            </div>
          </div>
        );
      })}

      <div className="pick-label" style={{ fontSize: '13px' }}>
        {picks.length > 0 ? (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {picks[0] && <span style={{ color: 'var(--gold)' }}>1st: {picks[0]}</span>}
            {picks[1] && <span style={{ color: 'var(--blue)' }}>2nd: {picks[1]}</span>}
            {picks[2] && <span style={{ color: 'var(--gray)' }}>3rd: {picks[2]}</span>}
          </div>
        ) : (
          <span style={{ color: 'var(--gray)' }}>Pick 1st place</span>
        )}
      </div>
    </div>
  );
}
