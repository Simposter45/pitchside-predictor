'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import { usePredictionStore } from '@/lib/store';
import { getFlag, getFlagEmoji } from '@/lib/data';
import Leaderboard from '@/components/Leaderboard';
import ShareCard from '@/components/ShareCard';

export default function ConfirmPage() {
  const router = useRouter();
  const { user, finalPick, entryTime, submitted } = usePredictionStore();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

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
    try {
      setSharing(true);
      const shareElement = document.getElementById('share-card');
      if (!shareElement) {
        setSharing(false);
        return;
      }

      const canvas = await html2canvas(shareElement, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#0f172a',
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setSharing(false);
          return;
        }
        
        const file = new File([blob], 'pitchside-prediction.png', { type: 'image/png' });
        const shareData = {
          files: [file],
          text: shareText
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback: download image and copy text
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'pitchside-prediction.png';
          a.click();
          URL.revokeObjectURL(url);

          await navigator.clipboard.writeText(shareText);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        }
        setSharing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing image:', err);
      setSharing(false);
    }
  };

  return (
    <div className="confirm-wrap">
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="confirm-icon">🎉</div>
      <h1 className="confirm-title">YOU&apos;RE IN!</h1>
      <p className="confirm-sub">
        Your prediction path is locked in. The clock is ticking — the earliest
        correct path wins the iPhone 17 Pro when PitchSide TV hits 100K.
      </p>

      <div style={{ margin: '32px 0' }}>
        <ShareCard />
      </div>

      <div className="share-btns">
        <button className="share-btn primary" onClick={handleShare} disabled={sharing} id="share-btn">
          {sharing ? '⏳ Generating Image...' : copied ? '✓ Downloaded & Copied!' : '📤 Share Your Pick'}
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
      </div>

      <div style={{ marginTop: 40, width: '100%', maxWidth: '1200px', alignSelf: 'center', margin: '40px auto 0' }}>
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
