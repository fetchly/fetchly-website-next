import { cn } from '@/lib/utils';
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
