'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LogoMarquee } from '@/components/sections/LogoMarquee';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';

const PROCESS_STEPS = [
  {
    title: 'Initial consultation and discovery',
    description:
      'Kickstart your journey with our Initial Consultation and Discovery — where your needs meet expert insight. Discover the path to your best solutions, tailored just for you from day one!',
  },
  {
    title: 'Collaborative planning and strategy',
    description:
      'Supercharge your success with Collaborative Planning and Strategy — where every voice counts and every step is smarter. Harness the power of teamwork to turn goals into game-changing results!',
  },
  {
    title: 'Design and development execution',
    description:
      'Unlock innovation with seamless Design and Development Execution — where bold ideas become reality, fast. Experience the perfect blend of creativity and precision to bring your vision to life, from concept to launch!',
  },
];

const FEATURES = [
  {
    title: 'Your design & planning roadmap',
    description:
      'Every screen, flow, and feature is mapped to match your e-commerce goals before any code is written.',
  },
  {
    title: 'Feature development that ships fast',
    description:
      'Weekly mobile test builds and live web links for rapid progress tracking.',
  },
  {
    title: 'Testing & polishing that catches it all',
    description:
      'Rigorous testing and refinement for high-performing launches.',
  },
  {
    title: 'Maintenance that handles the 3AM stuff',
    description:
      'Ongoing bug fixes and maintenance to prevent customer issues.',
  },
];

const CAPABILITIES = [
  {
    title: 'Backend that holds the line',
    description:
      'Ensure your store runs smoothly with our reliable backend solutions.',
  },
  {
    title: 'UI/UX that keeps shoppers clicking',
    description:
      'We craft ecommerce interfaces that guide customers to stay and "Buy Now".',
  },
  {
    title: 'Shopify without limitations',
    description:
      'We configure, integrate, and optimize your Shopify store for speed, stability, and scale.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What do you offer for custom ecommerce development?',
    answer:
      'We handle everything: strategy, design, development, QA, Shopify integration, backend architecture, and ongoing support. We dive into due diligence, deliver data-backed planning, and manage the full build.',
  },
  {
    question: 'Can you build my site from scratch?',
    answer:
      'Yes. We design and develop fully custom ecommerce platforms or apps, end-to-end. Everything is tailored to your product, your stack, and your customers.',
  },
  {
    question: 'Do you work with Shopify?',
    answer:
      'Absolutely. We offer Shopify integrations, custom theme development, app connections, and feature enhancements.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      'We offer unique month-to-month rates that include everything you need for your online store, from design to maintenance.',
  },
  {
    question: 'How do I get started?',
    answer:
      "Just fill out our contact form. We'll schedule a quick consultation, learn about your goals, and show you exactly how our team would build your ecommerce platform.",
  },
];

export default function EcommercePage() {
  return (
    <>
      {/* Hero Section - Two Column Layout */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-display-1 text-white mb-4">
                We help build
                <br />
                eCommerce brands
              </h1>
              <p className="text-lg md:text-xl text-primary mb-4">
                We build and manage the technical side,
                <br />
                so you can focus on running your brand.
              </p>
              <p className="text-gray-400 text-lg mb-8">
                We strategize, design, build, test, launch, and manage custom online stores, all at
                a low, month-to-month price. From UX to backend, every site and app we build is
                meticulously optimized to drive revenue.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/intake/request" size="lg">
                  Talk to us
                </Button>
                <Link
                  href="/our-model"
                  className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors text-lg"
                >
                  Learn more
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-800">
                <Image
                  src="/images/casper.png"
                  alt="Casper website homepage"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 w-24 h-24 animate-spin-slow">
                <Image
                  src="/images/badge.svg"
                  alt=""
                  width={96}
                  height={96}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </Container>

        {/* Dotted texture */}
        <Image
          src="/images/dotted-texture.webp"
          alt=""
          fill
          className="object-cover opacity-10 pointer-events-none"
        />
      </section>

      {/* Logo Marquee */}
      <LogoMarquee />

      {/* Process Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-display-2 text-white mb-4">Our seamless collaboration process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.title}
                className="p-8 rounded-2xl bg-gray-900/50 border border-white/10"
              >
                <div className="text-sm text-primary font-medium mb-4">0{index + 1}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-gray-900/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-display-2 text-white mb-4">
              The only toolkit you&apos;ll ever need
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="p-8 rounded-2xl bg-gray-900/50 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-display-2 text-white mb-4">
              Built to sell. Engineered to scale.
            </h2>
            <p className="text-xl text-gray-400">
              Cross-functional eCommerce team that can help you rapidly scale your DTC Brand.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="p-8 rounded-2xl bg-gray-900/50 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{cap.title}</h3>
                <p className="text-gray-400">{cap.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-gray-900/30">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-2 text-white mb-4">See if we have what you need.</h2>
            </div>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl bg-gray-900/50 border border-white/10 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="text-lg font-semibold text-white pr-4">{item.question}</span>
                    <span className="flex-shrink-0 text-primary">
                      <svg
                        className="w-6 h-6 transform transition-transform group-open:rotate-45"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-400">{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <CTA />
    </>
  );
}
