'use client';

import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { CLIENT_LOGOS } from '@/lib/constants';

export function LogoMarquee() {
  // Double the logos for seamless infinite scroll
  const duplicatedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="py-16 bg-gray-950 border-y border-white/5 overflow-hidden">
      <Container className="mb-8">
        <p className="text-center text-gray-500 text-sm uppercase tracking-wider">
          Trusted by innovative companies
        </p>
      </Container>

      {/* Marquee container */}
      <div className="relative">
        {/* Gradient masks for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-950 to-transparent z-10" />

        {/* Scrolling content */}
        <div className="flex animate-marquee hover:pause">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={48}
                className="h-8 md:h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoMarquee;
