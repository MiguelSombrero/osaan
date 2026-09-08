import { z } from 'zod';

export const ratingSchema = z.literal([1, 2, 3, 4, 5] as const);

export type RatingInferred = z.infer<typeof ratingSchema>;
