'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NavItemWithDropdown } from '@/types';

export function MegaMenu({ item }: { item: NavItemWithDropdown }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => { setMounted(true); }, []);

  const handleOpen = useCallback(() => {
    clearTimeout(timeoutRef.current);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    }
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  // Update dropdown position when opening
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (!item.items?.length) return null;

  const wide = item.items.length > 10;

  const dropdown = (
    <div
      ref={dropdownRef}
      className={cn(
        'fixed -translate-x-1/2 rounded-xl border border-white/10 bg-surface/80 backdrop-blur-xl shadow-xl z-50',
        'transition-[opacity,transform] duration-200',
        wide ? 'w-[42rem]' : 'w-[28rem]',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none',
      )}
      style={{ top: pos.top, left: pos.left }}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <div className={cn('p-3 grid gap-0.5', wide ? 'grid-cols-2' : 'grid-cols-1')}>
        {item.items.map((subItem) => (
          <Link
            key={subItem.href}
            href={subItem.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex flex-col gap-0.5 rounded-lg hover:bg-surface-alt transition-colors',
              wide ? 'px-3 py-2' : 'px-4 py-3',
              subItem.featured && 'border-l-2 border-l-primary bg-primary/5',
            )}
            data-cursor="hover"
          >
            <span className="text-sm font-medium text-foreground">{subItem.label}</span>
            {subItem.description && (
              <span className="text-xs text-foreground-muted">{subItem.description}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <div
        className={cn(
          'flex items-center gap-1 border-b-2 py-1 transition-colors',
          open
            ? 'text-foreground border-foreground'
            : 'text-foreground-muted hover:text-foreground border-transparent',
        )}
      >
        {item.href ? (
          <Link
            href={item.href}
            className="text-sm font-medium transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ) : (
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-sm font-medium"
          >
            {item.label}
          </button>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-0.5"
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={`Toggle ${item.label} menu`}
        >
          <svg
            className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}

/** Accordion-style dropdown for mobile nav */
export function MobileAccordion({ item, onNavigate }: { item: NavItemWithDropdown; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);

  if (!item.items?.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between py-3 text-foreground-muted hover:text-foreground transition-colors">
        {item.href ? (
          <Link
            href={item.href}
            onClick={onNavigate}
            className="font-medium transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ) : (
          <button onClick={() => setOpen((o) => !o)} className="font-medium">
            {item.label}
          </button>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1"
          aria-expanded={open}
          aria-label={`Toggle ${item.label} menu`}
        >
          <svg
            className={cn('w-4 h-4 transition-transform duration-200', open && 'rotate-180')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          open ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="pl-4 pb-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={onNavigate}
              className={cn(
                'block py-2 text-sm text-foreground-muted hover:text-foreground transition-colors',
                subItem.featured && 'border-l-2 border-l-primary pl-3 bg-primary/5 rounded-r-md text-foreground font-medium',
              )}
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
