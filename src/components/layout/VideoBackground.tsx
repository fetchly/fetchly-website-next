'use client';

import { cn, assetPath } from '@/lib/utils';

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
        poster={poster ? assetPath(poster) : undefined}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={assetPath(webmSrc)} type="video/webm" />
        <source src={assetPath(src)} type="video/mp4" />
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
