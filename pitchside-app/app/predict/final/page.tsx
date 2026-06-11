'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePredictionStore } from '@/lib/store';
import { buildAllKnockoutRounds, getFlag } from '@/lib/data';
import ProgressBar from '@/components/ProgressBar';
import BottomNav from '@/components/BottomNav';

export default function FinalPage() {
  const router = useRouter();
  const store = usePredictionStore();
  const { groupPicks, r32Picks, r16Picks, qfPicks, sfPicks, finalPick, setFinalPick, setSubmitted, user, fingerprint, thirdPicks } = store;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/register');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const { sf } = buildAllKnockoutRounds(groupPicks, thirdPicks, r32Picks, r16Picks, qfPicks);
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
      let visitorId = 'blocked_' + Math.random().toString(36).substring(7);
      try {
        const fpPromise = import('@fingerprintjs/fingerprintjs').then(fp => fp.load());
        const fp: any = await Promise.race([
          fpPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3500))
        ]);
        const result = await fp.get();
        visitorId = result.visitorId;
      } catch (e) {
        console.warn('Fingerprint blocked or timed out, using fallback ID');
      }

      const payload = {
        user,
        groupPicks,
        thirdPicks,
        r32Picks,
        r16Picks,
        qfPicks,
        sfPicks,
        finalPick,
        entryTime: store.entryTime,
        fingerprint: visitorId,
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
        <ProgressBar step={4} />
      </div>

      <div className="final-wrap">
        <div className="final-trophy">🏆</div>
        <h2 className="final-title">
          PICK YOUR<br />CHAMPION
        </h2>

        <div className="final-container">
        <h2 className="font-bebas" style={{ fontSize: 32, letterSpacing: 1, margin: 0 }}>The Final (Jul 19)</h2>
        <div style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, marginTop: 4 }}>
          MetLife Stadium, New York
        </div>
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
                  <div className="finalist-flag">
                    <img src={`https://flagcdn.com/w80/${getFlag(team!)}.png`} alt={team!} style={{ width: '48px', borderRadius: '4px', display: 'inline-block' }} />
                  </div>
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
