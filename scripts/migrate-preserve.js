#!/usr/bin/env node
/**
 * Fetchly Website Migration Script - Content Preserving Version
 *
 * This script preserves the EXACT content from the Webflow export
 * and wraps it in minimal React components.
 *
 * Strategy:
 * 1. Keep all HTML structure exactly as-is
 * 2. Use dangerouslySetInnerHTML to preserve content
 * 3. Copy CSS and JS files for immediate compatibility
 * 4. Gradual migration path for React-ifying components later
 *
 * Usage: node scripts/migrate-preserve.js
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const CONFIG = {
  sourceHtml: path.join(__dirname, '../../index.html'),
  sourceAssets: {
    images: path.join(__dirname, '../../images'),
    videos: path.join(__dirname, '../../videos'),
    css: path.join(__dirname, '../../css'),
    js: path.join(__dirname, '../../js'),
  },
  outputDir: path.join(__dirname, '..'),
  componentsDir: path.join(__dirname, '../src/components'),
  sectionsDir: path.join(__dirname, '../src/components/sections'),
  publicDir: path.join(__dirname, '../public'),
  stylesDir: path.join(__dirname, '../src/styles'),
};

// Utility functions
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created: ${path.relative(CONFIG.outputDir, dirPath)}`);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Source not found: ${src}`);
    return 0;
  }
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
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

/**
 * Clean HTML for use in dangerouslySetInnerHTML
 * Escapes backticks and ${} template literals
 */
