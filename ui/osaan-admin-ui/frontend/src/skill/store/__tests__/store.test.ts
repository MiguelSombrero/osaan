import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useSkillStore } from '../store';

describe('useSkillStore', () => {
  beforeEach(() => {
    // Reset store state
    useSkillStore.setState({ order: 'asc', searchTerm: '' });
  });

  describe('order state', () => {
    it('has default order of "asc"', () => {
      const { order } = useSkillStore.getState();
      expect(order).toBe('asc');
    });

    it('allows setting order', () => {
      act(() => {
        useSkillStore.getState().setOrder('desc');
      });

      const { order } = useSkillStore.getState();
      expect(order).toBe('desc');
    });
  });

  describe('searchTerm state', () => {
    it('has empty default searchTerm', () => {
      const { searchTerm } = useSkillStore.getState();
      expect(searchTerm).toBe('');
    });

    it('allows setting searchTerm', () => {
      act(() => {
        useSkillStore.getState().setSearchTerm('React');
      });

      const { searchTerm } = useSkillStore.getState();
      expect(searchTerm).toBe('React');
    });
  });

  describe('persistence', () => {
    it('persists order to localStorage', () => {
      act(() => {
        useSkillStore.getState().setOrder('desc');
      });

      const stored = localStorage.getItem('skill-list-storage');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.order).toBe('desc');
    });

    it('persists searchTerm to localStorage', () => {
      act(() => {
        useSkillStore.getState().setSearchTerm('JavaScript');
      });

      const stored = localStorage.getItem('skill-list-storage');
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.searchTerm).toBe('JavaScript');
    });

    it('restores state from localStorage on initialization', () => {
      const storedState = {
        state: { order: 'desc', searchTerm: 'Kubernetes' },
        version: 0,
      };
      localStorage.setItem('skill-list-storage', JSON.stringify(storedState));

      // Force rehydration by calling persist.rehydrate()
      // Note: In a real app, this happens automatically on page load
      useSkillStore.persist.rehydrate();

      const { order, searchTerm } = useSkillStore.getState();
      expect(order).toBe('desc');
      expect(searchTerm).toBe('Kubernetes');
    });
  });

  describe('state transitions', () => {
    it('maintains independent state for order and searchTerm', () => {
      act(() => {
        useSkillStore.getState().setOrder('desc');
        useSkillStore.getState().setSearchTerm('Python');
      });

      const { order, searchTerm } = useSkillStore.getState();
      expect(order).toBe('desc');
      expect(searchTerm).toBe('Python');

      // Changing one shouldn't affect the other
      act(() => {
        useSkillStore.getState().setOrder('asc');
      });

      const newState = useSkillStore.getState();
      expect(newState.order).toBe('asc');
      expect(newState.searchTerm).toBe('Python'); // Unchanged
    });

    it('preserves state across multiple updates', () => {
      act(() => {
        useSkillStore.getState().setSearchTerm('Java');
        useSkillStore.getState().setSearchTerm('JavaScript');
        useSkillStore.getState().setSearchTerm('TypeScript');
      });

      const { searchTerm } = useSkillStore.getState();
      expect(searchTerm).toBe('TypeScript');
    });
  });
});

describe('State persistence across navigation', () => {
  it('preserves user selections when data is stored in localStorage', () => {
    act(() => {
      useSkillStore.getState().setOrder('desc');
      useSkillStore.getState().setSearchTerm('Docker');
    });

    const stored = localStorage.getItem('skill-list-storage');
    const parsed = JSON.parse(stored!);

    expect(parsed.state.order).toBe('desc');
    expect(parsed.state.searchTerm).toBe('Docker');

    // This simulates what happens when user navigates away and back
    useSkillStore.persist.rehydrate();

    const { order, searchTerm } = useSkillStore.getState();
    expect(order).toBe('desc');
    expect(searchTerm).toBe('Docker');
  });
});
