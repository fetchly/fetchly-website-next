#!/usr/bin/env node
/**
 * Fetchly Website Migration - Structured React Project
 *
 * Creates a properly organized Next.js project with:
 * - Reusable UI components (Button, Card, Input, etc.)
 * - Layout components (Navbar, Footer, Container)
 * - Section components (Hero, Features, Testimonials)
 * - Proper TypeScript interfaces
 * - Tailwind CSS utilities
 * - GSAP animation hooks
 *
 * Usage: node scripts/migrate-structured.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  sourceHtml: path.join(__dirname, '../../index.html'),
  sourceAssets: {
    images: path.join(__dirname, '../../images'),
    videos: path.join(__dirname, '../../videos'),
    css: path.join(__dirname, '../../css'),
  },
  output: {
    root: path.join(__dirname, '..'),
    src: path.join(__dirname, '../src'),
    components: path.join(__dirname, '../src/components'),
    ui: path.join(__dirname, '../src/components/ui'),
    layout: path.join(__dirname, '../src/components/layout'),
    sections: path.join(__dirname, '../src/components/sections'),
    hooks: path.join(__dirname, '../src/hooks'),
    lib: path.join(__dirname, '../src/lib'),
    types: path.join(__dirname, '../src/types'),
    styles: path.join(__dirname, '../src/styles'),
    app: path.join(__dirname, '../src/app'),
    public: path.join(__dirname, '../public'),
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return 0;
  ensureDir(dest);
  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }
  return count;
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// ============================================================================
// HTML TO JSX CONVERTER
// ============================================================================

class HtmlToJsxConverter {
  constructor() {
    this.selfClosingTags = new Set([
      'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
      'link', 'meta', 'param', 'source', 'track', 'wbr'
    ]);

    this.attrMap = {
      'class': 'className',
      'for': 'htmlFor',
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'maxlength': 'maxLength',
      'colspan': 'colSpan',
      'rowspan': 'rowSpan',
      'cellpadding': 'cellPadding',
      'cellspacing': 'cellSpacing',
      'frameborder': 'frameBorder',
      'allowfullscreen': 'allowFullScreen',
      'autocomplete': 'autoComplete',
      'autofocus': 'autoFocus',
      'contenteditable': 'contentEditable',
      'crossorigin': 'crossOrigin',
      'datetime': 'dateTime',
      'enctype': 'encType',
      'hreflang': 'hrefLang',
      'inputmode': 'inputMode',
      'novalidate': 'noValidate',
      'srcset': 'srcSet',
      'usemap': 'useMap',
      'charset': 'charSet',
      'spellcheck': 'spellCheck',
    };

    this.booleanAttrs = new Set([
      'disabled', 'checked', 'selected', 'required', 'multiple',
      'autoplay', 'controls', 'loop', 'muted', 'hidden', 'readonly',
      'autofocus', 'novalidate', 'formnovalidate', 'open', 'reversed'
    ]);
  }

  convert(html) {
    let jsx = html;

    // Remove HTML comments or convert to JSX comments
    jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

    // Handle CDATA sections
    jsx = jsx.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');

    // Convert attributes
    for (const [htmlAttr, jsxAttr] of Object.entries(this.attrMap)) {
      const regex = new RegExp(`\\s${htmlAttr}=`, 'gi');
      jsx = jsx.replace(regex, ` ${jsxAttr}=`);
    }

    // Handle boolean attributes
    for (const attr of this.booleanAttrs) {
      // Convert standalone boolean attributes
      const standaloneRegex = new RegExp(`\\s${attr}(?=[\\s>])`, 'gi');
      jsx = jsx.replace(standaloneRegex, ` ${attr}={true}`);
      // Convert boolean="boolean" or boolean="true"
      const valueRegex = new RegExp(`\\s${attr}="${attr}"`, 'gi');
      jsx = jsx.replace(valueRegex, ` ${attr}={true}`);
    }

    // Handle inline styles - convert to object syntax
    jsx = jsx.replace(/\sstyle="([^"]*)"/g, (match, styleStr) => {
      if (!styleStr.trim()) return '';
      const styles = this.parseInlineStyle(styleStr);
      if (!styles) return match;
      return ` style={${styles}}`;
    });

    // Self-closing tags
    for (const tag of this.selfClosingTags) {
      const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
      jsx = jsx.replace(regex, `<${tag}$1 />`);
    }

    // Fix SVG attributes
    jsx = this.fixSvgAttributes(jsx);

    return jsx;
  }

  parseInlineStyle(styleStr) {
    try {
      const styles = styleStr.split(';')
        .filter(s => s.trim())
        .map(s => {
          const colonIndex = s.indexOf(':');
          if (colonIndex === -1) return null;
          const prop = s.substring(0, colonIndex).trim();
          const val = s.substring(colonIndex + 1).trim();
          if (!prop || !val) return null;

          // Convert kebab-case to camelCase
          const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          // Handle numeric values
          const numericVal = parseFloat(val);
          if (!isNaN(numericVal) && val === String(numericVal)) {
            return `${camelProp}: ${numericVal}`;
          }
          return `${camelProp}: '${val.replace(/'/g, "\\'")}'`;
        })
        .filter(Boolean);

      return styles.length ? `{ ${styles.join(', ')} }` : null;
    } catch (e) {
      return null;
    }
  }

  fixSvgAttributes(jsx) {
    const svgAttrMap = {
      'viewbox': 'viewBox',
      'preserveaspectratio': 'preserveAspectRatio',
      'xlink:href': 'xlinkHref',
      'xml:space': 'xmlSpace',
      'fill-rule': 'fillRule',
      'clip-rule': 'clipRule',
      'stroke-width': 'strokeWidth',
      'stroke-linecap': 'strokeLinecap',
      'stroke-linejoin': 'strokeLinejoin',
      'stroke-dasharray': 'strokeDasharray',
      'stroke-dashoffset': 'strokeDashoffset',
      'stroke-miterlimit': 'strokeMiterlimit',
      'stroke-opacity': 'strokeOpacity',
      'fill-opacity': 'fillOpacity',
      'font-family': 'fontFamily',
      'font-size': 'fontSize',
      'text-anchor': 'textAnchor',
      'dominant-baseline': 'dominantBaseline',
    };

    for (const [svg, react] of Object.entries(svgAttrMap)) {
      const regex = new RegExp(`\\s${svg}=`, 'gi');
      jsx = jsx.replace(regex, ` ${react}=`);
    }

    return jsx;
  }
}

// ============================================================================
// CONTENT EXTRACTOR
// ============================================================================

class ContentExtractor {
  constructor(dom) {
    this.dom = dom;
    this.document = dom.window.document;
  }

  extractMetadata() {
    const doc = this.document;
    const get = (sel) => doc.querySelector(sel)?.content || doc.querySelector(sel)?.textContent || '';

    return {
      title: get('title') || 'Fetchly',
      description: get('meta[name="description"]'),
      ogTitle: get('meta[property="og:title"]'),
      ogDescription: get('meta[property="og:description"]'),
      ogImage: get('meta[property="og:image"]'),
      ogType: get('meta[property="og:type"]') || 'website',
      twitterCard: get('meta[name="twitter:card"]') || 'summary_large_image',
      twitterTitle: get('meta[property="twitter:title"]'),
      twitterDescription: get('meta[property="twitter:description"]'),
      googleVerification: get('meta[name="google-site-verification"]'),
      jsonLd: this.extractJsonLd(),
    };
  }

  extractJsonLd() {
    const script = this.document.querySelector('script[type="application/ld+json"]');
    if (!script) return null;
    try {
      return JSON.parse(script.textContent);
    } catch {
      return null;
    }
  }

  extractNavigation() {
    const nav = this.document.querySelector('.navbar2_component, [role="banner"], nav');
    if (!nav) return null;

    const links = [];
    nav.querySelectorAll('a.navbar2_link, .w-nav-link').forEach(a => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent?.trim() || '';
      if (text && !href.includes('javascript:')) {
        links.push({
          label: text,
          href: href.replace('https://www.fetch.ly', '').replace('index.html', '/') || '/',
        });
      }
    });

    // Extract logo SVG
    const logoSvg = nav.querySelector('.vector-logo svg, .logo svg');
    const logo = logoSvg ? logoSvg.outerHTML : null;

    // Extract CTA button
    const ctaButton = nav.querySelector('.button, [class*="cta"]');
    const cta = ctaButton ? {
      text: ctaButton.textContent?.trim(),
      href: ctaButton.getAttribute('href'),
    } : null;

    return { links, logo, cta, html: nav.outerHTML };
  }

  extractHero() {
    const heroSelectors = [
      '.header30_content',
      '.section_header25',
      '.header2_content',
      '[class*="hero"]',
      'header',
    ];

    for (const sel of heroSelectors) {
      const el = this.document.querySelector(sel);
      if (el) {
        const h1 = el.querySelector('h1')?.textContent?.trim();
        const h2 = el.querySelector('h2')?.textContent?.trim();
        const subtitle = el.querySelector('.text-size-regular, [class*="subtitle"]')?.textContent?.trim();

        return {
          headline: h1 || '',
          subheadline: h2 || subtitle || '',
          html: el.outerHTML,
        };
      }
    }
    return null;
  }

  extractSections() {
    const mainWrapper = this.document.querySelector('.main-wrapper') || this.document.body;
    const sections = [];
    const processed = new WeakSet();

    // Define section patterns
    const patterns = [
      { name: 'LogoCloud', selectors: ['[class*="marquee"]', '.logo-cloud', '[class*="logo_"]'] },
      { name: 'Features', selectors: ['[class*="layout6"]', '[class*="layout237"]', '[class*="feature"]'] },
      { name: 'Comparison', selectors: ['[class*="comparison"]', '[class*="pricing"]', '[class*="layout308"]'] },
      { name: 'Services', selectors: ['[class*="services"]', '[class*="layout4"]'] },
      { name: 'WhyUs', selectors: ['[class*="why"]', '[class*="benefit"]'] },
      { name: 'Testimonials', selectors: ['[class*="testimonial"]'] },
      { name: 'CaseStudies', selectors: ['[class*="case-stud"]', '[class*="portfolio"]', '[class*="project"]'] },
      { name: 'FAQ', selectors: ['[class*="faq"]', '[class*="accordion"]'] },
      { name: 'CTA', selectors: ['[class*="cta"]', '[class*="call-to-action"]'] },
      { name: 'Contact', selectors: ['[class*="contact"]', '[class*="form_component"]'] },
      { name: 'Footer', selectors: ['footer', '[class*="footer"]'] },
    ];

    for (const pattern of patterns) {
      for (const selector of pattern.selectors) {
        const elements = mainWrapper.querySelectorAll(selector);
        elements.forEach((el, idx) => {
          if (processed.has(el)) return;

          // Skip if nested in processed element
          let parent = el.parentElement;
          while (parent && parent !== mainWrapper) {
            if (processed.has(parent)) return;
            parent = parent.parentElement;
          }

          processed.add(el);
          const name = idx > 0 ? `${pattern.name}${idx + 1}` : pattern.name;
          sections.push({
            name,
            type: pattern.name,
            html: el.outerHTML,
            className: el.className,
          });
        });
      }
    }

    return sections;
  }

  extractButtons() {
    const buttons = [];
    const seen = new Set();

    this.document.querySelectorAll('.button, .w-button, [class*="btn"]').forEach(btn => {
      const classes = btn.className || '';
      const text = btn.textContent?.trim() || '';

      // Create a signature to avoid duplicates
      const sig = `${classes}|${text.substring(0, 20)}`;
      if (seen.has(sig)) return;
      seen.add(sig);

      // Determine button variant
      let variant = 'default';
      if (classes.includes('hero') || classes.includes('primary')) variant = 'primary';
      else if (classes.includes('secondary') || classes.includes('outline')) variant = 'secondary';
      else if (classes.includes('small') || classes.includes('is-small')) variant = 'small';

      buttons.push({
        variant,
        classes,
        hasIcon: !!btn.querySelector('svg, [class*="icon"]'),
        sample: btn.outerHTML,
      });
    });

    return buttons;
  }

  extractForms() {
    const forms = [];
    this.document.querySelectorAll('form, .w-form, [class*="form_"]').forEach(form => {
      const inputs = [];
      form.querySelectorAll('input, textarea, select').forEach(input => {
        inputs.push({
          type: input.type || input.tagName.toLowerCase(),
          name: input.name,
          placeholder: input.placeholder,
          required: input.required,
          className: input.className,
        });
      });
      forms.push({ inputs, html: form.outerHTML });
    });
    return forms;
  }

  extractTestimonials() {
    const testimonials = [];
    this.document.querySelectorAll('[class*="testimonial"]').forEach(el => {
      const quote = el.querySelector('[class*="quote"], [class*="text"], p')?.textContent?.trim();
      const author = el.querySelector('[class*="author"], [class*="name"]')?.textContent?.trim();
      const role = el.querySelector('[class*="role"], [class*="title"], [class*="position"]')?.textContent?.trim();
      const image = el.querySelector('img')?.getAttribute('src');

      if (quote) {
        testimonials.push({ quote, author, role, image });
      }
    });
    return testimonials;
  }
}

// ============================================================================
// COMPONENT GENERATORS
// ============================================================================

const generators = {
  // Types
  generateTypes() {
    return `// Component prop types

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'muted' | 'dark';
}

export interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteMetadata {
  title: string;
  description: string;
  ogImage?: string;
}
`;
  },

  // Utility functions
  generateUtils() {
    return `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Generate unique ID
 */
