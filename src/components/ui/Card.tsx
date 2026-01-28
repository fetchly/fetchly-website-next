import { cn } from '@/lib/utils';
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
