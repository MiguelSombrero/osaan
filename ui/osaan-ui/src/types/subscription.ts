import type { Rating } from './rating';

export interface Subscription {
  id: string;
  userId: string;
  email: string;
  skill: string;
  rating: Rating;
  createdAt: string;
}

export interface SubscriptionDraft {
  skill: string;
  rating: Rating;
}
