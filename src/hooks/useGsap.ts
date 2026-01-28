'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for GSAP animations with proper cleanup
 *
 * Usage:
 * const containerRef = useGsap((gsap, container) => {
 *   gsap.from(container.querySelectorAll('.animate'), {
 *     opacity: 0,
 *     y: 50,
 *     stagger: 0.1,
 *   });
 * });
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  animation: (gsap: typeof import('gsap').gsap, container: T) => void | (() => void),
  deps: React.DependencyList = []
) {
  const containerRef = useRef<T>(null);
  const cleanupRef = useRef<(() => void) | void>(undefined);

  useEffect(() => {
    const loadGsap = async () => {
      if (!containerRef.current) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      cleanupRef.current = animation(gsap, containerRef.current);
    };

    loadGsap();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, deps);

  return containerRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    trigger?: string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
) {
  const {
    from = { opacity: 0, y: 50 },
    to = { opacity: 1, y: 0 },
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
  } = options;

  return useGsap<T>((gsap, container) => {
    const targets = trigger ? container.querySelectorAll(trigger) : container;

    gsap.fromTo(targets, from, {
      ...to,
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub,
      },
    });
  });
}

export default useGsap;
