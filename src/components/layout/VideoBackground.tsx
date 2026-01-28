'use client';

import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
}

export function VideoBackground({
  src,
  poster,
  className,
  overlayClassName,
  children,
}: VideoBackgroundProps) {
  // Extract base name for webm fallback
  const webmSrc = src.replace(/\.mp4$/, '.webm');

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={webmSrc} type="video/webm" />
        <source src={src} type="video/mp4" />
      </video>
      <div
        className={cn(
          'absolute inset-0 bg-gray-950/60',
          overlayClassName
        )}
      />
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}

export default VideoBackground;
