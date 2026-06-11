'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePredictionStore } from '@/lib/store';
import { getFlag, getFlagEmoji } from '@/lib/data';
import Leaderboard from '@/components/Leaderboard';

export default function ConfirmPage() {
  const router = useRouter();
  const { user, finalPick, entryTime, submitted } = usePredictionStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!submitted || !user) {
      router.replace('/');
    }
  }, [submitted, user, router]);

  if (!submitted || !user) return null;

  const t = entryTime ? new Date(entryTime) : new Date();
  const fmt =
    t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const shareText = `🏆 I just predicted ${finalPick} ${getFlagEmoji(getFlag(finalPick || ''))} to win the 2026 World Cup!\n\nCan you beat my bracket? Join PitchSide Predictor and win an iPhone 17 Pro!\n👉 https://pitchsidepredictor.com\n\n📸 IG: @thepitchsidetv\n📺 YT: PitchSide TV`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText });
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="confirm-wrap">
      <div className="confirm-icon">🎉</div>
      <h1 className="confirm-title">YOU&apos;RE IN!</h1>
      <p className="confirm-sub">
        Your prediction path is locked in. The clock is ticking — the earliest
        correct path wins the iPhone 17 Pro when PitchSide TV hits 100K.
      </p>

      <div className="entry-card" id="entry-summary">
        <div className="entry-row">
          <span className="entry-key">Predictor</span>
          <span className="entry-val">{user.nick}</span>
        </div>
        <div className="entry-row">
          <span className="entry-key">Instagram</span>
          <span className="entry-val">{user.insta}</span>
        </div>
        <div className="entry-row">
          <span className="entry-key">Champion Pick</span>
          <span className="entry-val gold">
            {finalPick} {getFlag(finalPick || '')}
          </span>
        </div>
        <div className="entry-row">
          <span className="entry-key">Entry Locked</span>
          <span className="entry-val">{fmt}</span>
        </div>
        <div className="entry-row">
          <span className="entry-key">Status</span>
          <span className="entry-val green">✓ Confirmed</span>
        </div>
      </div>

      <div className="share-btns">
        <button className="share-btn primary" onClick={handleShare} id="share-btn">
          {copied ? '✓ Copied!' : '📤 Share Your Pick'}
        </button>
        <Link href="/" className="share-btn">
          Back to Home
        </Link>
      </div>

      <div className="rules-box" style={{ marginTop: 28 }}>
        <h3>WHAT HAPPENS NEXT</h3>
        <ul>
          <li>Follow @thepitchsidetv on Instagram to stay eligible</li>
          <li>Watch every match prediction reel on PitchSide TV</li>
          <li>Your path is locked — no edits after submission</li>
          <li>Winner announced when PitchSide TV hits 100K followers</li>
        </ul>
      </div>

      <div style={{ marginTop: 40, width: '100%', maxWidth: '800px', alignSelf: 'center' }}>
        <Leaderboard />
      </div>

      <div style={{ textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--gray-border)', marginTop: '40px', width: '100%' }}>
        <p style={{ color: 'var(--gray)', marginBottom: '16px', fontSize: '14px' }}>Follow PitchSide TV</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="https://www.instagram.com/thepitchsidetv/" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            Instagram
          </a>
          <a href="https://www.youtube.com/@PitchSideTVOfficial" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            YouTube
          </a>
        </div>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
            usePredictionStore.getState().reset();
            window.location.href = '/register';
          }}
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            opacity: 0.05,
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '10px',
            cursor: 'pointer'
          }}
          title="Reset Local Storage (Dev Tool)"
        >
          Reset
        </button>
      )}
    </div>
  );
}
