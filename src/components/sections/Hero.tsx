'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const [email, setEmail] = useState('');

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/abstract-blue-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/abstract-blue.webm" type="video/webm" />
          <source src="/videos/abstract-blue.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-950" />
      </div>

      {/* Dotted texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/images/dotted-texture.webp')",
          backgroundSize: 'cover',
        }}
      />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-display-1 text-white mb-6 animate-fade-in">
            Your Dev Team as a Service™
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up">
            Development, Project Management, QA, Design, DevOps, and more
          </p>

          {/* Email form */}
          <form
            className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto animate-slide-up"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) {
                window.location.href = `/intake/step-1?email=${encodeURIComponent(email)}`;
              }
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button type="submit" size="lg">
              Scale with Fetchly
            </Button>
          </form>
        </div>
      </Container>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
    </section>
  );
}

export default Hero;
