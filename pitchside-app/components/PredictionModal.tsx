'use client';

import { useState, useEffect } from 'react';
import { getFlag, buildAllKnockoutRounds } from '@/lib/data';

interface PredictionModalProps {
  entryId: string;
  onClose: () => void;
}

export default function PredictionModal({ entryId, onClose }: PredictionModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/entry/${entryId}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [entryId]);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content loading" onClick={e => e.stopPropagation()}>
          <div className="spinner"></div>
          <p>Loading prediction path...</p>
        </div>
        <style jsx>{`
          .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
            z-index: 1000; display: flex; align-items: center; justify-content: center;
          }
          .modal-content {
            background: var(--navy); border: 1px solid var(--gray-border);
            border-radius: 16px; padding: 40px; text-align: center; color: var(--gray);
          }
          .spinner {
            width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--gold); border-radius: 50%;
            animation: spin 1s linear infinite; margin: 0 auto 16px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!data || data.error) return null;

  const { r16, qf, sf } = buildAllKnockoutRounds(
    data.group_picks,
    data.third_picks,
    data.r32_picks,
    data.r16_picks,
    data.qf_picks
  );

  const finalists = [data.sf_picks['sf_0'] || 'TBD', data.sf_picks['sf_1'] || 'TBD'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h2 className="font-bebas">{data.nick}'S PATH TO GLORY</h2>
        </div>

        <div className="modal-body">
          <section className="round-section final-section">
            <h3 className="font-bebas section-title gold-title">THE FINAL</h3>
            <div className="match-card final-match">
              <div className={`team ${finalists[0] === data.final_pick ? 'winner' : ''}`}>
                <img src={`https://flagcdn.com/w40/${getFlag(finalists[0])}.png`} alt={finalists[0]} />
                <span>{finalists[0]}</span>
              </div>
              <div className="vs">vs</div>
              <div className={`team ${finalists[1] === data.final_pick ? 'winner' : ''} team-right`}>
                <span>{finalists[1]}</span>
                <img src={`https://flagcdn.com/w40/${getFlag(finalists[1])}.png`} alt={finalists[1]} />
              </div>
            </div>
            
            <div className="champion-reveal">
              <span className="champion-label">Predicted Champion</span>
              <div className="champion-name font-bebas">
                <img src={`https://flagcdn.com/w80/${getFlag(data.final_pick)}.png`} alt={data.final_pick} />
                {data.final_pick}
              </div>
            </div>
          </section>

          <section className="round-section">
            <h3 className="font-bebas section-title">SEMI-FINALS</h3>
            <div className="matches-grid">
              {sf.map((m) => {
                const winner = data.sf_picks[m.id];
                return (
                  <div key={m.id} className="match-card">
                    <div className={`team ${m.team1 === winner ? 'winner' : ''}`}>
                      <img src={`https://flagcdn.com/w40/${getFlag(m.team1)}.png`} alt={m.team1} />
                      <span>{m.team1}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className={`team ${m.team2 === winner ? 'winner' : ''} team-right`}>
                      <span>{m.team2}</span>
                      <img src={`https://flagcdn.com/w40/${getFlag(m.team2)}.png`} alt={m.team2} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="round-section">
            <h3 className="font-bebas section-title">QUARTER-FINALS</h3>
            <div className="matches-grid">
              {qf.map((m) => {
                const winner = data.qf_picks[m.id];
                return (
                  <div key={m.id} className="match-card">
                    <div className={`team ${m.team1 === winner ? 'winner' : ''}`}>
                      <img src={`https://flagcdn.com/w40/${getFlag(m.team1)}.png`} alt={m.team1} />
                      <span>{m.team1}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className={`team ${m.team2 === winner ? 'winner' : ''} team-right`}>
                      <span>{m.team2}</span>
                      <img src={`https://flagcdn.com/w40/${getFlag(m.team2)}.png`} alt={m.team2} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="round-section">
            <h3 className="font-bebas section-title">ROUND OF 16</h3>
            <div className="matches-grid">
              {r16.map((m) => {
                const winner = data.r16_picks[m.id];
                return (
                  <div key={m.id} className="match-card">
                    <div className={`team ${m.team1 === winner ? 'winner' : ''}`}>
                      <img src={`https://flagcdn.com/w40/${getFlag(m.team1)}.png`} alt={m.team1} />
                      <span>{m.team1}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className={`team ${m.team2 === winner ? 'winner' : ''} team-right`}>
                      <span>{m.team2}</span>
                      <img src={`https://flagcdn.com/w40/${getFlag(m.team2)}.png`} alt={m.team2} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(8px);
          z-index: 1000; display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }
        .modal-content {
          background: #0f172a; border: 1px solid #1e293b;
          border-radius: 16px; width: 100%; max-width: 560px; max-height: 85vh;
          position: relative; overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          display: flex; flex-direction: column;
        }
        .close-btn {
          position: absolute; top: 16px; right: 20px;
          background: rgba(255,255,255,0.1); border: none;
          color: #94a3b8; font-size: 20px; cursor: pointer;
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; z-index: 10;
        }
        .close-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
        .modal-header {
          padding: 24px; border-bottom: 1px solid #1e293b;
          text-align: center; background: #0f172a;
          flex-shrink: 0; z-index: 5;
        }
        .modal-header h2 { margin: 0; font-size: 28px; color: #fff; letter-spacing: 1px; }
        .modal-body { padding: 24px; overflow-y: auto; }
        .round-section { margin-bottom: 40px; }
        .section-title {
          font-size: 22px; color: #94a3b8; text-align: center;
          margin-bottom: 20px; letter-spacing: 1.5px;
        }
        .gold-title { color: var(--gold); }
        .final-section {
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0) 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 12px; padding: 24px; margin-bottom: 40px;
        }
        .matches-grid { display: flex; flex-direction: column; gap: 12px; }
        .match-card {
          display: flex; align-items: center; justify-content: space-between;
          background: #1e293b; padding: 14px 16px; border-radius: 8px;
          border: 1px solid #334155;
        }
        .final-match { background: rgba(0,0,0,0.3); border-color: rgba(245, 158, 11, 0.3); padding: 20px; }
        .team {
          flex: 1; display: flex; align-items: center; gap: 12px;
          font-size: 15px; color: #94a3b8; font-weight: 500;
        }
        .team-right { justify-content: flex-end; }
        .team img { width: 28px; height: 20px; object-fit: cover; border-radius: 3px; opacity: 0.5; transition: opacity 0.2s; }
        .team.winner { color: #fff; font-weight: 700; }
        .team.winner img { opacity: 1; box-shadow: 0 0 8px rgba(255,255,255,0.1); }
        .vs {
          color: #64748b; font-size: 13px; font-weight: 700;
          text-transform: uppercase; margin: 0 16px;
        }
        .champion-reveal {
          margin-top: 24px; padding-top: 24px;
          border-top: 1px dashed rgba(245, 158, 11, 0.3);
          text-align: center;
        }
        .champion-label {
          color: var(--gold); font-size: 12px; text-transform: uppercase;
          letter-spacing: 2px; font-weight: 700; opacity: 0.8;
        }
        .champion-name {
          font-size: 36px; color: #fff; display: flex; align-items: center;
          justify-content: center; gap: 16px; margin-top: 12px;
          text-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
        }
        .champion-name img { width: 48px; height: 34px; object-fit: cover; border-radius: 4px; }
        .modal-body::-webkit-scrollbar { width: 6px; }
        .modal-body::-webkit-scrollbar-track { background: transparent; }
        .modal-body::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        
        @media (max-width: 600px) {
          .modal-content { max-height: 90vh; border-radius: 12px; }
          .modal-body { padding: 16px; }
          .modal-header h2 { font-size: 24px; }
          .match-card { padding: 12px; }
          .team { font-size: 13px; gap: 8px; }
          .team img { width: 24px; height: 16px; }
          .vs { margin: 0 8px; font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
