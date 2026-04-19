import { cn } from '@/lib/cn';

interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

function Card({ header, footer, className, children }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white border border-stone-200 rounded-md',
        className
      )}
    >
      {header && (
        <div className="px-5 py-4 border-b border-stone-200">{header}</div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50 rounded-b-md">
          {footer}
        </div>
      )}
    </div>
  );
}

export { Card };
export type { CardProps };
