import { describe, it, expect } from 'vitest';
import {
  skillSchema,
  skillNameSchema,
  getSkillsResponseSchema,
  getSkillsParamsSchema,
  SKILL_NAME_MAX_LENGTH,
} from '../schemas/skill.schema';

describe('skillNameSchema', () => {
  it('accepts a normal name', () => {
    expect(skillNameSchema.safeParse('Kubernetes').success).toBe(true);
  });

  it('rejects an empty string', () => {
    const result = skillNameSchema.safeParse('');
    expect(result.success).toBe(false);
  });

  it('rejects a whitespace-only string', () => {
    expect(skillNameSchema.safeParse('   ').success).toBe(false);
  });

  it(`accepts exactly ${SKILL_NAME_MAX_LENGTH} characters`, () => {
    expect(skillNameSchema.safeParse('a'.repeat(SKILL_NAME_MAX_LENGTH)).success).toBe(true);
  });

  it(`rejects ${SKILL_NAME_MAX_LENGTH + 1} characters`, () => {
    expect(skillNameSchema.safeParse('a'.repeat(SKILL_NAME_MAX_LENGTH + 1)).success).toBe(false);
  });
});

describe('skillSchema', () => {
  it('accepts a valid skill', () => {
    expect(skillSchema.safeParse({ id: '1', name: 'Rust' }).success).toBe(true);
  });

  it('rejects a skill with a blank name', () => {
    expect(skillSchema.safeParse({ id: '1', name: '' }).success).toBe(false);
  });
});

describe('getSkillsResponseSchema', () => {
  it('accepts a paginated response', () => {
    const result = getSkillsResponseSchema.safeParse({
      skills: [{ id: '1', name: 'Rust' }],
      page: 0,
      size: 20,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
    });
    expect(result.success).toBe(true);
  });
});

describe('getSkillsParamsSchema', () => {
  it('accepts an empty query string object', () => {
    const result = getSkillsParamsSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('coerces page and size from strings', () => {
    const result = getSkillsParamsSchema.safeParse({ page: '2', size: '10' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.size).toBe(10);
    }
  });

  it('rejects a negative page', () => {
    expect(getSkillsParamsSchema.safeParse({ page: '-1' }).success).toBe(false);
  });

  it('rejects a non-numeric size', () => {
    expect(getSkillsParamsSchema.safeParse({ size: 'abc' }).success).toBe(false);
  });
});
