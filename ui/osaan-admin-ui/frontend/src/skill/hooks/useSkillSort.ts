import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSkillStore } from '../store/store';
import { Order } from '@/types';

export const useSkillSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { order, setOrder } = useSkillStore();

  const orderParam = searchParams.get('order') as Order | null;

  useEffect(() => {
    // 1. URL -> Store (Priority: If URL has a value, it wins)
    if (orderParam && orderParam !== order) {
      setOrder(orderParam);
    }
    // 2. Store -> URL (Restoration: If URL is empty, restore from store)
    else if (!orderParam) {
      setSearchParams(
        prev => {
          prev.set('order', order);
          return prev;
        },
        { replace: true }
      );
    }
  }, [orderParam, order, setOrder, setSearchParams]);

  const toggleSort = () => {
    const newOrder = order === 'asc' ? 'desc' : 'asc';
    // Optimistically update both to prevent flicker
    setOrder(newOrder);
    setSearchParams(prev => {
      prev.set('order', newOrder);
      return prev;
    });
  };

  return { order, toggleSort };
};
