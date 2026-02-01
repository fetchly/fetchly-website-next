'use client';

import { useEffect } from 'react';

export function SessionTracker() {
  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_TRACKER_URL;
    const siteId = process.env.NEXT_PUBLIC_TRACKER_SITE_ID;

    if (!serverUrl || !siteId) return;

    let tracker: { destroy(): void } | null = null;

    async function loadTracker() {
      try {
        const { init } = await import('@fetchly/live-sessions/client');
        tracker = init({
          serverUrl,
          siteId,
          recording: true,
          debug: process.env.NODE_ENV === 'development',
        });
      } catch (err) {
        // Tracker is non-critical; fail silently in production
        if (process.env.NODE_ENV === 'development') {
          console.warn('[SessionTracker] Failed to load:', err);
        }
      }
    }

    loadTracker();

    return () => {
      tracker?.destroy();
    };
  }, []);

  return null;
}
