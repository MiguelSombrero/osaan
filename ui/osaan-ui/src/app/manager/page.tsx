'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { EmptyState, Spinner, ErrorState } from '@/components/ui';
import { SkillFilter, EmployeeResultCard, SelectionList } from '@/components/manager';
import { useEmployeeSearch } from '@/hooks/use-employee-search';
import type { EmployeeSearchResult } from '@/types/manager';

export const dynamic = 'force-dynamic';

export default function ManagerPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, search, hasSearched, refetch } = useEmployeeSearch();
  const [selected, setSelected] = useState<EmployeeSearchResult[]>([]);

  const toggleEmployee = (employee: EmployeeSearchResult) => {
    setSelected((prev) => {
      const exists = prev.some((e) => e.id === employee.id);
      if (exists) return prev.filter((e) => e.id !== employee.id);
      return [...prev, employee];
    });
  };

  const removeEmployee = (employeeId: string) => {
    setSelected((prev) => prev.filter((e) => e.id !== employeeId));
  };

  return (
    <AppShell>
      <PageHeader
        title={t('findBySkill')}
        subtitle={t('searchEmployees')}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar: filter + selection */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white border border-stone-200 rounded-md p-5">
            <SkillFilter
              onSearch={search}
              isLoading={isLoading}
            />
          </div>

          <div className="bg-white border border-stone-200 rounded-md p-5">
            <SelectionList
              selected={selected}
              onRemove={removeEmployee}
            />
          </div>
        </aside>

        {/* Main content: results */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-stone-200 rounded-md overflow-hidden min-h-64">
            {!hasSearched && !isLoading && (
              <EmptyState
                title={t('noSearchYet')}
                icon={
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
              />
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Spinner size="lg" />
                <p className="text-sm text-stone-600 font-sans">{t('loading')}</p>
              </div>
            )}

            {error && !isLoading && (
              <ErrorState
                title={t('loadingError')}
                message={error instanceof Error ? error.message : undefined}
                onRetry={() => refetch()}
              />
            )}

            {data && !isLoading && (
              <>
                {data.length === 0 ? (
                  <EmptyState
                    title={t('noSearchResults')}
                    icon={
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
                    {data.map((employee) => (
                      <EmployeeResultCard
                        key={employee.id}
                        employee={employee}
                        selected={selected.some((e) => e.id === employee.id)}
                        onToggle={toggleEmployee}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
