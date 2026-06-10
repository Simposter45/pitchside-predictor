'use client';

import { useState, useEffect } from 'react';
import { getFlag } from '@/lib/data';

interface LeaderboardEntry {
  id: string;
  rank: number;
  nick: string;
  champion: string;
  runnerUp: string | null;
  score: number;
  submittedAt: string;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = () => {
      fetch('/api/leaderboard')
        .then((res) => res.json())
        .then((data) => {
          setEntries(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchEntries();
    
    // Poll every 10 seconds for real-time updates
    const intervalId = setInterval(fetchEntries, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>Loading global predictions...</div>;
  }

  if (entries.length === 0) {
    return null;
  }

  // PitchSide_TV highlight check
  const isPitchSide = (nick: string) => nick.toUpperCase() === 'PITCHSIDE_TV';

  return (
    <div className="leaderboard-container">
      <h3 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px', letterSpacing: '1px' }} className="font-bebas">
        GLOBAL PREDICTIONS
      </h3>
      
      <div className="leaderboard-table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Rank</th>
              <th style={{ width: '40%' }}>Nickname</th>
              <th style={{ width: '25%' }}>Champion</th>
              <th style={{ width: '25%' }}>Runner Up</th>
              <th style={{ width: '100px', textAlign: 'right' }}>Points Gained</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className={isPitchSide(entry.nick) ? 'highlight-pitchside' : ''}>
                <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--gray)' }}>
                  {entry.rank}
                </td>
                <td style={{ fontWeight: 500, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.nick}
                  {isPitchSide(entry.nick) && (
                    <span className="pitchside-badge">OFFICIAL</span>
                  )}
                </td>
                <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {entry.champion ? (
                      <>
                        <img 
                          src={`https://flagcdn.com/w40/${getFlag(entry.champion)}.png`} 
                          alt={entry.champion} 
                          style={{ width: '20px', borderRadius: '2px' }} 
                        />
                        {entry.champion}
                      </>
                    ) : (
                      <span style={{ color: 'var(--gray)' }}>TBD</span>
                    )}
                  </div>
                </td>
                <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {entry.runnerUp ? (
                      <>
                        <img 
                          src={`https://flagcdn.com/w40/${getFlag(entry.runnerUp)}.png`} 
                          alt={entry.runnerUp} 
                          style={{ width: '20px', borderRadius: '2px', opacity: 0.8 }} 
                        />
                        <span style={{ color: 'var(--gray)' }}>{entry.runnerUp}</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--gray)' }}>-</span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', color: entry.score > 0 ? 'var(--green)' : 'var(--gray)' }}>
                  {entry.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .leaderboard-container {
          max-width: 800px;
          margin: 0 auto 60px;
          padding: 0 24px;
        }
        .leaderboard-table-wrapper {
          background: var(--navy2);
          border: 1px solid var(--gray-border);
          border-radius: 12px;
          overflow: hidden;
        }
        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .leaderboard-table th {
          background: rgba(0, 0, 0, 0.2);
          padding: 12px 16px;
          text-align: left;
          color: var(--gray);
          font-weight: 500;
          font-size: 12px;
          text-transform: uppercase;
          border-bottom: 1px solid var(--gray-border);
        }
        .leaderboard-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--gray-border);
        }
        .leaderboard-table tr:last-child td {
          border-bottom: none;
        }
        .highlight-pitchside td {
          background: rgba(245, 158, 11, 0.08);
          border-top: 1px solid var(--gold) !important;
          border-bottom: 1px solid var(--gold) !important;
          color: var(--gold);
        }
        .highlight-pitchside td:first-child {
          border-left: 2px solid var(--gold);
        }
        .pitchside-badge {
          background: var(--gold);
          color: #000;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          margin-left: 8px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}
