import type { ImageLoaderProps } from 'next/image';

export default function imageLoader({ src }: ImageLoaderProps): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${src}`;
}
