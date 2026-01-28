import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="relative bg-gray-950 border-t border-white/10">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/abstract-glass-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src="/videos/abstract-glass.webm" type="video/webm" />
          <source src="/videos/abstract-glass.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/95 to-gray-950/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/images/fetchly-logo.svg"
                  alt="Fetchly"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-gray-400 max-w-md mb-6">
                Your dev team as a service. We help companies build great products with
                fully aligned, high-performing development teams.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label={social.name}
                  >
                    {social.icon === 'linkedin' && <LinkedInIcon className="w-5 h-5" />}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.navigation.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
              <ul className="space-y-3">
                {FOOTER_LINKS.contact.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Fetchly Labs. All rights reserved.</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default Footer;
