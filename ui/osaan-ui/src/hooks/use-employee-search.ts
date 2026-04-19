'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { employeeApi } from '@/lib/api-client';
import type { EmployeeSearchParams } from '@/types/manager';

function useEmployeeSearch() {
  const [params, setParams] = useState<EmployeeSearchParams | null>(null);

  const query = useQuery({
    queryKey: ['employees', 'search', params],
    queryFn: () => employeeApi.searchEmployees(params!),
    enabled: !!params,
  });

  return {
    ...query,
    search: setParams,
    hasSearched: params !== null,
  };
}

export { useEmployeeSearch };
