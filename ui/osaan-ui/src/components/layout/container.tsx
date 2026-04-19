import { cn } from '@/lib/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'max-w-7xl mx-auto w-full px-[var(--page-x)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export { Container };
