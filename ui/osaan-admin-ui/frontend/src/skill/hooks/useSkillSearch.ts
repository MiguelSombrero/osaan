import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSkillStore } from '../store/store';

const DEBOUNCE_MS = 500;

export const useSkillSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm, setSearchTerm, setPage } = useSkillStore();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const previousSearchRef = useRef(searchTerm);

  const searchParam = searchParams.get('search');

  // 1. Sync URL -> Store (URL is source of truth)
  useEffect(() => {
    const urlValue = searchParam ?? '';
    if (urlValue !== searchTerm) {
      setSearchTerm(urlValue);
    }
  }, [searchParam, searchTerm, setSearchTerm]);

  // 2. Debounce searchTerm for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. Reset page to 0 when search term actually changes (not on mount)
  useEffect(() => {
    if (previousSearchRef.current !== debouncedSearchTerm) {
      setPage(0);
      setSearchParams(
        prev => {
          prev.set('page', '0');
          return prev;
        },
        { replace: true }
      );
      previousSearchRef.current = debouncedSearchTerm;
    }
  }, [debouncedSearchTerm, setPage, setSearchParams]);

  const updateSearch = (term: string) => {
    // Update both store and URL immediately (URL will be source of truth)
    setSearchTerm(term);
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

  return { searchTerm, debouncedSearchTerm, updateSearch };
};