export function generateId(prefix = 'id'): string {
  return \`\${prefix}-\${Math.random().toString(36).substring(2, 9)}\`;
}
`;
  },

  // Button component
  generateButton() {
    return `import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/types';

const variants = {
  primary: 'bg-[#69E5FB] text-black hover:bg-[#4dd4ec] font-medium',
  secondary: 'bg-gray-800 text-white hover:bg-gray-700',
  outline: 'border-2 border-current bg-transparent hover:bg-white/10',
  ghost: 'bg-transparent hover:bg-white/10',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled,
  className,
  icon,
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#69E5FB]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {icon}
      {children}
    </button>
  );
}

export default Button;
`;
  },

  // Input component
  generateInput() {
    return `'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { InputProps } from '@/types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-lg border transition-colors duration-200',
            'bg-white text-gray-900 placeholder:text-gray-500',
            'border-gray-300 focus:border-[#69E5FB] focus:ring-2 focus:ring-[#69E5FB]/20',
            'outline-none',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
`;
  },

  // Card component
  generateCard() {
    return `import { cn } from '@/lib/utils';
import type { CardProps } from '@/types';

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10',
        'p-6 md:p-8',
        hover && 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-xl font-semibold', className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-gray-400 mt-2', className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

export default Card;
`;
  },

  // Container component
  generateContainer() {
    return `import { cn } from '@/lib/utils';
import type { ContainerProps } from '@/types';

const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({ children, className, size = 'xl' }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 md:px-6 lg:px-8', sizes[size], className)}>
      {children}
    </div>
  );
}

export default Container;
`;
  },

  // Section component
  generateSection() {
    return `import { cn } from '@/lib/utils';
import type { SectionProps } from '@/types';

const backgrounds = {
  default: 'bg-transparent',
  muted: 'bg-gray-900/50',
  dark: 'bg-gray-950',
};

export function Section({ children, className, id, background = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24 lg:py-32',
        backgrounds[background],
        className
      )}
    >
      {children}
    </section>
  );
}

export default Section;
`;
  },

  // Navbar component
  generateNavbar(navData) {
    const links = navData?.links || [];
    const linksJson = JSON.stringify(links, null, 2);

    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

const navLinks = ${linksJson};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-gray-950/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <FetchlyLogo className="h-8 w-auto text-white" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/intake/request" size="sm">
              Get in Touch
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Button href="/intake/request" className="w-full">
                Get in Touch
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

function FetchlyLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1458 473" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1453.6 273.98C1440.44 261.73 1425.47 287 1415.34 294.17C1405.5 303.56 1394.87 312.16 1384.34 320.81C1379.78 323.67 1374.98 319.88 1377.28 315.29C1398.29 257.85 1413.49 198.57 1434.91 141.22C1437.4 133.91 1435.12 129.46 1426.18 129.46C1372.11 129.11 1397.26 123.56 1363.9 196.67C1349.54 226.99 1332.24 298.23 1279.57 281.21C1244.84 258.99 1294.63 174.79 1301.32 142.56C1304.34 134.73 1301.21 128.73 1292.15 128.73C1276.95 130.2 1253.64 123.08 1247.88 142.2C1227.49 191.61 1214.37 277.26 1149.1 291.98C1091.5 300.59 1171.35 118.14 1175.79 87.75C1183.02 63.71 1191.2 39.87 1196.91 15.4C1198.45 8.6 1193.1 2.13 1185.81 2.13C1169.72 1.94 1149.43 -0.690001 1145.05 19.09C1111.5 103.23 1107.34 242.56 1019.88 291.97C1011.13 295.58 996.29 294.93 998.7 280.25C1006.35 239.28 1027.38 210.04 1026.92 170.16C1018.84 105.06 941.66 116.51 905.27 153.11C917.4 106.2 933.4 59.66 948.37 13.39C951.74 -3.24 922.02 2.66 912.43 2.61C898.26 4.72 896.09 19.62 892.8 31.07C879.9 79.21 862.99 126.16 848.96 173.95C837.77 214.69 821.05 251.26 794.07 270.12C659.03 370.19 611.11 168.69 727.07 169.25C762.14 173.18 740.24 196.96 760.22 198.09C767.85 198.4 775.51 198.59 783.13 198.23C797.68 197.47 797.2 185.93 796.8 175.03C796.36 156.56 781.27 138.75 771.42 132.98C710.91 98.7 642.76 143.02 624.09 213.06C563.23 326.54 483.76 322.78 534.34 181.67C537.78 169.67 541.41 169.09 549.92 168.87C564.35 168.48 578.78 168.25 593.21 167.74C605.25 168.28 609.96 154.5 613.42 144.17C616.59 135.84 612.6 130.18 603.47 130.01C533.56 127.59 550.11 144.04 578.34 41.77C582.78 28.87 552.3 34.97 540.78 33.69C533.34 33.69 529.31 38.45 526.88 47.12L506.39 113.93C502.13 127.97 502.52 129.93 483.62 129.8C469.88 129.72 468.3 128.67 466.43 134.72C463.48 144.32 459.71 151.87 457.01 160.61C455.24 166.33 457.05 166.99 465.33 167.28C471.52 167.49 473.12 167.49 477.88 167.72C484.26 168.03 487.23 168.14 485.55 176.63C482.18 242.68 369.15 339.12 312.42 274.97C306.02 263.97 310.76 261.14 318.6 260.03C466.27 255.93 468.39 90.84 328.59 129.7C261.58 148.95 233.26 244.75 268.9 303C314.51 368.56 413.2 340.62 457.01 287.05C458.84 284.15 463.37 282.11 464.5 286.61C464.9 315.93 485.6 340.49 516.35 340.59C564.86 342.65 594.49 301.26 618.98 268.26C642.67 359.96 758.41 346.79 809.26 299.89C808.39 309.01 790.11 335 806.61 337.24C824.4 336.86 848.22 344.38 855.31 320.45C866.51 277.07 896.33 181.82 946.19 170.57C960.18 167.77 974.45 172.59 972.45 188.3C968.3 217.77 953.25 251.52 947.28 281.33C943.05 301.07 947.05 338.22 1008.53 338.22C1045.09 338.22 1058.53 304.53 1075.53 280.86C1073.27 294.43 1082.33 320.41 1098.61 330.25C1140.93 359.96 1187.35 317.82 1212.16 282.68C1219.7 326.11 1274.27 349.91 1326.57 308.91C1322.52 318.9 1323.52 339.2 1310.79 340.87C1282.89 344.75 1255.39 350.36 1229.79 362.02C1172.96 382.37 1175.83 472.17 1243.25 472.37C1304.27 477.73 1334.74 423.78 1356.39 375.98C1361.33 365.66 1368.48 361.85 1377.78 353.46C1409.14 325.16 1422.01 314.34 1454.57 286.66C1457.24 284.41 1459.01 278.82 1453.57 273.98H1453.6ZM305.96 223.13C310.63 200.03 328.85 168.66 361.01 169.22C376.92 169.36 382.94 177.38 381.84 191.83C380.07 215 344.81 228.05 314.6 230.44C312.42 230.64 304.55 229.6 305.96 223.13ZM1302 382C1292.68 397.05 1283.21 412.64 1269.07 423.67C1261.17 430.1 1252.96 430.32 1246.7 430.1C1216.69 428.21 1231.8 390.53 1250.87 386.8C1265.05 381.58 1279.56 377.27 1294.05 372.92C1301.18 370.77 1306.05 377.31 1302 382Z" fill="currentColor"/>
      <path d="M253.44 156.42C254.44 152.55 250.03 149.25 246.03 149.26H217.15C196.03 149.16 154.65 148.54 133.55 149.08H133.34C114.34 149.08 119.2 141.65 121.59 134.13C129.32 109.83 137.3 86.06 144.85 61.68C148 51.56 151.78 48.62 163 48.86C203.34 48.94 280.11 48.8 320.45 48.56C323.94 48.48 327.36 47.54 330.4 45.83C337.08 42 339.07 34 345.85 7.77C346.85 3.71 342.91 0.33 336.76 0.21C332.05 0.12 327.3 0 322.56 0C266 0.45 172.94 -0.46 116.38 0.45C112.05 0.57 105.72 5.14 104 9.12C98.58 21.82 94.81 35.18 90.57 48.34C73.66 101.27 66.6 126.61 41.2 201C31.84 227.69 24.41 255 16.02 281.93C11.07 297.73 5.62001 313.4 0.510012 329.18C-1.43999 335.18 2.44001 338.9 7.67001 339.18C19.85 340.01 32.08 339.96 44.25 339.04C49.25 338.66 56.57 334.11 58.03 329.92C67.48 302.92 75.6 275.44 84.14 248.12C87.88 236.12 90.05 227.61 95.67 209.12C97.33 203.68 103.35 198.46 109.47 198.46C114.32 198.46 118.87 198.62 124.08 198.46C154.98 197.55 190.78 198.21 227 198.21C239.92 198.27 247.07 181 253.44 156.42Z" fill="currentColor"/>
    </svg>
  );
}

