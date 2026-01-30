import type { Metadata } from 'next';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { StatsGrid } from '@/components/sections/StatsGrid';
import { CaseStudyGrid } from '@/components/sections/CaseStudyGrid';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { PageHero } from '@/components/sections/PageHero';
import { CASE_STUDIES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'One team handles your entire product lifecycle. Strategy, design, development, QA, and ongoing support, all on a flexible month-to-month basis.',
};

const SERVICES = [
  {
    title: 'Quality Assurance',
    description: 'Manual and automated testing across every device and browser your users care about.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Software Architecture',
    description: 'System design built for your scale, your stack, and your growth plan.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: 'Shopify Development',
    description: 'Custom themes, app integrations, and Shopify Plus builds from a certified partner.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    title: 'Project Management',
    description: 'Weekly syncs, shared boards, and a dedicated PM who keeps everything on track.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: 'Results-Driven Marketing Services',
    description: 'SEO, paid media, and conversion optimization tied directly to your product goals.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Design',
    description: 'UI/UX design grounded in user research, not guesswork.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
];

const FAQ_ITEMS = [
  {
    question: 'What services does Fetchly offer?',
    answer:
      'The full lifecycle: design, development, QA, software architecture, DevOps, project management, and marketing. Every role you need, one roof, no juggling vendors.',
  },
  {
    question: 'Do I need to hire separate vendors for design, dev, and QA?',
    answer:
      'No. One team covers everything. Your designer, engineers, QA analysts, and project manager all work together on your product from day one.',
  },
  {
    question: 'Can you work with our existing codebase or tech stack?',
    answer:
      'Yes. We pick up existing projects all the time. We onboard to your codebase, follow your conventions, and start contributing fast.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      "Flat month-to-month rate. No hourly billing, no surprise fees. You get a full team for one predictable price, about 50% less than traditional agencies.",
  },
  {
    question: 'How do I get started?',
    answer:
      "Fill out our contact form and we'll set up a quick consultation. We'll learn about your product, scope the engagement, and show you exactly how we'd work together.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        title="Design, development, and QA under one roof"
        description="One team handles your entire product lifecycle. Strategy, design, development, QA, and ongoing support, all on a flexible month-to-month basis."
        ctaText="Talk to us"
        ctaHref="/intake/request"
        secondaryText="Learn more"
        secondaryHref="/case-studies"
        showBadge={false}
      />

      {/* About Us Section */}
      <StatsGrid />

      {/* Services Section */}
      <FeatureGrid
        title="What we offer"
        items={SERVICES}
        columns={3}
        background="muted"
        iconWithBackground
        className="scroll-mt-24"
        id="services"
      />

      {/* Case Studies Section */}
      <CaseStudyGrid
        background="muted"
        items={CASE_STUDIES.filter((s) => s.title !== 'Oats Overnight').map((s) => ({
          title: s.title,
          description: s.shortDescription,
          image: s.image,
          href: s.href,
        }))}
      />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ
        items={FAQ_ITEMS}
        title="FAQ"
        label="FAQ"
      />
    </>
  );
}
