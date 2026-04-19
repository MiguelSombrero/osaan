'use client';

import { RatingInput } from '@/components/ui/rating-input';
import type { Rating } from '@/types/rating';

interface RatingControlProps {
  value: Rating | null;
  onChange: (rating: Rating) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

function RatingControl({ value, onChange, disabled, size = 'md' }: RatingControlProps) {
  return (
    <RatingInput
      value={value}
      onChange={onChange}
      disabled={disabled}
      size={size}
    />
  );
}

export { RatingControl };
