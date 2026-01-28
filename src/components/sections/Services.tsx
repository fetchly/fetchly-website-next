'use client';

import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const WHY_FETCHLY = [
  {
    title: 'Cost-Effective Pricing',
    description: 'Save up to 50% compared to similar agencies',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Flexible Scaling',
    description: 'Ramp up or scale down your team on a monthly basis',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
      </svg>
    ),
  },
  {
    title: 'Supplemental Services',
    description: 'Project managers, Designers, QA, and DevOps with no extra cost',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: 'Dedicated Resources',
    description: 'Full-time expert developers',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <>
      {/* Value Prop Section - Full height minus header */}
      <section
        id="value-prop"
        className="flex items-center bg-gray-900/50"
        style={{ minHeight: 'calc(100vh - var(--header-height))' }}
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <h2 className="text-display-2 text-white mb-6">
                The flexibility of staff-aug, the support of an agency
              </h2>
              <p className="text-gray-400 text-lg">
                Fetchly places developers, designers, PMs, and QA specialists directly into your
                workflow. You keep full ownership of your product, work month-to-month, and get
                supplemental services built into every engagement.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              <Image
                src="/images/exploded-device.png"
                alt="Exploded isometric diagram of a rectangular device assembly"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Why Fetchly Section */}
      <section id="why-fetchly" className="py-20 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-4">Why Fetchly?</p>
            <h2 className="text-display-2 text-white mb-4">
              Discover how we&apos;re transforming traditional development services to better serve you
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FETCHLY.map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-gray-900/50 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button href="/intake/step-1" size="lg">
              Get started
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Services;
