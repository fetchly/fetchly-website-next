import { Hero } from '@/components/sections/Hero';
import { Bento } from '@/components/sections/Bento';
import { Comparison } from '@/components/sections/Comparison';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { FAQ_ITEMS } from '@/lib/constants';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Bento />
      <Services />
      <Comparison />
      <Testimonials />
      <FAQ items={FAQ_ITEMS} title="FAQs" label="FAQ" />
    </>
  );
}
