'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { SectionHeader } from './SectionHeader';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQAccordionProps {
  /** Section title */
  title?: string;
  /** Optional description below the title */
  description?: string;
  /** Array of FAQ items */
  items: FAQItem[];
  /** Background variant */
  background?: 'default' | 'muted';
  /** Layout variant */
  layout?: 'centered' | 'two-column';
  /** Whether to use controlled state (managed accordion) or uncontrolled (native details) */
  controlled?: boolean;
  /** Show CTA button at bottom */
  showCTA?: boolean;
  /** CTA button text */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Additional className */
  className?: string;
}

function FAQItemControlled({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/60">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <Text
          as="span"
          size="base"
          className="font-semibold pr-4 text-foreground"
        >
          {item.question}
        </Text>
        <span
          className={cn(
            'flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 text-foreground-muted',
            isOpen && 'rotate-45'
          )}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 pb-5' : 'max-h-0'
        )}
      >
        <Text as="div" className="text-foreground-muted">
          {item.answer}
        </Text>
      </div>
    </div>
  );
}

function FAQItemUncontrolled({ item }: { item: FAQItem }) {
  return (
    <details className="group border-b border-border/60">
      <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
        <Text
          as="span"
          size="lg"
          className="font-semibold pr-4 text-foreground"
        >
          {item.question}
        </Text>
        <span className="flex-shrink-0 text-foreground-muted transition-transform duration-300 group-open:rotate-45">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </span>
      </summary>
      <div className="pb-5">
        <Text className="text-foreground-muted">{item.answer}</Text>
      </div>
    </details>
  );
}

export function FAQAccordion({
  title = 'FAQ',
  description,
  items,
  background = 'default',
  layout = 'centered',
  controlled = false,
  showCTA = false,
  ctaText = 'Get in Touch',
  ctaHref = '/intake/step-1',
  className,
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFAQItems = () => (
    <ScrollReveal stagger={0.1} direction="up" distance={30}>
      <div className="divide-y-0 border-t border-border/60">
        {items.map((item, index) =>
          controlled ? (
            <div key={index} data-reveal>
              <FAQItemControlled
                item={item}
                isOpen={openIndex === index}
                onToggle={() => toggleItem(index)}
              />
            </div>
          ) : (
            <div key={index} data-reveal>
              <FAQItemUncontrolled item={item} />
            </div>
          )
        )}
      </div>
    </ScrollReveal>
  );

  if (layout === 'two-column') {
    return (
      <Section
        background={background}
        className={cn('py-12 md:py-16', className)}
      >
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[0.75fr_1fr] gap-12 lg:gap-20">
            <div>
              <Text size="sm" className="uppercase tracking-[1px] font-semibold text-foreground-subtle mb-4">
                FAQ
              </Text>
              <Heading level="display-2" className="text-foreground">
                {title}
              </Heading>
            </div>
            {renderFAQItems()}
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section
      background={background}
      className={cn('py-12 md:py-16', className)}
    >
      <Container size="md">
        <SectionHeader title={title} description={description} />
        {renderFAQItems()}
        {showCTA && (
          <div className="text-center mt-12">
            <Button href={ctaHref} size="lg">
              {ctaText}
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}

export default FAQAccordion;
