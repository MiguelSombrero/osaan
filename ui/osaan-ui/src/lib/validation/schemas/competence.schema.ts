import { z } from 'zod';
import { ratingSchema } from './rating.schema';

export const competenceSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string(),
  skillId: z.string(),
  rating: ratingSchema,
});

export type CompetenceInferred = z.infer<typeof competenceSchema>;

// What POST /api/competences/[employeeId] actually receives: a bare array.
export const createCompetencesBodySchema = z.array(
  competenceSchema.omit({ id: true, employeeId: true })
);

export type CreateCompetencesBody = z.infer<typeof createCompetencesBodySchema>;

// Kept for API-surface parity with the (currently unused) wrapped shape.
export const createCompetencesRequestSchema = z.object({
  employeeId: z.string(),
  competences: z.array(competenceSchema.omit({ id: true, employeeId: true })),
});

export type CreateCompetencesRequestInferred = z.infer<typeof createCompetencesRequestSchema>;

export const updateCompetenceRatingBodySchema = z.object({
  rating: ratingSchema,
});

export type UpdateCompetenceRatingBody = z.infer<typeof updateCompetenceRatingBodySchema>;

export const competenceDetailSchema = z.object({
  id: z.string(),
  skillName: z.string(),
  rating: ratingSchema,
});

export type CompetenceDetailInferred = z.infer<typeof competenceDetailSchema>;

export const competenceProfileDataSchema = z.object({
  employee: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
  }),
  competences: z.array(competenceDetailSchema),
});

export type CompetenceProfileDataInferred = z.infer<typeof competenceProfileDataSchema>;
