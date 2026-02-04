'use client';

import { useEffect, useRef } from 'react';

interface CalendlyCallbacks {
  onDateTimeSelected?: () => void;
  onEventScheduled?: (payload: unknown) => void;
}

export function useCalendlyEvents({
  onDateTimeSelected,
  onEventScheduled,
}: CalendlyCallbacks) {
  const cbRef = useRef(({ onDateTimeSelected, onEventScheduled }));

  cbRef.current = { onDateTimeSelected, onEventScheduled };

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== 'https://calendly.com') return;

      if (e.data?.event === 'calendly.date_and_time_selected') {
        cbRef.current.onDateTimeSelected?.();
      }

      if (e.data?.event === 'calendly.event_scheduled') {
        cbRef.current.onEventScheduled?.(e.data?.payload);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
}
