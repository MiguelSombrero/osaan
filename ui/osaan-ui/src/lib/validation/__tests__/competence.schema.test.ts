import { describe, it, expect } from 'vitest';
import {
  competenceSchema,
  createCompetencesBodySchema,
  createCompetencesRequestSchema,
  updateCompetenceRatingBodySchema,
  competenceDetailSchema,
  competenceProfileDataSchema,
} from '../schemas/competence.schema';

describe('competenceSchema', () => {
  it('accepts a valid competence', () => {
    const result = competenceSchema.safeParse({
      id: 'c1',
      employeeId: 'e1',
      skillId: 's1',
      rating: 4,
    });
    expect(result.success).toBe(true);
  });

  it('rejects an out-of-range rating', () => {
    expect(
      competenceSchema.safeParse({ employeeId: 'e1', skillId: 's1', rating: 9 }).success
    ).toBe(false);
  });
});

describe('createCompetencesBodySchema', () => {
  it('accepts a bare array of skill/rating pairs (actual client body shape)', () => {
    const result = createCompetencesBodySchema.safeParse([
      { skillId: 's1', rating: 3 },
      { skillId: 's2', rating: 5 },
    ]);
    expect(result.success).toBe(true);
  });

  it('rejects an entry with an invalid rating', () => {
    expect(createCompetencesBodySchema.safeParse([{ skillId: 's1', rating: 0 }]).success).toBe(
      false
    );
  });
});

describe('createCompetencesRequestSchema', () => {
  it('accepts the wrapped shape for API-surface parity', () => {
    const result = createCompetencesRequestSchema.safeParse({
      employeeId: 'e1',
      competences: [{ skillId: 's1', rating: 3 }],
    });
    expect(result.success).toBe(true);
  });
});

describe('updateCompetenceRatingBodySchema', () => {
  it('accepts a valid rating update', () => {
    expect(updateCompetenceRatingBodySchema.safeParse({ rating: 2 }).success).toBe(true);
  });

  it('rejects a missing rating', () => {
    expect(updateCompetenceRatingBodySchema.safeParse({}).success).toBe(false);
  });
});

describe('competenceDetailSchema', () => {
  it('accepts a valid detail', () => {
    expect(
      competenceDetailSchema.safeParse({ id: 'c1', skillName: 'Rust', rating: 3 }).success
    ).toBe(true);
  });
});

describe('competenceProfileDataSchema', () => {
  it('accepts a full profile', () => {
    const result = competenceProfileDataSchema.safeParse({
      employee: { id: 'e1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' },
      competences: [{ id: 'c1', skillName: 'Rust', rating: 3 }],
    });
    expect(result.success).toBe(true);
  });
});
