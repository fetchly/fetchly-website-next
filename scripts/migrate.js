#!/usr/bin/env node
/**
 * Fetchly Website Migration Script
 * Converts Webflow HTML export to Next.js components
 *
 * Usage: node scripts/migrate.js
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
  publicDir: path.join(__dirname, '../public'),
  stylesDir: path.join(__dirname, '../src/styles'),
};

// HTML to JSX attribute mappings
const ATTR_MAPPINGS = {
  'class': 'className',
  'for': 'htmlFor',
  'tabindex': 'tabIndex',
  'readonly': 'readOnly',
  'maxlength': 'maxLength',
  'cellpadding': 'cellPadding',
  'cellspacing': 'cellSpacing',
  'colspan': 'colSpan',
  'rowspan': 'rowSpan',
  'frameborder': 'frameBorder',
  'allowfullscreen': 'allowFullScreen',
  'autocomplete': 'autoComplete',
  'autofocus': 'autoFocus',
  'contenteditable': 'contentEditable',
  'crossorigin': 'crossOrigin',
  'datetime': 'dateTime',
  'enctype': 'encType',
  'formaction': 'formAction',
  'formenctype': 'formEncType',
  'formmethod': 'formMethod',
  'formnovalidate': 'formNoValidate',
  'formtarget': 'formTarget',
  'hreflang': 'hrefLang',
  'inputmode': 'inputMode',
  'novalidate': 'noValidate',
  'srcdoc': 'srcDoc',
  'srcset': 'srcSet',
  'usemap': 'useMap',
};

// Self-closing tags in JSX
const SELF_CLOSING_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

// Utility functions
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`Source directory not found: ${src}`);
    return;
  }
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`Copied: ${src} -> ${dest}`);
}

/**
 * Convert HTML string to JSX-compatible string
 */
