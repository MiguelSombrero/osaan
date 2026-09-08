import type { z } from 'zod';
import type { TFunction } from 'i18next';

/**
 * Both entry points below resolve a message through the same key chain:
 *
 *   validation.fields.<field>.<code>  →  most specific
 *   validation.custom.<message>       →  custom refinements only
 *   validation.codes.<code>           →  code-level default
 *   validation.generic                →  last resort
 */

const MISSING = '__osaan_validation_key_missing__';

function resolve(key: string, t: TFunction, params: Record<string, unknown>): string | null {
  const result = t(key, { ...params, defaultValue: MISSING });
  return result === MISSING ? null : result;
}

interface ResolveInput {
  field: string;
  code: string;
  customMessage?: string;
  params?: Record<string, unknown>;
}

function resolveMessage({ field, code, customMessage, params = {} }: ResolveInput, t: TFunction) {
  const specific = resolve(`validation.fields.${field}.${code}`, t, params);
  if (specific !== null) return specific;

  if (code === 'custom' && customMessage) {
    const custom = resolve(`validation.custom.${customMessage}`, t, params);
    if (custom !== null) return custom;
  }

  const generic = resolve(`validation.codes.${code}`, t, params);
  if (generic !== null) return generic;

  return t('validation.generic');
}

function fieldNameFromPath(path: ReadonlyArray<PropertyKey>): string {
  return String(path[path.length - 1] ?? '');
}

export function getValidationErrorMessage(issue: z.core.$ZodIssue, t: TFunction): string {
  return resolveMessage(
    {
      field: fieldNameFromPath(issue.path),
      code: issue.code,
      customMessage: typeof issue.message === 'string' ? issue.message : undefined,
      params: buildInterpolationParams(issue),
    },
    t
  );
}

/**
 * react-hook-form flattens Zod issues into `FieldError`, keeping the issue code
 * as `type` but dropping `path` and the `minimum`/`maximum` bounds — so the field
 * name is passed in explicitly and interpolation params are unavailable here.
 */
interface FieldErrorLike {
  type?: string | number;
  message?: string;
}

export function getFieldErrorMessage(
  field: string,
  error: FieldErrorLike | undefined,
  t: TFunction
): string | null {
  if (!error) return null;

  return resolveMessage(
    { field, code: String(error.type ?? ''), customMessage: error.message },
    t
  );
}

function buildInterpolationParams(issue: z.core.$ZodIssue): Record<string, unknown> {
  switch (issue.code) {
    case 'too_small':
      return { min: issue.minimum };
    case 'too_big':
      return { max: issue.maximum };
    default:
      return {};
  }
}
