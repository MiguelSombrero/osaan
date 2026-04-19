import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-stone-800 font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-stone-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-9 rounded-md border bg-white px-3 text-sm font-sans',
              'text-stone-950 placeholder:text-stone-400',
              'transition-colors duration-150',
              error
                ? 'border-error focus:border-error focus:ring-1 focus:ring-error'
                : 'border-stone-300 focus:border-saffron-600 focus:ring-1 focus:ring-saffron-600',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              'outline-none',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-stone-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-error font-sans">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-stone-600 font-sans">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