function htmlToJsx(html) {
  // Handle attribute conversions
  let jsx = html;

  // Convert class to className
  jsx = jsx.replace(/\sclass="/g, ' className="');
  jsx = jsx.replace(/\sclass='/g, " className='");

  // Convert for to htmlFor
  jsx = jsx.replace(/\sfor="/g, ' htmlFor="');
  jsx = jsx.replace(/\sfor='/g, " htmlFor='");

  // Convert other attributes
  for (const [htmlAttr, jsxAttr] of Object.entries(ATTR_MAPPINGS)) {
    if (htmlAttr === 'class' || htmlAttr === 'for') continue;
    const regex = new RegExp(`\\s${htmlAttr}="`, 'g');
    jsx = jsx.replace(regex, ` ${jsxAttr}="`);
  }

  // Handle boolean attributes (convert to JSX format)
  jsx = jsx.replace(/\s(disabled|checked|selected|required|multiple|autoplay|controls|loop|muted|hidden)(?=[>\s])/g, ' $1={true}');

  // Self-closing tags
  for (const tag of SELF_CLOSING_TAGS) {
    // Match tags that aren't already self-closing
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  }

  // Handle inline styles (basic conversion - complex styles need manual review)
  jsx = jsx.replace(/\sstyle="([^"]*)"/g, (match, styleStr) => {
    const styleObj = styleStr.split(';')
      .filter(s => s.trim())
      .map(s => {
        const [prop, val] = s.split(':').map(p => p.trim());
        if (!prop || !val) return null;
        // Convert kebab-case to camelCase
        const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        return `${camelProp}: "${val}"`;
      })
      .filter(Boolean)
      .join(', ');
    return ` style={{ ${styleObj} }}`;
  });

  // Convert HTML comments to JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  return jsx;
}

/**
 * Extract sections from the HTML
 */
function extractSections(dom) {
  const document = dom.window.document;
  const sections = [];

  // Find main wrapper
  const mainWrapper = document.querySelector('.main-wrapper');
  if (!mainWrapper) {
    console.warn('No .main-wrapper found');
    return sections;
  }

  // Extract navbar
  const navbar = mainWrapper.querySelector('.navbar2_component, [role="banner"]');
  if (navbar) {
    sections.push({
      name: 'Navbar',
      element: navbar,
      type: 'component'
    });
  }

  // Extract header/hero
  const header = mainWrapper.querySelector('.section_header25, .header30_content, header');
  if (header) {
    sections.push({
      name: 'Hero',
      element: header.closest('.header30_content') || header,
      type: 'section'
    });
  }

  // Extract all sections with common Webflow patterns
  const sectionSelectors = [
    '[class*="section_"]',
    '[class*="_component"]',
    '.section',
    'section',
    '[class*="layout"]',
    '[class*="cta"]',
    '[class*="testimonial"]',
    '[class*="faq"]',
    'footer'
  ];

  const allSections = mainWrapper.querySelectorAll(sectionSelectors.join(', '));
  const processed = new Set();

  allSections.forEach((el, index) => {
    // Skip if already processed or is a child of processed element
    if (processed.has(el)) return;

    // Get a meaningful name from class
    const className = el.className || '';
    let name = className.split(' ')[0] || `Section${index}`;
    name = name.replace(/[_-]/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join('')
      .replace(/^\d+/, '');

    if (!name || name.length < 2) {
      name = `Section${index}`;
    }

    sections.push({
      name,
      element: el,
      type: 'section',
      className
    });

    processed.add(el);
  });

  return sections;
}

/**
 * Extract head content (meta, styles, scripts)
 */
function extractHead(dom) {
  const document = dom.window.document;
  const head = document.querySelector('head');

  return {
    title: head.querySelector('title')?.textContent || 'Fetchly',
    meta: {
      description: head.querySelector('meta[name="description"]')?.content || '',
      ogTitle: head.querySelector('meta[property="og:title"]')?.content || '',
      ogDescription: head.querySelector('meta[property="og:description"]')?.content || '',
      ogImage: head.querySelector('meta[property="og:image"]')?.content || '',
    },
    styles: Array.from(head.querySelectorAll('style')).map(s => s.textContent),
    jsonLd: head.querySelector('script[type="application/ld+json"]')?.textContent || null,
  };
}

/**
 * Generate a React component file
 */
function generateComponent(name, htmlContent, isClientComponent = false) {
  const jsxContent = htmlToJsx(htmlContent);

  return `${isClientComponent ? "'use client';\n\n" : ''}import React from 'react';

export default function ${name}() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
}

/**
 * Generate the main page component
 */
function generatePage(sections, headData) {
  const imports = sections
    .filter(s => s.name && s.name !== 'Unknown')
    .map(s => `import ${s.name} from '@/components/${s.name}';`)
    .join('\n');

  const components = sections
    .filter(s => s.name && s.name !== 'Unknown')
    .map(s => `      <${s.name} />`)
    .join('\n');

  return `import type { Metadata } from 'next';
${imports}

export const metadata: Metadata = {
  title: '${headData.title.replace(/'/g, "\\'")}',
  description: '${headData.meta.description.replace(/'/g, "\\'")}',
  openGraph: {
    title: '${headData.meta.ogTitle.replace(/'/g, "\\'")}',
    description: '${headData.meta.ogDescription.replace(/'/g, "\\'")}',
    images: ['${headData.meta.ogImage}'],
  },
};

export default function HomePage() {
  return (
    <main className="main-wrapper overflow-hidden">
${components}
    </main>
  );
}
`;
}

/**
 * Generate global styles file
 */
function generateGlobalStyles(headData, webflowCss) {
  const inlineStyles = headData.styles.join('\n\n');

  return `/* Webflow Base Styles */
${webflowCss}

/* Inline Styles from HTML */
${inlineStyles}

