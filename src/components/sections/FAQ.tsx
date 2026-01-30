'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { FAQ_ITEMS } from '@/lib/constants';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { cn } from '@/lib/utils';

// ~250 WPM = ~4 words/sec
const MS_PER_WORD = 220;

function getDuration(answer: string) {
  return answer.split(/\s+/).length * MS_PER_WORD;
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalItems = FAQ_ITEMS.length;

  // Observe section visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const advanceToNext = useCallback(() => {
    setOpenIndex((prev) => {
      const next = prev + 1;
      if (next >= totalItems) {
        setFinished(true);
        return prev;
      }
      return next;
    });
    setProgress(0);
    startTimeRef.current = performance.now();
  }, [totalItems]);

  // Animation loop for progress bar
  useEffect(() => {
    if (paused || !isVisible || finished) return;

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const duration = getDuration(FAQ_ITEMS[openIndex].answer);
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);

      if (pct >= 1) {
        advanceToNext();
        return;
      }

      timerRef.current = requestAnimationFrame(tick);
    };

    timerRef.current = requestAnimationFrame(tick);

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [paused, isVisible, finished, openIndex, advanceToNext]);

  const handleClick = (index: number) => {
    // Clicking the open item pauses/resumes
    if (index === openIndex) {
      setPaused((p) => !p);
      return;
    }
    // Clicking a different item switches to it and resets the timer
    setOpenIndex(index);
    setProgress(0);
    setPaused(false);
    startTimeRef.current = performance.now();
  };

  return (
    <Section id="faq" background="muted">
      <Container size="md">
        <ScrollReveal direction="up" distance={30}>
          <div className="text-center mb-16">
            <Badge className="mb-4">FAQ</Badge>
            <Heading level="display-2" className="text-foreground mb-4">
              FAQs
            </Heading>
          </div>
        </ScrollReveal>

        <div ref={sectionRef}>
          <ScrollReveal stagger={0.1} direction="up" distance={30}>
            <div>
              {FAQ_ITEMS.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    data-reveal
                    className="border-b border-border/60 relative"
                  >
                    {/* Progress bar */}
                    {isOpen && !finished && (
                      <div className="absolute -bottom-[3px] left-0 w-full h-[6px] transition-none" style={{
                        background: `radial-gradient(ellipse ${20 + Math.sin(progress * Math.PI) * 40}px 6px at ${progress * 100}% 50%, var(--color-accent) 0%, var(--color-primary) 20%, rgba(4,255,168,0.15) 50%, transparent 100%)`
                      }} />
                    )}
                    <button
                      onClick={() => handleClick(index)}
                      className="w-full flex items-center justify-between py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <Text as="span" className={cn(
                        'font-semibold pr-4 transition-colors duration-300',
                        isOpen ? 'text-foreground' : 'text-foreground-muted'
                      )}>
                        {item.question}
                      </Text>
                      <span
                        className={cn(
                          'flex-shrink-0 w-5 h-5 flex items-center justify-center text-foreground-muted transition-transform duration-300',
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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
              })}
            </div>
          </ScrollReveal>

          {/* CTA revealed after all items have cycled */}
          <div className={cn(
            'overflow-hidden transition-all duration-500 ease-out',
            finished ? 'max-h-40 opacity-100 mt-10' : 'max-h-0 opacity-0'
          )}>
            <div className="text-center">
              <Text className="text-foreground-muted mb-4">Still have questions?</Text>
              <Button href="/intake/step-1" size="lg">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default FAQ;
