'use client';

import { useEffect } from 'react';

const SERVER_URL = process.env.NEXT_PUBLIC_TRACKER_URL ?? '';
const SITE_ID = process.env.NEXT_PUBLIC_TRACKER_SITE_ID ?? '';

export function LiveSessionsTracker() {
  useEffect(() => {
    if (!SERVER_URL || !SITE_ID) return;

    let tracker: { destroy(): void; chat: { send(body: string): void; on(event: string, handler: (...args: any[]) => void): () => void } } | null = null;

    async function loadTracker() {
      try {
        const { init } = await import('@fetchly/live-sessions/client');
        tracker = init({
          siteId: SITE_ID,
          serverUrl: SERVER_URL,
          recording: true,
          debug: process.env.NODE_ENV === 'development',
        });
        (window as any).__FLS_TRACKER__ = tracker;
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[LiveSessionsTracker] Failed to load:', err);
        }
      }
    }

    loadTracker();

    return () => {
      if (tracker) {
        tracker.destroy();
        tracker = null;
      }
      delete (window as any).__FLS_TRACKER__;
    };
  }, []);

  return null;
}
