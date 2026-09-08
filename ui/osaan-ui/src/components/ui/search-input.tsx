'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  // While focused, the user may be actively typing further ahead of what's
  // been sent upstream. An in-flight debounced onChange echoing back as the
  // value prop can otherwise arrive after — and overwrite — newer keystrokes.
  const isFocusedRef = useRef(false);

  // Sync from outside, but never clobber active local edits.
  useEffect(() => {
    if (!isFocusedRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  // Debounce to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange]);

  return (
    <div className={cn('relative flex items-center', className)}>
      <span className="absolute left-3 text-stone-400 pointer-events-none">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => {
          isFocusedRef.current = true;
        }}
        onBlur={() => {
          isFocusedRef.current = false;
        }}
        placeholder={placeholder}
        className={cn(
          'w-full h-10 pl-9 pr-9 rounded-md border border-stone-300 bg-white',
          'text-sm font-sans text-stone-950 placeholder:text-stone-400',
          'outline-none focus:border-saffron-600 focus:ring-1 focus:ring-saffron-600',
          'transition-colors duration-150',
          '[&::-webkit-search-cancel-button]:hidden'
        )}
      />
      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute right-3 text-stone-400 hover:text-stone-700 transition-colors"
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export { SearchInput };
export type { SearchInputProps };
