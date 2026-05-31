'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual weight: default (subtle), elevated (prominent), subtle (minimal) */
  variant?: 'default' | 'elevated' | 'subtle';
  /** Adds accent glow on hover */
  glow?: boolean;
  /** Removes default padding */
  noPadding?: boolean;
  /** Disables hover effects (for static cards) */
  static?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', glow = false, noPadding = false, static: isStatic = false, ...props }, ref) => {
    const baseClass = isStatic
      ? 'glass-card-static'
      : variant === 'elevated'
        ? 'glass-card-elevated'
        : 'glass-card';

    return (
      <div
        ref={ref}
        className={cn(
          baseClass,
          glow && !isStatic && 'glass-glow',
          !noPadding && 'p-5',
          className
        )}
        {...props}
      />
    );
  }
);
GlassCard.displayName = 'GlassCard';

export { GlassCard };
export type { GlassCardProps };
