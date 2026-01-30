import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { Bento } from '@/components/sections/Bento';
import { Comparison } from '@/components/sections/Comparison';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';

export const metadata: Metadata = {
  title: { absolute: 'Fetchly | We help companies build great products.' },
  description:
    'Fetchly provides a fully aligned, high-performing web and app development team at a fraction of the cost of traditional agencies or staff augmentation.',
};

const FAQ_ITEMS = [
  {
    question: 'What services do you offer?',
    answer:
      'Everything you need to turn your idea into a working product: design, development, QA, project & product management, architecture, and reporting. One team. One monthly plan. More than one less thing to worry about.',
  },
  {
    question: 'How can I get started?',
    answer:
      "Easy. Just reach out through our contact form, and we'll walk you through the next steps.",
  },
  {
    question: 'Do you offer support?',
    answer:
      "Absolutely. We're with you at every step, from due diligence and design to testing and deployment. You'll always get fast answers, data-backed decisions, and the most comprehensive planning you've seen.",
  },
  {
    question: 'What is your pricing?',
    answer:
      "We offer a low, month-to-month rate that covers everything you need. We don't nickel-and-dime you with hourly rates and surprise fees. We're 50% less than agencies and staff aug and a whole lot easier to scale.",
  },
  {
    question: 'Can I customize your services?',
    answer:
      "Always. Every plan is built around your product, your priorities, and your pace. We change to fit what you're building.",
  },
];

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
