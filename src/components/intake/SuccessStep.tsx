'use client';

import { CalendlyEmbed } from './CalendlyEmbed';

interface SuccessStepProps {
  onCalendlyScheduled?: () => void;
}

export function SuccessStep({ onCalendlyScheduled }: SuccessStepProps) {
  return (
    <div className="space-y-8">
      {/* Confirmation */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
          <svg
            className="w-7 h-7 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-h4 font-semibold text-foreground">
          Got it! We&apos;ll be in touch within 24 hours.
        </h2>
        <p className="text-body text-foreground-subtle max-w-md mx-auto">
          Want to skip the back-and-forth? Book a call now.
        </p>
      </div>

      {/* Optional Calendly */}
      <CalendlyEmbed
        onEventScheduled={onCalendlyScheduled}
        className="max-w-3xl mx-auto"
      />
    </div>
  );
}

export default SuccessStep;
