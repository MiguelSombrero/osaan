import { z } from 'zod';
import { ratingSchema } from './rating.schema';

export const employeeSearchParamsSchema = z.object({
  skillName: z.string().min(1),
  minRating: ratingSchema,
});

export type EmployeeSearchParamsInferred = z.infer<typeof employeeSearchParamsSchema>;

export const employeeSearchQuerySchema = z.object({
  skillName: z.string().min(1),
  minRating: z.coerce.number().int().min(1).max(5),
});

export type EmployeeSearchQuery = z.infer<typeof employeeSearchQuerySchema>;

export const employeeSearchResultSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  matchedSkills: z.array(
    z.object({
      skillId: z.string(),
      skillName: z.string(),
      rating: ratingSchema,
    })
  ),
});

export type EmployeeSearchResultInferred = z.infer<typeof employeeSearchResultSchema>;

export const managerSelectionSchema = z.object({
  employees: z.array(employeeSearchResultSchema),
});

export type ManagerSelectionInferred = z.infer<typeof managerSelectionSchema>;
