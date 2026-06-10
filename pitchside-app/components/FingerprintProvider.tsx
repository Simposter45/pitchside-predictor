'use client';

import { useEffect } from 'react';
import { usePredictionStore } from '@/lib/store';

export default function FingerprintProvider() {
  const setFingerprint = usePredictionStore((s) => s.setFingerprint);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        if (!cancelled) {
          setFingerprint(result.visitorId);
        }
      } catch {
        // Silently fail — fingerprint is a defence-in-depth measure, not a blocker
      }
    }

    load();
    return () => { cancelled = true; };
  }, [setFingerprint]);

  return null; // Renders nothing
}