export default Navbar;
`;
  },

  // Footer component
  generateFooter(navData) {
    const links = navData?.links || [];

    return `import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const footerLinks = ${JSON.stringify(links, null, 2)};

const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/fetchly-labs', icon: LinkedInIcon },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-white">Fetchly</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Your dev team as a service. We help companies build great products with
              fully aligned, high-performing development teams.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/intake/request" className="text-gray-400 hover:text-white transition-colors">
                  Request a Quote
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Fetchly Labs. All rights reserved.</p>
        </div>
      </Container>
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
`;
  },

  // Hero section
  generateHero(heroData) {
    const headline = heroData?.headline || 'Your Dev Team as a Service™';
    const subheadline = heroData?.subheadline || 'Development, Project Management, QA, Design, DevOps, and more';

    return `'use client';

import { useRef, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
      <div className="absolute inset-0 bg-[url('/images/dotted-texture.webp')] opacity-20" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            ref={headlineRef}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
          >
            ${headline.replace(/'/g, "\\'")}
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            ${subheadline.replace(/'/g, "\\'")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button size="lg">
              Scale with Fetchly
            </Button>
          </div>
        </div>
      </Container>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent" />
    </section>
  );
}

export default Hero;
`;
  },

  // Generic section template
  generateSectionComponent(name, content, converter) {
    const jsx = converter.convert(content);
    const escapedJsx = jsx
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');

    return `'use client';

/**
 * ${name} Section
 *
 * TODO: Convert from dangerouslySetInnerHTML to proper JSX
 * This is a placeholder that preserves the original content
 */
export function ${name}() {
  return (
    <div
      className="${toKebabCase(name)}-section"
      dangerouslySetInnerHTML={{ __html: \`${escapedJsx}\` }}
    />
  );
}

export default ${name};
`;
  },

  // GSAP animation hook
  generateUseGsap() {
    return `'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for GSAP animations with proper cleanup
 *
 * Usage:
 * const containerRef = useGsap((gsap, container) => {
 *   gsap.from(container.querySelectorAll('.animate'), {
 *     opacity: 0,
 *     y: 50,
 *     stagger: 0.1,
 *   });
 * });
 */
export function useGsap<T extends HTMLElement = HTMLDivElement>(
  animation: (gsap: typeof import('gsap').gsap, container: T) => void | (() => void),
  deps: React.DependencyList = []
) {
  const containerRef = useRef<T>(null);
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    const loadGsap = async () => {
      if (!containerRef.current) return;

      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');

      gsap.registerPlugin(ScrollTrigger);

      cleanupRef.current = animation(gsap, containerRef.current);
    };

    loadGsap();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, deps);

  return containerRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: {
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
    trigger?: string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
  } = {}
) {
  const {
    from = { opacity: 0, y: 50 },
    to = { opacity: 1, y: 0 },
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
  } = options;

  return useGsap<T>((gsap, container) => {
    const targets = trigger ? container.querySelectorAll(trigger) : container;

    gsap.fromTo(targets, from, {
      ...to,
      scrollTrigger: {
        trigger: container,
        start,
        end,
        scrub,
      },
    });
  });
}

export default useGsap;
`;
  },

  // Global styles
  generateGlobalStyles() {
    return `@import 'tailwindcss';

/* Custom CSS Variables */
:root {
  --color-primary: #69E5FB;
  --color-primary-dark: #4dd4ec;
  --color-background: #0a0a0a;
  --color-foreground: #ffffff;
  --color-muted: #737373;
  --font-sans: var(--font-inter), system-ui, sans-serif;
}

/* Base Styles */
html {
  font-size: 1.125rem;
  scroll-behavior: smooth;
}

@media screen and (max-width: 1920px) {
  html { font-size: calc(0.625rem + 0.417vw); }
}

@media screen and (max-width: 1440px) {
  html { font-size: calc(0.813rem + 0.208vw); }
}

@media screen and (max-width: 479px) {
  html { font-size: calc(0.749rem + 0.837vw); }
}

body {
  @apply bg-gray-950 text-white antialiased;
  font-family: var(--font-sans);
}

/* Selection */
::selection {
  background: var(--color-primary);
  color: #000000;
}

/* Focus styles */
:focus-visible {
  @apply outline-none ring-2 ring-[#69E5FB] ring-offset-2 ring-offset-gray-950;
}

/* Smooth scrolling for anchor links */
html:has(:target) {
  scroll-behavior: smooth;
}

/* Animation utilities */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.5s ease-out forwards;
}

/* Marquee animation */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
`;
  },

  // Layout
  generateLayout(metadata) {
    return `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fetch.ly'),
  title: {
    default: '${metadata.title.replace(/'/g, "\\'")}',
    template: '%s | Fetchly',
  },
  description: '${metadata.description.replace(/'/g, "\\'")}',
  openGraph: {
    title: '${metadata.ogTitle.replace(/'/g, "\\'")}',
    description: '${metadata.ogDescription.replace(/'/g, "\\'")}',
    images: ['${metadata.ogImage}'],
    type: 'website',
    siteName: 'Fetchly',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${metadata.twitterTitle.replace(/'/g, "\\'")}',
    description: '${metadata.twitterDescription.replace(/'/g, "\\'")}',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
`;
  },

  // Main page
  generatePage(sections) {
    const imports = sections
      .map(s => `import { ${s.name} } from '@/components/sections/${s.name}';`)
      .join('\n');

    const components = sections
      .map(s => `      <${s.name} />`)
      .join('\n');

    return `import { Hero } from '@/components/sections/Hero';
${imports}

export default function HomePage() {
  return (
    <>
      <Hero />
${components}
    </>
  );
}
`;
  },

  // Component index
  generateComponentIndex(components) {
    return components
      .map(c => `export { ${c} } from './${c}';`)
      .join('\n') + '\n';
  },
};

// ============================================================================
// MAIN MIGRATION
// ============================================================================

async function migrate() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║      Fetchly Migration - Structured React Project          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  // 1. Read and parse HTML
  console.log('📖 Reading source HTML...');
  if (!fs.existsSync(CONFIG.sourceHtml)) {
    console.error(`❌ Source not found: ${CONFIG.sourceHtml}`);
    process.exit(1);
  }
  const html = fs.readFileSync(CONFIG.sourceHtml, 'utf-8');
  const dom = new JSDOM(html);
  const extractor = new ContentExtractor(dom);
  const converter = new HtmlToJsxConverter();

  // 2. Create directory structure
  console.log('\n📁 Creating project structure...');
  Object.values(CONFIG.output).forEach(ensureDir);

  // 3. Copy assets
  console.log('\n📦 Copying assets...');
  const imgCount = copyDir(CONFIG.sourceAssets.images, path.join(CONFIG.output.public, 'images'));
  const vidCount = copyDir(CONFIG.sourceAssets.videos, path.join(CONFIG.output.public, 'videos'));
  console.log(`   ✓ ${imgCount} images, ${vidCount} videos`);

  // 4. Extract content
  console.log('\n🔍 Extracting content...');
  const metadata = extractor.extractMetadata();
  const navData = extractor.extractNavigation();
  const heroData = extractor.extractHero();
  const sections = extractor.extractSections();
  console.log(`   ✓ Metadata, navigation, ${sections.length} sections`);

  // 5. Generate types
  console.log('\n📝 Generating TypeScript types...');
  writeFile(path.join(CONFIG.output.types, 'index.ts'), generators.generateTypes());

  // 6. Generate utilities
  console.log('🔧 Generating utilities...');
  writeFile(path.join(CONFIG.output.lib, 'utils.ts'), generators.generateUtils());

  // 7. Generate UI components
  console.log('\n🎨 Generating UI components...');
  writeFile(path.join(CONFIG.output.ui, 'Button.tsx'), generators.generateButton());
  writeFile(path.join(CONFIG.output.ui, 'Input.tsx'), generators.generateInput());
  writeFile(path.join(CONFIG.output.ui, 'Card.tsx'), generators.generateCard());
  writeFile(path.join(CONFIG.output.ui, 'Container.tsx'), generators.generateContainer());
  writeFile(path.join(CONFIG.output.ui, 'Section.tsx'), generators.generateSection());
  writeFile(path.join(CONFIG.output.ui, 'index.ts'), generators.generateComponentIndex([
    'Button', 'Input', 'Card', 'Container', 'Section'
  ]));
  console.log('   ✓ Button, Input, Card, Container, Section');

  // 8. Generate layout components
  console.log('\n🏗️  Generating layout components...');
  writeFile(path.join(CONFIG.output.layout, 'Navbar.tsx'), generators.generateNavbar(navData));
  writeFile(path.join(CONFIG.output.layout, 'Footer.tsx'), generators.generateFooter(navData));
  writeFile(path.join(CONFIG.output.layout, 'index.ts'), generators.generateComponentIndex(['Navbar', 'Footer']));
  console.log('   ✓ Navbar, Footer');

  // 9. Generate section components
  console.log('\n📄 Generating section components...');
  writeFile(path.join(CONFIG.output.sections, 'Hero.tsx'), generators.generateHero(heroData));
  console.log('   ✓ Hero');

  const sectionComponents = ['Hero'];
  for (const section of sections) {
    // Skip footer/navbar as we have dedicated components
    if (['Footer', 'Navbar'].includes(section.name)) continue;

    const componentCode = generators.generateSectionComponent(section.name, section.html, converter);
    writeFile(path.join(CONFIG.output.sections, `${section.name}.tsx`), componentCode);
    sectionComponents.push(section.name);
    console.log(`   ✓ ${section.name}`);
  }
  writeFile(path.join(CONFIG.output.sections, 'index.ts'), generators.generateComponentIndex(sectionComponents));

  // 10. Generate hooks
  console.log('\n🪝 Generating hooks...');
  writeFile(path.join(CONFIG.output.hooks, 'useGsap.ts'), generators.generateUseGsap());
  writeFile(path.join(CONFIG.output.hooks, 'index.ts'), "export { useGsap, useScrollAnimation } from './useGsap';\n");
  console.log('   ✓ useGsap, useScrollAnimation');

  // 11. Generate styles
  console.log('\n🎨 Generating styles...');
  writeFile(path.join(CONFIG.output.styles, 'globals.css'), generators.generateGlobalStyles());

  // Copy webflow CSS for reference
  const webflowCss = path.join(CONFIG.sourceAssets.css, 'webflow.min.css');
  if (fs.existsSync(webflowCss)) {
    fs.copyFileSync(webflowCss, path.join(CONFIG.output.styles, 'webflow-reference.css'));
    console.log('   ✓ Copied webflow CSS for reference');
  }

  // 12. Generate app files
  console.log('\n📱 Generating app files...');
  writeFile(path.join(CONFIG.output.app, 'layout.tsx'), generators.generateLayout(metadata));
  writeFile(path.join(CONFIG.output.app, 'page.tsx'), generators.generatePage(
    sections.filter(s => !['Footer', 'Navbar'].includes(s.name))
  ));
  console.log('   ✓ layout.tsx, page.tsx');

  // 13. Update package.json
  console.log('\n📦 Updating package.json...');
  const pkgPath = path.join(CONFIG.output.root, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.dependencies = {
      ...pkg.dependencies,
      'clsx': '^2.1.0',
      'tailwind-merge': '^2.2.0',
      'gsap': '^3.12.0',
    };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('   ✓ Added clsx, tailwind-merge, gsap');
  }

  // Summary
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                    Migration Complete!                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📁 Project Structure:');
  console.log('');
  console.log('   src/');
  console.log('   ├── app/');
  console.log('   │   ├── layout.tsx      # Root layout with Navbar/Footer');
  console.log('   │   └── page.tsx        # Home page');
  console.log('   ├── components/');
  console.log('   │   ├── ui/             # Reusable UI components');
  console.log('   │   │   ├── Button.tsx');
  console.log('   │   │   ├── Input.tsx');
  console.log('   │   │   ├── Card.tsx');
  console.log('   │   │   └── ...');
  console.log('   │   ├── layout/         # Layout components');
  console.log('   │   │   ├── Navbar.tsx');
  console.log('   │   │   └── Footer.tsx');
  console.log('   │   └── sections/       # Page sections');
  console.log(`   │       └── ... (${sectionComponents.length} sections)`);
  console.log('   ├── hooks/              # Custom React hooks');
  console.log('   │   └── useGsap.ts');
  console.log('   ├── lib/                # Utilities');
  console.log('   │   └── utils.ts');
  console.log('   ├── styles/             # Global styles');
  console.log('   │   └── globals.css');
  console.log('   └── types/              # TypeScript types');
  console.log('       └── index.ts');
  console.log('');
  console.log('🚀 Next Steps:');
  console.log('');
  console.log('   1. Install new dependencies:');
  console.log('      npm install');
  console.log('');
  console.log('   2. Start development server:');
  console.log('      npm run dev');
  console.log('');
  console.log('   3. Fine-tune sections:');
  console.log('      - Sections use dangerouslySetInnerHTML as placeholders');
  console.log('      - Convert each to proper JSX incrementally');
  console.log('      - Use UI components (Button, Card, etc.) for consistency');
  console.log('');
  console.log('   4. Add animations:');
  console.log('      - Use useGsap hook for GSAP animations');
  console.log('      - Use useScrollAnimation for scroll-triggered effects');
  console.log('');
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
