import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SaaS Development Services',
  description:
    'Launch your SaaS with a full-stack dev team on standby. Fetchly brings everything you need to bring your app to life, all wrapped in one low, month-to-month price.',
};

export default function SaaSLayout({ children }: { children: React.ReactNode }) {
  return children;
}
