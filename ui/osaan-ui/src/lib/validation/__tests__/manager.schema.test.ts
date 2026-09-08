import { describe, it, expect } from 'vitest';
import {
  employeeSearchParamsSchema,
  employeeSearchQuerySchema,
  employeeSearchResultSchema,
  managerSelectionSchema,
} from '../schemas/manager.schema';

describe('employeeSearchParamsSchema', () => {
  it('accepts valid params', () => {
    expect(
      employeeSearchParamsSchema.safeParse({ skillName: 'Rust', minRating: 3 }).success
    ).toBe(true);
  });

  it('rejects a blank skillName', () => {
    expect(
      employeeSearchParamsSchema.safeParse({ skillName: '', minRating: 3 }).success
    ).toBe(false);
  });

  it('rejects an out-of-range minRating', () => {
    expect(
      employeeSearchParamsSchema.safeParse({ skillName: 'Rust', minRating: 6 }).success
    ).toBe(false);
  });
});

describe('employeeSearchQuerySchema', () => {
  it('coerces minRating from a query string', () => {
    const result = employeeSearchQuerySchema.safeParse({ skillName: 'Rust', minRating: '3' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.minRating).toBe(3);
    }
  });

  it('rejects an out-of-range minRating string', () => {
    expect(
      employeeSearchQuerySchema.safeParse({ skillName: 'Rust', minRating: '6' }).success
    ).toBe(false);
  });

  it('rejects a missing skillName', () => {
    expect(employeeSearchQuerySchema.safeParse({ minRating: '3' }).success).toBe(false);
  });
});

describe('employeeSearchResultSchema', () => {
  it('accepts a full search result', () => {
    const result = employeeSearchResultSchema.safeParse({
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      matchedSkills: [{ skillId: 's1', skillName: 'Rust', rating: 4 }],
    });
    expect(result.success).toBe(true);
  });
});

describe('managerSelectionSchema', () => {
  it('accepts a list of employees', () => {
    const result = managerSelectionSchema.safeParse({
      employees: [
        {
          id: '1',
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
          matchedSkills: [],
        },
      ],
    });
    expect(result.success).toBe(true);
  });
});
