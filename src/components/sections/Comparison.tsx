'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { COMPARISON_DATA } from '@/lib/constants';

export function Comparison() {
  return (
    <Section id="comparison" className="py-24 md:py-32">
      <Container>
        <div className="text-center mb-16">
          <Badge className="mb-4">Why Choose Us</Badge>
          <h2 className="text-display-2 text-white mb-4">
            A totally different model
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See how Fetchly stacks up against traditional staffing options
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm uppercase tracking-wider">
                  Product Comparison
                </th>
                <th className="py-4 px-6 text-center text-gray-400 font-medium">
                  Staff Aug
                </th>
                <th className="py-4 px-6 text-center">
                  <div className="inline-flex flex-col items-center bg-[#1F444B] rounded-t-xl py-3 px-6 -mb-4">
                    <span className="text-white font-semibold text-lg">Fetchly</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-center text-gray-400 font-medium">
                  Agency
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COMPARISON_DATA.rows.map((row) => (
                <tr
                  key={row.feature}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-5 px-6 text-white font-medium uppercase text-sm tracking-wide">
                    {row.feature}
                  </td>
                  <td className="py-5 px-6 text-center">
                    <ComparisonCell value={row.staffAug} />
                  </td>
                  <td className="py-5 px-6 text-center bg-[#1F444B]/30">
                    <ComparisonCell value={row.fetchly} highlight />
                  </td>
                  <td className="py-5 px-6 text-center">
                    <ComparisonCell value={row.agency} />
                  </td>
                </tr>
              ))}
              {/* CTA Row */}
              <tr>
                <td className="py-5 px-6"></td>
                <td className="py-5 px-6"></td>
                <td className="py-5 px-6 text-center bg-[#1F444B]/30 rounded-b-xl">
                  <Button href="/intake/step-1" className="w-full">
                    Get in touch
                  </Button>
                </td>
                <td className="py-5 px-6"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}

function ComparisonCell({
  value,
  highlight = false,
}: {
  value: boolean | 'partial';
  highlight?: boolean;
}) {
  if (value === true) {
    return (
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
          highlight ? 'bg-[#04FFA8]/20' : 'bg-green-500/20'
        }`}
      >
        <svg
          className={`w-5 h-5 ${highlight ? 'text-[#04FFA8]' : 'text-green-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }

  if (value === 'partial') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20">
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50">
      <svg
        className="w-5 h-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  );
}

export default Comparison;
