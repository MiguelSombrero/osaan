import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Providers } from '@/test/utils/renderWithProviders';
import { useSkillSearchParams } from '../useSkillSearchParams';

describe('useSkillSearchParams', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('initial state', () => {
    it('returns default values when no URL params exist', () => {
      const { result } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => <Providers>{children}</Providers>,
      });

      expect(result.current.searchTerm).toBe('');
      expect(result.current.debouncedSearchTerm).toBe('');
      expect(result.current.page).toBe(0);
      expect(result.current.size).toBe(20);
      expect(result.current.order).toBe('asc');
    });

    it('restores state from URL params', () => {
      const { result } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => (
          <Providers initialRoute="/?search=react&page=2&size=50&order=desc">{children}</Providers>
        ),
      });

      expect(result.current.searchTerm).toBe('react');
      expect(result.current.page).toBe(2);
      expect(result.current.size).toBe(50);
      expect(result.current.order).toBe('desc');
    });

    it('uses defaults for missing page/size/order', () => {
      const { result } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => <Providers initialRoute="/">{children}</Providers>,
      });

      // All params should use backend defaults when URL is empty
      expect(result.current.page).toBe(0); // Uses default
      expect(result.current.size).toBe(20); // Uses default
      expect(result.current.order).toBe('asc'); // Uses default
    });
  });

  describe('URL is source of truth', () => {
    it('returns values directly from URL params', () => {
      const { result } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => (
          <Providers initialRoute="/?search=test&page=2&size=50&order=desc">{children}</Providers>
        ),
      });

      // Hook should return values directly from URL (no store involved)
      expect(result.current.searchTerm).toBe('test');
      expect(result.current.page).toBe(2);
      expect(result.current.size).toBe(50);
      expect(result.current.order).toBe('desc');
    });
  });

  describe('hook interface', () => {
    it('provides all expected functions and values', () => {
      const { result } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => <Providers>{children}</Providers>,
      });

      expect(typeof result.current.updateSearch).toBe('function');
      expect(typeof result.current.updatePage).toBe('function');
      expect(typeof result.current.updateSize).toBe('function');
      expect(typeof result.current.toggleSort).toBe('function');
      expect(result.current.debouncedSearchTerm).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('handles invalid page param gracefully', () => {
      const { result } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => (
          <Providers initialRoute="/?page=invalid&size=20&order=asc">{children}</Providers>
        ),
      });

      // Should use default page
      expect(result.current.page).toBe(0);
    });

    it('handles invalid size param gracefully', () => {
      const { result } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => (
          <Providers initialRoute="/?page=0&size=notanumber&order=asc">{children}</Providers>
        ),
      });

      // Should use default size
      expect(result.current.size).toBe(20);
    });
  });

  describe('integration scenarios', () => {
    it('maintains state across re-renders', () => {
      const { result, rerender } = renderHook(() => useSkillSearchParams(), {
        wrapper: ({ children }) => (
          <Providers initialRoute="/?search=test&page=2&size=30&order=desc">{children}</Providers>
        ),
      });

      const initialValues = {
        searchTerm: result.current.searchTerm,
        page: result.current.page,
        size: result.current.size,
        order: result.current.order,
      };

      rerender();

      expect(result.current.searchTerm).toBe(initialValues.searchTerm);
      expect(result.current.page).toBe(initialValues.page);
      expect(result.current.size).toBe(initialValues.size);
      expect(result.current.order).toBe(initialValues.order);
    });
  });
});
