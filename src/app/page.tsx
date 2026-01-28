import { Hero } from '@/components/sections/Hero';
import { LogoMarquee } from '@/components/sections/LogoMarquee';
import { Comparison } from '@/components/sections/Comparison';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { CTA } from '@/components/sections/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoMarquee />
      <Services />
      <Comparison />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
