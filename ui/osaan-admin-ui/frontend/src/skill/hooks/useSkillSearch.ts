import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSkillStore } from '../store/store';

const DEBOUNCE_MS = 500;

export const useSkillSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTerm, setSearchTerm } = useSkillStore();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const searchParam = searchParams.get('search');

  // 1. Sync URL -> Store (on navigation / back / forward)
  useEffect(() => {
    if (searchParam !== null && searchParam !== searchTerm) {
      setSearchTerm(searchParam);
    } else if (searchParam === null && searchTerm) {
      // Restore from store if URL is empty but store has value
      setSearchParams(
        prev => {
          prev.set('search', searchTerm);
          return prev;
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, setSearchParams, setSearchTerm]);

  // 2. Debounce: searchTerm -> debouncedSearchTerm (for API calls)
  //    and sync to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);

      // Sync to URL
      const currentUrlSearch = searchParams.get('search');
      if (searchTerm) {
        if (currentUrlSearch !== searchTerm) {
          setSearchParams(
            prev => {
              prev.set('search', searchTerm);
              return prev;
            },
            { replace: true }
          );
        }
      } else if (currentUrlSearch) {
        setSearchParams(
          prev => {
            prev.delete('search');
            return prev;
          },
          { replace: true }
        );
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, setSearchParams]);

  const updateSearch = (term: string) => {
    setSearchTerm(term);
  };

  return { searchTerm, debouncedSearchTerm, updateSearch };
};
