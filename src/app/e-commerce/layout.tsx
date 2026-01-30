import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom eCommerce Development',
  description:
    'We strategize, design, build, test, launch, and manage custom online stores, all at a low, month-to-month price. From UX to backend, every store we build is optimized to drive revenue.',
};

export default function EcommerceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
