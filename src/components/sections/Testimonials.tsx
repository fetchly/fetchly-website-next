'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';

const testimonials = [
  {
    quote: "Working with Fetchly to build VRTSync has been a positive and collaborative experience. Their project management is strong, and they've helped translate a complex vision into a functional product. We've appreciated their responsiveness and technical capability throughout the process.",
    author: "Randy Mangel",
    role: "Founder of VRTSync",
    logo: "/images/VRTSync.svg",
  },
  {
    quote: "The team at Fetchly has fit our evolving development needs perfectly, giving us the flexibility to allocate talented developers to projects as needed. They consistently deliver high-quality work, and their project managers do a great job keeping everything on track.",
    author: "Spencer Steffen",
    role: "VP of Engineering at Oats Overnight",
    logo: "/images/oats-overnight.svg",
  },
  {
    quote: "I was, without exaggerating, blown away by the quality, appearance, and functionality of the app.",
    author: "Douglas H. Clements, Ph.D",
    role: "Distinguished Professor and Kennedy Endowed Chair, University of Denver",
    logo: "/images/university-denver.svg",
  },
  {
    quote: "Fetch.ly was an outstanding development partner. They were responsive, clear communicators, and excellent at breaking down technical concepts so everyone stayed on the same page. They delivered an app our client loves, and I am excited to work with them on future projects!",
    author: "Dan Mulligan",
    role: "Partner at YellowDog Design Print and Marketing",
    image: "/images/image.webp",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Section id="testimonials" className="py-24 md:py-32">
      <Container>
        <div className="text-center mb-12">
          <Badge className="mb-4">Testimonials</Badge>
          <h2 className="text-display-2 text-white">
            What our clients say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="relative">
            <div className="bg-gray-900/50 rounded-2xl border border-white/10 p-8 md:p-12">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} className="w-6 h-6 text-[#1F444B]" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-white font-normal leading-relaxed mb-8">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {currentTestimonial.logo ? (
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center p-2">
                    <Image
                      src={currentTestimonial.logo}
                      alt={currentTestimonial.author}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : currentTestimonial.image ? (
                  <Image
                    src={currentTestimonial.image}
                    alt={currentTestimonial.author}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-white font-semibold">{currentTestimonial.author}</p>
                  <p className="text-gray-400 text-sm">{currentTestimonial.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-16 -right-16 justify-between pointer-events-none">
              <button
                onClick={goToPrevious}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors pointer-events-auto"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default Testimonials;
