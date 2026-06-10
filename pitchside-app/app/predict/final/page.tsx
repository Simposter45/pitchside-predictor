'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePredictionStore } from '@/lib/store';
import { buildAllKnockoutRounds, getFlag } from '@/lib/data';
import ProgressBar from '@/components/ProgressBar';
import BottomNav from '@/components/BottomNav';

export default function FinalPage() {
  const router = useRouter();
  const store = usePredictionStore();
  const { groupPicks, r32Picks, r16Picks, qfPicks, sfPicks, finalPick, setFinalPick, setSubmitted, user, fingerprint } = store;
  const [loading, setLoading] = useState(false);

  if (!user) {
    if (typeof window !== 'undefined') router.replace('/register');
    return null;
  }

  const { sf } = buildAllKnockoutRounds(groupPicks, r32Picks, r16Picks, qfPicks);
  const finalist1 = sfPicks[sf[0]?.id] || null;
  const finalist2 = sfPicks[sf[1]?.id] || null;
  const finalistsReady = finalist1 && finalist2;

  const handleSubmit = async () => {
    if (!finalPick) {
      alert('Please pick your champion!');
      return false;
    }
    setLoading(true);
    try {
      const payload = {
        user,
        groupPicks,
        r32Picks,
        r16Picks,
        qfPicks,
        sfPicks,
        finalPick,
        entryTime: store.entryTime,
        fingerprint,
      };

      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return false;
      }

      setSubmitted();
      router.push('/confirm');
    } catch {
      alert('Network error. Please check your connection and try again.');
      setLoading(false);
    }
    return true;
  };

  return (
    <>
      <div className="bracket-header">
        <h1>The Final</h1>
        <p>Who lifts the trophy at MetLife Stadium on July 19?</p>
        <ProgressBar step={3} />
      </div>

      <div className="final-wrap">
        <div className="final-trophy">🏆</div>
        <h2 className="final-title">
          PICK YOUR<br />CHAMPION
        </h2>

        <div className="final-matchup">
          {!finalistsReady ? (
            <div style={{ color: 'var(--gray)', fontSize: 14, padding: 20 }}>
              Complete all semi-final picks to unlock the final
            </div>
          ) : (
            <>
              {[finalist1, finalist2].map((team, i) => (
                <div
                  key={i}
                  className={`finalist-card ${finalPick === team ? 'winner-pick' : ''}`}
                  onClick={() => team && setFinalPick(team)}
                >
                  <div className="finalist-flag">{getFlag(team!)}</div>
                  <div className="finalist-name">{team}</div>
                  {finalPick === team && (
                    <div className="finalist-your-pick">YOUR PICK ★</div>
                  )}
                </div>
              ))}

              <div className="vs-label" style={{ order: 1, flexBasis: '100%', textAlign: 'center', margin: '-16px 0' }}>
              </div>
            </>
          )}
        </div>

        {finalistsReady && (
          <div style={{ color: 'var(--gray)', fontSize: 13, marginTop: 8 }}>
            {finalist1} <span style={{ color: 'var(--blue)', fontFamily: 'Bebas Neue, sans-serif', fontSize: 22 }}>VS</span> {finalist2}
          </div>
        )}
      </div>

      <div className="bottom-spacer" />

      <BottomNav
        backHref="/predict/knockouts"
        nextLabel={loading ? 'Submitting...' : 'Submit Entry →'}
        countText={finalPick ? '1 / 1 champion picked' : '0 / 1 champion picked'}
        onNext={handleSubmit}
        isLoading={loading}
      />
    </>
  );
}
