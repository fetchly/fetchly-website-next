'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useCalendlyEvents } from '@/hooks/useCalendlyEvents';

const CALENDLY_URL =
  'https://calendly.com/fetchly1/fetchly-intro?hide_gdpr_banner=1&primary_color=69E5FB&text_color=000000';

interface CalendlyEmbedProps {
  url?: string;
  className?: string;
  onEventScheduled?: () => void;
  onDateTimeSelected?: () => void;
}

export function CalendlyEmbed({
  url = CALENDLY_URL,
  className,
  onEventScheduled,
  onDateTimeSelected,
}: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useCalendlyEvents({
    onDateTimeSelected,
    onEventScheduled,
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className={cn('w-full', className)}>
      {/* Skeleton placeholder while Calendly loads */}
      {!loaded && (
        <div className="w-full rounded-lg bg-surface-card border border-border animate-pulse h-[650px] max-md:h-[700px] max-sm:h-[750px]" />
      )}
      <div
        ref={containerRef}
        className={cn(
          'calendly-inline-widget',
          !loaded && 'hidden',
        )}
        data-url={url}
        style={{
          minWidth: '320px',
          width: '100%',
          height: '650px',
        }}
      />
    </div>
  );
}

export default CalendlyEmbed;
