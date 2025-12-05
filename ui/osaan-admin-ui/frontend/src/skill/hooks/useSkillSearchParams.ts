import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Order } from '@/types';

const DEBOUNCE_MS = 500;

// Exported defaults - single source of truth for backend default values
export const DEFAULT_PAGE = 0;
export const DEFAULT_SIZE = 20;
export const DEFAULT_ORDER: Order = 'asc';

/**
 * Unified hook for managing skill list search parameters (search, pagination, sort).
 * URL is the single source of truth - all state is read directly from URL params.
 * No external store needed - URL already provides persistence and state management.
 */
export const useSkillSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract URL params (single source of truth)
  const searchParam = searchParams.get('search') ?? '';
  const pageParam = searchParams.get('page');
  const sizeParam = searchParams.get('size');
  const orderParam = searchParams.get('order') as Order | null;

  // Parse with defaults
  const page = pageParam !== null ? Number(pageParam) : DEFAULT_PAGE;
  const size = sizeParam !== null ? Number(sizeParam) : DEFAULT_SIZE;
  const order = orderParam ?? DEFAULT_ORDER;

  // Local state only for debouncing search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParam);
  const previousSearchRef = useRef(searchParam);

  // Debounce search term from URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchParam);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchParam]);

  // Reset page to 0 when search term changes
  useEffect(() => {
    if (
      previousSearchRef.current !== debouncedSearchTerm &&
      debouncedSearchTerm !== previousSearchRef.current
    ) {
      if (page !== DEFAULT_PAGE) {
        setSearchParams(
          prev => {
            prev.delete('page');
            return prev;
          },
          { replace: true }
        );
      }
      previousSearchRef.current = debouncedSearchTerm;
    }
  }, [debouncedSearchTerm, page, setSearchParams]);

  // Update functions - only modify URL
  const updateSearch = (term: string) => {
    setSearchParams(
      prev => {
        if (term) {
          prev.set('search', term);
        } else {
          prev.delete('search');
        }
        return prev;
      },
      { replace: true }
    );
  };

  const updatePage = (newPage: number) => {
    setSearchParams(prev => {
      // Only add page to URL if it's not the default
      if (newPage === DEFAULT_PAGE) {
        prev.delete('page');
      } else {
        prev.set('page', String(newPage));
      }
      return prev;
    });
  };

  const updateSize = (newSize: number) => {
    setSearchParams(prev => {
      // Only add size to URL if it's not the default
      if (newSize === DEFAULT_SIZE) {
        prev.delete('size');
      } else {
        prev.set('size', String(newSize));
      }
      // Reset page when changing page size
      prev.delete('page');
      return prev;
    });
  };

  const toggleSort = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    setSearchParams(prev => {
      // Only add order to URL if it's not the default
      if (newOrder === DEFAULT_ORDER) {
        prev.delete('order');
      } else {
        prev.set('order', newOrder);
      }
      return prev;
    });
  };

  return {
    // Search
    searchTerm: searchParam,
    debouncedSearchTerm,
    updateSearch,
    // Pagination
    page: !Number.isNaN(page) ? page : DEFAULT_PAGE,
    size: !Number.isNaN(size) ? size : DEFAULT_SIZE,
    updatePage,
    updateSize,
    // Sort
    order,
    toggleSort,
  };
};
