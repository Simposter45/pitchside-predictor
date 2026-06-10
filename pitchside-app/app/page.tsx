import Link from 'next/link';
import type { Metadata } from 'next';
import Leaderboard from '@/components/Leaderboard';

export const metadata: Metadata = {
  title: 'PitchSide Predictor — Free World Cup 2026 Bracket Predictor | Win iPhone 17 Pro',
  description:
    'Predict the full FIFA World Cup 2026 path for free. Pick every group winner and knockout match. Fastest correct prediction wins an iPhone 17 Pro. Enter now.',
};

export default function LandingPage() {
  return (
    <>
      <div className="hero">
        <div className="hero-eyebrow">FIFA World Cup 2026 · Official Predictor</div>
        <h1 className="hero-title">
          PREDICT<br />THE <span>PATH</span>
        </h1>
        <p className="hero-sub">
          Pick every winner from group stage to the final. The fastest correct
          prediction wins.
        </p>

        <div className="prize-badge">
          <div className="trophy">🏆</div>
          <div className="prize-badge-text">
            <div className="label">Grand Prize</div>
            <div className="value">iPhone 17 Pro</div>
          </div>
        </div>

        <br />
        <Link href="/register" className="hero-cta">
          Enter Now — It&apos;s Free
        </Link>

        <div className="hero-steps">
          {[
            { n: 1, label: 'Register\nfree' },
            { n: 2, label: 'Pick every\nwinner' },
            { n: 3, label: 'Earliest\ncorrect path' },
            { n: 4, label: 'Win\niPhone 17 Pro' },
          ].map(({ n, label }) => (
            <div key={n} className="step">
              <div className="step-num">{n}</div>
              <div className="step-label">
                {label.split('\n').map((l, i) => (
                  <span key={i}>
                    {l}
                    {i === 0 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px 40px' }}>
        <div className="rules-box">
          <h3>HOW TO WIN</h3>
          <ul>
            <li>Pick the winner of every match — group stage through the final</li>
            <li>Submit your full path before matches begin</li>
            <li>The earliest entry with a 100% correct path wins</li>
            <li><strong>Tie-Breaker:</strong> If no one guesses the perfect path, the iPhone will be gifted to the user closest to the path using our Exponential Bracket Points System (10pts for R32, 20pts for R16, 40pts for QF, 80pts for SF, 160pts for Finalists, 320pts for Champion).</li>
            <li>Prize awarded when PitchSide TV reaches 100K followers</li>
            <li>One entry per person. Follow @thepitchsidetv to be eligible.</li>
          </ul>
        </div>
      </div>
      <Leaderboard />
      
      <div style={{ textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--gray-border)', marginTop: '40px' }}>
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
    </>
  );
}
