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

const VALUE_PROPS = [
  {
    title: 'One redesign to rule them all.',
    description:
      'We brought 6 platforms and 1.2k custom components into one simple interface.',
  },
  {
    title: 'Designed to scale with you.',
    description:
      "We rebuilt EventSquid's Event Builder for modern UX, faster onboarding, and a scalable, drag-and-drop experience.",
  },
  {
    title: 'Costs 50% less than agencies.',
    description:
      "You get the firepower of a full product team for less than half the cost of hiring in-house. Month-to-month flexibility. Global talent. Zero overhead. We do our due diligence. We plan every tiny detail. We design based on data. You get true specialists in system architecture and development.",
  },
];

const CAPABILITIES = [
  {
    title: 'Custom applications',
    description:
      'We build fast and polished end-to-end apps for web, iOS, and Android from start to launch.',
  },
  {
    title: 'Testing & monitoring',
    description:
      'Everything is tested, tracked, and actively monitored so you can launch stress-free.',
  },
  {
    title: 'Backend & database',
    description:
      'We build the behind-the-scenes engine so your app scales without breaking.',
  },
];

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

export default function SaaSHomePage() {
  return (
    <>
      {/* Hero Section - Two Column Layout */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-display-1 text-white mb-4">
                Custom software development as a service
              </h1>
              <p className="text-lg md:text-xl text-primary mb-4">
                Web, mobile &amp; data software
              </p>
              <p className="text-gray-400 text-lg mb-8">
                Launch your SaaS with a full-stack dev team on standby. Fetchly brings everything
                you need to bring your app to life, all wrapped in one low, month-to-month price.
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
                  src="/images/saas-hero.png"
                  alt="Order management dashboard"
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

      {/* Value Props Section */}
      <section className="py-24 md:py-32 bg-gray-900/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-display-2 text-white mb-4">Launch your product</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what 7+ years in business, 120+ employees, and 100+ engineers can do for your
              next big idea.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="p-8 rounded-2xl bg-gray-900/50 border border-white/10"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{prop.title}</h3>
                <p className="text-gray-400">{prop.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">
              We build apps so<br />you don&apos;t have to
            </h2>
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

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-gray-900/30">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-2 text-white mb-4">The what, the how, the why.</h2>
              <p className="text-gray-400 text-lg">
                Get your questions answered. Our SaaS application development company is here to
                assist you. Don&apos;t see your question? Ask away.
              </p>
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
