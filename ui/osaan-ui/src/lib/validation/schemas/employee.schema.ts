import { z } from 'zod';

export const employeeSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
});

export type EmployeeInferred = z.infer<typeof employeeSchema>;

export const createEmployeeSchema = employeeSchema.omit({ id: true });

export type CreateEmployeeInferred = z.infer<typeof createEmployeeSchema>;
