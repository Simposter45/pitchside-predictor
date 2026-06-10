'use client';

import { useRouter } from 'next/navigation';

interface BottomNavProps {
  backHref?: string;
  nextHref?: string;
  nextLabel?: string;
  countText?: string;
  onNext?: () => boolean | Promise<boolean>; // return false to block navigation
  hideBack?: boolean;
  isLoading?: boolean;
}

export default function BottomNav({
  backHref,
  nextHref,
  nextLabel = 'Next →',
  countText,
  onNext,
  hideBack = false,
  isLoading = false,
}: BottomNavProps) {
  const router = useRouter();

  const handleNext = async () => {
    if (onNext) {
      const ok = await onNext();
      if (!ok) return;
    }
    if (nextHref) router.push(nextHref);
  };

  return (
    <div className="bottom-nav">
      {!hideBack && backHref ? (
        <button className="nav-btn" onClick={() => router.push(backHref)}>
          ← Back
        </button>
      ) : (
        <div />
      )}
      <div className="nav-count">{countText}</div>
      <button
        className="nav-btn primary-btn"
        onClick={handleNext}
        disabled={isLoading}
      >
        {isLoading ? <span className="spinner" /> : nextLabel}
      </button>
    </div>
  );
}
