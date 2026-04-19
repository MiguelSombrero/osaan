'use client';

import { cn } from '@/lib/cn';
import { Button } from './button';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  className?: string;
}

function Pagination({
  page,
  totalPages,
  totalElements,
  onPrev,
  onNext,
  isFirst,
  isLast,
  className,
}: PaginationProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-5 py-3 border-t border-stone-200',
        className
      )}
    >
      <p className="text-sm text-stone-600 font-sans">
        Page <span className="font-medium text-stone-950">{page + 1}</span> of{' '}
        <span className="font-medium text-stone-950">{totalPages}</span>
        <span className="ml-2 text-stone-400">({totalElements} total)</span>
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={isLast}
          aria-label="Next page"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export { Pagination };
export type { PaginationProps };
