import type { Rating } from './rating';

export interface Subscription {
  id: string;
  email: string;
  skill: string;
  rating: Rating;
  createdAt: string;
}

export interface SubscriptionDraft {
  email: string;
  skill: string;
  rating: Rating;
}
