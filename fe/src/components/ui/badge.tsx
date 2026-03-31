import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'alert';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-purple-vivid/20 text-purple-light',
        variant === 'outline' && 'border border-bg-border text-text-muted',
        variant === 'alert' && 'bg-alert/20 text-alert',
        className
      )}
    >
      {children}
    </span>
  );
}
