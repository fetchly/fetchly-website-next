import type { Metadata } from 'next';
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
    default: 'Fetchly | We help companies build great products.',
    template: '%s | Fetchly',
  },
  description: 'Fetchly provides a fully aligned, high-performing web and app development team at a fraction of the cost of traditional agencies or staff augmentation. We are the cost-effective solution for tech teams.',
  openGraph: {
    title: 'Fetchly - We help companies build great products.',
    description: 'Fetchly provides a fully aligned, high-performing web and app development team at a fraction of the cost of traditional agencies or staff augmentation. We are the cost-effective solution for tech teams.',
    images: ['/images/open-graph.png'],
    type: 'website',
    siteName: 'Fetchly',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fetchly - We help companies build great products.',
    description: 'Fetchly provides a fully aligned, high-performing web and app development team at a fraction of the cost of traditional agencies or staff augmentation. We are the cost-effective solution for tech teams.',
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
      <body className="min-h-screen flex flex-col bg-gray-950 text-white antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
