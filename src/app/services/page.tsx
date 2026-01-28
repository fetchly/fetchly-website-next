import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Comparison } from '@/components/sections/Comparison';
import { Testimonials } from '@/components/sections/Testimonials';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Our diverse range of services is designed to meet your unique needs, ensuring quality and satisfaction at every step. From personalized consultations to innovative solutions, we are here to help you achieve your goals.',
};

const SERVICES = [
  {
    title: 'Quality Assurance',
    description: 'Expertise that drives results and satisfaction.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Software Architecture',
    description: 'Customized plans to meet your unique challenges.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: 'Shopify Development',
    description: 'Partner with us for exceptional service delivery.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    title: 'Project Management',
    description: 'Our team is always within reach.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: 'Results-Driven Marketing Services',
    description: 'Boost your visibility and engagement with our strategies.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Design',
    description: 'Stay ahead with our advanced tech services.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

const CASE_STUDIES = [
  {
    title: 'VRT Sync',
    description: 'Real products with real results. See how our SaaS development services move the needle.',
    image: '/images/vrt-sync.png',
  },
  {
    title: 'Container Alliance',
    description: 'See how our all-in-one team handles design, development, QA, and launch so your SaaS works better, looks better, and gets to market faster.',
    image: '/images/container-alliance.png',
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

export default function ServicesPage() {
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
            <h1 className="text-display-1 text-white mb-6">
              Explore our comprehensive service offerings
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Our diverse range of services is designed to meet your unique needs, ensuring quality
              and satisfaction at every step. From personalized consultations to innovative
              solutions, we are here to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/intake/step-1" size="lg">
                Talk to us
              </Button>
              <Button href="#services" variant="outline" size="lg">
                Learn more
              </Button>
            </div>
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

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32 bg-gray-900/30">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-display-2 text-white mb-6">What we offer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="p-8 rounded-2xl bg-gray-900/50 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            ))}
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
                Real products with real results.
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
              <h2 className="text-display-2 text-white mb-4">FAQ</h2>
              <p className="text-xl text-gray-300">
                Have questions? We&apos;ve got answers. If you don&apos;t see yours, reach out below.
              </p>
            </div>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <FAQItem key={index} question={item.question} answer={item.answer} />
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

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl bg-gray-900/50 border border-white/10 overflow-hidden">
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
        <span className="text-lg font-semibold text-white">{question}</span>
        <span className="ml-4 flex-shrink-0 text-primary">
          <svg
            className="w-6 h-6 transform transition-transform group-open:rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </summary>
      <div className="px-6 pb-6">
        <p className="text-gray-400">{answer}</p>
      </div>
    </details>
  );
}
