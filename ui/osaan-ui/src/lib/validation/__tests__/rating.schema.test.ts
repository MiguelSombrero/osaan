import { describe, it, expect } from 'vitest';
import { ratingSchema } from '../schemas/rating.schema';

describe('ratingSchema', () => {
  it.each([1, 2, 3, 4, 5])('accepts %i', (value) => {
    const result = ratingSchema.safeParse(value);
    expect(result.success).toBe(true);
  });

  it.each([0, 6, -1, 3.5, '3', null, undefined])('rejects %p', (value) => {
    const result = ratingSchema.safeParse(value);
    expect(result.success).toBe(false);
  });

  it('fails with a stable, testable issue code', () => {
    const result = ratingSchema.safeParse(6);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe('invalid_value');
    }
  });
});
