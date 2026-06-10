import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PitchSide Predictor — Predict the FIFA World Cup 2026 Path',
  description:
    'Free contest: Pick every World Cup 2026 match winner. The fastest correct full bracket wins an iPhone 17 Pro. Follow @thepitchsidetv to enter.',
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
            <li>Prize awarded when PitchSide TV reaches 100K followers</li>
            <li>One entry per person. Follow @thepitchsidetv to be eligible.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