function escapeForTemplate(html) {
  return html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

/**
 * Extract inline styles from head
 */
function extractInlineStyles(dom) {
  const styles = [];
  dom.window.document.querySelectorAll('head style').forEach(style => {
    styles.push(style.textContent);
  });
  return styles.join('\n\n');
}

/**
 * Extract inline scripts from head (non-external)
 */
function extractInlineScripts(dom) {
  const scripts = [];
  dom.window.document.querySelectorAll('head script:not([src])').forEach(script => {
    if (script.textContent.trim() && !script.type?.includes('json')) {
      scripts.push(script.textContent);
    }
  });
  return scripts;
}

/**
 * Extract JSON-LD structured data
 */
function extractJsonLd(dom) {
  const script = dom.window.document.querySelector('script[type="application/ld+json"]');
  if (script) {
    try {
      return JSON.parse(script.textContent);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Extract metadata from head
 */
function extractMetadata(dom) {
  const doc = dom.window.document;
  const getMeta = (selector) => doc.querySelector(selector)?.content || '';
  const getMetaByName = (name) => getMeta(`meta[name="${name}"]`);
  const getMetaByProperty = (prop) => getMeta(`meta[property="${prop}"]`);

  return {
    title: doc.querySelector('title')?.textContent || 'Fetchly',
    description: getMetaByName('description'),
    ogTitle: getMetaByProperty('og:title'),
    ogDescription: getMetaByProperty('og:description'),
    ogImage: getMetaByProperty('og:image'),
    ogType: getMetaByProperty('og:type'),
    twitterTitle: getMetaByProperty('twitter:title'),
    twitterDescription: getMetaByProperty('twitter:description'),
    twitterCard: getMetaByName('twitter:card'),
    googleVerification: getMetaByName('google-site-verification'),
    jsonLd: extractJsonLd(dom),
  };
}

/**
 * Define section boundaries based on Webflow class patterns
 */
function defineSectionBoundaries() {
  return [
    { name: 'Navbar', selector: '.navbar2_component, [role="banner"]', priority: 1 },
    { name: 'Hero', selector: '.header30_content, .section_header25, .header2_content', priority: 2 },
    { name: 'LogoMarquee', selector: '[class*="marquee"], .logo-cloud', priority: 3 },
    { name: 'Features', selector: '[class*="layout6"], [class*="layout237"], [class*="layout308"]', priority: 4 },
    { name: 'Comparison', selector: '[class*="comparison"], .pricing-table', priority: 5 },
    { name: 'Services', selector: '[class*="services"], [class*="layout4"]', priority: 6 },
    { name: 'Testimonials', selector: '[class*="testimonial"]', priority: 7 },
    { name: 'CaseStudies', selector: '[class*="case-stud"], [class*="portfolio"]', priority: 8 },
    { name: 'FAQ', selector: '[class*="faq"]', priority: 9 },
    { name: 'CTA', selector: '[class*="cta"]', priority: 10 },
    { name: 'Contact', selector: '[class*="contact"], [class*="form_"]', priority: 11 },
    { name: 'Footer', selector: 'footer, [class*="footer"]', priority: 12 },
  ];
}

/**
 * Extract body content and identify sections
 */
function extractBodySections(dom) {
  const doc = dom.window.document;
  const mainWrapper = doc.querySelector('.main-wrapper') || doc.body;
  const boundaries = defineSectionBoundaries();
  const sections = [];
  const processed = new WeakSet();

  // First pass: identify named sections
  for (const boundary of boundaries) {
    const elements = mainWrapper.querySelectorAll(boundary.selector);
    elements.forEach(el => {
      if (processed.has(el)) return;

      // Check if this element is inside an already processed section
      let isNested = false;
      let parent = el.parentElement;
      while (parent && parent !== mainWrapper) {
        if (processed.has(parent)) {
          isNested = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (isNested) return;

      processed.add(el);
      sections.push({
        name: boundary.name,
        priority: boundary.priority,
        html: el.outerHTML,
        className: el.className,
      });
    });
  }

  // Sort by document order (priority is fallback)
  // For now, use priority order which typically matches document flow
  sections.sort((a, b) => a.priority - b.priority);

  // Deduplicate names
  const nameCount = {};
  sections.forEach(section => {
    if (nameCount[section.name]) {
      nameCount[section.name]++;
      section.name = `${section.name}${nameCount[section.name]}`;
    } else {
      nameCount[section.name] = 1;
    }
  });

  return sections;
}

/**
 * Generate a preserved-content component
 */
function generatePreservedComponent(name, html) {
  const escapedHtml = escapeForTemplate(html);

  return `'use client';

/**
 * ${name} Component
 *
 * This component preserves the original Webflow HTML structure.
 * To migrate to React:
 * 1. Replace dangerouslySetInnerHTML with JSX
 * 2. Convert class to className
 * 3. Add React interactivity as needed
 */
export default function ${name}() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />
  );
}
`;
}

/**
 * Generate the main page that composes all sections
 */
function generateMainPage(sections, metadata) {
  const imports = sections
    .map(s => `import ${s.name} from '@/components/sections/${s.name}';`)
    .join('\n');

  const components = sections
    .map(s => `        <${s.name} />`)
    .join('\n');

  const jsonLdScript = metadata.jsonLd
    ? `
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(${JSON.stringify(metadata.jsonLd, null, 2)}) }}
      />`
    : '';

  return `import type { Metadata } from 'next';
${imports}

export const metadata: Metadata = {
  title: '${metadata.title.replace(/'/g, "\\'")}',
  description: '${metadata.description.replace(/'/g, "\\'")}',
  openGraph: {
    title: '${metadata.ogTitle.replace(/'/g, "\\'")}',
    description: '${metadata.ogDescription.replace(/'/g, "\\'")}',
    images: ['${metadata.ogImage}'],
    type: '${metadata.ogType || 'website'}',
  },
  twitter: {
    card: '${metadata.twitterCard || 'summary_large_image'}',
    title: '${metadata.twitterTitle.replace(/'/g, "\\'")}',
    description: '${metadata.twitterDescription.replace(/'/g, "\\'")}',
  },
  verification: {
    google: '${metadata.googleVerification}',
  },
};

export default function HomePage() {
  return (
    <>
      <main className="main-wrapper overflow-hidden">
${components}
      </main>${jsonLdScript}
    </>
  );
}
`;
}

/**
 * Generate the root layout
 */
function generateLayout(metadata) {
  return `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/webflow.css';
import '@/styles/custom.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '${metadata.title.replace(/'/g, "\\'")}',
    template: '%s | Fetchly',
  },
  description: '${metadata.description.replace(/'/g, "\\'")}',
  metadataBase: new URL('https://www.fetch.ly'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
`;
}

/**
 * Generate custom CSS file for overrides
 */
function generateCustomCss(inlineStyles) {
  return `/*
 * Custom Styles - Extracted from Webflow inline styles
 * These can be gradually migrated to Tailwind utilities
 */

/* Font rendering optimization */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Responsive font sizing from Webflow */
html { font-size: 1.125rem; }
@media screen and (max-width: 1920px) { html { font-size: calc(0.625rem + 0.41666666666666674vw); } }
@media screen and (max-width: 1440px) { html { font-size: calc(0.8126951092611863rem + 0.20811654526534862vw); } }
@media screen and (max-width: 479px) { html { font-size: calc(0.7494769874476988rem + 0.8368200836820083vw); } }

/* Webflow extracted inline styles */
${inlineStyles}

/* Custom overrides - add your styles below */
`;
}

/**
 * Generate a script loader component for third-party scripts
 */
function generateScriptLoader(scripts) {
  if (!scripts.length) return null;

  const scriptContent = scripts.join('\n\n// --- Next Script ---\n\n');

  return `'use client';

import { useEffect } from 'react';

/**
 * ScriptLoader - Loads third-party scripts from the original Webflow site
 *
 * Note: Review these scripts and migrate to proper Next.js patterns:
 * - Analytics: Use next/script or @vercel/analytics
 * - Forms: Use React form libraries
 * - Animations: Use framer-motion or GSAP with React
 */
export default function ScriptLoader() {
  useEffect(() => {
    // Original inline scripts - review and migrate as needed
    try {
      ${scriptContent.split('\n').map(line => `      // ${line}`).join('\n')}
    } catch (e) {
      console.warn('Script loader error:', e);
    }
  }, []);

  return null;
}
`;
}

/**
 * Update tsconfig for path aliases
 */
function updateTsConfig() {
  const tsconfigPath = path.join(CONFIG.outputDir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    tsconfig.compilerOptions = tsconfig.compilerOptions || {};
    tsconfig.compilerOptions.paths = {
      '@/*': ['./src/*'],
    };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('📝 Updated tsconfig.json with path aliases');
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     Fetchly Website Migration - Content Preserving    ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');

  // 1. Read and parse source HTML
  console.log('📖 Reading source HTML...');
  if (!fs.existsSync(CONFIG.sourceHtml)) {
    console.error(`❌ Source HTML not found: ${CONFIG.sourceHtml}`);
    process.exit(1);
  }
  const htmlContent = fs.readFileSync(CONFIG.sourceHtml, 'utf-8');
  const dom = new JSDOM(htmlContent);
  console.log(`   ✓ Parsed ${(htmlContent.length / 1024).toFixed(1)}KB HTML`);

  // 2. Create directory structure
  console.log('\n📁 Creating directory structure...');
  ensureDir(CONFIG.componentsDir);
  ensureDir(CONFIG.sectionsDir);
  ensureDir(CONFIG.publicDir);
  ensureDir(CONFIG.stylesDir);
  ensureDir(path.join(CONFIG.publicDir, 'images'));
  ensureDir(path.join(CONFIG.publicDir, 'videos'));
  ensureDir(path.join(CONFIG.publicDir, 'fonts'));

  // 3. Copy static assets
  console.log('\n📦 Copying static assets...');
  let assetCount = 0;
  assetCount += copyDir(CONFIG.sourceAssets.images, path.join(CONFIG.publicDir, 'images'));
  console.log(`   ✓ Images: ${assetCount} files`);

  const videoCount = copyDir(CONFIG.sourceAssets.videos, path.join(CONFIG.publicDir, 'videos'));
  console.log(`   ✓ Videos: ${videoCount} files`);

  // 4. Copy and process CSS
  console.log('\n🎨 Processing stylesheets...');
  const webflowCssPath = path.join(CONFIG.sourceAssets.css, 'webflow.min.css');
  if (fs.existsSync(webflowCssPath)) {
    fs.copyFileSync(webflowCssPath, path.join(CONFIG.stylesDir, 'webflow.css'));
    console.log('   ✓ Copied webflow.css');
  }

  // Extract and save inline styles
  const inlineStyles = extractInlineStyles(dom);
  const customCss = generateCustomCss(inlineStyles);
  fs.writeFileSync(path.join(CONFIG.stylesDir, 'custom.css'), customCss);
  console.log('   ✓ Generated custom.css with inline styles');

  // 5. Extract metadata
  console.log('\n🔍 Extracting metadata...');
  const metadata = extractMetadata(dom);
  console.log(`   ✓ Title: ${metadata.title}`);
  console.log(`   ✓ Description: ${metadata.description.substring(0, 50)}...`);

  // 6. Extract and generate section components
  console.log('\n✂️  Extracting sections...');
  const sections = extractBodySections(dom);
  console.log(`   Found ${sections.length} sections:`);

  for (const section of sections) {
    const componentCode = generatePreservedComponent(section.name, section.html);
    const componentPath = path.join(CONFIG.sectionsDir, `${section.name}.tsx`);
    fs.writeFileSync(componentPath, componentCode);
    console.log(`   ✓ ${section.name}`);
  }

  // 7. Generate main page
  console.log('\n📄 Generating pages...');
  const pageCode = generateMainPage(sections, metadata);
  fs.writeFileSync(path.join(CONFIG.outputDir, 'src/app/page.tsx'), pageCode);
  console.log('   ✓ src/app/page.tsx');

  // 8. Generate layout
  const layoutCode = generateLayout(metadata);
  fs.writeFileSync(path.join(CONFIG.outputDir, 'src/app/layout.tsx'), layoutCode);
  console.log('   ✓ src/app/layout.tsx');

  // 9. Handle scripts
  console.log('\n📜 Processing scripts...');
  const inlineScripts = extractInlineScripts(dom);
  if (inlineScripts.length > 0) {
    console.log(`   ⚠️  Found ${inlineScripts.length} inline scripts - review needed`);
    // Save scripts for reference
    fs.writeFileSync(
      path.join(CONFIG.outputDir, 'scripts/original-scripts.js'),
      '// Original inline scripts from Webflow export\n// Review and migrate to Next.js patterns\n\n' +
      inlineScripts.join('\n\n// --- Next Script ---\n\n')
    );
    console.log('   ✓ Saved to scripts/original-scripts.js for review');
  }

  // Copy JS libraries that might be needed
  const jsFiles = ['gsap.min.js', 'ScrollTrigger.min.js'];
  for (const jsFile of jsFiles) {
    const srcPath = path.join(CONFIG.sourceAssets.js, jsFile);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(CONFIG.publicDir, jsFile));
    }
  }

  // 10. Update tsconfig
  updateTsConfig();

  // 11. Generate index file for components
  const indexContent = sections
    .map(s => `export { default as ${s.name} } from './sections/${s.name}';`)
    .join('\n');
  fs.writeFileSync(path.join(CONFIG.componentsDir, 'index.ts'), indexContent + '\n');
  console.log('   ✓ Generated component index');

  // Summary
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                  Migration Complete!                   ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Generated files:');
  console.log(`  📦 ${sections.length} section components in src/components/sections/`);
  console.log('  📄 src/app/page.tsx (main page)');
  console.log('  📄 src/app/layout.tsx (root layout)');
  console.log('  🎨 src/styles/webflow.css');
  console.log('  🎨 src/styles/custom.css');
  console.log(`  🖼️  ${assetCount} images in public/images/`);
  console.log(`  🎬 ${videoCount} videos in public/videos/`);
  console.log('');
  console.log('Next steps:');
  console.log('  1. Install dependencies: cd migrated && npm install jsdom');
  console.log('  2. Start dev server: npm run dev');
  console.log('  3. View at http://localhost:3000');
  console.log('');
  console.log('Migration path:');
  console.log('  - Components use dangerouslySetInnerHTML for exact content');
  console.log('  - Gradually convert to JSX for React interactivity');
  console.log('  - Replace Webflow CSS with Tailwind utilities over time');
  console.log('');
}

// Run
migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
