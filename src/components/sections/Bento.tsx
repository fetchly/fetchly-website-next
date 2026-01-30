'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Text } from '@/components/ui/Text';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { assetPath } from '@/lib/utils';

// Per-element fall config: y offset, rotateX (tilt around center), timeline position
const FALL_CONFIG = [
  { y: -380, rx: 32, at: 0    },  // video
  { y: -540, rx: 42, at: 0.14 },  // tapp
  { y: -440, rx: 36, at: 0.05 },  // winc
  { y: -620, rx: 48, at: 0.25 },  // projects
  { y: -400, rx: 33, at: 0.09 },  // testimonial
  { y: -580, rx: 45, at: 0.30 },  // colorado
  { y: -680, rx: 54, at: 0.40 },  // 66k
  { y: -480, rx: 38, at: 0.18 },  // casper
  { y: -560, rx: 43, at: 0.34 },  // vast
];

export function Bento() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ctx: any;

    const setup = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const items = grid.querySelectorAll<HTMLElement>('[data-bento-item]');
      if (!items.length) return;

      ctx = gsap.context(() => {
        // Single scrubbed timeline — cards land one by one as you scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'top bottom',
            end: 'top 20%',
            scrub: 0.6,
          },
        });

        items.forEach((item, i) => {
          const cfg = FALL_CONFIG[i] || FALL_CONFIG[0];

          tl.fromTo(
            item,
            {
              y: cfg.y,
              rotateX: cfg.rx,
              opacity: 0,
              transformPerspective: 800,
              transformOrigin: 'center center',
            },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              duration: 1,
              ease: 'back.out(1)',
            },
            cfg.at // staggered position in the timeline
          );
        });
      }, grid);
    };

    setup();
    return () => { ctx?.revert(); };
  }, []);

  return (
    <Section>
      <Container>
        {/* Intro Text */}
        <ScrollReveal direction="up" distance={30} duration={0.7}>
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <Text size="xl" className="text-foreground-muted leading-relaxed">
              Fetchly places developers, designers, PMs, and QA specialists directly into your
              workflow. You keep full ownership of your product, work month-to-month, and get
              supplemental services built into every engagement.
            </Text>
          </div>
        </ScrollReveal>

        {/* Bento Grid — 100vh perspective stage, cards fall into place on approach */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 h-[100svh] overflow-visible" style={{ perspective: '800px', perspectiveOrigin: '50% 30%' }}>
          {/* Column 1 */}
          <div className="flex flex-col gap-3 lg:gap-4 min-h-0">
            <div data-bento-item className="group relative flex-1 min-h-0 bg-black rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={assetPath("/videos/13s-poster.jpg")}
                className="absolute inset-0 w-full h-full object-cover saturate-[0.7] brightness-90 group-hover:saturate-100 group-hover:brightness-110 transition-all duration-300"
              >
                <source src={assetPath("/videos/13s.webm")} type="video/webm" />
                <source src={assetPath("/videos/13s.mp4")} type="video/mp4" />
              </video>
            </div>
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/tapp.png"
                alt="Tapp project showcase"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3 lg:gap-4 min-h-0">
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/winc.png"
                alt="Winc project showcase"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/projects.png"
                alt="Projects showcase"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3 lg:gap-4 min-h-0">
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/testimonial.png"
                alt="Client testimonial"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/colorado.png"
                alt="Colorado project"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/66k.png"
                alt="66k metric"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-3 lg:gap-4 min-h-0">
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/casper.png"
                alt="Casper project showcase"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
            <div data-bento-item className="relative flex-1 min-h-0 rounded-[10px] lg:rounded-[20px] overflow-hidden will-change-transform">
              <Image
                src="/images/vast.png"
                alt="Vast project showcase"
                fill
                className="object-cover saturate-[0.7] brightness-90 hover:saturate-100 hover:brightness-110 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default Bento;
