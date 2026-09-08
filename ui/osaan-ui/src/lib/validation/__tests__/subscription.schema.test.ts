import { describe, it, expect } from 'vitest';
import { subscriptionDraftSchema, subscriptionSchema } from '../schemas/subscription.schema';

describe('subscriptionDraftSchema', () => {
  it('accepts a valid draft', () => {
    expect(subscriptionDraftSchema.safeParse({ skill: 'Rust', rating: 3 }).success).toBe(true);
  });

  it('rejects a blank skill', () => {
    expect(subscriptionDraftSchema.safeParse({ skill: '', rating: 3 }).success).toBe(false);
  });

  it('rejects an out-of-range rating', () => {
    expect(subscriptionDraftSchema.safeParse({ skill: 'Rust', rating: 7 }).success).toBe(false);
  });

  it('trims skill name', () => {
    const result = subscriptionDraftSchema.safeParse({ skill: '  Rust  ', rating: 3 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.skill).toBe('Rust');
    }
  });
});

describe('subscriptionSchema', () => {
  it('accepts a full subscription entity', () => {
    const result = subscriptionSchema.safeParse({
      id: '1',
      userId: 'u1',
      email: 'ada@example.com',
      skill: 'Rust',
      rating: 3,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });
});
