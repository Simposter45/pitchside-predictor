'use client';

interface ProgressBarProps {
  step: 1 | 2 | 3 | 4 | 5; // 1=groups, 2=thirds, 3=knockouts, 4=final, 5=confirm
}

export default function ProgressBar({ step }: ProgressBarProps) {
  return (
    <div className="progress-bar-wrap">
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          className={`prog-step ${s < step ? 'done' : s === step ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}
