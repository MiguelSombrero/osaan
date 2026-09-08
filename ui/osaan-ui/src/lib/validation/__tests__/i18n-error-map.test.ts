import { describe, it, expect, beforeAll } from 'vitest';
import i18next, { type i18n as I18nInstance } from 'i18next';
import { getValidationErrorMessage } from '../i18n-error-map';
import type { z } from 'zod';

let testI18n: I18nInstance;

beforeAll(async () => {
  testI18n = i18next.createInstance();
  await testI18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: {
        translation: {
          validation: {
            generic: 'Please check your input and try again.',
            codes: {
              too_small: 'Value is too short.',
            },
            fields: {
              skill: {
                too_small: 'Enter a skill name.',
              },
            },
            custom: {
              teamAlreadyFull: 'The team is already full.',
            },
          },
        },
      },
    },
  });
});

function issue(overrides: Partial<z.core.$ZodIssue>): z.core.$ZodIssue {
  return {
    code: 'invalid_type',
    path: [],
    message: '',
    ...overrides,
  } as z.core.$ZodIssue;
}

describe('getValidationErrorMessage', () => {
  it('resolves the most specific field+code key when present', () => {
    const result = getValidationErrorMessage(
      issue({ code: 'too_small', path: ['skill'] }),
      testI18n.t
    );
    expect(result).toBe('Enter a skill name.');
  });

  it('falls back to a custom refinement key by message id', () => {
    const result = getValidationErrorMessage(
      issue({ code: 'custom', path: ['teamSize'], message: 'teamAlreadyFull' }),
      testI18n.t
    );
    expect(result).toBe('The team is already full.');
  });

  it('falls back to the generic code-level key when no field-specific key exists', () => {
    const result = getValidationErrorMessage(
      issue({ code: 'too_small', path: ['unknownField'] }),
      testI18n.t
    );
    expect(result).toBe('Value is too short.');
  });

  it('falls back to the absolute generic message when nothing else matches', () => {
    const result = getValidationErrorMessage(
      issue({ code: 'invalid_type', path: ['somethingUnmapped'] }),
      testI18n.t
    );
    expect(result).toBe('Please check your input and try again.');
  });
});
