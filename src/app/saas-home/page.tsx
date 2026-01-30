'use client';

import Image from 'next/image';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { FAQ } from '@/components/sections/FAQ';
import { PageHero } from '@/components/sections/PageHero';

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
      "A full product team for less than half the cost of hiring in-house. Month-to-month flexibility. No overhead. Specialists in system architecture and development.",
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
    question: 'What kind of SaaS products do you build?',
    answer:
      'Dashboards, multi-tenant platforms, internal tools, customer portals. If it runs in a browser or on a phone and serves multiple users, we build it.',
  },
  {
    question: 'Do you handle both frontend and backend development?',
    answer:
      'Yes. We cover the full stack: frontend UI, backend APIs, database architecture, DevOps, and infrastructure. One team, end to end.',
  },
  {
    question: 'Can you take over a product that another team started?',
    answer:
      "Yes. We onboard to existing codebases, audit what's there, and pick up where the last team left off. No restart required.",
  },
  {
    question: 'How does your pricing compare to hiring in-house?',
    answer:
      "About 50% less. You get a full product team for one monthly rate: engineering, design, QA, DevOps, and project management. No recruiting, benefits, or overhead costs.",
  },
  {
    question: 'What does getting started look like?',
    answer:
      "Fill out our contact form and we'll schedule a discovery call. We scope your project, define the team structure, and get moving, usually within a week or two.",
  },
];

export default function SaaSHomePage() {
  return (
    <>
      {/* Hero Section */}
      <PageHero
        title={<>Custom software<br />development as a service</>}
        subtitle="Web, mobile & data software"
        description="A full-stack dev team that builds, tests, and ships your SaaS product. Design, engineering, QA, and DevOps on a month-to-month plan."
        ctaText="Talk to us"
        ctaHref="/intake/request"
        secondaryText="Learn more"
        secondaryHref="/our-model"
        image="/images/saas-hero.jpg"
        imageAlt="SaaS order management dashboard"
        badgeImage="/images/badge-saas.svg"
        imageOverlay={
          <>
            {/* CA logo overlay */}
            <div className="absolute top-4 left-4 z-10 w-20">
              <Image
                src="/images/ca-logo.svg"
                alt="Container Alliance"
                width={80}
                height={32}
                className="w-full h-auto"
              />
            </div>
            {/* Leads portlet floating card */}
            <div className="absolute -bottom-4 -left-8 z-10 w-36 md:w-44">
              <Image
                src="/images/leads-portlet.avif"
                alt="Leads portlet UI card"
                width={220}
                height={160}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </>
        }
      />

      {/* Value Props Section */}
      <FeatureGrid
        label="The SaaS developers behind your next app"
        title="7+ years in business. 120+ employees. 100+ engineers."
        description="Real products built by a team that stays with you from first commit to launch and beyond."
        items={VALUE_PROPS}
        columns={3}
        background="muted"
      />

      {/* Capabilities Section */}
      <FeatureGrid
        title="We build apps so you don't have to"
        items={CAPABILITIES}
        columns={3}
      />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ
        items={FAQ_ITEMS}
        title="The what, the how, the why."
        label="FAQ"
      />

      {/* CTA Section */}
      <CTA />
    </>
  );
}
