import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'accent' | 'success' | 'muted';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-stone-100 text-stone-800 border border-stone-200',
  accent: 'bg-saffron-100 text-saffron-700 border border-saffron-200',
  success: 'bg-success-light text-success border border-green-200',
  muted: 'bg-stone-50 text-stone-600 border border-stone-200',
};

function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 text-xs font-medium font-sans',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
