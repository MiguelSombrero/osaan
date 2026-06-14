'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Subscription, SubscriptionDraft } from '@/types/subscription';

const STORAGE_KEY = 'osaan.subscriptions.v1';

function readStorage(): Subscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Subscription[];
  } catch {
    return [];
  }
}

function writeStorage(subs: Subscription[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  } catch {
    // ignore quota errors
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface UseSubscriptionsLocal {
  subscriptions: Subscription[];
  hydrated: boolean;
  add: (draft: SubscriptionDraft) => Subscription;
  remove: (id: string) => void;
  clear: () => void;
}

export function useSubscriptionsLocal(): UseSubscriptionsLocal {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSubscriptions(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeStorage(subscriptions);
  }, [subscriptions, hydrated]);

  const add = useCallback((draft: SubscriptionDraft) => {
    const subscription: Subscription = {
      id: generateId(),
      email: draft.email.trim(),
      skill: draft.skill.trim(),
      rating: draft.rating,
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [subscription, ...prev]);
    return subscription;
  }, []);

  const remove = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clear = useCallback(() => {
    setSubscriptions([]);
  }, []);

  return { subscriptions, hydrated, add, remove, clear };
}
