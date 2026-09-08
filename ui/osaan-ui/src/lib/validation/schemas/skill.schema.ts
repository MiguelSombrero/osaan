import { z } from 'zod';

export const SKILL_NAME_MAX_LENGTH = 255;

export const skillNameSchema = z.string().trim().min(1).max(SKILL_NAME_MAX_LENGTH);

export const skillSchema = z.object({
  id: z.string(),
  name: skillNameSchema,
});

export type SkillInferred = z.infer<typeof skillSchema>;

export const getSkillsResponseSchema = z.object({
  skills: z.array(skillSchema),
  page: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  first: z.boolean(),
  last: z.boolean(),
});

export type GetSkillsResponseInferred = z.infer<typeof getSkillsResponseSchema>;

export const getSkillsParamsSchema = z.object({
  query: z.string().trim().min(1).max(SKILL_NAME_MAX_LENGTH).optional(),
  page: z.coerce.number().int().min(0).optional(),
  size: z.coerce.number().int().min(1).max(100).optional(),
  sort: z.string().trim().min(1).max(100).optional(),
});

export type GetSkillsParamsInferred = z.infer<typeof getSkillsParamsSchema>;
