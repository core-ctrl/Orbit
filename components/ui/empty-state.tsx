import { LucideIcon, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Activity,
  title,
  description,
  action,
  secondaryAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-20 px-4', className)}>
      {/* Icon container with glass effect */}
      <div className="w-16 h-16 rounded-2xl glass-card-elevated flex items-center justify-center mb-6 animate-scale-in">
        <Icon className="w-7 h-7 text-[var(--text-muted)]" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 animate-fade-in">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] text-center max-w-sm mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        {description}
      </p>

      {children && (
        <div className="mb-8 w-full max-w-2xl animate-fade-in" style={{ animationDelay: '150ms' }}>
          {children}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {action && (
          <button onClick={action.onClick} className="btn-gradient px-5 py-2.5 text-sm">
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button onClick={secondaryAction.onClick} className="btn-glass px-5 py-2.5 text-sm">
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
