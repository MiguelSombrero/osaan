import { describe, it, expect } from 'vitest';
import { employeeSchema, createEmployeeSchema } from '../schemas/employee.schema';

describe('employeeSchema', () => {
  it('accepts a valid employee', () => {
    const result = employeeSchema.safeParse({
      id: '1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid employee without id', () => {
    expect(
      employeeSchema.safeParse({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      }).success
    ).toBe(true);
  });

  it('rejects a blank firstName', () => {
    expect(
      employeeSchema.safeParse({
        firstName: '',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      }).success
    ).toBe(false);
  });

  it('rejects a blank lastName', () => {
    expect(
      employeeSchema.safeParse({
        firstName: 'Ada',
        lastName: '',
        email: 'ada@example.com',
      }).success
    ).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = employeeSchema.safeParse({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].code).toBe('invalid_format');
    }
  });
});

describe('createEmployeeSchema', () => {
  it('does not require or accept an id field being present as required', () => {
    const result = createEmployeeSchema.safeParse({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect('id' in result.data).toBe(false);
    }
  });
});
