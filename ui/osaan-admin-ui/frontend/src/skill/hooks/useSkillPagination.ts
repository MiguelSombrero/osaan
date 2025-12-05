import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSkillStore } from '../store/store';

const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;

export const useSkillPagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, setPage, size, setSize } = useSkillStore();

  const pageParam = searchParams.get('page');
  const sizeParam = searchParams.get('size');

  useEffect(() => {
    // 1. URL -> Store (URL wins if it has values)
    const parsedPage = pageParam !== null ? Number(pageParam) : null;
    const parsedSize = sizeParam !== null ? Number(sizeParam) : null;

    if (parsedPage !== null && !Number.isNaN(parsedPage) && parsedPage !== page) {
      setPage(parsedPage);
    }

    if (parsedSize !== null && !Number.isNaN(parsedSize) && parsedSize !== size) {
      setSize(parsedSize);
    }

    // 2. Store -> URL (if URL is missing values, restore from store)
    if (pageParam === null) {
      setSearchParams(
        prev => {
          prev.set('page', String(page));
          return prev;
        },
        { replace: true }
      );
    }

    if (sizeParam === null) {
      setSearchParams(
        prev => {
          prev.set('size', String(size));
          return prev;
        },
        { replace: true }
      );
    }
  }, [pageParam, sizeParam, page, size, setPage, setSize, setSearchParams]);

  const updatePage = (newPage: number) => {
    setPage(newPage);
    setSearchParams(prev => {
      prev.set('page', String(newPage));
      return prev;
    });
  };

  const updateSize = (newSize: number) => {
    setSize(newSize);
    setPage(DEFAULT_PAGE);
    setSearchParams(prev => {
      prev.set('size', String(newSize));
      prev.set('page', String(DEFAULT_PAGE));
      return prev;
    });
  };

  return {
    page: page ?? DEFAULT_PAGE,
    size: size ?? DEFAULT_SIZE,
    updatePage,
    updateSize,
  };
};