/* Custom Overrides */
`;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Fetchly migration...\n');

  // 1. Read source HTML
  console.log('📖 Reading source HTML...');
  const htmlContent = fs.readFileSync(CONFIG.sourceHtml, 'utf-8');
  const dom = new JSDOM(htmlContent);

  // 2. Create directories
  console.log('📁 Creating directories...');
  ensureDir(CONFIG.componentsDir);
  ensureDir(CONFIG.publicDir);
  ensureDir(CONFIG.stylesDir);
  ensureDir(path.join(CONFIG.publicDir, 'images'));
  ensureDir(path.join(CONFIG.publicDir, 'videos'));

  // 3. Copy assets
  console.log('📦 Copying assets...');
  copyDir(CONFIG.sourceAssets.images, path.join(CONFIG.publicDir, 'images'));
  copyDir(CONFIG.sourceAssets.videos, path.join(CONFIG.publicDir, 'videos'));

  // 4. Copy and process CSS
  console.log('🎨 Processing styles...');
  const webflowCssPath = path.join(CONFIG.sourceAssets.css, 'webflow.min.css');
  let webflowCss = '';
  if (fs.existsSync(webflowCssPath)) {
    webflowCss = fs.readFileSync(webflowCssPath, 'utf-8');
    fs.copyFileSync(webflowCssPath, path.join(CONFIG.stylesDir, 'webflow.css'));
  }

  // 5. Extract head data
  console.log('🔍 Extracting metadata...');
  const headData = extractHead(dom);

  // 6. Extract sections
  console.log('✂️  Extracting sections...');
  const sections = extractSections(dom);
  console.log(`   Found ${sections.length} sections`);

  // 7. Generate components
  console.log('🔧 Generating components...');
  const generatedComponents = [];
  const seenNames = new Set();

  for (const section of sections) {
    // Ensure unique names
    let name = section.name;
    let counter = 1;
    while (seenNames.has(name)) {
      name = `${section.name}${counter}`;
      counter++;
    }
    seenNames.add(name);
    section.name = name;

    const htmlContent = section.element.outerHTML;
    const isClientComponent = htmlContent.includes('onClick') ||
                              htmlContent.includes('data-w-id') ||
                              htmlContent.includes('w-nav');

    const componentCode = generateComponent(name, htmlContent, isClientComponent);
    const componentPath = path.join(CONFIG.componentsDir, `${name}.tsx`);

    fs.writeFileSync(componentPath, componentCode);
    generatedComponents.push({ name, path: componentPath });
    console.log(`   ✓ ${name}`);
  }

  // 8. Generate global styles
  console.log('📝 Generating global styles...');
  const globalStyles = generateGlobalStyles(headData, webflowCss);
  fs.writeFileSync(path.join(CONFIG.stylesDir, 'globals.css'), globalStyles);

  // 9. Generate main page
  console.log('📄 Generating main page...');
  const pageCode = generatePage(sections, headData);
  fs.writeFileSync(path.join(CONFIG.outputDir, 'src/app/page.tsx'), pageCode);

  // 10. Generate layout with font imports
  console.log('📄 Generating layout...');
  const layoutCode = `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "${headData.title}",
  description: "${headData.meta.description}",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={\`\${inter.variable} font-sans antialiased\`}>
        {children}
      </body>
    </html>
  );
}
`;
  fs.writeFileSync(path.join(CONFIG.outputDir, 'src/app/layout.tsx'), layoutCode);

  // 11. Summary
  console.log('\n✅ Migration complete!\n');
  console.log('Generated:');
  console.log(`  - ${generatedComponents.length} components in src/components/`);
  console.log('  - Global styles in src/styles/globals.css');
  console.log('  - Main page in src/app/page.tsx');
  console.log('  - Layout in src/app/layout.tsx');
  console.log('  - Assets in public/images and public/videos');
  console.log('\nNext steps:');
  console.log('  1. Run: npm install jsdom');
  console.log('  2. Run: npm run dev');
  console.log('  3. Review and refine components manually');
  console.log('  4. Add interactivity with React hooks');

  return { sections, headData, generatedComponents };
}

// Run migration
migrate().catch(console.error);
