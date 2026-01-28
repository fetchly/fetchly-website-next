import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Comparison } from '@/components/sections/Comparison';
import { Testimonials } from '@/components/sections/Testimonials';

export const metadata: Metadata = {
  title: 'Our Model',
  description:
    'At Fetchly, we provide you with top-tier developers and essential support services, ensuring your project thrives. Experience a seamless collaboration that brings your app vision to life.',
};

const TEAM_ROLES = [
  { title: 'Software Architect', icon: '🏗️' },
  { title: 'Designer', icon: '🎨' },
  { title: 'DevOps', icon: '⚙️' },
  { title: 'AI/Application Developer', icon: '💻' },
  { title: 'Project Manager', icon: '📋' },
  { title: 'Quality Assurance', icon: '✅' },
];

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Initial consultation and discovery',
    description:
      "Kickstart your journey with our Initial Consultation and Discovery — where your needs meet expert insight. Discover the path to your best solutions, tailored just for you from day one!",
  },
  {
    number: '02',
    title: 'Collaborative planning and strategy',
    description:
      'Supercharge your success with Collaborative Planning and Strategy — where every voice counts and every step is smarter. Harness the power of teamwork to turn goals into game-changing results!',
  },
  {
    number: '03',
    title: 'Design and development execution',
    description:
      'Unlock innovation with seamless Design and Development Execution — where bold ideas become reality, fast. Experience the perfect blend of creativity and precision to bring your vision to life, from concept to launch!',
  },
];

const CASE_STUDIES = [
  {
    title: 'VRT Sync',
    description: 'Real products with real results. See how our SaaS development services move the needle.',
  },
  {
    title: 'Container Alliance',
    description: 'See how our all-in-one team handles design, development, QA, and launch so your SaaS works better, looks better, and gets to market faster.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'What services do you offer?',
    answer:
      "Everything you need to turn your idea into a working product: design, development, QA, project & product management, architecture, and reporting. One team. One monthly plan. More than one less thing to worry about.",
  },
  {
    question: 'How do I get started?',
    answer:
      "Easy. Just reach out through our contact form, and we'll walk you through the next steps.",
  },
  {
    question: 'Do you support the full product lifecycle?',
    answer:
      "Absolutely. We're with you at every step, from due diligence and design to testing and deployment. You'll always get fast answers, data-backed decisions, and the most comprehensive planning you've seen.",
  },
  {
    question: 'How is pricing structured?',
    answer:
      "We offer a low, month-to-month rate that covers everything you need. We don't nickel-and-dime you with hourly rates and surprise fees. We're 50% less than agencies and staff aug and a whole lot easier to scale.",
  },
  {
    question: 'Can the engagement be customized?',
    answer:
      "Always. Every plan is built around your product, your priorities, and your pace. We change to fit what you're building.",
  },
];

export default function OurModelPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/header.avif"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gray-950/80" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <p className="text-lg md:text-xl text-primary mb-4">
              Web, mobile &amp; data software
            </p>
            <h1 className="text-display-1 text-white mb-6">
              Your dedicated development team awaits
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              At Fetchly, we provide you with top-tier developers and essential support services,
              ensuring your project thrives. Experience a seamless collaboration that brings your
              app vision to life.
            </p>
            <Button href="/intake/step-1" size="lg">
              Get Started
            </Button>
          </div>
        </Container>
      </section>

      {/* Team Model Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-display-2 text-white mb-6">
              Smarter, Leaner, and Aligned Tech Teams
            </h2>
            <p className="text-xl text-gray-300">
              Full-time dedicated engineer with 150 hours + 50 supplemental hours
            </p>
          </div>

          {/* Team Roles Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TEAM_ROLES.map((role) => (
              <div
                key={role.title}
                className="p-6 rounded-2xl bg-gray-900/50 border border-white/10 text-center hover:border-primary/50 transition-colors"
              >
                <div className="text-3xl mb-3">{role.icon}</div>
                <p className="text-sm text-gray-300">{role.title}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-24 md:py-32 bg-gray-900/30">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-display-2 text-white mb-6">
              Our seamless collaboration process
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                className="p-8 rounded-2xl bg-gray-900/50 border border-white/10"
              >
                <div className="text-4xl font-bold text-primary/30 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* About Us Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-display-2 text-white mb-6">About us</h2>
            <p className="text-xl text-gray-300">
              For over eight years, we have helped businesses deliver innovative platforms.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gray-900/50 border border-white/10">
              <div className="text-5xl font-bold text-primary mb-2">8</div>
              <p className="text-gray-400">Years of history</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-900/50 border border-white/10">
              <div className="text-5xl font-bold text-primary mb-2">128</div>
              <p className="text-gray-400">Team members</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gray-900/50 border border-white/10">
              <div className="text-5xl font-bold text-primary mb-2">103</div>
              <p className="text-gray-400">Successfully launched platforms</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Comparison Section */}
      <Comparison />

      {/* Case Studies Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <h2 className="text-display-2 text-white mb-4">What we&apos;ve built.</h2>
              <p className="text-xl text-gray-300">
                Build it right.
              </p>
            </div>
            <Link
              href="/case-studies"
              className="mt-6 md:mt-0 text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-2"
            >
              View all
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CASE_STUDIES.map((study) => (
              <Link
                key={study.title}
                href="/case-studies"
                className="group rounded-2xl overflow-hidden bg-gray-900/50 border border-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="aspect-video relative bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    <span className="text-lg">{study.title}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-gray-400">{study.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-display-2 text-white mb-4">
                The what, the how, the why.
              </h2>
            </div>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={index}
                  className="group rounded-2xl bg-gray-900/50 border border-white/10 overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="text-lg font-semibold text-white">{item.question}</span>
                    <span className="ml-4 flex-shrink-0 text-primary">
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
            <div className="text-center mt-12">
              <Button href="/intake/step-1" size="lg">
                Get in Touch
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
