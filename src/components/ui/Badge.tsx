import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
}

const variants = {
  default: 'bg-[#69E5FB]/10 text-[#69E5FB] border-[#69E5FB]/20',
  accent: 'bg-[#04FFA8]/10 text-[#04FFA8] border-[#04FFA8]/20',
  outline: 'bg-transparent text-white border-white/30',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
