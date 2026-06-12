'use client';

import { usePredictionStore } from '@/lib/store';
import { getFlag, buildAllKnockoutRounds } from '@/lib/data';

export default function ShareCard() {
  const { user, groupPicks, thirdPicks, r32Picks, r16Picks, qfPicks, sfPicks, finalPick } = usePredictionStore();

  if (!user || !finalPick) return null;

  const { sf } = buildAllKnockoutRounds(groupPicks, thirdPicks, r32Picks, r16Picks, qfPicks);
  const finalists = [sfPicks['sf_0'] || 'TBD', sfPicks['sf_1'] || 'TBD'];

  return (
    <div id="share-card" className="share-card-container">
      <div className="share-card-header">
        <h2 className="font-bebas">{user.nick}'S PATH TO GLORY</h2>
      </div>

      <div className="share-card-body">
        <section className="round-section final-section">
          <h3 className="font-bebas section-title gold-title">THE FINAL</h3>
          <div className="match-card final-match">
            <div className={`team ${finalists[0] === finalPick ? 'winner' : ''}`}>
              <img crossOrigin="anonymous" src={`https://flagcdn.com/w40/${getFlag(finalists[0])}.png`} alt={finalists[0]} />
              <span>{finalists[0]}</span>
            </div>
            <div className="vs">vs</div>
            <div className={`team ${finalists[1] === finalPick ? 'winner' : ''} team-right`}>
              <span>{finalists[1]}</span>
              <img crossOrigin="anonymous" src={`https://flagcdn.com/w40/${getFlag(finalists[1])}.png`} alt={finalists[1]} />
            </div>
          </div>
          
          <div className="champion-reveal">
            <span className="champion-label">Predicted Champion</span>
            <div className="champion-name font-bebas">
              <img crossOrigin="anonymous" src={`https://flagcdn.com/w80/${getFlag(finalPick)}.png`} alt={finalPick} />
              {finalPick}
            </div>
          </div>
        </section>

        <section className="round-section" style={{ marginBottom: 0 }}>
          <h3 className="font-bebas section-title" style={{ fontSize: '18px', marginBottom: '12px' }}>SEMI-FINALS</h3>
          <div className="matches-grid">
            {sf.map((m) => {
              const winner = sfPicks[m.id];
              return (
                <div key={m.id} className="match-card small-match">
                  <div className={`team ${m.team1 === winner ? 'winner' : ''}`}>
                    <img crossOrigin="anonymous" src={`https://flagcdn.com/w40/${getFlag(m.team1)}.png`} alt={m.team1} />
                    <span>{m.team1}</span>
                  </div>
                  <div className="vs">vs</div>
                  <div className={`team ${m.team2 === winner ? 'winner' : ''} team-right`}>
                    <span>{m.team2}</span>
                    <img crossOrigin="anonymous" src={`https://flagcdn.com/w40/${getFlag(m.team2)}.png`} alt={m.team2} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="share-card-footer">
        <div className="branding">
          <span className="brand-logo font-bebas">PITCHSIDE TV</span>
          <span className="brand-url">pitchsidepredictor.com</span>
        </div>
      </div>

      <style jsx>{`
        .share-card-container {
          background: #0f172a; border: 1px solid #1e293b;
          border-radius: 16px; width: 100%; max-width: 480px; margin: 0 auto;
          overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
          color: white; font-family: inherit;
        }
        .share-card-header {
          padding: 24px; border-bottom: 1px solid #1e293b;
          text-align: center; background: #0f172a;
        }
        .share-card-header h2 { margin: 0; font-size: 28px; color: #fff; letter-spacing: 1px; }
        .share-card-body { padding: 24px; }
        .round-section { margin-bottom: 32px; }
        .section-title {
          font-size: 22px; color: #94a3b8; text-align: center;
          margin-bottom: 20px; letter-spacing: 1.5px;
        }
        .gold-title { color: var(--gold); }
        .final-section {
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0) 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 12px; padding: 20px; margin-bottom: 32px;
        }
        .matches-grid { display: flex; flex-direction: column; gap: 10px; }
        .match-card {
          display: flex; align-items: center; justify-content: space-between;
          background: #1e293b; padding: 14px 16px; border-radius: 8px;
          border: 1px solid #334155;
        }
        .final-match { background: rgba(0,0,0,0.3); border-color: rgba(245, 158, 11, 0.3); padding: 16px; }
        .small-match { padding: 10px 12px; }
        .team {
          flex: 1; display: flex; align-items: center; gap: 10px;
          font-size: 14px; color: #94a3b8; font-weight: 500;
        }
        .team-right { justify-content: flex-end; }
        .team img { width: 24px; height: 16px; object-fit: cover; border-radius: 3px; opacity: 0.5; }
        .team.winner { color: #fff; font-weight: 700; }
        .team.winner img { opacity: 1; box-shadow: 0 0 8px rgba(255,255,255,0.1); }
        .vs {
          color: #64748b; font-size: 12px; font-weight: 700;
          text-transform: uppercase; margin: 0 12px;
        }
        .champion-reveal {
          margin-top: 20px; padding-top: 20px;
          border-top: 1px dashed rgba(245, 158, 11, 0.3);
          text-align: center;
        }
        .champion-label {
          color: var(--gold); font-size: 12px; text-transform: uppercase;
          letter-spacing: 2px; font-weight: 700; opacity: 0.8;
        }
        .champion-name {
          font-size: 32px; color: #fff; display: flex; align-items: center;
          justify-content: center; gap: 12px; margin-top: 10px;
          text-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
        }
        .champion-name img { width: 40px; height: 28px; object-fit: cover; border-radius: 4px; }
        .share-card-footer {
          padding: 16px 24px; background: rgba(245, 158, 11, 0.1);
          border-top: 1px solid rgba(245, 158, 11, 0.2); text-align: center;
        }
        .branding { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .brand-logo { color: var(--gold); font-size: 20px; letter-spacing: 2px; }
        .brand-url { color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 1px; }
      `}</style>
    </div>
  );
}
