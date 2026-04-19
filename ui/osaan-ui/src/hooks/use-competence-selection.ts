'use client';

import { useState, useCallback } from 'react';
import type { Rating } from '@/types/rating';

interface CompetenceSelection {
  selected: Map<string, Rating | null>;
  toggle: (skillId: string) => void;
  setRating: (skillId: string, rating: Rating) => void;
  clear: () => void;
  selectedCount: number;
  unratedCount: number;
  readyToSave: boolean;
}

function useCompetenceSelection(): CompetenceSelection {
  const [selected, setSelected] = useState<Map<string, Rating | null>>(new Map());

  const toggle = useCallback((skillId: string) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(skillId)) {
        next.delete(skillId);
      } else {
        next.set(skillId, null);
      }
      return next;
    });
  }, []);

  const setRating = useCallback((skillId: string, rating: Rating) => {
    setSelected((prev) => {
      if (!prev.has(skillId)) return prev;
      const next = new Map(prev);
      next.set(skillId, rating);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected(new Map());
  }, []);

  const selectedCount = selected.size;
  const unratedCount = Array.from(selected.values()).filter((r) => r === null).length;
  const readyToSave = selectedCount > 0 && unratedCount === 0;

  return { selected, toggle, setRating, clear, selectedCount, unratedCount, readyToSave };
}

export { useCompetenceSelection };
