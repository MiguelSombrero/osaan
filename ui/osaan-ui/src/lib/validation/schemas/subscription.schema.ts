import { z } from 'zod';
import { ratingSchema } from './rating.schema';
import { skillNameSchema } from './skill.schema';

export const subscriptionDraftSchema = z.object({
  skill: skillNameSchema,
  rating: ratingSchema,
});

export type SubscriptionDraftInferred = z.infer<typeof subscriptionDraftSchema>;

// Type inference only — never parsed against microservice responses.
export const subscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  email: z.email(),
  skill: skillNameSchema,
  rating: ratingSchema,
  createdAt: z.string(),
});

export type SubscriptionInferred = z.infer<typeof subscriptionSchema>;
