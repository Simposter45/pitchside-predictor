'use client';

interface ProgressBarProps {
  step: 1 | 2 | 3 | 4; // 1=groups, 2=knockouts, 3=final, 4=confirm
}

export default function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="progress-bar-wrap">
      {[1, 2, 3, 4].map((s) => (
        <div
          key={s}
          className={`prog-step ${s < step ? 'done' : s === step ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}
