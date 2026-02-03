'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: ReactNode;
  /** Scroll speed multiplier. 0 = fixed, 0.5 = half speed, 1 = normal */
  speed?: number;
  /** Whether this section pins (sticks) while other content scrolls over it */
  pin?: boolean;
  /** Extra scale applied while pinned to create zoom-depth effect */
  pinScale?: number;
  /** Fade out as the section scrolls away */
  fadeOut?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Section-level parallax that creates dramatic depth between large content blocks.
 *
 * Use `pin` to make a section stick while the next section scrolls over it (Apple-style).
 * Use `speed` to make sections scroll at different rates.
 * Use `fadeOut` to dim a section as it leaves the viewport.
 */
export function ParallaxSection({
  children,
  speed,
  pin = false,
  pinScale,
  fadeOut = false,
  className,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx: any;

    const setup = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (pin) {
          // Pin this section, optionally scale/fade as next section overlaps
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=40%',
              pin: true,
              scrub: 0.5,
              pinSpacing: true,
            },
          });

          if (pinScale) {
            tl.to(inner, {
              scale: pinScale,
              ease: 'none',
            }, 0);
          }

          if (fadeOut) {
            tl.to(inner, {
              opacity: 0,
              ease: 'none',
            }, 0);
          }
        } else if (speed !== undefined && speed !== 1) {
          // Speed-based parallax on the inner content
          const distance = (1 - speed) * 150;
          gsap.fromTo(
            inner,
            { y: -distance },
            {
              y: distance,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
              },
            }
          );
        }

        if (!pin && fadeOut) {
          gsap.to(inner, {
            opacity: 0,
            scrollTrigger: {
              trigger: section,
              start: 'center center',
              end: 'bottom top',
              scrub: true,
            },
          });
        }
      });
    };

    setup();
    return () => { ctx?.revert(); };
  }, [speed, pin, pinScale, fadeOut]);

  return (
    <div ref={sectionRef} className={cn('relative overflow-hidden', className)}>
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}

export default ParallaxSection;
