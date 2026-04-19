'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';
import type { Rating } from '@/types/rating';

interface RatingInputProps {
  value: Rating | null;
  onChange: (rating: Rating) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const dotColors: Record<number, string> = {
  1: 'var(--rating-1)',
  2: 'var(--rating-2)',
  3: 'var(--rating-3)',
  4: 'var(--rating-4)',
  5: 'var(--rating-5)',
};

function RatingInput({
  value,
  onChange,
  disabled = false,
  size = 'md',
  className,
}: RatingInputProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<Rating | null>(null);

  const dotSize = size === 'sm' ? 12 : 16;
  const gap = size === 'sm' ? 4 : 6;

  const active = hovered ?? value;

  const ratingLabel = (r: Rating): string =>
    t(`rating${r}`, { defaultValue: String(r) });

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div
        className="flex items-center"
        style={{ gap }}
        onMouseLeave={() => setHovered(null)}
        role="group"
        aria-label={t('minimumRating', { defaultValue: 'Skill rating' })}
      >
        {([1, 2, 3, 4, 5] as Rating[]).map((level) => {
          const isFilled = active !== null && level <= active;
          return (
            <button
              key={level}
              type="button"
              disabled={disabled}
              aria-label={`${level} — ${ratingLabel(level)}`}
              onClick={() => onChange(level)}
              onMouseEnter={() => setHovered(level)}
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: isFilled ? dotColors[level] : 'var(--border)',
                backgroundColor: isFilled ? dotColors[level] : 'transparent',
                transition: 'background-color 0.12s ease, border-color 0.12s ease',
                cursor: disabled ? 'default' : 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
            />
          );
        })}
      </div>
      <p
        className="text-xs text-stone-600 font-sans h-4 transition-opacity duration-100"
        suppressHydrationWarning
      >
        {active ? ratingLabel(active) : ''}
      </p>
    </div>
  );
}

export { RatingInput };
export type { RatingInputProps };
